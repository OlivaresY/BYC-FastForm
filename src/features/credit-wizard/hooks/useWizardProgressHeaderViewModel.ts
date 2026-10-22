import { useMemo } from 'react';
import {
  WIZARD_PROGRESS_HEADER_LABELS,
  WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS,
  WIZARD_PROGRESS_HEADER_TEST_IDS,
} from '../constants/WizardProgressHeader.constants';
import type {
  WizardProgressHeaderBadgeVariant,
  WizardProgressHeaderStepIconConfig,
} from '../constants/WizardProgressHeader.constants';
import { resolveBadgeVariant, resolveStepIcon } from '../utils/wizardProgress';

export interface WizardProgressSegment {
  isActive: boolean;
  key: string;
}

export interface UseWizardProgressHeaderViewModelProps {
  currentStep: number;
  totalSteps: number;
}

export interface UseWizardProgressHeaderViewModelReturn {
  badgeVariant: WizardProgressHeaderBadgeVariant;
  percentage: number;
  percentageText: string;
  segments: readonly WizardProgressSegment[];
  stepIconConfig: WizardProgressHeaderStepIconConfig;
  stepText: string;
}

export const useWizardProgressHeaderViewModel = ({
  currentStep,
  totalSteps,
}: UseWizardProgressHeaderViewModelProps): UseWizardProgressHeaderViewModelReturn => {
  return useMemo((): UseWizardProgressHeaderViewModelReturn => {
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

    const segments: WizardProgressSegment[] = Array.from(
      { length: segmentCount },
      (_, index) => ({
        isActive: index < currentStep,
        key: `${WIZARD_PROGRESS_HEADER_TEST_IDS.SEGMENT_PREFIX}${index}`,
      }),
    );

    const badgeVariant = resolveBadgeVariant(percentage);
    const stepIconConfig = resolveStepIcon(currentStep);

    const stepText = `${WIZARD_PROGRESS_HEADER_LABELS.STEP_PREFIX} ${currentStep} ${WIZARD_PROGRESS_HEADER_LABELS.OF} ${totalSteps}`;
    const percentageText = `${percentage}${WIZARD_PROGRESS_HEADER_LABELS.COMPLETED_SUFFIX}`;

    return {
      badgeVariant,
      percentage,
      percentageText,
      segments,
      stepIconConfig,
      stepText,
    };
  }, [currentStep, totalSteps]);
};
