import type {
  LegalEntityContact,
  UseLegalEntityContactViewModelReturn,
} from './LegalEntityContact.types';

export interface LegalEntityContactStepViewProps {
  currentStep: number;
  defaultValues?: Partial<LegalEntityContact>;
  disabled?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSubmit?: (data: LegalEntityContact) => void;
  testID?: string;
  totalSteps: number;
  viewModel?: UseLegalEntityContactViewModelReturn;
}
