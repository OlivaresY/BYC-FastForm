import { z } from 'zod';
import {
  APPLICANT_STEP_VIEW_ERRORS,
  APPLICANT_STEP_VIEW_NUMERICAL,
} from '../constants/ApplicantStepView.constants';
import {
  INTERNATIONAL_PHONE_REGEX,
  isValidCalendarDate,
  isValidDateDDMMYYYY,
} from '@/shared/utils';
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from './LegalEntityForm.types';
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from './PhysicalPersonForm.types';
import type {
  ThirdPartyBeneficiaryField,
  ThirdPartyBeneficiaryValues,
} from './ApplicantStepView.types';

export { isValidCalendarDate, isValidDateDDMMYYYY };

// =============================================================================
// Shared Helpers & Date Validation
// =============================================================================

const NON_DIGIT_PATTERN = /\D/g;
const PHONE_PATTERN = INTERNATIONAL_PHONE_REGEX;

/**
 * Strips every non-digit character so masked IDs (e.g. `1-1234-0567`) are
 * measured by their digit count.
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

export const createDateDDMMYYYYSchema = (errorMessage: string) =>
  z.string({ error: errorMessage }).trim().refine(isValidDateDDMMYYYY, {
    message: errorMessage,
  });

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
  birthDate: createDateDDMMYYYYSchema(
    APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.BIRTH_DATE,
  ),
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
  middleName: z.string().trim().nullish(),
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
// Third-Party Beneficiary Schemas
// =============================================================================

export const ThirdPartyBeneficiaryStrictFieldsSchema = {
  isThirdPartyRegistration: z.literal(true),
  thirdPartyBirthDate: createDateDDMMYYYYSchema(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
  ),
  thirdPartyDocNumber: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_NUMBER,
  ),
  thirdPartyDocType: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE,
  ),
  thirdPartyEmail: z
    .string({ error: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL })
    .trim()
    .min(1, APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL)
    .pipe(z.email({ error: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL })),
  thirdPartyFullName: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
  ),
  thirdPartyNationality: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY,
  ),
  thirdPartyPhone: z
    .string({ error: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE })
    .trim()
    .min(8, APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE)
    .regex(PHONE_PATTERN, APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE),
  thirdPartyRelationship: requiredText(
    APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.RELATIONSHIP,
  ),
};

export const StrictThirdPartyBeneficiarySchema = z.object(
  ThirdPartyBeneficiaryStrictFieldsSchema,
);

export const optionalBeneficiaryEmailSchema = z
  .string()
  .trim()
  .nullish()
  .refine((val) => !val || z.email().safeParse(val).success, {
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
  });

export const optionalBeneficiaryPhoneSchema = z
  .string()
  .trim()
  .nullish()
  .refine((val) => !val || (val.length >= 8 && PHONE_PATTERN.test(val)), {
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
  });

export const ThirdPartyBeneficiaryFieldsSchema = {
  isThirdPartyRegistration: z.boolean().nullish(),
  thirdPartyBirthDate: z.string().nullish(),
  thirdPartyDocNumber: z.string().nullish(),
  thirdPartyDocType: z.string().nullish(),
  thirdPartyEmail: optionalBeneficiaryEmailSchema,
  thirdPartyFullName: z.string().nullish(),
  thirdPartyNationality: z.string().nullish(),
  thirdPartyPhone: optionalBeneficiaryPhoneSchema,
  thirdPartyRelationship: z.string().nullish(),
};

export const ThirdPartyBeneficiarySchema = StrictThirdPartyBeneficiarySchema;

export const THIRD_PARTY_BENEFICIARY_FIELDS = [
  'thirdPartyBirthDate',
  'thirdPartyDocNumber',
  'thirdPartyDocType',
  'thirdPartyEmail',
  'thirdPartyFullName',
  'thirdPartyNationality',
  'thirdPartyPhone',
  'thirdPartyRelationship',
] as const satisfies readonly ThirdPartyBeneficiaryField[];

// =============================================================================
// Submission Schemas
// =============================================================================

export const PhysicalApplicantStepSchema = z.discriminatedUnion(
  'vehicleBeneficiary',
  [
    z.object({
      regime: z.literal('physical'),
      values: PhysicalApplicantSchema,
      vehicleBeneficiary: z.literal('same_holder'),
    }),
    StrictThirdPartyBeneficiarySchema.extend({
      regime: z.literal('physical'),
      values: PhysicalApplicantSchema,
      vehicleBeneficiary: z.literal('third_party'),
    }),
  ],
);

export const LegalApplicantStepSchema = z.discriminatedUnion(
  'vehicleBeneficiary',
  [
    z.object({
      regime: z.literal('legal'),
      values: LegalApplicantSchema,
      vehicleBeneficiary: z.literal('same_holder'),
    }),
    StrictThirdPartyBeneficiarySchema.extend({
      regime: z.literal('legal'),
      values: LegalApplicantSchema,
      vehicleBeneficiary: z.literal('third_party'),
    }),
  ],
);

export const ApplicantStepSubmissionSchema = z.union([
  PhysicalApplicantStepSchema,
  LegalApplicantStepSchema,
]);

export const ApplicantStepSchema = ApplicantStepSubmissionSchema;

export const ApplicantStepFormSchema = z.object({
  ...ThirdPartyBeneficiaryFieldsSchema,
  regime: z.enum(['physical', 'legal']).nullish(),
  vehicleBeneficiary: z.enum(['same_holder', 'third_party']).nullish(),
});

export const ApplicantStepFormStateSchema = z
  .object({
      legalValues: z.custom<LegalEntityFormValues>(),
      physicalValues: z.custom<PhysicalPersonFormValues>(),
      regime: z.enum(['physical', 'legal']),
      thirdPartyValues: z.custom<ThirdPartyBeneficiaryValues>(),
      vehicleBeneficiary: z.enum(['same_holder', 'third_party']),
    })
    .superRefine((data, ctx) => {
    if (data.regime === 'physical') {
      const result = PhysicalApplicantSchema.safeParse(data.physicalValues);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['physicalValues', ...issue.path],
          });
        });
      }
    } else {
      const result = LegalApplicantSchema.safeParse(data.legalValues);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['legalValues', ...issue.path],
          });
        });
      }
    }

    if (data.vehicleBeneficiary === 'third_party') {
      const candidate: ThirdPartyBeneficiaryValues = {
        ...data.thirdPartyValues,
        isThirdPartyRegistration: true,
      };
      const thirdPartyResult =
        StrictThirdPartyBeneficiarySchema.safeParse(candidate);
      if (!thirdPartyResult.success) {
        thirdPartyResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['thirdPartyValues', ...issue.path],
          });
        });
      }
    }
  });

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
