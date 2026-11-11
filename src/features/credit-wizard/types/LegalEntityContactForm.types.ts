import type { Control } from 'react-hook-form';
import type { CustomSelectOption } from '@/shared/ui';
import type { LegalEntityContact } from './LegalEntityContact.types';

export interface LegalEntityContactFormOptions {
  cantonOptions?: readonly CustomSelectOption[];
  currencyOptions?: readonly CustomSelectOption[];
  districtOptions?: readonly CustomSelectOption[];
  economicSectorOptions?: readonly CustomSelectOption[];
  provinceOptions?: readonly CustomSelectOption[];
}

export interface LegalEntityContactFormProps {
  control: Control<LegalEntityContact>;
  disabled?: boolean;
  onInputFocus?: (event?: unknown) => void;
  options?: LegalEntityContactFormOptions;
  testID?: string;
}
