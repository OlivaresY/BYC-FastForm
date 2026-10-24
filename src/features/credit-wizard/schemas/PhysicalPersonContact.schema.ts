import { z } from 'zod/v3';
import {
  EMPLOYMENT_STATUSES,
  FINANCIAL_CURRENCIES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
  PHYSICAL_PERSON_CONTACT_PATTERNS,
} from '../constants/PhysicalPersonContact.constants';
import { isValidDateDDMMYYYY } from '../types/ApplicantStepView.schema';

export const INTERNATIONAL_PHONE_REGEX =
  PHYSICAL_PERSON_CONTACT_PATTERNS.INTERNATIONAL_PHONE;

export const ContactInfoSchema = z.object({
  cellPhone: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    })
    .regex(
      INTERNATIONAL_PHONE_REGEX,
      PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_INVALID,
    ),
  email: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .trim()
    .min(1, {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .email(PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_INVALID),
  homePhone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || INTERNATIONAL_PHONE_REGEX.test(value), {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.HOME_PHONE_INVALID,
    }),
});

export const ResidentialAddressSchema = z.object({
  canton: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
    }),
  district: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    }),
  exactAddress: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS
          .EXACT_ADDRESS_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS
          .EXACT_ADDRESS_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS
          .EXACT_ADDRESS_REQUIRED,
    }),
  province: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    }),
});

export const isNotFutureDateDDMMYYYY = (value: unknown): boolean => {
  if (typeof value !== 'string' || !isValidDateDDMMYYYY(value)) {
    return true;
  }
  const match = PHYSICAL_PERSON_CONTACT_PATTERNS.DATE_DD_MM_YYYY.exec(
    value.trim(),
  );
  if (!match) {
    return true;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    1000 - 1,
  );
  return inputDate <= endOfToday;
};

export const EmploymentDataSchema = z.object({
  employer: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
    }),
  employmentStatus: z.enum(
    [
      EMPLOYMENT_STATUSES.BUSINESS_OWNER,
      EMPLOYMENT_STATUSES.INDEPENDENT,
      EMPLOYMENT_STATUSES.RETIRED,
      EMPLOYMENT_STATUSES.SALARIED_CCSS,
      EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
      EMPLOYMENT_STATUSES.SALARIED_PUBLIC,
    ],
    {
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA
          .EMPLOYMENT_STATUS_INVALID,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA
          .EMPLOYMENT_STATUS_REQUIRED,
    },
  ),
  entryDate: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.ENTRY_DATE_INVALID,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.ENTRY_DATE_INVALID,
    })
    .trim()
    .refine(isValidDateDDMMYYYY, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.ENTRY_DATE_INVALID,
    })
    .refine(isNotFutureDateDDMMYYYY, {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.ENTRY_DATE_FUTURE,
    }),
  officePhone: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_REQUIRED,
    })
    .regex(
      INTERNATIONAL_PHONE_REGEX,
      PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_INVALID,
    ),
  profession: z
    .string({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
    }),
});

export const FinancialCapacitySchema = z.object({
  currency: z.enum([FINANCIAL_CURRENCIES.CRC, FINANCIAL_CURRENCIES.USD], {
    invalid_type_error:
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.CURRENCY_INVALID,
    required_error:
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.CURRENCY_INVALID,
  }),
  grossIncome: z
    .number({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_POSITIVE,
    ),
  netIncome: z
    .number({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_POSITIVE,
    ),
  otherIncomes: z
    .number({
      invalid_type_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY
          .OTHER_INCOMES_REQUIRED,
      required_error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY
          .OTHER_INCOMES_REQUIRED,
    })
    .min(0, PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.OTHER_INCOMES_MIN)
    .optional(),
});

export const PhysicalPersonContactSchema = z.object({
  contactInfo: ContactInfoSchema,
  employmentData: EmploymentDataSchema,
  financialCapacity: FinancialCapacitySchema,
  residentialAddress: ResidentialAddressSchema,
});
