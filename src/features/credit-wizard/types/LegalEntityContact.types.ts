import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import type { z } from 'zod';
import type {
  CommercialActivitySchema,
  CommercialAddressSchema,
  CommercialReferenceSchema,
  ContactInfoSchema,
  FinancialStatementsSchema,
  LegalEntityContactSchema,
} from '../schemas/LegalEntityContact.schema';

export type CommercialActivity = z.infer<typeof CommercialActivitySchema>;
export type CommercialAddress = z.infer<typeof CommercialAddressSchema>;
export type CommercialReference = z.infer<typeof CommercialReferenceSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type FinancialStatements = z.infer<typeof FinancialStatementsSchema>;
export type LegalEntityContact = z.infer<typeof LegalEntityContactSchema>;

export type FinancialCurrency = FinancialStatements['currency'];

export interface UseLegalEntityContactViewModelProps {
  defaultValues?: Partial<LegalEntityContact>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSubmit?: (data: LegalEntityContact) => void | Promise<void>;
}

export interface UseLegalEntityContactViewModelReturn {
  control: Control<LegalEntityContact>;
  errors: FieldErrors<LegalEntityContact>;
  handleNextStep: (dataOrEvent?: unknown) => Promise<void> | void;
  handleSubmit: UseFormHandleSubmit<LegalEntityContact>;
  isSubmitting: boolean;
  isValid: boolean;
  submitError: string | null;
}
