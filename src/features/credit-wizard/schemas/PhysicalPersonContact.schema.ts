import { z } from 'zod';
import {
  EMPLOYMENT_STATUSES,
  FINANCIAL_CURRENCIES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
  PHYSICAL_PERSON_CONTACT_PATTERNS,
} from '../constants/PhysicalPersonContact.constants';
import { isNotFutureDateDDMMYYYY, isValidDateDDMMYYYY } from '@/shared/utils';

export const INTERNATIONAL_PHONE_REGEX =
  PHYSICAL_PERSON_CONTACT_PATTERNS.INTERNATIONAL_PHONE;

export const ContactInfoSchema = z.object({
  cellPhone: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
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
      error: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .trim()
    .min(1, {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .pipe(
      z.email({
        error: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_INVALID,
      }),
    ),
  homePhone: z
    .string()
    .trim()
    .nullish()
    .refine((value) => !value || INTERNATIONAL_PHONE_REGEX.test(value), {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.HOME_PHONE_INVALID,
    }),
});

export const ResidentialAddressSchema = z.object({
  canton: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
    }),
  district: z
    .string({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    }),
  exactAddress: z
    .string({
      error:
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
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    }),
});

export { isNotFutureDateDDMMYYYY };

export const EmploymentDataSchema = z.object({
  employer: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
    })
    .trim()
    .min(1, {
      message: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
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
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA
          .EMPLOYMENT_STATUS_REQUIRED,
    },
  ),
  entryDate: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.ENTRY_DATE_INVALID,
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
      error:
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
      error: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
    }),
});

export const FinancialCapacitySchema = z.object({
  currency: z.enum([FINANCIAL_CURRENCIES.CRC, FINANCIAL_CURRENCIES.USD], {
    error: PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.CURRENCY_INVALID,
  }),
  grossIncome: z.coerce
    .number({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_POSITIVE,
    ),
  netIncome: z.coerce
    .number({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_POSITIVE,
    ),
  otherIncomes: z.coerce
    .number({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY
          .OTHER_INCOMES_REQUIRED,
    })
    .min(0, PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.OTHER_INCOMES_MIN)
    .nullish(),
});

export const PhysicalPersonContactSchema = z.object({
  contactInfo: ContactInfoSchema,
  employmentData: EmploymentDataSchema,
  financialCapacity: FinancialCapacitySchema,
  residentialAddress: ResidentialAddressSchema,
});
