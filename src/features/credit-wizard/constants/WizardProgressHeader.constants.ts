export const WIZARD_PROGRESS_HEADER_BADGE_TIERS = {
  COMPLETE: "COMPLETE",
  HALFWAY: "HALFWAY",
  NEAR_COMPLETE: "NEAR_COMPLETE",
  STARTED: "STARTED",
} as const;

export type WizardProgressHeaderBadgeTier =
  (typeof WIZARD_PROGRESS_HEADER_BADGE_TIERS)[keyof typeof WIZARD_PROGRESS_HEADER_BADGE_TIERS];

export interface WizardProgressHeaderBadgeVariant {
  containerClassName: string;
  hasCheckIcon: boolean;
  iconColor: string;
  textClassName: string;
}

export interface WizardProgressHeaderStepIconConfig {
  paths: readonly string[];
  sizePx: number;
  strokeWidthPx: number;
  viewBox: string;
}

export const WIZARD_PROGRESS_HEADER_BADGE_VARIANTS: Record<
  WizardProgressHeaderBadgeTier,
  WizardProgressHeaderBadgeVariant
> = {
  COMPLETE: {
    containerClassName: "bg-[#E8F5E9]",
    hasCheckIcon: true,
    iconColor: "#1B5E20",
    textClassName: "text-[#1B5E20]",
  },
  HALFWAY: {
    containerClassName: "bg-[#F2F4F8]",
    hasCheckIcon: false,
    iconColor: "#1A237E",
    textClassName: "text-[#1A237E]",
  },
  NEAR_COMPLETE: {
    containerClassName: "bg-[#FFF8E1]",
    hasCheckIcon: false,
    iconColor: "#B97700",
    textClassName: "text-[#B97700]",
  },
  STARTED: {
    containerClassName: "bg-[#EAF5FF]",
    hasCheckIcon: false,
    iconColor: "#0070D2",
    textClassName: "text-[#0070D2]",
  },
} as const;

export const WIZARD_PROGRESS_HEADER_CHECK_ICON = {
  PATH: "M20 6 9 17l-5-5",
  SIZE_PX: 12,
  STROKE_WIDTH_PX: 3,
  VIEW_BOX: "0 0 24 24",
} as const;

export const WIZARD_PROGRESS_HEADER_LABELS = {
  COMPLETED_SUFFIX: "% LISTO",
  OF: "DE",
  STEP_PREFIX: "PASO",
} as const;

export const WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS = {
  DEFAULT_PERCENTAGE: 0,
  HALFWAY_THRESHOLD_PERCENTAGE: 50,
  MAX_PERCENTAGE: 100,
  MIN_PERCENTAGE: 0,
  NEAR_COMPLETE_THRESHOLD_PERCENTAGE: 75,
  NO_SEGMENTS: 0,
} as const;

export const WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES = {
  ACTIVE: "bg-[#385741]",
  BASE: "h-[3px] flex-1 rounded-full",
  INACTIVE: "bg-[#E6E2DE]",
} as const;

export const WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES = {
  STROKE_COLOR: "#111827",
} as const;

export const WIZARD_PROGRESS_HEADER_STEP_ICONS: Record<
  number,
  WizardProgressHeaderStepIconConfig
> = {
  // Step 1: User / Person
  1: {
    paths: [
      "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
      "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: "0 0 24 24",
  },
  // Step 2: Briefcase / Employment
  2: {
    paths: [
      "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
      "M2 7h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z",
      "M2 11h20",
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: "0 0 24 24",
  },
  // Step 3: Vehicle / Car
  3: {
    paths: [
      "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 12v4c0 .6.4 1 1 1h2",
      "M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
      "M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: "0 0 24 24",
  },
  // Step 4: Bank / Landmark
  4: {
    paths: [
      "M3 22h18",
      "M6 18v-7",
      "M10 18v-7",
      "M14 18v-7",
      "M18 18v-7",
      "M12 2L4 7h16L12 2z",
      "M3 7h18",
      "M3 18h18",
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: "0 0 24 24",
  },
} as const;

export const WIZARD_PROGRESS_HEADER_TEST_IDS = {
  CHECK_ICON: "wizard-progress-header-check-icon",
  CONTAINER: "wizard-progress-header-container",
  PERCENTAGE_BADGE: "wizard-progress-header-percentage-badge",
  PERCENTAGE_TEXT: "wizard-progress-header-percentage-text",
  SEGMENT_PREFIX: "wizard-progress-header-segment-",
  SEGMENTED_LINE: "wizard-progress-header-segmented-line",
  STEP_ICON: "wizard-progress-header-step-icon",
  STEP_LABEL: "wizard-progress-header-step-label",
  STEP_PILL: "wizard-progress-header-step-pill",
  SUBTITLE: "wizard-progress-header-subtitle",
  TITLE: "wizard-progress-header-title",
} as const;

/**
 * Resolves the badge visual tier for a clamped completion percentage.
 * Tiers: < 50% STARTED, 50-74% HALFWAY, 75-99% NEAR_COMPLETE, 100% COMPLETE.
 */
export const getWizardProgressBadgeVariant = (
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
 * Defaults to Step 1 (Person) icon if out of bounds.
 */
export const getWizardProgressStepIcon = (
  step: number,
): WizardProgressHeaderStepIconConfig => {
  const clampedStep = Math.min(4, Math.max(1, Math.floor(step)));
  return (
    WIZARD_PROGRESS_HEADER_STEP_ICONS[clampedStep] ??
    WIZARD_PROGRESS_HEADER_STEP_ICONS[1]
  );
};
