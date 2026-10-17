import { z } from 'zod';
import {
  APPLICANT_STEP_VIEW_ERRORS,
  APPLICANT_STEP_VIEW_NUMERICAL,
} from '../constants/ApplicantStepView.constants';
import type { LegalEntityFormField } from './LegalEntityForm.types';
import type { PhysicalPersonFormField } from './PhysicalPersonForm.types';
import type { ThirdPartyBeneficiaryField } from './ApplicantStepView.types';

// =============================================================================
// Shared Helpers
// =============================================================================

const NON_DIGIT_PATTERN = /\D/g;

/**
 * Strips every non-digit character so masked IDs (e.g. `1-1234-0567`) are
 * measured by their digit count. Used for validation only; submitted values
 * are never rewritten.
 */
export const sanitizeIdentificationNumber = (value: string): string =>
  value.replace(NON_DIGIT_PATTERN, '');

const requiredText = (message: string): z.ZodString =>
  z.string({ error: message }).trim().min(1, message);

const identificationNumberSchema = (
  minDigits: number,
  message: string,
): z.ZodString =>
  z
    .string({ error: message })
    .refine(
      (value) => sanitizeIdentificationNumber(value).length >= minDigits,
      {
        error: message,
      },
    );

// =============================================================================
// Applicant Schemas (Physical & Legal)
// =============================================================================

export const PhysicalIdentificationNumberSchema = identificationNumberSchema(
  APPLICANT_STEP_VIEW_NUMERICAL.MIN_PHYSICAL_ID_LENGTH,
  APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.IDENTIFICATION_NUMBER,
);

export const LegalIdentificationNumberSchema = identificationNumberSchema(
  APPLICANT_STEP_VIEW_NUMERICAL.MIN_LEGAL_ID_LENGTH,
  APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_NUMBER,
);

export const PhysicalApplicantSchema = z.object({
  birthDate: requiredText(APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.BIRTH_DATE),
  firstLastName: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_LAST_NAME,
  ),
  firstName: requiredText(APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_NAME),
  gender: z.enum(['male', 'female', 'other'], {
    error: APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.GENDER,
  }),
  identificationNumber: PhysicalIdentificationNumberSchema,
  identificationType: z.enum(['national_id', 'dimex', 'passport'], {
    error: APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.IDENTIFICATION_TYPE,
  }),
  maritalStatus: z.enum(
    ['single', 'married', 'divorced', 'widowed', 'common_law'],
    { error: APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.MARITAL_STATUS },
  ),
  middleName: z.string().trim().optional(),
  nationality: requiredText(APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.NATIONALITY),
  secondLastName: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.SECOND_LAST_NAME,
  ),
});

export const LegalApplicantSchema = z.object({
  identificationNumber: LegalIdentificationNumberSchema,
  identificationType: z.enum(['legal_id', 'dimex', 'nite'], {
    error: APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_TYPE,
  }),
  legalName: requiredText(APPLICANT_STEP_VIEW_ERRORS.LEGAL.LEGAL_NAME),
  representativeIdentification: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_IDENTIFICATION,
  ),
  representativeName: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_NAME,
  ),
});

export const PHYSICAL_APPLICANT_FIELDS = [
  'birthDate',
  'firstLastName',
  'firstName',
  'gender',
  'identificationNumber',
  'identificationType',
  'maritalStatus',
  'middleName',
  'nationality',
  'secondLastName',
] as const satisfies readonly PhysicalPersonFormField[];

export const LEGAL_APPLICANT_FIELDS = [
  'identificationNumber',
  'identificationType',
  'legalName',
  'representativeIdentification',
  'representativeName',
] as const satisfies readonly LegalEntityFormField[];

// =============================================================================
// Third-Party Beneficiary Schema & Validation
// =============================================================================

export const ThirdPartyBeneficiaryFieldsSchema = {
  isThirdPartyRegistration: z.boolean().optional(),
  thirdPartyBirthDate: z.string().optional(),
  thirdPartyDocNumber: z.string().optional(),
  thirdPartyDocType: z.string().optional(),
  thirdPartyFullName: z.string().optional(),
  thirdPartyNationality: z.string().optional(),
  thirdPartyRelationship: z.string().optional(),
};

export interface ThirdPartyValidationPayload {
  isThirdPartyRegistration?: boolean | null;
  thirdPartyBirthDate?: string | null;
  thirdPartyDocNumber?: string | null;
  thirdPartyDocType?: string | null;
  thirdPartyFullName?: string | null;
  thirdPartyNationality?: string | null;
  thirdPartyRelationship?: string | null;
}

export const THIRD_PARTY_BENEFICIARY_FIELDS = [
  'thirdPartyBirthDate',
  'thirdPartyDocNumber',
  'thirdPartyDocType',
  'thirdPartyFullName',
  'thirdPartyNationality',
  'thirdPartyRelationship',
] as const satisfies readonly ThirdPartyBeneficiaryField[];

const THIRD_PARTY_REQUIRED_RULES: readonly {
  field: ThirdPartyBeneficiaryField;
  message: string;
}[] = [
  {
    field: 'thirdPartyDocType',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE,
  },
  {
    field: 'thirdPartyDocNumber',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_NUMBER,
  },
  {
    field: 'thirdPartyFullName',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
  },
  {
    field: 'thirdPartyRelationship',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.RELATIONSHIP,
  },
  {
    field: 'thirdPartyBirthDate',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
  },
  {
    field: 'thirdPartyNationality',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY,
  },
];

export const validateThirdPartyBeneficiary = (
  data: ThirdPartyValidationPayload,
  ctx: z.RefinementCtx,
): void => {
  if (data.isThirdPartyRegistration !== true) {
    return;
  }

  THIRD_PARTY_REQUIRED_RULES.forEach(({ field, message }) => {
    const value = data[field];
    if (!value || value.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field],
      });
    }
  });
};

export const ThirdPartyBeneficiarySchema = z
  .object(ThirdPartyBeneficiaryFieldsSchema)
  .superRefine(validateThirdPartyBeneficiary);

/**
 * Normalizes the third-party birth date to the plain string the schema
 * expects. `Date` instances become `YYYY-MM-DD`; invalid dates become empty so
 * they fail the required rule instead of throwing.
 */
export const normalizeThirdPartyBirthDate = (
  value: Date | string | undefined,
): string => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ''
      : value.toISOString().split('T')[0];
  }

  return value ?? '';
};

// =============================================================================
// Submission Schemas
// =============================================================================

export const PhysicalApplicantStepSchema = z.object({
  ...ThirdPartyBeneficiaryFieldsSchema,
  regime: z.literal('physical'),
  values: PhysicalApplicantSchema,
  vehicleBeneficiary: z.enum(['same_holder', 'third_party']),
});

export const LegalApplicantStepSchema = z.object({
  ...ThirdPartyBeneficiaryFieldsSchema,
  regime: z.literal('legal'),
  values: LegalApplicantSchema,
  vehicleBeneficiary: z.enum(['same_holder', 'third_party']),
});

export const ApplicantStepSubmissionSchema = z
  .discriminatedUnion('regime', [
    PhysicalApplicantStepSchema,
    LegalApplicantStepSchema,
  ])
  .superRefine(validateThirdPartyBeneficiary);

export const ApplicantStepSchema = ApplicantStepSubmissionSchema;
export const ApplicantStepFormSchema = z
  .object({
    ...ThirdPartyBeneficiaryFieldsSchema,
    regime: z.enum(['physical', 'legal']).optional(),
    vehicleBeneficiary: z.enum(['same_holder', 'third_party']).optional(),
  })
  .superRefine(validateThirdPartyBeneficiary);

// =============================================================================
// Issue -> Field Error Mapping
// =============================================================================

interface SchemaIssue {
  message: string;
  path: readonly PropertyKey[];
}

const isMember = <T extends string>(
  list: readonly T[],
  value: unknown,
): value is T => list.some((item) => item === value);

/**
 * Converts Zod issues into a `{ field: message }` map. Only the first issue per
 * field is kept, and issues outside `fields` are ignored.
 */
export const mapIssuesToFieldErrors = <TField extends string>(
  issues: readonly SchemaIssue[],
  fields: readonly TField[],
): Partial<Record<TField, string>> => {
  const errors: Partial<Record<TField, string>> = {};

  issues.forEach((issue) => {
    const [key] = issue.path;

    if (isMember(fields, key) && errors[key] === undefined) {
      errors[key] = issue.message;
    }
  });

  return errors;
};
