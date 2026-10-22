export const WIZARD_PROGRESS_HEADER_BADGE_TIERS = {
  COMPLETE: 'COMPLETE',
  HALFWAY: 'HALFWAY',
  NEAR_COMPLETE: 'NEAR_COMPLETE',
  STARTED: 'STARTED',
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
    containerClassName: 'bg-green-50',
    hasCheckIcon: true,
    iconColor: '#1B5E20',
    textClassName: 'text-green-900',
  },
  HALFWAY: {
    containerClassName: 'bg-slate-100',
    hasCheckIcon: false,
    iconColor: '#1A237E',
    textClassName: 'text-indigo-900',
  },
  NEAR_COMPLETE: {
    containerClassName: 'bg-amber-50',
    hasCheckIcon: false,
    iconColor: '#B97700',
    textClassName: 'text-amber-700',
  },
  STARTED: {
    containerClassName: 'bg-blue-50',
    hasCheckIcon: false,
    iconColor: '#0070D2',
    textClassName: 'text-blue-700',
  },
} as const;

export const WIZARD_PROGRESS_HEADER_CHECK_ICON = {
  PATH: 'M20 6 9 17l-5-5',
  SIZE_PX: 12,
  STROKE_WIDTH_PX: 3,
  VIEW_BOX: '0 0 24 24',
} as const;

export const WIZARD_PROGRESS_HEADER_LABELS = {
  COMPLETED_SUFFIX: '% LISTO',
  OF: 'DE',
  STEP_PREFIX: 'PASO',
} as const;

export const WIZARD_PROGRESS_HEADER_NUMERICAL_CONSTANTS = {
  DEFAULT_PERCENTAGE: 0,
  HALFWAY_THRESHOLD_PERCENTAGE: 50,
  MAX_PERCENTAGE: 100,
  MAX_STEP: 4,
  MIN_PERCENTAGE: 0,
  MIN_STEP: 1,
  NEAR_COMPLETE_THRESHOLD_PERCENTAGE: 75,
  NO_SEGMENTS: 0,
} as const;

export const WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES = {
  ACTIVE: 'bg-brand-green',
  BASE: 'h-[3px] flex-1 rounded-full',
  INACTIVE: 'bg-[#E5E0D8]',
} as const;

export const WIZARD_PROGRESS_HEADER_STEP_ICON_STYLES = {
  STROKE_COLOR: '#111827',
} as const;

export const WIZARD_PROGRESS_HEADER_STEP_ICONS: Record<
  number,
  WizardProgressHeaderStepIconConfig
> = {
  // Step 1: User / Person
  1: {
    paths: [
      'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
      'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: '0 0 24 24',
  },
  // Step 2: Briefcase / Employment
  2: {
    paths: [
      'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
      'M2 7h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z',
      'M2 11h20',
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: '0 0 24 24',
  },
  // Step 3: Vehicle / Car
  3: {
    paths: [
      'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 12v4c0 .6.4 1 1 1h2',
      'M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
      'M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: '0 0 24 24',
  },
  // Step 4: Bank / Landmark
  4: {
    paths: [
      'M3 22h18',
      'M6 18v-7',
      'M10 18v-7',
      'M14 18v-7',
      'M18 18v-7',
      'M12 2L4 7h16L12 2z',
      'M3 7h18',
      'M3 18h18',
    ],
    sizePx: 14,
    strokeWidthPx: 2,
    viewBox: '0 0 24 24',
  },
} as const;

export const WIZARD_PROGRESS_HEADER_STYLES = {
  CONTAINER: 'w-full min-h-[50px] justify-between bg-transparent',
  PERCENTAGE_BADGE_BASE: 'flex-row items-center gap-1 rounded-full px-2.5 py-1',
  PERCENTAGE_TEXT_BASE: 'text-xs font-bold',
  SEGMENTED_LINE: 'mt-4 w-full flex-row gap-0.5',
  STEP_LABEL: 'text-xs font-semibold uppercase text-text-primary',
  STEP_PILL:
    'flex-row items-center gap-2 rounded-full border border-border-base bg-white px-3 py-1',
  SUBTITLE: 'mb-4 mt-1 text-sm font-normal text-text-secondary',
  TITLE: 'mt-4 text-2xl font-extrabold tracking-tight text-text-primary',
  TOP_ROW: 'flex-row items-center justify-between',
} as const;

export const WIZARD_PROGRESS_HEADER_TEST_IDS = {
  CHECK_ICON: 'wizard-progress-header-check-icon',
  CONTAINER: 'wizard-progress-header-container',
  PERCENTAGE_BADGE: 'wizard-progress-header-percentage-badge',
  PERCENTAGE_TEXT: 'wizard-progress-header-percentage-text',
  SEGMENT_PREFIX: 'wizard-progress-header-segment-',
  SEGMENTED_LINE: 'wizard-progress-header-segmented-line',
  STEP_ICON: 'wizard-progress-header-step-icon',
  STEP_LABEL: 'wizard-progress-header-step-label',
  STEP_PILL: 'wizard-progress-header-step-pill',
  SUBTITLE: 'wizard-progress-header-subtitle',
  TITLE: 'wizard-progress-header-title',
} as const;
