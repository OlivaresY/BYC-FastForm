import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CheckmarkIcon } from '@/shared/ui/Icons';
import {
  WIZARD_PROGRESS_HEADER_CHECK_ICON,
  WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES,
  WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES,
  WIZARD_PROGRESS_HEADER_STYLES,
  WIZARD_PROGRESS_HEADER_TEST_IDS,
} from '../constants/WizardProgressHeader.constants';
import { useWizardProgressHeaderViewModel } from '../hooks/useWizardProgressHeaderViewModel';
import type { WizardProgressHeaderProps } from '../types/WizardProgressHeader.types';

export const WizardProgressHeader = ({
  currentStep,
  style,
  subtitle,
  testID,
  title,
  totalSteps,
}: WizardProgressHeaderProps): React.JSX.Element => {
  const { badgeVariant, percentageText, segments, stepIconConfig, stepText } =
    useWizardProgressHeaderViewModel({ currentStep, totalSteps });

  return (
    <View
      className={WIZARD_PROGRESS_HEADER_STYLES.CONTAINER}
      style={style}
      testID={testID ?? WIZARD_PROGRESS_HEADER_TEST_IDS.CONTAINER}
    >
      {/* Top Row: Step Pill (Left) & Percentage Badge (Right) */}
      <View className={WIZARD_PROGRESS_HEADER_STYLES.TOP_ROW}>
        <View
          className={WIZARD_PROGRESS_HEADER_STYLES.STEP_PILL}
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_PILL}
        >
          <View testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_ICON}>
            <Svg
              fill='none'
              height={stepIconConfig.sizePx}
              stroke={WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES.STROKE_COLOR}
              strokeLinecap='round'
              strokeLinejoin='round'
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
            className={WIZARD_PROGRESS_HEADER_STYLES.STEP_LABEL}
            testID={WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_LABEL}
          >
            {stepText}
          </Text>
        </View>

        <View
          className={`${WIZARD_PROGRESS_HEADER_STYLES.PERCENTAGE_BADGE_BASE} ${badgeVariant.containerClassName}`}
          testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_BADGE}
        >
          {badgeVariant.hasCheckIcon ? (
            <View testID={WIZARD_PROGRESS_HEADER_TEST_IDS.CHECK_ICON}>
              <CheckmarkIcon
                color={badgeVariant.iconColor}
                size={WIZARD_PROGRESS_HEADER_CHECK_ICON.SIZE_PX}
                strokeWidth={WIZARD_PROGRESS_HEADER_CHECK_ICON.STROKE_WIDTH_PX}
              />
            </View>
          ) : null}
          <Text
            className={`${WIZARD_PROGRESS_HEADER_STYLES.PERCENTAGE_TEXT_BASE} ${badgeVariant.textClassName}`}
            testID={WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_TEXT}
          >
            {percentageText}
          </Text>
        </View>
      </View>

      {/* Middle Block: Title & Subtitle */}
      <Text
        className={WIZARD_PROGRESS_HEADER_STYLES.TITLE}
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.TITLE}
      >
        {title}
      </Text>

      <Text
        className={WIZARD_PROGRESS_HEADER_STYLES.SUBTITLE}
        testID={WIZARD_PROGRESS_HEADER_TEST_IDS.SUBTITLE}
      >
        {subtitle}
      </Text>

      {/* Bottom Element: Segmented Line */}
      <View
        className={WIZARD_PROGRESS_HEADER_STYLES.SEGMENTED_LINE}
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

export const WizardProgressHeaderMemo = React.memo(WizardProgressHeader);
