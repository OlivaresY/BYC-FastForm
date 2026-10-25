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

    const handleSaveModal = useCallback((): void => {
      vm.handleSaveThirdPartyData?.();
    }, [vm]);

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
                onSelectEntity={vm.onRegimeChange}
                selectedEntity={vm.regime}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_SELECTOR}
              />

              {/* 4. Taupe Container Wrapping Form & Vehicle Beneficiary */}
              <View
                className={APPLICANT_STEP_VIEW_STYLES.TAUPE_CONTAINER}
                testID={APPLICANT_STEP_VIEW_TEST_IDS.TAUPE_CONTAINER}
              >
                {vm.regime === 'physical' ? (
                  <PhysicalPersonForm
                    disabled={disabled}
                    errors={vm.physicalErrors}
                    isIdentificationValid={vm.isIdentificationValid}
                    onFieldChange={vm.onPhysicalFieldChange}
                    testID={APPLICANT_STEP_VIEW_TEST_IDS.PHYSICAL_FORM}
                    values={vm.physicalValues}
                  />
                ) : (
                  <LegalEntityForm
                    disabled={disabled}
                    errors={vm.legalErrors}
                    isIdentificationValid={vm.isIdentificationValid}
                    onFieldChange={vm.onLegalFieldChange}
                    testID={APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_FORM}
                    values={vm.legalValues}
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
                  onSelectBeneficiary={vm.onVehicleBeneficiaryChange}
                  selectedBeneficiary={vm.vehicleBeneficiary}
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
              disabled={!vm.isValid || disabled}
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
              onPress={vm.onSubmit}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
              variant='primary'
            />
          </View>
        </KeyboardAvoidingView>

        {/* 6. Third-Party Final Beneficiary Bottom Sheet Modal */}
        <FinalBeneficiaryModal
          errors={vm.thirdPartyErrors}
          isOpen={vm.isBeneficiaryModalOpen}
          onClose={vm.closeBeneficiaryModal ?? NOOP_VOID}
          onFieldChange={vm.onThirdPartyFieldChange ?? NOOP_FIELD_CHANGE}
          onSave={handleSaveModal}
          values={
            vm.thirdPartyValues ?? APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY
          }
        />
      </View>
    );
  },
);

ApplicantStepView.displayName = 'ApplicantStepView';
