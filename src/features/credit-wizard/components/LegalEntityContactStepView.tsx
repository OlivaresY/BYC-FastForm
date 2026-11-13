import { useTranslation } from '@/shared/i18n';
import React from 'react';
import { LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/LegalEntityContactStepView.constants';
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
  const { t } = useTranslation();
  const stepCopy = t.creditWizard.step2LegalContact;
  const defaultViewModel = useLegalEntityContactViewModel({ onSubmit });
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
      title={stepCopy.title}
      totalSteps={totalSteps}
    >
      <LegalEntityContactForm
        control={control}
        disabled={disabled || isSubmitting}
        onCantonChange={handleCantonChange}
        onProvinceChange={handleProvinceChange}
        options={{ cantonOptions, districtOptions, provinceOptions }}
        testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.FORM}
      />
    </WizardStepLayout>
  );
};

LegalEntityContactStepView.displayName = 'LegalEntityContactStepView';
