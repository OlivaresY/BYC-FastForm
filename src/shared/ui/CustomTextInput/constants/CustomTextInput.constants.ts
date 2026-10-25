export const CUSTOM_TEXT_INPUT_COLORS = {
  BORDER_BASE: '#A39F97',
  BORDER_ERROR: '#B91C1C',
  BORDER_FOCUSED: '#5A6B80',
  HELPER_TEXT: '#5A6B80',
  ICON_STROKE: '#5A6B80',
  PLACEHOLDER: '#5A6B80',
  REQUIRED_ASTERISK: '#B91C1C',
  TEXT_PRIMARY: '#111111',
  VALID_ICON_STROKE: '#16A34A',
} as const;

export const CUSTOM_TEXT_INPUT_COPY = {
  REQUIRED_ASTERISK: '*',
} as const;

export const CUSTOM_TEXT_INPUT_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const CUSTOM_TEXT_INPUT_ICONS = {
  CALENDAR: {
    paths: ['M16 2v4', 'M8 2v4', 'M3 10h18'],
    rect: {
      height: 18,
      rx: 2,
      ry: 2,
      width: 18,
      x: 3,
      y: 4,
    },
  },
  CHECKMARK: {
    path: 'M20 6 9 17l-5-5',
  },
  HASH: {
    paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3 14 21'],
  },
} as const;

export const CUSTOM_TEXT_INPUT_STYLES = {
  BORDER_BASE: 'border-border-base',
  BORDER_ERROR: 'border-brand-red',
  BORDER_FOCUSED: 'border-text-secondary',
  CONTAINER: 'w-full',
  ERROR_TEXT: 'mt-1 text-xs text-brand-red',
  HELPER_TEXT: 'mt-1 text-xs text-text-secondary',
  INPUT: 'flex-1 text-base text-text-primary py-0',
  INPUT_WRAPPER_BASE:
    'min-h-[48px] w-full flex-row items-center rounded-lg border bg-surface px-3.5 py-2.5 gap-2.5',
  LABEL_LEFT_CONTAINER: 'flex-row items-center gap-1',
  LABEL_ROW: 'mb-1.5 flex-row items-center justify-between w-full',
  LABEL_TEXT: 'text-sm font-medium text-text-primary',
  REQUIRED_ASTERISK: 'ml-0.5 text-sm font-bold text-brand-red',
} as const;

export const CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES = {
  FILL_NONE: 'none',
  STROKE_LINE_CAP: 'round',
  STROKE_LINE_JOIN: 'round',
} as const;

export const CUSTOM_TEXT_INPUT_TEST_IDS = {
  CONTAINER: 'custom-text-input-container',
  ERROR: 'custom-text-input-error',
  HELPER_TEXT: 'custom-text-input-helper-text',
  INPUT: 'custom-text-input',
  INPUT_WRAPPER: 'custom-text-input-wrapper',
  LABEL: 'custom-text-input-label',
  LEFT_ICON: 'custom-text-input-left-icon',
  REQUIRED_ASTERISK: 'custom-text-input-required-asterisk',
  VALID_ICON: 'custom-text-input-valid-icon',
} as const;
