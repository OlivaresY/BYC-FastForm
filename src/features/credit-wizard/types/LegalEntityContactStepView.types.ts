import type {
  LegalEntityContact,
  UseLegalEntityContactViewModelReturn,
} from './LegalEntityContact.types';

export interface LegalEntityContactStepViewProps {
  currentStep?: number;
  disabled?: boolean;
  onClose?: () => void;
  onSubmit?: (data: LegalEntityContact) => void;
  testID?: string;
  totalSteps?: number;
  viewModel?: UseLegalEntityContactViewModelReturn;
}
