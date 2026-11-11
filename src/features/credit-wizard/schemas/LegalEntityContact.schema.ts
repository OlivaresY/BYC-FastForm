import { z } from 'zod';
import { isNotFutureDateDDMMYYYY, isValidDateDDMMYYYY } from '@/shared/utils';
import {
  FINANCIAL_CURRENCIES,
  LEGAL_ENTITY_CONTACT_PATTERNS,
} from '../constants/LegalEntityContact.constants';
import { WIZARD_COPY } from '../constants/WizardCopy.constants';

const LEGAL_ENTITY_CONTACT_ERRORS = WIZARD_COPY.STEP_2_LEGAL_CONTACT.ERRORS;

export const INTERNATIONAL_PHONE_REGEX =
  LEGAL_ENTITY_CONTACT_PATTERNS.INTERNATIONAL_PHONE;

export { isNotFutureDateDDMMYYYY };

export const CommercialActivitySchema = z.object({
  accountingPhone: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ACCOUNTING_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ACCOUNTING_PHONE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .regex(
          INTERNATIONAL_PHONE_REGEX,
          LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
            .ACCOUNTING_PHONE_INVALID,
        ),
    ),
  constitutionDate: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .refine(isValidDateDDMMYYYY, {
          message:
            LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
              .CONSTITUTION_DATE_INVALID,
        })
        .refine(isNotFutureDateDDMMYYYY, {
          message:
            LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
              .CONSTITUTION_DATE_FUTURE,
        }),
    ),
  economicSector: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ECONOMIC_SECTOR_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ECONOMIC_SECTOR_REQUIRED,
    }),
  employeesCount: z.coerce
    .number({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .EMPLOYEES_COUNT_REQUIRED,
    })
    .int()
    .gt(
      0,
      LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY.EMPLOYEES_COUNT_POSITIVE,
    ),
  mainActivity: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY.MAIN_ACTIVITY_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY.MAIN_ACTIVITY_REQUIRED,
    }),
});

export const CommercialAddressSchema = z.object({
  canton: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.CANTON_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.CANTON_REQUIRED,
    }),
  district: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.DISTRICT_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.DISTRICT_REQUIRED,
    }),
  exactAddress: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.EXACT_ADDRESS_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.EXACT_ADDRESS_REQUIRED,
    }),
  province: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.PROVINCE_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.PROVINCE_REQUIRED,
    }),
});

export const CommercialReferenceSchema = z.object({
  companyReference: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .COMPANY_REFERENCE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .COMPANY_REFERENCE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .min(2, {
          message:
            LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
              .COMPANY_REFERENCE_MIN,
        }),
    ),
  ibanAccount: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE.IBAN_ACCOUNT_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE.IBAN_ACCOUNT_REQUIRED,
    })
    .pipe(
      z
        .string()
        .regex(
          LEGAL_ENTITY_CONTACT_PATTERNS.CR_IBAN,
          LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .IBAN_ACCOUNT_INVALID,
        ),
    ),
  referencePhone: z
    .string({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .REFERENCE_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .REFERENCE_PHONE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .regex(
          INTERNATIONAL_PHONE_REGEX,
          LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .REFERENCE_PHONE_INVALID,
        ),
    ),
});

export const ContactInfoSchema = z.object({
  cellPhone: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .regex(
          INTERNATIONAL_PHONE_REGEX,
          LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_INVALID,
        ),
    ),
  email: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    })
    .pipe(
      z.email({
        error: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.EMAIL_INVALID,
      }),
    ),
  officePhone: z
    .string({
      error: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.OFFICE_PHONE_REQUIRED,
    })
    .trim()
    .min(1, {
      message: LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.OFFICE_PHONE_REQUIRED,
    })
    .pipe(
      z
        .string()
        .regex(
          INTERNATIONAL_PHONE_REGEX,
          LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.OFFICE_PHONE_INVALID,
        ),
    ),
});

export const FinancialStatementsSchema = z.object({
  currency: z.enum([FINANCIAL_CURRENCIES.CRC, FINANCIAL_CURRENCIES.USD], {
    error: LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.CURRENCY_INVALID,
  }),
  grossSales: z.coerce
    .number({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.GROSS_SALES_REQUIRED,
    })
    .gt(
      0,
      LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.GROSS_SALES_POSITIVE,
    ),
  netProfit: z.coerce
    .number({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.NET_PROFIT_REQUIRED,
    })
    .gt(0, LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.NET_PROFIT_POSITIVE),
  otherIncomes: z.coerce
    .number({
      error:
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.OTHER_INCOMES_REQUIRED,
    })
    .min(
      0,
      LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.OTHER_INCOMES_MIN,
    )
    .nullish(),
});

export const LegalEntityContactSchema = z
  .object({
    commercialActivity: CommercialActivitySchema,
    commercialAddress: CommercialAddressSchema,
    commercialReference: CommercialReferenceSchema,
    contactInfo: ContactInfoSchema,
    financialStatements: FinancialStatementsSchema,
  })
  .refine(
    (data) =>
      !(
        typeof data.financialStatements?.grossSales === 'number' &&
        typeof data.financialStatements?.netProfit === 'number' &&
        data.financialStatements.netProfit > data.financialStatements.grossSales
      ),
    {
      message:
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS
          .NET_PROFIT_EXCEEDS_GROSS,
      path: ['financialStatements', 'netProfit'],
    },
  );
