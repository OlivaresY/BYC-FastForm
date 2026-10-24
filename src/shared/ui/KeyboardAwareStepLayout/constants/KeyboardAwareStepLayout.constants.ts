export const KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS = {
  BOTTOM_BAR_HEIGHT: 84,
  EXTRA_KEYBOARD_SCROLL_OFFSET: 24,
  KEYBOARD_VERTICAL_OFFSET_IOS: 64,
  SCROLL_EVENT_THROTTLE: 16,
} as const;

export const KEYBOARD_AWARE_STEP_LAYOUT_STYLES = {
  CONTAINER: 'w-full flex-1 self-stretch',
  KEYBOARD_AVOIDING_VIEW: 'flex-1',
  SCROLL_VIEW: 'w-full flex-1 self-stretch',
} as const;

export const KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS = {
  CONTAINER: 'keyboard-aware-step-layout-container',
  FOOTER: 'keyboard-aware-step-layout-footer',
  KEYBOARD_AVOIDING_VIEW: 'keyboard-aware-step-layout-keyboard-avoiding-view',
  SCROLL_VIEW: 'keyboard-aware-step-layout-scroll-view',
} as const;
