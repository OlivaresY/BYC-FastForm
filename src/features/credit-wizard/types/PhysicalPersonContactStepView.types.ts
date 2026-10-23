import type { UsePhysicalPersonContactViewModelReturn } from './PhysicalPersonContact.types';
import type { PhysicalPersonContactFormOptions } from './PhysicalPersonContactForm.types';

export interface PhysicalPersonContactStepViewProps {
  disabled?: boolean;
  onClose?: () => void;
  options?: PhysicalPersonContactFormOptions;
  testID?: string;
  viewModel?: UsePhysicalPersonContactViewModelReturn;
}
