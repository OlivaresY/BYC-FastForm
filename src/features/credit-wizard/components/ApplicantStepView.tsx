import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { BaseButton, ArrowRightIcon, ProcessTopBar } from '@/shared/ui';
import {
  APPLICANT_STEP_VIEW_COLORS,
  APPLICANT_STEP_VIEW_CONSTANTS,
  APPLICANT_STEP_VIEW_COPY,
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ICON_DIMENSIONS,
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
import { WizardProgressHeader } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;
const NOOP_FIELD_CHANGE = (): void => undefined;

export const ApplicantStepView = React.memo(
  ({
    closeBeneficiaryModal: closeBeneficiaryModalProp,
    disabled = false,
    handleSaveThirdPartyData: handleSaveThirdPartyDataProp,
    isBeneficiaryModalOpen: isBeneficiaryModalOpenProp,
    isIdentificationValid: isIdentificationValidProp,
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
    const handleSaveThirdPartyData =
      handleSaveThirdPartyDataProp ?? vm.handleSaveThirdPartyData;
    const isBeneficiaryModalOpen =
      isBeneficiaryModalOpenProp ?? vm.isBeneficiaryModalOpen;
    const isIdentificationValid =
      isIdentificationValidProp ?? vm.isIdentificationValid;
    const isValid = isValidProp ?? vm.isValid;
    const legalErrors = legalErrorsProp ?? vm.legalErrors;
    const legalValues = legalValuesProp ?? vm.legalValues;
    const onLegalFieldChange = onLegalFieldChangeProp ?? vm.onLegalFieldChange;
    const onPhysicalFieldChange =
      onPhysicalFieldChangeProp ?? vm.onPhysicalFieldChange;
    const onRegimeChange = onRegimeChangeProp ?? vm.onRegimeChange;
    const onSubmit = onSubmitProp ?? vm.onSubmit;
    const onThirdPartyFieldChange =
      onThirdPartyFieldChangeProp ?? vm.onThirdPartyFieldChange;
    const onVehicleBeneficiaryChange =
      onVehicleBeneficiaryChangeProp ?? vm.onVehicleBeneficiaryChange;
    const physicalErrors = physicalErrorsProp ?? vm.physicalErrors;
    const physicalValues = physicalValuesProp ?? vm.physicalValues;
    const regime = regimeProp ?? vm.regime;
    const thirdPartyErrors = thirdPartyErrorsProp ?? vm.thirdPartyErrors;
    const thirdPartyValues = thirdPartyValuesProp ?? vm.thirdPartyValues;
    const vehicleBeneficiary = vehicleBeneficiaryProp ?? vm.vehicleBeneficiary;

    const handleSaveModal = useCallback((): void => {
      handleSaveThirdPartyData?.();
    }, [handleSaveThirdPartyData]);

    return (
      <View
        className={APPLICANT_STEP_VIEW_STYLES.CONTAINER}
        testID={testID ?? APPLICANT_STEP_VIEW_TEST_IDS.CONTAINER}
      >
        <ProcessTopBar
          onClose={onClose ?? NOOP_VOID}
          testID={APPLICANT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR}
          userInitials={APPLICANT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className={APPLICANT_STEP_VIEW_STYLES.KEYBOARD_AVOIDING_VIEW}
        >
          <ScrollView
            className={APPLICANT_STEP_VIEW_STYLES.SCROLL_VIEW}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            testID={APPLICANT_STEP_VIEW_TEST_IDS.SCROLL_VIEW}
          >
            <View className={APPLICANT_STEP_VIEW_STYLES.SCROLL_CONTENT}>
              {/* 1. Wizard Progress Header */}
              <WizardProgressHeader
                currentStep={APPLICANT_STEP_VIEW_NUMERICAL.CURRENT_STEP}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
                totalSteps={APPLICANT_STEP_VIEW_NUMERICAL.TOTAL_STEPS}
              />

              {/* 2. Step Title & Description Block */}
              <View className={APPLICANT_STEP_VIEW_STYLES.HEADER_BLOCK}>
                <Text
                  accessibilityRole='header'
                  className={APPLICANT_STEP_VIEW_STYLES.TITLE}
                  testID={APPLICANT_STEP_VIEW_TEST_IDS.TITLE}
                >
                  {APPLICANT_STEP_VIEW_COPY.TITLE}
                </Text>
                <Text
                  className={APPLICANT_STEP_VIEW_STYLES.DESCRIPTION}
                  testID={APPLICANT_STEP_VIEW_TEST_IDS.DESCRIPTION}
                >
                  {APPLICANT_STEP_VIEW_COPY.DESCRIPTION}
                </Text>
              </View>

              {/* 3. Legal Entity Selector (Physical vs. Legal) */}
              <LegalEntitySelector
                disabled={disabled}
                onSelectEntity={onRegimeChange}
                selectedEntity={regime}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_SELECTOR}
              />

              {/* 4. Taupe Container Wrapping Form & Vehicle Beneficiary */}
              <View
                className={APPLICANT_STEP_VIEW_STYLES.TAUPE_CONTAINER}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.TAUPE_CONTAINER}
              >
                {regime === 'physical' ? (
                  <PhysicalPersonForm
                    disabled={disabled}
                    errors={physicalErrors}
                    isIdentificationValid={isIdentificationValid}
                    onFieldChange={onPhysicalFieldChange}
                    testID={APPLICANT_STEP_VIEW_TEST_IDS.PHYSICAL_FORM}
                    values={physicalValues}
                  />
                ) : (
                  <LegalEntityForm
                    disabled={disabled}
                    errors={legalErrors}
                    isIdentificationValid={isIdentificationValid}
                    onFieldChange={onLegalFieldChange}
                    testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_FORM}
                    values={legalValues}
                  />
                )}

                {/* Divider between Applicant Form and Vehicle Beneficiary Section */}
                <View
                  className={APPLICANT_STEP_VIEW_STYLES.DIVIDER}
                  testID={APPLICANT_STEP_VIEW_TEST_IDS.DIVIDER}
                />

                {/* Vehicle Beneficiary Final Destination Section */}
                <VehicleBeneficiarySection
                  disabled={disabled}
                  onSelectBeneficiary={onVehicleBeneficiaryChange}
                  selectedBeneficiary={vehicleBeneficiary}
                  testID={APPLICANT_STEP_VIEW_TEST_IDS.VEHICLE_BENEFICIARY}
                />
              </View>
            </View>
          </ScrollView>

          {/* 5. Fixed Bottom CTA Bar */}
          <View
            className={APPLICANT_STEP_VIEW_STYLES.BOTTOM_BAR}
            testID={APPLICANT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
          >
            <BaseButton
              className={APPLICANT_STEP_VIEW_STYLES.SUBMIT_BUTTON}
              disabled={!isValid || disabled}
              fullWidth
              iconRight={
                <ArrowRightIcon
                  color={APPLICANT_STEP_VIEW_COLORS.SUBMIT_ICON}
                  size={APPLICANT_STEP_VIEW_ICON_DIMENSIONS.SUBMIT_ICON_SIZE}
                  strokeWidth={
                    APPLICANT_STEP_VIEW_ICON_DIMENSIONS.SUBMIT_ICON_STROKE_WIDTH
                  }
                />
              }
              label={APPLICANT_STEP_VIEW_COPY.SUBMIT_BUTTON}
              onPress={onSubmit}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
              variant='primary'
            />
          </View>
        </KeyboardAvoidingView>

        {/* 6. Third-Party Final Beneficiary Bottom Sheet Modal */}
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
      </View>
    );
  },
);

ApplicantStepView.displayName = 'ApplicantStepView';
