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
  modal?: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onSubmit: () => void;
  submitButtonIcon?: React.ReactNode;
  submitButtonLabel?: string;
  submitError?: string | null;
  testID?: string;
  testIds?: WizardStepLayoutTestIds;
  title: string;
  totalSteps?: number;
  userInitials?: string;
}
