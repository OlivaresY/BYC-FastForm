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
  SUBMIT_FAILED:
    'No se pudo enviar la solicitud de crédito. Por favor, intenta de nuevo más tarde.',
} as const;

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

export interface ICreditApplicationRepository {
  submitMasterDraft: (payload: MasterCreditApplicationPayload) => Promise<void>;
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

export class SupabaseCreditApplicationRepository implements ICreditApplicationRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  public readonly submitMasterDraft = async (
    payload: MasterCreditApplicationPayload,
  ): Promise<void> => {
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

    const insertRow = mapMasterPayloadToInsertRow(validatedPayload);
    const { error } = await this.client
      .from(CREDIT_APPLICATIONS_TABLE)
      .insert(insertRow);

    if (error) {
      throw new Error(CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED);
    }
  };
}

export const supabaseCreditApplicationRepository: ICreditApplicationRepository =
  new SupabaseCreditApplicationRepository();
