import React, { useCallback } from 'react';
import { View } from 'react-native';
import { BaseButton, ErrorBanner } from '@/shared/ui';
import {
  APPLICANT_STEP_VIEW_CONSTANTS,
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_NUMERICAL,
  APPLICANT_STEP_VIEW_STYLES,
  APPLICANT_STEP_VIEW_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
import { WIZARD_COPY } from '../constants/WizardCopy.constants';
import { useApplicantStepViewModel } from '../hooks/useApplicantStepViewModel';
import type { ApplicantStepViewProps } from '../types/ApplicantStepView.types';
import { FinalBeneficiaryModal } from './FinalBeneficiaryModal';
import { LegalEntityForm } from './LegalEntityForm';
import { LegalEntitySelector } from './LegalEntitySelector';
import { PhysicalPersonForm } from './PhysicalPersonForm';
import { VehicleBeneficiarySection } from './VehicleBeneficiarySection';
import { WizardStepLayout } from './WizardStepLayout';

const NOOP_VOID = (): void => undefined;
const NOOP_FIELD_CHANGE = (): void => undefined;

export const ApplicantStepView = React.memo(
  ({
    disabled = false,
    onClose,
    onSubmit,
    testID,
    viewModel: viewModelProp,
  }: ApplicantStepViewProps): React.JSX.Element => {
    const defaultViewModel = useApplicantStepViewModel({
      onSubmit,
    });

    const vm = viewModelProp ?? defaultViewModel;

    const {
      closeBeneficiaryModal,
      handleNextStep,
      handleSaveThirdPartyData,
      isBeneficiaryModalOpen,
      isIdentificationValid,
      isSubmitting = false,
      isValid,
      legalErrors,
      legalValues,
      onLegalFieldChange,
      onPhysicalFieldChange,
      onRegimeChange,
      onThirdPartyFieldChange,
      onVehicleBeneficiaryChange,
      physicalErrors,
      physicalValues,
      regime,
      submitError,
      thirdPartyErrors,
      thirdPartyValues,
      vehicleBeneficiary,
    } = vm;

    const handleSaveModal = useCallback((): void => {
      handleSaveThirdPartyData?.();
    }, [handleSaveThirdPartyData]);

    return (
      <>
        <WizardStepLayout
          currentStep={APPLICANT_STEP_VIEW_NUMERICAL.CURRENT_STEP}
          description={WIZARD_COPY.STEP_1_APPLICANT.DESCRIPTION}
          disabled={disabled}
          footer={
            <BaseButton
              disabled={!isValid || disabled || isSubmitting}
              fullWidth
              label={WIZARD_COPY.STEP_1_APPLICANT.SUBMIT_BUTTON}
              loading={isSubmitting}
              onPress={(): void => {
                void handleNextStep?.();
              }}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
              variant='primary'
            />
          }
          onClose={onClose}
          testID={testID}
          testIds={{
            bottomBar: APPLICANT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
            container: testID ?? APPLICANT_STEP_VIEW_TEST_IDS.CONTAINER,
            description: APPLICANT_STEP_VIEW_TEST_IDS.DESCRIPTION,
            processTopBar: APPLICANT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
            scrollView: APPLICANT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
            submitButton: APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
            title: APPLICANT_STEP_VIEW_TEST_IDS.TITLE,
            wizardHeader: APPLICANT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
          }}
          title={WIZARD_COPY.STEP_1_APPLICANT.TITLE}
          totalSteps={APPLICANT_STEP_VIEW_NUMERICAL.TOTAL_STEPS}
          userInitials={APPLICANT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS}
        >
          {submitError ? (
            <ErrorBanner error={submitError} message={submitError} />
          ) : null}

          <LegalEntitySelector
            disabled={disabled || isSubmitting}
            onSelectEntity={onRegimeChange}
            selectedEntity={regime}
            testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_SELECTOR}
          />

          <View
            className={APPLICANT_STEP_VIEW_STYLES.TAUPE_CONTAINER}
            testID={APPLICANT_STEP_VIEW_TEST_IDS.TAUPE_CONTAINER}
          >
            {regime === 'physical' ? (
              <PhysicalPersonForm
                disabled={disabled || isSubmitting}
                errors={physicalErrors}
                isIdentificationValid={isIdentificationValid}
                onFieldChange={onPhysicalFieldChange}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.PHYSICAL_FORM}
                values={physicalValues}
              />
            ) : (
              <LegalEntityForm
                disabled={disabled || isSubmitting}
                errors={legalErrors}
                isIdentificationValid={isIdentificationValid}
                onFieldChange={onLegalFieldChange}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_FORM}
                values={legalValues}
              />
            )}

            <View
              className={APPLICANT_STEP_VIEW_STYLES.DIVIDER}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.DIVIDER}
            />

            <VehicleBeneficiarySection
              disabled={disabled || isSubmitting}
              onSelectBeneficiary={onVehicleBeneficiaryChange}
              selectedBeneficiary={vehicleBeneficiary}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.VEHICLE_BENEFICIARY}
            />
          </View>
        </WizardStepLayout>

        <FinalBeneficiaryModal
          errors={thirdPartyErrors}
          isOpen={isBeneficiaryModalOpen}
          onClose={closeBeneficiaryModal ?? NOOP_VOID}
          onFieldChange={onThirdPartyFieldChange ?? NOOP_FIELD_CHANGE}
          onSave={handleSaveModal}
          values={
            thirdPartyValues ?? APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY
          }
        />
      </>
    );
  },
);

ApplicantStepView.displayName = 'ApplicantStepView';
