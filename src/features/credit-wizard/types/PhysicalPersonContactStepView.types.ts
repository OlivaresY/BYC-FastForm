import type {
  PhysicalPersonContact,
  UsePhysicalPersonContactViewModelReturn,
} from './PhysicalPersonContact.types';
import type { PhysicalPersonContactFormOptions } from './PhysicalPersonContactForm.types';

export interface PhysicalPersonContactStepViewProps {
  currentStep: number;
  disabled?: boolean;
  onClose?: () => void;
  onSubmit?: (data: PhysicalPersonContact) => void;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
  totalSteps: number;
  viewModel?: UsePhysicalPersonContactViewModelReturn;
}
