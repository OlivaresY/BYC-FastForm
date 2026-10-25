import { WIZARD_COPY } from './WizardCopy.constants';

export const WIZARD_STEP_LAYOUT_COLORS = {
  BACK_ICON: '#5A6B80',
  SUBMIT_ICON: '#FFFFFF',
} as const;

export const WIZARD_STEP_LAYOUT_CONSTANTS = {
  DEFAULT_USER_INITIALS: 'BYC',
} as const;

export const WIZARD_STEP_LAYOUT_COPY = {
  BACK_BUTTON: WIZARD_COPY.BUTTONS.BACK,
  SUBMIT_BUTTON: WIZARD_COPY.BUTTONS.NEXT,
} as const;

export const WIZARD_STEP_LAYOUT_DIMENSIONS = {
  BACK_ICON_SIZE: 16,
  BACK_ICON_STROKE_WIDTH: 2.5,
  BOTTOM_BAR_HEIGHT: 84,
  EXTRA_KEYBOARD_SCROLL_OFFSET: 24,
  SUBMIT_ICON_SIZE: 16,
  SUBMIT_ICON_STROKE_WIDTH: 2.5,
} as const;

export const WIZARD_STEP_LAYOUT_NUMERICAL = {
  DEFAULT_CURRENT_STEP: 1,
  DEFAULT_TOTAL_STEPS: 4,
  SCROLL_EVENT_THROTTLE_MS: 16,
} as const;

export const WIZARD_STEP_LAYOUT_STYLES = {
  BACK_BUTTON: 'flex-1',
  BOTTOM_BAR:
    'w-full flex-row items-center gap-3 border-t border-border-card bg-surface-card px-4 py-3 pb-8',
  BOTTOM_BAR_FULL:
    'w-full border-t border-border-card bg-surface-card px-4 py-3 pb-8',
  CONTAINER: 'bg-background-primary flex-1',
  DESCRIPTION: 'text-sm text-text-secondary',
  HEADER_BLOCK: 'gap-1',
  KEYBOARD_AVOIDING_VIEW: 'flex-1',
  SCROLL_CONTENT: 'gap-6 p-4 pb-28',
  SCROLL_VIEW: 'flex-1',
  SUBMIT_BUTTON: 'flex-1',
  SUBMIT_BUTTON_FULL: 'w-full flex-1',
  TITLE: 'text-xl font-bold text-text-primary',
} as const;

export const WIZARD_STEP_LAYOUT_TEST_IDS = {
  BACK_BUTTON: 'wizard-step-layout-back-button',
  BOTTOM_BAR: 'wizard-step-layout-bottom-bar',
  CONTAINER: 'wizard-step-layout-container',
  DESCRIPTION: 'wizard-step-layout-description',
  PROCESS_TOP_BAR: 'wizard-step-layout-process-top-bar',
  SCROLL_VIEW: 'wizard-step-layout-scroll-view',
  SUBMIT_BUTTON: 'wizard-step-layout-submit-button',
  TITLE: 'wizard-step-layout-title',
  WIZARD_HEADER: 'wizard-step-layout-wizard-header',
} as const;
