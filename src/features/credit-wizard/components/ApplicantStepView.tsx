import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BaseButton } from '@/shared/ui/BaseButton';
import {
  APPLICANT_STEP_VIEW_COPY,
  APPLICANT_STEP_VIEW_NUMERICAL,
  APPLICANT_STEP_VIEW_STYLES,
  APPLICANT_STEP_VIEW_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
import type { ApplicantStepViewProps } from '../types/ApplicantStepView.types';
import { LegalEntityForm } from './LegalEntityForm';
import { LegalEntitySelector } from './LegalEntitySelector';
import { PhysicalPersonForm } from './PhysicalPersonForm';
import { VehicleBeneficiarySection } from './VehicleBeneficiarySection';
import { WizardProgressHeader } from './WizardProgressHeader';

export const ApplicantStepView = ({
  disabled = false,
  isIdentificationValid = false,
  isValid = false,
  legalErrors,
  legalValues,
  onLegalFieldChange,
  onPhysicalFieldChange,
  onRegimeChange,
  onSubmit,
  onVehicleBeneficiaryChange,
  physicalErrors,
  physicalValues,
  regime,
  testID,
  vehicleBeneficiary,
}: ApplicantStepViewProps): React.JSX.Element => {
  return (
    <View
      className={APPLICANT_STEP_VIEW_STYLES.CONTAINER}
      testID={testID ?? APPLICANT_STEP_VIEW_TEST_IDS.CONTAINER}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName={APPLICANT_STEP_VIEW_STYLES.SCROLL_CONTENT}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID={APPLICANT_STEP_VIEW_TEST_IDS.SCROLL_VIEW}
      >
        {/* 1. Wizard Progress Header */}
        <WizardProgressHeader
          currentStep={APPLICANT_STEP_VIEW_NUMERICAL.CURRENT_STEP}
          subtitle={APPLICANT_STEP_VIEW_COPY.HEADER_SUBTITLE}
          testID={APPLICANT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
          title={APPLICANT_STEP_VIEW_COPY.HEADER_TITLE}
          totalSteps={APPLICANT_STEP_VIEW_NUMERICAL.TOTAL_STEPS}
        />

        {/* 2. Step Title & Description Block */}
        <View className={APPLICANT_STEP_VIEW_STYLES.HEADER_BLOCK}>
          <Text
            accessibilityRole="header"
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
      </ScrollView>

      {/* 5. Fixed Bottom CTA Bar */}
      <View
        className={APPLICANT_STEP_VIEW_STYLES.BOTTOM_BAR}
        testID={APPLICANT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
      >
        <BaseButton
          disabled={!isValid || disabled}
          label={APPLICANT_STEP_VIEW_COPY.SUBMIT_BUTTON}
          onPress={onSubmit}
          testID={APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
          variant="primary"
        />
      </View>
    </View>
  );
};
