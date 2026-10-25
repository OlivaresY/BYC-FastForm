import type { Control } from 'react-hook-form';
import type { LegalEntityContact } from './LegalEntityContact.types';

export interface LegalEntityContactFormProps {
  control: Control<LegalEntityContact>;
  disabled?: boolean;
  onInputFocus?: (event?: unknown) => void;
  testID?: string;
}
