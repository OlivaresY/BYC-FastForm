import type React from 'react';

export interface WizardStepLayoutChildrenProps {
  onInputFocus: () => void;
}

export interface WizardStepLayoutTestIds {
  backButton?: string;
  bottomBar?: string;
  container?: string;
  description?: string;
  processTopBar?: string;
  scrollView?: string;
  submitButton?: string;
  title?: string;
  wizardHeader?: string;
}

export interface WizardStepLayoutProps {
  backButtonIcon?: React.ReactNode;
  backButtonLabel?: string;
  children:
    | React.ReactNode
    | ((props: WizardStepLayoutChildrenProps) => React.ReactNode);
  currentStep?: number;
  description: string;
  disabled?: boolean;
  extraScrollPadding?: number;
  isSubmitDisabled?: boolean;
  isSubmitting?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  submitButtonLabel?: string;
  submitError?: string | null;
  testID?: string;
  testIds?: WizardStepLayoutTestIds;
  title: string;
  totalSteps?: number;
  userInitials?: string;
}
