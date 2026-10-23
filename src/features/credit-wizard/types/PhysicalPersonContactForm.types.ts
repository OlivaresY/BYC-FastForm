import type { Control, FieldErrors } from 'react-hook-form';
import type { CustomSelectOption } from '@/shared/ui/CustomSelect';
import type {
  PhysicalPersonContact,
  UsePhysicalPersonContactViewModelReturn,
} from './PhysicalPersonContact.types';

export interface PhysicalPersonContactFormOptions {
  cantonOptions?: readonly CustomSelectOption[];
  currencyOptions?: readonly CustomSelectOption[];
  districtOptions?: readonly CustomSelectOption[];
  employmentStatusOptions?: readonly CustomSelectOption[];
  provinceOptions?: readonly CustomSelectOption[];
}

export interface PhysicalPersonContactFormProps {
  control: Control<PhysicalPersonContact>;
  disabled?: boolean;
  errors?: FieldErrors<PhysicalPersonContact>;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
  viewModel?: UsePhysicalPersonContactViewModelReturn;
}
