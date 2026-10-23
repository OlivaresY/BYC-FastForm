import { z } from 'zod';
import {
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
      error: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    })
    .trim()
    .min(1, PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED)
    .regex(
      INTERNATIONAL_PHONE_REGEX,
      PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_INVALID,
    ),
  email: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .trim()
    .min(1, PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED)
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
      error: PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED,
    })
    .trim()
    .min(1, PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.CANTON_REQUIRED),
  district: z
    .string({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    })
    .trim()
    .min(
      1,
      PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.DISTRICT_REQUIRED,
    ),
  exactAddress: z
    .string({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS
          .EXACT_ADDRESS_REQUIRED,
    })
    .trim()
    .min(
      1,
      PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.EXACT_ADDRESS_REQUIRED,
    ),
  province: z
    .string({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    })
    .trim()
    .min(
      1,
      PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    ),
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
    999,
  );
  return inputDate <= endOfToday;
};

export const EmploymentDataSchema = z.object({
  employer: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
    })
    .trim()
    .min(1, PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED),
  employmentStatus: z
    .string({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA
          .EMPLOYMENT_STATUS_REQUIRED,
    })
    .trim()
    .min(
      1,
      PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYMENT_STATUS_REQUIRED,
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
    .min(
      1,
      PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_REQUIRED,
    )
    .regex(
      INTERNATIONAL_PHONE_REGEX,
      PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.OFFICE_PHONE_INVALID,
    ),
  profession: z
    .string({
      error: PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED,
    })
    .trim()
    .min(1, PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.PROFESSION_REQUIRED),
});

export const FinancialCapacitySchema = z.object({
  currency: z.enum([FINANCIAL_CURRENCIES.CRC, FINANCIAL_CURRENCIES.USD], {
    error: PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.CURRENCY_INVALID,
  }),
  grossIncome: z
    .number({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_POSITIVE,
    ),
  netIncome: z
    .number({
      error:
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_REQUIRED,
    })
    .gt(
      0,
      PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_POSITIVE,
    ),
  otherIncomes: z
    .number({
      error:
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
