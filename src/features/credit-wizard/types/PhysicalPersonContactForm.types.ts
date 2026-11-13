import type { Control } from 'react-hook-form';
import type { CustomSelectOption } from '@/shared/ui';
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
  onCantonChange?: (canton: string) => void;
  onInputFocus?: (event?: unknown) => void;
  onProvinceChange?: (province: string) => void;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
}
