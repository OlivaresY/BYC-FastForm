export const CUSTOM_SELECT_COLORS = {
  BORDER_BASE: '#A39F97',
  BORDER_ERROR: '#B91C1C',
  BORDER_OPEN: '#5A6B80',
  CHECKMARK_STROKE: '#B91C1C',
  CHEVRON_STROKE: '#5A6B80',
  CLOSE_STROKE: '#5A6B80',
  GLOBE_STROKE: '#5A6B80',
  PLACEHOLDER: '#5A6B80',
  REQUIRED_ASTERISK: '#B91C1C',
  TEXT_ACTIVE: '#B91C1C',
  TEXT_PRIMARY: '#111111',
  TEXT_SECONDARY: '#5A6B80',
} as const;

export const CUSTOM_SELECT_COPY = {
  CLOSE_MODAL_ACCESSIBILITY_LABEL: 'Cerrar opciones',
  DEFAULT_MODAL_TITLE: 'Seleccionar opción',
  DEFAULT_PLACEHOLDER: 'Seleccionar...',
  REQUIRED_ASTERISK: '*',
} as const;

export const CUSTOM_SELECT_ICON_DIMENSIONS = {
  CHECKMARK_SIZE_PX: 18,
  CHEVRON_SIZE_PX: 18,
  CLOSE_SIZE_PX: 20,
  GLOBE_SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const CUSTOM_SELECT_ICONS = {
  CHECKMARK: {
    paths: ['M20 6 9 17l-5-5'],
  },
  CHEVRON_DOWN: {
    paths: ['M6 9l6 6 6-6'],
  },
  CLOSE: {
    paths: ['M18 6 6 18', 'M6 6l12 12'],
  },
  GLOBE: {
    paths: [
      'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z',
      'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
      'M2 12h20',
    ],
  },
} as const;

export const CUSTOM_SELECT_STYLES = {
  CONTAINER: 'w-full',
  ERROR_TEXT: 'mt-1 text-xs text-[#B91C1C]',
  HELPER_TEXT: 'mt-1 text-xs text-[#5A6B80]',
  LABEL_ROW: 'mb-1.5 flex-row items-center gap-1',
  LABEL_TEXT: 'text-sm font-medium text-[#111111]',
  MODAL_BACKDROP: 'flex-1 items-center justify-center bg-black/50 px-6',
  MODAL_CARD:
    'max-h-[80%] w-[90%] max-w-[360px] rounded-2xl bg-white p-5 shadow-xl',
  MODAL_CLOSE_BUTTON:
    'min-h-[48px] min-w-[48px] items-center justify-center rounded-full active:bg-black/5',
  MODAL_HEADER:
    'mb-3 flex-row items-center justify-between border-b border-gray-100 pb-2',
  MODAL_TITLE: 'text-base font-bold text-[#111111]',
  OPTION_ACTIVE:
    'min-h-[48px] flex-row items-center justify-between rounded-xl border border-[#B91C1C] bg-[#FDE8E8] px-4 py-3',
  OPTION_ACTIVE_TEXT: 'flex-1 text-sm font-bold text-[#B91C1C]',
  OPTION_INACTIVE:
    'min-h-[48px] flex-row items-center justify-between rounded-xl border border-transparent bg-transparent px-4 py-3 active:bg-gray-50',
  OPTION_INACTIVE_TEXT: 'flex-1 text-sm font-medium text-[#111111]',
  OPTION_LIST: 'gap-1.5',
  OPTIONS_SCROLL: 'max-h-80',
  REQUIRED_ASTERISK: 'text-sm font-bold text-[#B91C1C]',
  TRIGGER_BASE:
    'min-h-[48px] min-w-[48px] w-full flex-row items-center justify-between rounded-lg border bg-white px-4 py-3 gap-2.5',
  TRIGGER_BORDER_BASE: 'border-[#A39F97]',
  TRIGGER_BORDER_ERROR: 'border-[#B91C1C]',
  TRIGGER_BORDER_OPEN: 'border-[#5A6B80]',
  TRIGGER_DISABLED: 'opacity-40',
  TRIGGER_TEXT_PLACEHOLDER: 'flex-1 text-sm font-normal text-[#5A6B80]',
  TRIGGER_TEXT_SELECTED: 'flex-1 text-sm font-medium text-[#111111]',
} as const;

export const CUSTOM_SELECT_SVG_ATTRIBUTES = {
  FILL_NONE: 'none',
  STROKE_LINE_CAP: 'round',
  STROKE_LINE_JOIN: 'round',
} as const;

export const CUSTOM_SELECT_TEST_IDS = {
  CHEVRON_ICON: 'custom-select-chevron-icon',
  CONTAINER: 'custom-select-container',
  ERROR_MESSAGE: 'custom-select-error-message',
  HELPER_TEXT: 'custom-select-helper-text',
  LABEL: 'custom-select-label',
  LEFT_ICON: 'custom-select-left-icon',
  MODAL: 'custom-select-modal',
  MODAL_BACKDROP: 'custom-select-modal-backdrop',
  MODAL_CARD: 'custom-select-modal-card',
  MODAL_CLOSE_BUTTON: 'custom-select-modal-close-button',
  MODAL_TITLE: 'custom-select-modal-title',
  OPTION_CHECK_PREFIX: 'custom-select-option-check-',
  OPTION_ITEM_PREFIX: 'custom-select-option-',
  REQUIRED_ASTERISK: 'custom-select-required-asterisk',
  TRIGGER: 'custom-select-trigger',
  TRIGGER_TEXT: 'custom-select-trigger-text',
} as const;
