import React from 'react';
import { LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/LegalEntityContactStepView.constants';
import { WIZARD_COPY } from '../constants/WizardCopy.constants';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type { LegalEntityContactStepViewProps } from '../types/LegalEntityContactStepView.types';
import { LegalEntityContactForm } from './LegalEntityContactForm';
import { WizardStepLayout } from './WizardStepLayout';

export const LegalEntityContactStepView = ({
  currentStep,
  disabled = false,
  onClose,
  onSubmit,
  testID,
  totalSteps,
  viewModel: viewModelProp,
}: LegalEntityContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = useLegalEntityContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, handleNextStep, isSubmitting, isValid, submitError } =
    viewModel;

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description={WIZARD_COPY.STEP_2_LEGAL_CONTACT.DESCRIPTION}
      disabled={disabled}
      isSubmitDisabled={!isValid}
      isSubmitting={isSubmitting}
      onBack={onClose}
      onClose={onClose}
      onNext={(): void => {
        void handleNextStep();
      }}
      submitButtonLabel={WIZARD_COPY.BUTTONS.NEXT}
      submitError={submitError}
      testID={testID}
      testIds={{
        backButton: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON,
        bottomBar: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
        container: testID ?? LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
        description: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
        processTopBar: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
        scrollView: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
        submitButton: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
        title: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.TITLE,
        wizardHeader: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
      }}
      title={WIZARD_COPY.STEP_2_LEGAL_CONTACT.TITLE}
      totalSteps={totalSteps}
    >
      {({ onInputFocus }) => (
        <LegalEntityContactForm
          control={control}
          disabled={disabled || isSubmitting}
          onInputFocus={onInputFocus}
          testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.FORM}
        />
      )}
    </WizardStepLayout>
  );
};

LegalEntityContactStepView.displayName = 'LegalEntityContactStepView';
