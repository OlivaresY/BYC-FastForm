import type { SupabaseClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  MasterCreditApplicationSchema,
  type MasterCreditApplicationSchemaOutput,
} from '../schemas/MasterCreditApplication.schema';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export const CREDIT_APPLICATIONS_TABLE = 'credit_applications' as const;

const IDEMPOTENCY_KEY_COLUMN = 'idempotency_key' as const;
const USER_ID_COLUMN = 'user_id' as const;
const IDEMPOTENCY_RECOVERY_SELECT_COLUMNS =
  'id, status, created_at, user_id, payload' as const;
const UNIQUE_VIOLATION_SQLSTATE = '23505' as const;

export const CREDIT_APPLICATION_SERVICE_ERRORS = {
  AUTH_REQUIRED:
    'La sesión de usuario es inválida o ha expirado. Inicia sesión nuevamente antes de enviar la solicitud.',
  SUBMIT_ABORTED: 'La solicitud de crédito fue cancelada antes de completarse.',
  SUBMIT_FAILED:
    'No se pudo enviar la solicitud de crédito. Por favor, intenta de nuevo más tarde.',
} as const;

const createAbortError = (): Error => {
  const abortError = new Error(
    CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_ABORTED,
  );
  abortError.name = 'AbortError';
  return abortError;
};

const isUniqueViolationError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === UNIQUE_VIOLATION_SQLSTATE;

const canonicalizeJsonValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJsonValue);
  }

  if (value !== null && typeof value === 'object') {
    const sortedEntries = Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0))
      .map(([key, entryValue]) => [key, canonicalizeJsonValue(entryValue)]);

    return Object.fromEntries(sortedEntries);
  }

  return value;
};

const serializeCanonicalJson = (value: unknown): string =>
  JSON.stringify(canonicalizeJsonValue(value));

const INVALID_PLACEHOLDER_USER_ID_PATTERN =
  /(?:mock|placeholder|dummy|fake|until-auth)/i;

const isValidAuthenticatedUserId = (userId: unknown): userId is string => {
  if (typeof userId !== 'string') {
    return false;
  }
  const trimmedUserId = userId.trim();
  return (
    trimmedUserId.length > 0 &&
    !INVALID_PLACEHOLDER_USER_ID_PATTERN.test(trimmedUserId)
  );
};

export interface CreditApplicationInsertRow {
  idempotency_key?: string;
  payload: MasterCreditApplicationPayload;
  regime: MasterCreditApplicationPayload['regime'];
  selected_banks: MasterCreditApplicationPayload['selectedBanks'];
  status: MasterCreditApplicationPayload['status'];
  template_version: MasterCreditApplicationPayload['templateVersion'];
  user_id: MasterCreditApplicationPayload['userId'];
}

export interface RecoveredCreditApplicationRecord {
  created_at: string;
  id: string;
  payload?: unknown;
  status: string;
  user_id?: string;
}

export interface SubmitMasterDraftOptions {
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export interface ICreditApplicationRepository {
  submitMasterDraft: (
    payload: MasterCreditApplicationPayload,
    options?: SubmitMasterDraftOptions,
  ) => Promise<RecoveredCreditApplicationRecord | void>;
}

interface InsertQueryResponse {
  error: unknown;
}

interface AbortableInsertQuery extends PromiseLike<InsertQueryResponse> {
  abortSignal?: (signal: AbortSignal) => PromiseLike<InsertQueryResponse>;
}

interface RecoveryQueryResponse {
  data: RecoveredCreditApplicationRecord | null;
  error: unknown;
}

interface AbortableRecoveryQuery extends PromiseLike<RecoveryQueryResponse> {
  abortSignal?: (signal: AbortSignal) => PromiseLike<RecoveryQueryResponse>;
}

export const mapMasterPayloadToInsertRow = (
  payload: MasterCreditApplicationPayload,
  idempotencyKey?: string,
): CreditApplicationInsertRow => {
  const normalizedIdempotencyKey = idempotencyKey?.trim();

  return {
    ...(normalizedIdempotencyKey
      ? { idempotency_key: normalizedIdempotencyKey }
      : {}),
    payload,
    regime: payload.regime,
    selected_banks: payload.selectedBanks,
    status: payload.status,
    template_version: payload.templateVersion,
    user_id: payload.userId,
  };
};

/**
 * Supabase persistence repository for credit applications.
 *
 * Architectural RLS & Idempotency Contract (`public.credit_applications`):
 * ```sql
 * CREATE UNIQUE INDEX IF NOT EXISTS credit_applications_idempotency_key_unique
 *   ON public.credit_applications (idempotency_key)
 *   WHERE idempotency_key IS NOT NULL;
 *
 * CREATE POLICY credit_applications_insert_own
 *   ON public.credit_applications
 *   FOR INSERT
 *   TO authenticated
 *   WITH CHECK (auth.uid() = user_id);
 * ```
 * Every insert enforces fail-closed parity between the active authenticated
 * session (`auth.uid()`) and the persisted `user_id` column, and persists
 * `idempotency_key` so retries recover cleanly on SQLSTATE `23505`.
 */
export class SupabaseCreditApplicationRepository implements ICreditApplicationRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  private readonly recoverIdempotentSubmission = async (
    idempotencyKey: string,
    expectedUserId: string,
    expectedPayload: MasterCreditApplicationPayload,
    signal?: AbortSignal,
  ): Promise<RecoveredCreditApplicationRecord> => {
    const recoveryQuery = this.client
      .from(CREDIT_APPLICATIONS_TABLE)
      .select(IDEMPOTENCY_RECOVERY_SELECT_COLUMNS)
      .eq(IDEMPOTENCY_KEY_COLUMN, idempotencyKey)
      .eq(USER_ID_COLUMN, expectedUserId)
      .single();

    const abortableRecoveryQuery: AbortableRecoveryQuery = recoveryQuery;
    const executableRecoveryQuery =
      signal && typeof abortableRecoveryQuery?.abortSignal === 'function'
        ? abortableRecoveryQuery.abortSignal(signal)
        : recoveryQuery;

    const { data: existingRecord, error: recoveryError } =
      await executableRecoveryQuery;

    if (signal?.aborted) {
      throw createAbortError();
    }

    if (
      recoveryError ||
      !existingRecord ||
      typeof existingRecord.user_id !== 'string' ||
      existingRecord.user_id.trim() !== expectedUserId.trim() ||
      serializeCanonicalJson(existingRecord.payload) !==
        serializeCanonicalJson(expectedPayload)
    ) {
      throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED);
    }

    return existingRecord;
  };

  public readonly submitMasterDraft = async (
    payload: MasterCreditApplicationPayload,
    options?: SubmitMasterDraftOptions,
  ): Promise<RecoveredCreditApplicationRecord | void> => {
    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    let validatedPayload: MasterCreditApplicationSchemaOutput;

    try {
      validatedPayload = MasterCreditApplicationSchema.parse(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        const isOnlyUserIdIssue = error.issues.every(
          (issue) => issue.path.length === 1 && issue.path[0] === 'userId',
        );
        if (isOnlyUserIdIssue) {
          throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
        }
      }
      throw error;
    }

    if (!isValidAuthenticatedUserId(validatedPayload.userId)) {
      throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
    }

    if (typeof this.client.auth?.getUser === 'function') {
      const { data: authData, error: authError } =
        await this.client.auth.getUser();

      if (
        authError ||
        !authData?.user ||
        !isValidAuthenticatedUserId(authData.user.id) ||
        authData.user.id.trim() !== validatedPayload.userId.trim()
      ) {
        throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
      }
    }

    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    const normalizedIdempotencyKey = options?.idempotencyKey?.trim();
    const insertRow = mapMasterPayloadToInsertRow(
      validatedPayload,
      normalizedIdempotencyKey,
    );
    const insertBuilder: AbortableInsertQuery = this.client
      .from(CREDIT_APPLICATIONS_TABLE)
      .insert(insertRow);

    const executableQuery =
      options?.signal && typeof insertBuilder?.abortSignal === 'function'
        ? insertBuilder.abortSignal(options.signal)
        : insertBuilder;

    const { error } = await executableQuery;

    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    if (error) {
      if (normalizedIdempotencyKey && isUniqueViolationError(error)) {
        return this.recoverIdempotentSubmission(
          normalizedIdempotencyKey,
          insertRow.user_id,
          insertRow.payload,
          options?.signal,
        );
      }

      throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED);
    }
  };
}

export const supabaseCreditApplicationRepository: ICreditApplicationRepository =
  new SupabaseCreditApplicationRepository();
