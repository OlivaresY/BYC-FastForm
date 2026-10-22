export const PROCESS_TOP_BAR_COLORS = {
  AVATAR_BACKGROUND: '#E5E0D8',
  AVATAR_TEXT: '#111111',
  BADGE_BACKGROUND: '#DEE8E0',
  BADGE_ICON: '#3A5C45',
  BADGE_TEXT: '#3A5C45',
  CLOSE_ICON: '#5A6B80',
  DIVIDER: '#CBD5E1',
  TITLE: '#111111',
} as const;

export const PROCESS_TOP_BAR_COPY = {
  AVATAR_ACCESSIBILITY_LABEL: 'Perfil de usuario',
  BADGE_TEXT: 'BYC',
  CLOSE_ACCESSIBILITY_LABEL: 'Cerrar proceso',
  DEFAULT_INITIALS: 'YO',
  TITLE: 'CORIMOTORS',
} as const;

export const PROCESS_TOP_BAR_DIMENSIONS = {
  AVATAR_SIZE_PX: 32,
  BADGE_CAR_ICON_SIZE_PX: 14,
  CLOSE_ICON_SIZE_PX: 20,
  DIVIDER_HEIGHT_PX: 16,
  DIVIDER_WIDTH_PX: 1,
  HIT_SLOP_PX: 12,
} as const;

export const PROCESS_TOP_BAR_HIT_SLOP = {
  bottom: 12,
  left: 12,
  right: 12,
  top: 12,
} as const;

export const PROCESS_TOP_BAR_STYLES = {
  AVATAR_CONTAINER:
    'h-8 w-8 items-center justify-center rounded-full bg-[#E5E0D8]',
  AVATAR_TEXT: 'text-xs font-bold text-text-primary',
  BADGE_CONTAINER:
    'flex-row items-center gap-1 rounded-full bg-brand-beige px-2 py-0.5',
  BADGE_TEXT: 'text-xs font-bold text-brand-green',
  BRANDING_CONTAINER: 'flex-row items-center justify-center gap-2',
  CLOSE_BUTTON: 'items-center justify-center',
  CONTAINER:
    'w-full flex-row items-center justify-between bg-surface px-4 py-3',
  DIVIDER: 'h-4 w-[1px] bg-slate-300',
  LEFT_SECTION: 'flex-1 items-start',
  RIGHT_SECTION: 'flex-1 items-end',
  TITLE_TEXT: 'text-sm font-bold uppercase tracking-wider text-text-primary',
} as const;

export const PROCESS_TOP_BAR_TEST_IDS = {
  AVATAR_BUTTON: 'process-top-bar-avatar-button',
  AVATAR_INITIALS: 'process-top-bar-avatar-initials',
  BADGE: 'process-top-bar-badge',
  BADGE_CAR_ICON: 'process-top-bar-badge-car-icon',
  BADGE_TEXT: 'process-top-bar-badge-text',
  CLOSE_BUTTON: 'process-top-bar-close-button',
  CONTAINER: 'process-top-bar-container',
  DIVIDER: 'process-top-bar-divider',
  LEFT_SECTION: 'process-top-bar-left-section',
  RIGHT_SECTION: 'process-top-bar-right-section',
  TITLE: 'process-top-bar-title',
} as const;
