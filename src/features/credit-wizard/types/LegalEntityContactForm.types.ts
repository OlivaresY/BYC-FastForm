import type { Control } from 'react-hook-form';
import type { LegalEntityContact } from './LegalEntityContact.types';

export interface LegalEntityContactFormProps {
  control: Control<LegalEntityContact>;
  disabled?: boolean;
  onInputFocus?: () => void;
  testID?: string;
}
