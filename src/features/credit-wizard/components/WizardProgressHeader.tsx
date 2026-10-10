import React from "react";
import { Text, View } from "react-native";
import {
  WIZARD_PROGRESS_HEADER_LABELS,
  WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS,
  WIZARD_PROGRESS_HEADER_TEST_IDS,
} from "../constants/WizardProgressHeader.constants";
import type { WizardProgressHeaderProps } from "../types/WizardProgressHeader.types";

export const WizardProgressHeader = ({
  currentStep,
  style,
  subtitle,
  testID,
  title,
  totalSteps,
}: WizardProgressHeaderProps): React.JSX.Element => {
  const isValidStepInput =
    Number.isFinite(totalSteps) &&
    totalSteps > 0 &&
    Number.isFinite(currentStep);

  const rawPercentage = isValidStepInput
    ? Math.round((currentStep / totalSteps) * 100)
    : WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.DEFAULT_PERCENTAGE;

  const percentage = Math.min(
    WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MAX_PERCENTAGE,
    Math.max(
      WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MIN_PERCENTAGE,
      rawPercentage,
    ),
  );

  const stepText = `${WIZARD_PROGRESS_HEADER_LABELS.STEP_PREFIX} ${currentStep} ${WIZARD_PROGRESS_HEADER_LABELS.OF} ${totalSteps}`;
  const percentageText = `${percentage}${WIZARD_PROGRESS_HEADER_LABELS.COMPLETED_SUFFIX}`;

  return (
    <View
      className="w-full bg-transparent"
      style={style}
      testID={testID ?? WIZARD_PROGRESS_HEADER_TEST_IDS.CONTAINER}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-xs font-bold uppercase text-text-secondary"
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_LABEL}
        >
          {stepText}
        </Text>
        <View
          className="rounded-full bg-brand-beige px-2.5 py-1"
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_BADGE}
        >
          <Text
            className="text-xs font-bold text-brand-green"
            testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_TEXT}
          >
            {percentageText}
          </Text>
        </View>
      </View>

      <Text
        className="mt-2 text-2xl font-bold text-text-primary"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.TITLE}
      >
        {title}
      </Text>

      <Text
        className="mb-4 mt-1 text-sm text-text-secondary"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.SUBTITLE}
      >
        {subtitle}
      </Text>

      <View
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PROGRESS_BAR_TRACK}
      >
        <View
          className="h-full rounded-full bg-brand-red"
          style={{ width: `${percentage}%` }}
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PROGRESS_BAR_FILL}
        />
      </View>
    </View>
  );
};
