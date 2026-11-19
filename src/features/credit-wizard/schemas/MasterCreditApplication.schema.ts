import { z } from 'zod';
import { AVAILABLE_BANKS } from '../constants/BankAuthorizations.constants';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../constants/LegalEntitySelector.constants';
import type { PhysicalApplicantStepData } from '../types/ApplicantStepView.types';
import {
  APPLICATION_STATUS,
  BANK_KEY_TO_CODE_MAP,
  SELECTED_BANK_CODES,
  type SelectedBankCode,
} from '../types/MasterCreditApplication.types';
import {
  LegalApplicantStepSchema,
  PhysicalApplicantStepSchema,
} from './ApplicantStepView.schema';
import { bankAuthorizationsSchema } from './BankAuthorizations.schema';
import { LegalEntityContactSchema } from './LegalEntityContact.schema';
import { PhysicalPersonContactSchema } from './PhysicalPersonContact.schema';
import { VehicleCreditSchema } from './VehicleCredit.schema';

export const MASTER_CREDIT_APPLICATION_ERRORS = {
  SELECTED_BANKS_MISMATCH:
    'Los bancos seleccionados deben coincidir exactamente con las autorizaciones bancarias.',
  SELECTED_BANKS_REQUIRED: 'Debe seleccionar al menos una entidad bancaria.',
  STATUS_INVALID: 'El estado de la solicitud no es válido.',
  TEMPLATE_VERSION_REQUIRED: 'La versión de la plantilla es obligatoria.',
  USER_ID_REQUIRED: 'El identificador de usuario es obligatorio.',
} as const;

const APPLICATION_STATUS_VALUES = [
  APPLICATION_STATUS.APPROVED,
  APPLICATION_STATUS.DRAFT,
  APPLICATION_STATUS.PENDING,
  APPLICATION_STATUS.REJECTED,
] as const;

const SELECTED_BANK_CODE_VALUES = [
  SELECTED_BANK_CODES.BAC,
  SELECTED_BANK_CODES.BNCR,
  SELECTED_BANK_CODES.CARRO_FACIL,
  SELECTED_BANK_CODES.PROMERICA,
  SELECTED_BANK_CODES.SCOTIABANK,
] as const;

export const ApplicationStatusSchema = z.enum(APPLICATION_STATUS_VALUES, {
  error: MASTER_CREDIT_APPLICATION_ERRORS.STATUS_INVALID,
});

export const SelectedBankCodeSchema = z.enum(SELECTED_BANK_CODE_VALUES);

const NormalizedPhysicalApplicantStepSchema =
  PhysicalApplicantStepSchema.transform(
    (applicant): PhysicalApplicantStepData => ({
      ...applicant,
      values: {
        ...applicant.values,
        middleName: applicant.values.middleName ?? '',
        secondLastName: applicant.values.secondLastName ?? '',
      },
    }),
  );

const CommonMasterApplicationFields = {
  bankAuthorizations: bankAuthorizationsSchema,
  selectedBanks: z
    .array(SelectedBankCodeSchema)
    .min(1, MASTER_CREDIT_APPLICATION_ERRORS.SELECTED_BANKS_REQUIRED),
  status: ApplicationStatusSchema,
  templateVersion: z
    .string({
      error: MASTER_CREDIT_APPLICATION_ERRORS.TEMPLATE_VERSION_REQUIRED,
    })
    .trim()
    .min(1, MASTER_CREDIT_APPLICATION_ERRORS.TEMPLATE_VERSION_REQUIRED),
  userId: z
    .string({
      error: MASTER_CREDIT_APPLICATION_ERRORS.USER_ID_REQUIRED,
    })
    .trim()
    .min(1, MASTER_CREDIT_APPLICATION_ERRORS.USER_ID_REQUIRED),
  vehicleCredit: VehicleCreditSchema,
};

export const PhysicalMasterCreditApplicationSchema = z.object({
  ...CommonMasterApplicationFields,
  applicant: NormalizedPhysicalApplicantStepSchema,
  contact: PhysicalPersonContactSchema,
  regime: z.literal(LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL),
});

export const LegalMasterCreditApplicationSchema = z.object({
  ...CommonMasterApplicationFields,
  applicant: LegalApplicantStepSchema,
  contact: LegalEntityContactSchema,
  regime: z.literal(LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL),
});

const BaseMasterCreditApplicationSchema = z.discriminatedUnion('regime', [
  PhysicalMasterCreditApplicationSchema,
  LegalMasterCreditApplicationSchema,
]);

export const MasterCreditApplicationSchema =
  BaseMasterCreditApplicationSchema.superRefine((data, ctx) => {
    const expectedBanks: SelectedBankCode[] = AVAILABLE_BANKS.filter(
      (bankKey) => data.bankAuthorizations[bankKey],
    ).map((bankKey) => BANK_KEY_TO_CODE_MAP[bankKey]);

    const uniqueSelectedBanks = new Set<SelectedBankCode>(data.selectedBanks);
    const hasDuplicates =
      uniqueSelectedBanks.size !== data.selectedBanks.length;
    const matchesAuthorizationFlags =
      !hasDuplicates &&
      expectedBanks.length === data.selectedBanks.length &&
      expectedBanks.every((bankCode) => uniqueSelectedBanks.has(bankCode));

    if (!matchesAuthorizationFlags) {
      ctx.addIssue({
        code: 'custom',
        message: MASTER_CREDIT_APPLICATION_ERRORS.SELECTED_BANKS_MISMATCH,
        path: ['selectedBanks'],
      });
    }
  });

export type MasterCreditApplicationSchemaOutput = z.infer<
  typeof MasterCreditApplicationSchema
>;
