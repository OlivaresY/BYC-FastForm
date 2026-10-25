export const BASE_BUTTON_COLORS = {
  GHOST_LOADER: '#B91C1C',
  NEUTRAL_LOADER: '#1F2937',
  OUTLINE_LOADER: '#B91C1C',
  PRIMARY_LOADER: '#FFFFFF',
  SECONDARY_LOADER: '#FFFFFF',
} as const;

export const BASE_BUTTON_VARIANTS = {
  GHOST: 'ghost',
  NEUTRAL: 'neutral',
  OUTLINE: 'outline',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export const BASE_BUTTON_STYLES = {
  BASE_CONTAINER:
    'min-h-[48px] min-w-[48px] flex-row items-center justify-center gap-2 rounded-xl px-4 py-3',
  CONTENT_CONTAINER: 'flex-row items-center justify-center gap-2',
  DISABLED: 'opacity-40',
  FULL_WIDTH: 'w-full self-stretch',
  LABEL_BASE: 'text-center flex-shrink',
  VARIANTS: {
    [BASE_BUTTON_VARIANTS.GHOST]: {
      container: 'bg-transparent active:bg-brand-red/10',
      loaderColor: BASE_BUTTON_COLORS.GHOST_LOADER,
      text: 'text-brand-red font-semibold text-base',
    },
    [BASE_BUTTON_VARIANTS.NEUTRAL]: {
      container: 'border border-gray-300 bg-white active:bg-gray-100',
      loaderColor: BASE_BUTTON_COLORS.NEUTRAL_LOADER,
      text: 'text-text-primary font-semibold text-base',
    },
    [BASE_BUTTON_VARIANTS.OUTLINE]: {
      container:
        'border-2 border-brand-red bg-transparent active:bg-brand-red/10',
      loaderColor: BASE_BUTTON_COLORS.OUTLINE_LOADER,
      text: 'text-brand-red font-semibold text-base',
    },
    [BASE_BUTTON_VARIANTS.PRIMARY]: {
      container: 'bg-brand-red active:opacity-90',
      loaderColor: BASE_BUTTON_COLORS.PRIMARY_LOADER,
      text: 'text-surface font-semibold text-base',
    },
    [BASE_BUTTON_VARIANTS.SECONDARY]: {
      container: 'bg-primary-dark active:opacity-90',
      loaderColor: BASE_BUTTON_COLORS.SECONDARY_LOADER,
      text: 'text-surface font-semibold text-base',
    },
  },
} as const;

export const BASE_BUTTON_TEST_IDS = {
  BUTTON: 'base-button',
  LABEL: 'base-button-label',
  LOADER: 'base-button-loader',
} as const;
