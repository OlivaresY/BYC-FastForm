import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  getWizardProgressBadgeVariant,
  getWizardProgressStepIcon,
  WIZARD_PROGRESS_HEADER_CHECK_ICON,
  WIZARD_PROGRESS_HEADER_LABELS,
  WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS,
  WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES,
  WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES,
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

  const segmentCount = isValidStepInput
    ? Math.floor(totalSteps)
    : WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.NO_SEGMENTS;

  const segments = Array.from({ length: segmentCount }, (_, index) => ({
    isActive: index < currentStep,
    key: `${WIZARD_PROGRESS_HEADER_TEST_IDS.SEGMENT_PREFIX}${index}`,
  }));

  const badgeVariant = getWizardProgressBadgeVariant(percentage);
  const stepIconConfig = getWizardProgressStepIcon(currentStep);

  const stepText = `${WIZARD_PROGRESS_HEADER_LABELS.STEP_PREFIX} ${currentStep} ${WIZARD_PROGRESS_HEADER_LABELS.OF} ${totalSteps}`;
  const percentageText = `${percentage}${WIZARD_PROGRESS_HEADER_LABELS.COMPLETED_SUFFIX}`;

  return (
    <View
      className="w-full bg-transparent"
      style={style}
      testID={testID ?? WIZARD_PROGRESS_HEADER_TEST_IDS.CONTAINER}
    >
      {/* Top Row: Step Pill (Left) & Percentage Badge (Right) */}
      <View className="flex-row items-center justify-between">
        <View
          className="flex-row items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1"
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_PILL}
        >
          <View testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_ICON}>
            <Svg
              fill="none"
              height={stepIconConfig.sizePx}
              stroke={WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES.STROKE_COLOR}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={stepIconConfig.strokeWidthPx}
              viewBox={stepIconConfig.viewBox}
              width={stepIconConfig.sizePx}
            >
              {stepIconConfig.paths.map((d, i) => (
                <Path
                  d={d}
                  key={`${WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_ICON}-${i}`}
                />
              ))}
            </Svg>
          </View>
          <Text
            className="text-xs font-semibold uppercase text-gray-900"
            testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_LABEL}
          >
            {stepText}
          </Text>
        </View>

        <View
          className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${badgeVariant.containerClassName}`}
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_BADGE}
        >
          {badgeVariant.hasCheckIcon ? (
            <View testID={WIZARD_PROGRESS_HEADER_TEST_IDS.CHECK_ICON}>
              <Svg
                fill="none"
                height={WIZARD_PROGRESS_HEADER_CHECK_ICON.SIZE_PX}
                stroke={badgeVariant.iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={WIZARD_PROGRESS_HEADER_CHECK_ICON.STROKE_WIDTH_PX}
                viewBox={WIZARD_PROGRESS_HEADER_CHECK_ICON.VIEW_BOX}
                width={WIZARD_PROGRESS_HEADER_CHECK_ICON.SIZE_PX}
              >
                <Path d={WIZARD_PROGRESS_HEADER_CHECK_ICON.PATH} />
              </Svg>
            </View>
          ) : null}
          <Text
            className={`text-xs font-bold ${badgeVariant.textClassName}`}
            testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_TEXT}
          >
            {percentageText}
          </Text>
        </View>
      </View>

      {/* Middle Block: Title & Subtitle */}
      <Text
        className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.TITLE}
      >
        {title}
      </Text>

      <Text
        className="mb-4 mt-1 text-sm font-normal text-slate-500"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.SUBTITLE}
      >
        {subtitle}
      </Text>

      {/* Bottom Element: Segmented Line */}
      <View
        className="mt-4 w-full flex-row gap-0.5"
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.SEGMENTED_LINE}
      >
        {segments.map(({ isActive, key }) => (
          <View
            className={`${WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.BASE} ${
              isActive
                ? WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.ACTIVE
                : WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.INACTIVE
            }`}
            key={key}
            testID={key}
          />
        ))}
      </View>
    </View>
  );
};
