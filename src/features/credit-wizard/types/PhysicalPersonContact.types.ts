import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import type { z } from 'zod';
import type {
  ContactInfoSchema,
  EmploymentDataSchema,
  FinancialCapacitySchema,
  PhysicalPersonContactSchema,
  ResidentialAddressSchema,
} from '../schemas/PhysicalPersonContact.schema';

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type ResidentialAddress = z.infer<typeof ResidentialAddressSchema>;
export type EmploymentData = z.infer<typeof EmploymentDataSchema>;
export type FinancialCapacity = z.infer<typeof FinancialCapacitySchema>;
export type PhysicalPersonContact = z.infer<typeof PhysicalPersonContactSchema>;

export type FinancialCurrency = FinancialCapacity['currency'];

export interface UsePhysicalPersonContactViewModelProps {
  defaultValues?: Partial<PhysicalPersonContact>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSubmit?: (data: PhysicalPersonContact) => void | Promise<void>;
}

export interface UsePhysicalPersonContactViewModelReturn {
  control: Control<PhysicalPersonContact>;
  errors: FieldErrors<PhysicalPersonContact>;
  handleNextStep: (dataOrEvent?: unknown) => Promise<void> | void;
  handleSubmit: UseFormHandleSubmit<PhysicalPersonContact>;
  isSubmitting: boolean;
  isValid: boolean;
  submitError: string | null;
}
