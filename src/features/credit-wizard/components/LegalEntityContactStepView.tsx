import React from 'react';
import {
  LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS,
} from '../constants/LegalEntityContactStepView.constants';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type { LegalEntityContactStepViewProps } from '../types/LegalEntityContactStepView.types';
import { LegalEntityContactForm } from './LegalEntityContactForm';
import { WizardStepLayout } from './WizardStepLayout';

export const LegalEntityContactStepView = ({
  currentStep = LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL.DEFAULT_CURRENT_STEP,
  disabled = false,
  onClose,
  onSubmit,
  testID,
  totalSteps = LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL.DEFAULT_TOTAL_STEPS,
  viewModel: viewModelProp,
}: LegalEntityContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = useLegalEntityContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, handleNextStep, isSubmitting, isValid, submitError } =
    viewModel;

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description={LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.DESCRIPTION}
      disabled={disabled}
      isSubmitDisabled={!isValid}
      isSubmitting={isSubmitting}
      onBack={onClose}
      onClose={onClose}
      onSubmit={(): void => {
        void handleNextStep();
      }}
      submitError={submitError}
      testID={testID}
      testIds={{
        backButton: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON,
        bottomBar: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
        container:
          testID ?? LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
        description: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
        processTopBar:
          LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
        scrollView: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
        submitButton: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
        title: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.TITLE,
        wizardHeader: LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
      }}
      title={LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.TITLE}
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
