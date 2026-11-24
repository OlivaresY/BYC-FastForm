export const NAVIGATION_TAB_ROUTES = {
  HISTORY: 'historial',
  PROFILE: 'perfil',
} as const;

export const BOTTOM_TAB_BAR_COLORS = {
  ACTIVE_ICON: '#B91C1C',
  INACTIVE_ICON: '#5A6B80',
} as const;

export const BOTTOM_TAB_BAR_DIMENSIONS = {
  ICON_SIZE_PX: 22,
  ICON_STROKE_WIDTH: 2,
  LABEL_MAX_LINES: 1,
  MIN_BOTTOM_PADDING_PX: 8,
} as const;

export const BOTTOM_TAB_BAR_STYLES = {
  CONTAINER:
    'w-full flex-row items-center border-t border-border-subtle bg-surface px-2 pt-2',
  TAB_BUTTON:
    'min-h-[48px] min-w-[48px] flex-1 items-center justify-center gap-1 px-1 py-1.5',
  TAB_LABEL_ACTIVE: 'flex-shrink text-center text-xs font-bold text-brand-red',
  TAB_LABEL_INACTIVE:
    'flex-shrink text-center text-xs font-medium text-text-secondary',
} as const;

export const BOTTOM_TAB_BAR_TEST_IDS = {
  CONTAINER: 'bottom-tab-bar-container',
  HISTORY_LABEL: 'bottom-tab-bar-history-label',
  HISTORY_TAB: 'bottom-tab-bar-history-tab',
  NEW_APPLICATION_LABEL: 'bottom-tab-bar-new-application-label',
  NEW_APPLICATION_TAB: 'bottom-tab-bar-new-application-tab',
  PROFILE_LABEL: 'bottom-tab-bar-profile-label',
  PROFILE_TAB: 'bottom-tab-bar-profile-tab',
} as const;
