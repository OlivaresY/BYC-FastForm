import type { BankKey } from '../constants/BankAuthorizations.constants';
import type {
  LegalApplicantStepData,
  PhysicalApplicantStepData,
} from './ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from './BankAuthorizations.types';
import type { LegalEntityContact } from './LegalEntityContact.types';
import type { PhysicalPersonContact } from './PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from './VehicleCredit.types';

export const APPLICATION_STATUS = {
  APPROVED: 'Approved',
  DRAFT: 'Draft',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const DEFAULT_TEMPLATE_VERSION = 'v1' as const;

export const SELECTED_BANK_CODES = {
  BAC: 'bac',
  BNCR: 'bncr',
  CARRO_FACIL: 'carro_facil',
  PROMERICA: 'promerica',
  SCOTIABANK: 'scotiabank',
} as const;

export type SelectedBankCode =
  (typeof SELECTED_BANK_CODES)[keyof typeof SELECTED_BANK_CODES];

export const BANK_KEY_TO_CODE_MAP: Readonly<Record<BankKey, SelectedBankCode>> =
  {
    banco_bac: SELECTED_BANK_CODES.BAC,
    banco_bncr: SELECTED_BANK_CODES.BNCR,
    banco_carro_facil: SELECTED_BANK_CODES.CARRO_FACIL,
    banco_promerica: SELECTED_BANK_CODES.PROMERICA,
    banco_scotiabank: SELECTED_BANK_CODES.SCOTIABANK,
  } as const;

export interface MasterCreditApplicationBase {
  bankAuthorizations: BankAuthorizationsFormValues;
  selectedBanks: SelectedBankCode[];
  status: ApplicationStatus;
  templateVersion: string;
  userId: string;
  vehicleCredit: VehicleCreditFormValues;
}

export interface PhysicalMasterCreditApplicationPayload extends MasterCreditApplicationBase {
  applicant: PhysicalApplicantStepData;
  contact: PhysicalPersonContact;
  regime: 'physical';
}

export interface LegalMasterCreditApplicationPayload extends MasterCreditApplicationBase {
  applicant: LegalApplicantStepData;
  contact: LegalEntityContact;
  regime: 'legal';
}

export type MasterCreditApplicationPayload =
  LegalMasterCreditApplicationPayload | PhysicalMasterCreditApplicationPayload;

export interface MasterDraftAggregatorBaseInput {
  bankAuthorizations: BankAuthorizationsFormValues;
  status?: ApplicationStatus;
  templateVersion?: string;
  userId: string;
  vehicleCredit: VehicleCreditFormValues;
}

export interface PhysicalMasterDraftAggregatorInput extends MasterDraftAggregatorBaseInput {
  applicant: PhysicalApplicantStepData;
  contact: PhysicalPersonContact;
}

export interface LegalMasterDraftAggregatorInput extends MasterDraftAggregatorBaseInput {
  applicant: LegalApplicantStepData;
  contact: LegalEntityContact;
}

export type MasterDraftAggregatorInput =
  LegalMasterDraftAggregatorInput | PhysicalMasterDraftAggregatorInput;
