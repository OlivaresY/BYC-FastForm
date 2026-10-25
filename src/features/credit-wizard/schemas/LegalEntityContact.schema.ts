import { z } from 'zod';
import {
  LEGAL_ENTITY_CONTACT_ERRORS,
  LEGAL_ENTITY_CONTACT_PATTERNS,
} from '../constants/LegalEntityContact.constants';
import { isNotFutureDateDDMMYYYY, isValidDateDDMMYYYY } from '@/shared/utils';

export const LegalEntityContactSchema = z
  .object({
    constitutionDate: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_REQUIRED,
      })
      .pipe(
        z
          .string()
          .refine(isValidDateDDMMYYYY, {
            message: LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_INVALID,
          })
          .refine(isNotFutureDateDDMMYYYY, {
            message: LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_FUTURE,
          }),
      ),
    corporateId: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_REQUIRED,
      })
      .pipe(
        z
          .string()
          .regex(
            LEGAL_ENTITY_CONTACT_PATTERNS.CORPORATE_ID,
            LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_INVALID,
          ),
      ),
    corporateName: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_NAME_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_NAME_REQUIRED,
      }),
    email: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.EMAIL_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.EMAIL_REQUIRED,
      })
      .pipe(
        z.email({
          error: LEGAL_ENTITY_CONTACT_ERRORS.EMAIL_INVALID,
        }),
      ),
    grossIncome: z.coerce
      .number({
        error: LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_REQUIRED,
      })
      .gt(0, LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_POSITIVE),
    netIncome: z.coerce
      .number({
        error: LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_REQUIRED,
      })
      .gt(0, LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_POSITIVE),
    phone: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.PHONE_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.PHONE_REQUIRED,
      })
      .pipe(
        z
          .string()
          .regex(
            LEGAL_ENTITY_CONTACT_PATTERNS.PHONE,
            LEGAL_ENTITY_CONTACT_ERRORS.PHONE_INVALID,
          ),
      ),
    representativeId: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_ID_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_ID_REQUIRED,
      }),
    representativeName: z
      .string({
        error: LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_NAME_REQUIRED,
      })
      .trim()
      .min(1, {
        message: LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_NAME_REQUIRED,
      }),
  })
  .refine(
    (data) =>
      !(
        typeof data.grossIncome === 'number' &&
        typeof data.netIncome === 'number' &&
        data.netIncome > data.grossIncome
      ),
    {
      message: LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_EXCEEDS_GROSS,
      path: ['netIncome'],
    },
  );
