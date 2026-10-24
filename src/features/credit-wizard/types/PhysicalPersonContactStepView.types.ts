import type {
  PhysicalPersonContact,
  UsePhysicalPersonContactViewModelReturn,
} from './PhysicalPersonContact.types';
import type { PhysicalPersonContactFormOptions } from './PhysicalPersonContactForm.types';

export interface PhysicalPersonContactStepViewProps {
  disabled?: boolean;
  onClose?: () => void;
  onSubmit?: (data: PhysicalPersonContact) => void;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
  viewModel?: UsePhysicalPersonContactViewModelReturn;
}
