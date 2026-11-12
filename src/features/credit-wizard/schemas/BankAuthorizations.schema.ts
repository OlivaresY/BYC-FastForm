import { z } from 'zod';
import {
  AVAILABLE_BANKS,
  type BankKey,
} from '../constants/BankAuthorizations.constants';

export const BANK_AUTHORIZATIONS_ERROR_MESSAGES = {
  AT_LEAST_ONE_BANK_REQUIRED: 'Debe seleccionar al menos una entidad bancaria',
  AUTORIZA_BUROS_CREDITO_REQUIRED: 'Debe aceptar esta condición para continuar',
  AUTORIZA_SUGEF_CIC_REQUIRED: 'Debe aceptar esta condición para continuar',
} as const;

const bankSchemaShape = AVAILABLE_BANKS.reduce(
  (acc, bank) => {
    acc[bank] = z.boolean();
    return acc;
  },
  {} as Record<BankKey, z.ZodBoolean>,
);

export const bankAuthorizationsSchema = z
  .object({
    ...bankSchemaShape,
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
  })
  .refine(
    (data) => AVAILABLE_BANKS.some((bank) => data[bank]),
    {
      message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AT_LEAST_ONE_BANK_REQUIRED,
      path: ['banco_bac'],
    },
  );

export type BankAuthorizationsSchema = typeof bankAuthorizationsSchema;
