import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { BaseButton } from '@/shared/ui/BaseButton';
import { ArrowRightIcon } from '@/shared/ui/Icons';
import {
  APPLICANT_STEP_VIEW_COLORS,
  APPLICANT_STEP_VIEW_COPY,
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ICON_DIMENSIONS,
  APPLICANT_STEP_VIEW_NUMERICAL,
  APPLICANT_STEP_VIEW_STYLES,
  APPLICANT_STEP_VIEW_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
import type { ApplicantStepViewProps } from '../types/ApplicantStepView.types';
import { FinalBeneficiaryModalMemo } from './FinalBeneficiaryModal';
import { LegalEntityFormMemo } from './LegalEntityForm';
import { LegalEntitySelectorMemo } from './LegalEntitySelector';
import { PhysicalPersonFormMemo } from './PhysicalPersonForm';
import { VehicleBeneficiarySectionMemo } from './VehicleBeneficiarySection';
import { WizardProgressHeaderMemo } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;
const NOOP_FIELD_CHANGE = (): void => undefined;

export const ApplicantStepView = ({
  closeBeneficiaryModal,
  disabled = false,
  handleSaveThirdPartyData,
  isBeneficiaryModalOpen = false,
  isIdentificationValid = false,
  isValid = false,
  legalErrors,
  legalValues,
  onLegalFieldChange,
  onPhysicalFieldChange,
  onRegimeChange,
  onSubmit,
  onThirdPartyFieldChange,
  onVehicleBeneficiaryChange,
  physicalErrors,
  physicalValues,
  regime,
  testID,
  thirdPartyErrors,
  thirdPartyValues,
  vehicleBeneficiary,
}: ApplicantStepViewProps): React.JSX.Element => {
  const handleSaveModal = useCallback((): void => {
    handleSaveThirdPartyData?.();
  }, [handleSaveThirdPartyData]);

  return (
    <View
      className={APPLICANT_STEP_VIEW_STYLES.CONTAINER}
      testID={testID ?? APPLICANT_STEP_VIEW_TEST_IDS.CONTAINER}
    >
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
            <WizardProgressHeaderMemo
              currentStep={APPLICANT_STEP_VIEW_NUMERICAL.CURRENT_STEP}
              subtitle={APPLICANT_STEP_VIEW_COPY.HEADER_SUBTITLE}
              testID={APPLICANT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
              title={APPLICANT_STEP_VIEW_COPY.HEADER_TITLE}
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
            <LegalEntitySelectorMemo
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
                <PhysicalPersonFormMemo
                  disabled={disabled}
                  errors={physicalErrors}
                  isIdentificationValid={isIdentificationValid}
                  onFieldChange={onPhysicalFieldChange}
                  testID={APPLICANT_STEP_VIEW_TEST_IDS.PHYSICAL_FORM}
                  values={physicalValues}
                />
              ) : (
                <LegalEntityFormMemo
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
              <VehicleBeneficiarySectionMemo
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
      <FinalBeneficiaryModalMemo
        errors={thirdPartyErrors}
        isOpen={isBeneficiaryModalOpen}
        onClose={closeBeneficiaryModal ?? NOOP_VOID}
        onFieldChange={onThirdPartyFieldChange ?? NOOP_FIELD_CHANGE}
        onSave={handleSaveThirdPartyData ? handleSaveModal : undefined}
        values={
          thirdPartyValues ?? APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY
        }
      />
    </View>
  );
};
