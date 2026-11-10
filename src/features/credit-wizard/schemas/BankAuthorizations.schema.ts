import { z } from 'zod';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

export const BANK_AUTHORIZATIONS_ERROR_MESSAGES = {
  AT_LEAST_ONE_BANK_REQUIRED: 'Debe seleccionar al menos una entidad bancaria',
  AUTORIZA_BUROS_CREDITO_REQUIRED: 'Debe aceptar esta condición para continuar',
  AUTORIZA_SUGEF_CIC_REQUIRED: 'Debe aceptar esta condición para continuar',
} as const;

export const bankAuthorizationsSchema: z.ZodType<BankAuthorizationsFormValues> =
  z
    .object({
      autoriza_buros_credito: z
        .boolean({
          error:
            BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BUROS_CREDITO_REQUIRED,
        })
        .refine((val) => val === true, {
          message:
            BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BUROS_CREDITO_REQUIRED,
        }),
      autoriza_sugef_cic: z
        .boolean({
          error: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_CIC_REQUIRED,
        })
        .refine((val) => val === true, {
          message:
            BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_CIC_REQUIRED,
        }),
      banco_bac: z.boolean().default(false),
      banco_bncr: z.boolean().default(false),
      banco_carro_facil: z.boolean().default(false),
      banco_promerica: z.boolean().default(false),
      banco_scotiabank: z.boolean().default(false),
    })
    .refine(
      (data) =>
        data.banco_bac ||
        data.banco_bncr ||
        data.banco_carro_facil ||
        data.banco_promerica ||
        data.banco_scotiabank,
      {
        message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AT_LEAST_ONE_BANK_REQUIRED,
        path: ['banco_bac'],
      },
    );

export type BankAuthorizationsSchema = typeof bankAuthorizationsSchema;
