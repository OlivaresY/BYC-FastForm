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

const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

const optionalBeneficiaryEmailSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.string().email().safeParse(value).success,
    {
      message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
    },
  )
  .optional();

const optionalBeneficiaryPhoneSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || PHONE_PATTERN.test(value), {
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
  })
  .optional();

const isValidCalendarDate = (
  year: number,
  month: number,
  day: number,
): boolean => {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  const maxDays = daysInMonth[month - 1] ?? 31;
  return day <= maxDays;
};

/**
 * Normalizes a third-party birth date into a clean string (YYYY-MM-DD)
 * using strict regex parsing that completely ignores system timezones to prevent
 * accidental date shifting (e.g. UTC-6 converting midnight into the previous day).
 *
 * Supported formats:
 * - ISO date string: 'YYYY-MM-DD'
 * - ISO datetime string: 'YYYY-MM-DDTHH:mm:ss...'
 * - Localized slash format: 'DD/MM/YYYY' or 'DD / MM / YYYY'
 * - Localized dash format: 'DD-MM-YYYY' or 'DD - MM - YYYY'
 * - Date object: Extracts UTC year, month, day directly without .toISOString()
 *
 * Returns 'YYYY-MM-DD' if valid, or '' if missing or invalid.
 */
export const normalizeThirdPartyBirthDate = (
  value: Date | string | undefined | null,
): string => {
  if (value === undefined || value === null) {
    return '';
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return '';
    }
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1;
    const day = value.getUTCDate();

    if (!isValidCalendarDate(year, month, day)) {
      return '';
    }

    const y = String(year).padStart(4, '0');
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    return '';
  }

  // 1. ISO format: YYYY-MM-DD
  const isoMatch = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(
    trimmed,
  );
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    if (!isValidCalendarDate(year, month, day)) {
      return '';
    }

    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. ISO timestamp format: YYYY-MM-DDTHH:mm:ss...
  const isoTimestampMatch =
    /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T/.exec(trimmed);
  if (isoTimestampMatch) {
    const year = Number(isoTimestampMatch[1]);
    const month = Number(isoTimestampMatch[2]);
    const day = Number(isoTimestampMatch[3]);

    if (!isValidCalendarDate(year, month, day)) {
      return '';
    }

    return `${isoTimestampMatch[1]}-${isoTimestampMatch[2]}-${isoTimestampMatch[3]}`;
  }

  // 3. Localized format with slashes: DD/MM/YYYY or DD / MM / YYYY
  const slashMatch = /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/.exec(
    trimmed,
  );
  if (slashMatch) {
    const day = Number(slashMatch[1]);
    const month = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);

    if (!isValidCalendarDate(year, month, day)) {
      return '';
    }

    const y = String(year).padStart(4, '0');
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 4. Localized format with dashes: DD-MM-YYYY or DD - MM - YYYY
  const dashMatch = /^(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(\d{4})$/.exec(trimmed);
  if (dashMatch) {
    const day = Number(dashMatch[1]);
    const month = Number(dashMatch[2]);
    const year = Number(dashMatch[3]);

    if (!isValidCalendarDate(year, month, day)) {
      return '';
    }

    const y = String(year).padStart(4, '0');
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return '';
};

const beneficiaryBirthDateSchema = z
  .union([z.string(), z.date()])
  .refine((value) => normalizeThirdPartyBirthDate(value) !== '', {
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
  });

export const ThirdPartyBeneficiaryFieldsSchema = {
  email: optionalBeneficiaryEmailSchema,
  isThirdPartyRegistration: z.boolean().optional(),
  phone: optionalBeneficiaryPhoneSchema,
  thirdPartyBirthDate: z.union([z.string(), z.date()]).optional(),
  thirdPartyDocNumber: z.string().optional(),
  thirdPartyDocType: z.string().optional(),
  thirdPartyEmail: optionalBeneficiaryEmailSchema,
  thirdPartyFullName: z.string().optional(),
  thirdPartyNationality: z.string().optional(),
  thirdPartyPhone: optionalBeneficiaryPhoneSchema,
  thirdPartyRelationship: z.string().optional(),
};

export const ThirdPartyBeneficiaryStrictFieldsSchema = {
  birthDate: z.union([z.date(), z.string()]).optional(),
  email: optionalBeneficiaryEmailSchema,
  fullName: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationType: z.string().optional(),
  isThirdPartyRegistration: z.literal(true),
  nationality: z.string().optional(),
  phone: optionalBeneficiaryPhoneSchema,
  relationship: z.string().optional(),
  thirdPartyBirthDate: beneficiaryBirthDateSchema,
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
    .email(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL),
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

export interface ThirdPartyValidationPayload {
  birthDate?: Date | string | null;
  email?: string | null;
  isThirdPartyRegistration?: boolean | null;
  phone?: string | null;
  thirdPartyBirthDate?: Date | string | null;
  thirdPartyDocNumber?: string | null;
  thirdPartyDocType?: string | null;
  thirdPartyEmail?: string | null;
  thirdPartyFullName?: string | null;
  thirdPartyNationality?: string | null;
  thirdPartyPhone?: string | null;
  thirdPartyRelationship?: string | null;
}

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

const THIRD_PARTY_REQUIRED_RULES: readonly {
  field:
    | 'thirdPartyBirthDate'
    | 'thirdPartyDocNumber'
    | 'thirdPartyDocType'
    | 'thirdPartyEmail'
    | 'thirdPartyFullName'
    | 'thirdPartyNationality'
    | 'thirdPartyPhone'
    | 'thirdPartyRelationship';
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
  {
    field: 'thirdPartyPhone',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
  },
  {
    field: 'thirdPartyEmail',
    message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
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
    const isBlank =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '');
    if (isBlank) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field],
      });
    }
  });

  const phoneValue = data.thirdPartyPhone ?? data.phone;
  if (
    phoneValue &&
    phoneValue.trim() !== '' &&
    (phoneValue.trim().length < 8 || !PHONE_PATTERN.test(phoneValue.trim()))
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
      path: ['thirdPartyPhone'],
    });
  }

  const emailValue = data.thirdPartyEmail ?? data.email;
  if (
    emailValue &&
    emailValue.trim() !== '' &&
    !z.string().email().safeParse(emailValue.trim()).success
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
      path: ['thirdPartyEmail'],
    });
  }
  const rawBirthDate = data.thirdPartyBirthDate ?? data.birthDate;
  if (
    rawBirthDate &&
    (typeof rawBirthDate === 'string' ? rawBirthDate.trim() !== '' : true) &&
    normalizeThirdPartyBirthDate(rawBirthDate) === ''
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
      path: ['thirdPartyBirthDate'],
    });
  }
};

export const ThirdPartyBeneficiarySchema = z
  .object(ThirdPartyBeneficiaryFieldsSchema)
  .superRefine(validateThirdPartyBeneficiary);

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
