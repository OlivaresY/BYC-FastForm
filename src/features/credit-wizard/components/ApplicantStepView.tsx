import React, { useCallback } from 'react';
import { View } from 'react-native';
import {
  APPLICANT_STEP_VIEW_CONSTANTS,
  APPLICANT_STEP_VIEW_COPY,
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_NUMERICAL,
  APPLICANT_STEP_VIEW_STYLES,
  APPLICANT_STEP_VIEW_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
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
    closeBeneficiaryModal: closeBeneficiaryModalProp,
    disabled = false,
    handleNextStep: handleNextStepProp,
    handleSaveThirdPartyData: handleSaveThirdPartyDataProp,
    isBeneficiaryModalOpen: isBeneficiaryModalOpenProp,
    isIdentificationValid: isIdentificationValidProp,
    isSubmitting: isSubmittingProp,
    isValid: isValidProp,
    legalErrors: legalErrorsProp,
    legalValues: legalValuesProp,
    onClose,
    onLegalFieldChange: onLegalFieldChangeProp,
    onPhysicalFieldChange: onPhysicalFieldChangeProp,
    onRegimeChange: onRegimeChangeProp,
    onSubmit: onSubmitProp,
    onThirdPartyFieldChange: onThirdPartyFieldChangeProp,
    onVehicleBeneficiaryChange: onVehicleBeneficiaryChangeProp,
    physicalErrors: physicalErrorsProp,
    physicalValues: physicalValuesProp,
    regime: regimeProp,
    submitError: submitErrorProp,
    testID,
    thirdPartyErrors: thirdPartyErrorsProp,
    thirdPartyValues: thirdPartyValuesProp,
    vehicleBeneficiary: vehicleBeneficiaryProp,
    viewModel: viewModelProp,
  }: ApplicantStepViewProps): React.JSX.Element => {
    const defaultViewModel = useApplicantStepViewModel({
      initialLegalValues: legalValuesProp,
      initialPhysicalValues: physicalValuesProp,
      initialRegime: regimeProp,
      initialThirdPartyValues: thirdPartyValuesProp,
      initialVehicleBeneficiary: vehicleBeneficiaryProp,
      onSubmit: onSubmitProp,
    });

    const vm = viewModelProp ?? defaultViewModel;

    const closeBeneficiaryModal =
      closeBeneficiaryModalProp ?? vm.closeBeneficiaryModal;
    const handleNextStep =
      handleNextStepProp ?? vm.handleNextStep ?? vm.onSubmit;
    const handleSaveThirdPartyData =
      handleSaveThirdPartyDataProp ?? vm.handleSaveThirdPartyData;
    const isBeneficiaryModalOpen =
      isBeneficiaryModalOpenProp ?? vm.isBeneficiaryModalOpen;
    const isIdentificationValid =
      isIdentificationValidProp ?? vm.isIdentificationValid;
    const isSubmitting = isSubmittingProp ?? vm.isSubmitting ?? false;
    const isValid = isValidProp ?? vm.isValid;
    const legalErrors = legalErrorsProp ?? vm.legalErrors;
    const legalValues = legalValuesProp ?? vm.legalValues;
    const onLegalFieldChange = onLegalFieldChangeProp ?? vm.onLegalFieldChange;
    const onPhysicalFieldChange =
      onPhysicalFieldChangeProp ?? vm.onPhysicalFieldChange;
    const onRegimeChange = onRegimeChangeProp ?? vm.onRegimeChange;
    const onThirdPartyFieldChange =
      onThirdPartyFieldChangeProp ?? vm.onThirdPartyFieldChange;
    const onVehicleBeneficiaryChange =
      onVehicleBeneficiaryChangeProp ?? vm.onVehicleBeneficiaryChange;
    const physicalErrors = physicalErrorsProp ?? vm.physicalErrors;
    const physicalValues = physicalValuesProp ?? vm.physicalValues;
    const regime = regimeProp ?? vm.regime;
    const submitError = submitErrorProp ?? vm.submitError ?? null;
    const thirdPartyErrors = thirdPartyErrorsProp ?? vm.thirdPartyErrors;
    const thirdPartyValues = thirdPartyValuesProp ?? vm.thirdPartyValues;
    const vehicleBeneficiary = vehicleBeneficiaryProp ?? vm.vehicleBeneficiary;

    const handleSaveModal = useCallback((): void => {
      handleSaveThirdPartyData?.();
    }, [handleSaveThirdPartyData]);

    return (
      <WizardStepLayout
        currentStep={APPLICANT_STEP_VIEW_NUMERICAL.CURRENT_STEP}
        description={APPLICANT_STEP_VIEW_COPY.DESCRIPTION}
        disabled={disabled}
        isSubmitDisabled={!isValid}
        isSubmitting={isSubmitting}
        modal={
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
        }
        onClose={onClose}
        onSubmit={(): void => {
          void handleNextStep();
        }}
        submitButtonLabel={APPLICANT_STEP_VIEW_COPY.SUBMIT_BUTTON}
        submitError={submitError}
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
        title={APPLICANT_STEP_VIEW_COPY.TITLE}
        totalSteps={APPLICANT_STEP_VIEW_NUMERICAL.TOTAL_STEPS}
        userInitials={APPLICANT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS}
      >
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
    );
  },
);

ApplicantStepView.displayName = 'ApplicantStepView';
