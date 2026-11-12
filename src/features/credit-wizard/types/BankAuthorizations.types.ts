import type { z } from 'zod';
import type { BankKey } from '../constants/BankAuthorizations.constants';
import type { bankAuthorizationsSchema } from '../schemas/BankAuthorizations.schema';

export type BankFlags = Record<BankKey, boolean>;

export type BankAuthorizationsFormValues = z.infer<
  typeof bankAuthorizationsSchema
>;
