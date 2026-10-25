import React from 'react';
import {
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS,
} from '../constants/PhysicalPersonContactStepView.constants';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type { PhysicalPersonContactStepViewProps } from '../types/PhysicalPersonContactStepView.types';
import { PhysicalPersonContactForm } from './PhysicalPersonContactForm';
import { WizardStepLayout } from './WizardStepLayout';

export const PhysicalPersonContactStepView = ({
  currentStep,
  disabled = false,
  onClose,
  onSubmit,
  options,
  testID,
  totalSteps,
  viewModel: viewModelProp,
}: PhysicalPersonContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = usePhysicalPersonContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, handleNextStep, isSubmitting, isValid, submitError } = viewModel;

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.DESCRIPTION}
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
        backButton: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON,
        bottomBar: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
        container: testID ?? PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
        description: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
        processTopBar: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
        scrollView: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
        submitButton: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
        title: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.TITLE,
        wizardHeader: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
      }}
      title={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.TITLE}
      totalSteps={totalSteps}
    >
      {({ onInputFocus }) => (
        <PhysicalPersonContactForm
          control={control}
          disabled={disabled || isSubmitting}
          onInputFocus={onInputFocus}
          options={options}
          testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM}
        />
      )}
    </WizardStepLayout>
  );
};

PhysicalPersonContactStepView.displayName = 'PhysicalPersonContactStepView';