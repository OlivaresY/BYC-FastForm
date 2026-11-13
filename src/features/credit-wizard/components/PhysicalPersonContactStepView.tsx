import { useTranslation } from '@/shared/i18n';
import React from 'react';
import { PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/PhysicalPersonContactStepView.constants';
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
  const { t } = useTranslation();
  const stepCopy = t.creditWizard.step2PhysicalContact;
  const defaultViewModel = usePhysicalPersonContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const {
    cantonOptions,
    control,
    districtOptions,
    handleCantonChange,
    handleNextStep,
    handleProvinceChange,
    isSubmitting,
    isValid,
    provinceOptions,
    submitError,
  } = viewModel;

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description={stepCopy.description}
      disabled={disabled}
      isSubmitDisabled={!isValid}
      isSubmitting={isSubmitting}
      onBack={onClose}
      onClose={onClose}
      onNext={(): void => {
        void handleNextStep();
      }}
      submitButtonLabel={t.common.buttons.next}
      submitError={submitError}
      testID={testID}
      testIds={{
        backButton: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON,
        bottomBar: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
        container:
          testID ?? PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
        description: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
        processTopBar:
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
        scrollView: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
        submitButton: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
        title: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.TITLE,
        wizardHeader: PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
      }}
      title={stepCopy.title}
      totalSteps={totalSteps}
    >
      <PhysicalPersonContactForm
        control={control}
        disabled={disabled || isSubmitting}
        onCantonChange={handleCantonChange}
        onProvinceChange={handleProvinceChange}
        options={{
          ...options,
          cantonOptions: options?.cantonOptions ?? cantonOptions,
          districtOptions: options?.districtOptions ?? districtOptions,
          provinceOptions: options?.provinceOptions ?? provinceOptions,
        }}
        testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM}
      />
    </WizardStepLayout>
  );
};

PhysicalPersonContactStepView.displayName = 'PhysicalPersonContactStepView';
