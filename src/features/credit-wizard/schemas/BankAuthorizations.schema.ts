import { z } from 'zod';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

export const BANK_AUTHORIZATIONS_ERROR_MESSAGES = {
  ACEPTA_TERMINOS_REQUIRED: 'Debe aceptar esta condición para continuar',
  AUTORIZA_BURO_REQUIRED: 'Debe aceptar esta condición para continuar',
  AUTORIZA_SUGEF_REQUIRED: 'Debe aceptar esta condición para continuar',
  BANCO_DESTINO_REQUIRED: 'El banco de destino es obligatorio',
} as const;

export const bankAuthorizationsSchema: z.ZodType<BankAuthorizationsFormValues> =
  z.object({
    acepta_terminos: z
      .boolean({
        error: BANK_AUTHORIZATIONS_ERROR_MESSAGES.ACEPTA_TERMINOS_REQUIRED,
      })
      .refine((val) => val === true, {
        message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.ACEPTA_TERMINOS_REQUIRED,
      }),
    autoriza_buro: z
      .boolean({
        error: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BURO_REQUIRED,
      })
      .refine((val) => val === true, {
        message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BURO_REQUIRED,
      }),
    autoriza_sugef: z
      .boolean({
        error: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
      })
      .refine((val) => val === true, {
        message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
      }),
    banco_destino: z
      .string({
        error: BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
      })
      .trim()
      .min(1, {
        message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
      }),
  });

export type BankAuthorizationsSchema = typeof bankAuthorizationsSchema;
