import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabaseClient';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export const CREDIT_APPLICATIONS_TABLE = 'credit_applications' as const;

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
    const insertRow = mapMasterPayloadToInsertRow(payload);
    const { error } = await this.client
      .from(CREDIT_APPLICATIONS_TABLE)
      .insert(insertRow);

    if (error) {
      throw new Error(
        `Failed to submit credit application draft: ${error.message}`,
      );
    }
  };
}

export const supabaseCreditApplicationRepository: ICreditApplicationRepository =
  new SupabaseCreditApplicationRepository();
