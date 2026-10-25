import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import type { z } from 'zod';
import type { LegalEntityContactSchema } from '../schemas/LegalEntityContact.schema';

export type LegalEntityContact = z.infer<typeof LegalEntityContactSchema>;

export type LegalEntityContactField = keyof LegalEntityContact;

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
