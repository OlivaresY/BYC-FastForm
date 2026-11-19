import type { SupabaseClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  MasterCreditApplicationSchema,
  type MasterCreditApplicationSchemaOutput,
} from '../schemas/MasterCreditApplication.schema';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export const CREDIT_APPLICATIONS_TABLE = 'credit_applications' as const;

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
  payload: MasterCreditApplicationPayload;
  regime: MasterCreditApplicationPayload['regime'];
  selected_banks: MasterCreditApplicationPayload['selectedBanks'];
  status: MasterCreditApplicationPayload['status'];
  template_version: MasterCreditApplicationPayload['templateVersion'];
  user_id: MasterCreditApplicationPayload['userId'];
}

export interface SubmitMasterDraftOptions {
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export interface ICreditApplicationRepository {
  submitMasterDraft: (
    payload: MasterCreditApplicationPayload,
    options?: SubmitMasterDraftOptions,
  ) => Promise<void>;
}

interface InsertQueryResponse {
  error: unknown;
}

interface AbortableInsertQuery extends PromiseLike<InsertQueryResponse> {
  abortSignal?: (signal: AbortSignal) => PromiseLike<InsertQueryResponse>;
}

export const mapMasterPayloadToInsertRow = (
  payload: MasterCreditApplicationPayload,
): CreditApplicationInsertRow => ({
  payload,
  regime: payload.regime,
  selected_banks: payload.selectedBanks,
  status: payload.status,
  template_version: payload.templateVersion,
  user_id: payload.userId,
});

/**
 * Supabase persistence repository for credit applications.
 *
 * Architectural RLS Contract (`public.credit_applications`):
 * ```sql
 * CREATE POLICY "Advisors insert own applications"
 * ON public.credit_applications
 * FOR INSERT
 * TO authenticated
 * WITH CHECK (auth.uid() = user_id);
 * ```
 * Every insert enforces parity between the active authenticated session
 * (`auth.uid()`) and the persisted `user_id` column.
 */
export class SupabaseCreditApplicationRepository implements ICreditApplicationRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  public readonly submitMasterDraft = async (
    payload: MasterCreditApplicationPayload,
    options?: SubmitMasterDraftOptions,
  ): Promise<void> => {
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
      const { data: authData } = await this.client.auth.getUser();

      if (authData?.user) {
        if (
          !isValidAuthenticatedUserId(authData.user.id) ||
          authData.user.id.trim() !== validatedPayload.userId.trim()
        ) {
          throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
        }
      }
    }

    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    const insertRow = mapMasterPayloadToInsertRow(validatedPayload);
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
      throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED);
    }
  };
}

export const supabaseCreditApplicationRepository: ICreditApplicationRepository =
  new SupabaseCreditApplicationRepository();
