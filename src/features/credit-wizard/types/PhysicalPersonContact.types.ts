import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import type { z } from 'zod';
import type { CustomSelectOption } from '@/shared/ui';
import type {
  CommercialReferenceSchema,
  ContactInfoSchema,
  EmploymentDataSchema,
  FinancialCapacitySchema,
  PhysicalPersonContactSchema,
  ResidentialAddressSchema,
} from '../schemas/PhysicalPersonContact.schema';

export type CommercialReference = z.infer<typeof CommercialReferenceSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type EmploymentData = z.infer<typeof EmploymentDataSchema>;
export type FinancialCapacity = z.infer<typeof FinancialCapacitySchema>;
export type PhysicalPersonContact = z.infer<typeof PhysicalPersonContactSchema>;
export type ResidentialAddress = z.infer<typeof ResidentialAddressSchema>;

export type FinancialCurrency = FinancialCapacity['currency'];

export interface UsePhysicalPersonContactViewModelProps {
  defaultValues?: Partial<PhysicalPersonContact>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSubmit?: (data: PhysicalPersonContact) => void | Promise<void>;
}

export interface UsePhysicalPersonContactViewModelReturn {
  cantonOptions: readonly CustomSelectOption[];
  control: Control<PhysicalPersonContact>;
  districtOptions: readonly CustomSelectOption[];
  errors: FieldErrors<PhysicalPersonContact>;
  handleCantonChange: (canton: string) => void;
  handleNextStep: (dataOrEvent?: unknown) => Promise<void> | void;
  handleProvinceChange: (province: string) => void;
  handleSubmit: UseFormHandleSubmit<PhysicalPersonContact>;
  isSubmitting: boolean;
  isValid: boolean;
  provinceOptions: readonly CustomSelectOption[];
  submitError: string | null;
}
