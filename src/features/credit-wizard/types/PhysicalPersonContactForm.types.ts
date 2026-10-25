import type { Control } from 'react-hook-form';
import type { CustomSelectOption } from '@/shared/ui/CustomSelect';
import type { PhysicalPersonContact } from './PhysicalPersonContact.types';

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
  onInputFocus?: () => void;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
}
