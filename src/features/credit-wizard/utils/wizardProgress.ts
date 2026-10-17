import {
  WIZARD_PROGRESS_HEADER_BADGE_VARIANTS,
  WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS,
  WIZARD_PROGRESS_HEADER_STEP_ICONS,
} from '../constants/WizardProgressHeader.constants';
import type {
  WizardProgressHeaderBadgeVariant,
  WizardProgressHeaderStepIconConfig,
} from '../constants/WizardProgressHeader.constants';

/**
 * Resolves the badge visual tier for a clamped completion percentage.
 * Tiers: < 50% STARTED, 50-74% HALFWAY, 75-99% NEAR_COMPLETE, 100% COMPLETE.
 */
export const resolveBadgeVariant = (
  percentage: number,
): WizardProgressHeaderBadgeVariant => {
  if (percentage >= WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MAX_PERCENTAGE) {
    return WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.COMPLETE;
  }

  if (
    percentage >=
    WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.NEAR_COMPLETE_THRESHOLD_PERCENTAGE
  ) {
    return WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.NEAR_COMPLETE;
  }

  if (
    percentage >=
    WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.HALFWAY_THRESHOLD_PERCENTAGE
  ) {
    return WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.HALFWAY;
  }

  return WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.STARTED;
};

/**
 * Resolves the SVG step icon configuration based on current step number.
 * Clamps step between MIN_STEP and MAX_STEP and falls back to Step 1.
 */
export const resolveStepIcon = (
  step: number,
): WizardProgressHeaderStepIconConfig => {
  const clampedStep = Math.min(
    WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MAX_STEP,
    Math.max(
      WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MIN_STEP,
      Math.floor(step),
    ),
  );
  return (
    WIZARD_PROGRESS_HEADER_STEP_ICONS[clampedStep] ??
    WIZARD_PROGRESS_HEADER_STEP_ICONS[
      WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS.MIN_STEP
    ]
  );
};
