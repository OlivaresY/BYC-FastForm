import {
  APPLICATION_STATUS,
  SELECTED_BANK_CODES,
  type SelectedBankCode,
} from '@/features/credit-wizard';

export const APPLICATION_STATUS_VALUES = {
  APPROVED: APPLICATION_STATUS.APPROVED,
  DRAFT: APPLICATION_STATUS.DRAFT,
  PENDING: APPLICATION_STATUS.PENDING,
  REJECTED: APPLICATION_STATUS.REJECTED,
} as const;

export const BANK_DISPLAY_LABELS: Readonly<Record<SelectedBankCode, string>> = {
  [SELECTED_BANK_CODES.BAC]: 'BAC Credomatic',
  [SELECTED_BANK_CODES.BNCR]: 'Banco Nacional (BNCR)',
  [SELECTED_BANK_CODES.CARRO_FACIL]: 'Carro Fácil',
  [SELECTED_BANK_CODES.PROMERICA]: 'Banco Promerica',
  [SELECTED_BANK_CODES.SCOTIABANK]: 'Scotiabank',
} as const;

export const HISTORY_QUERY_LIMITS = {
  DEFAULT_DOSSIERS_PAGE_SIZE: 50,
  MAX_NOTIFICATIONS_COUNT: 20,
  REQUEST_TIMEOUT_MS: 15000,
} as const;

export const HISTORY_STATUS_FILTERS = {
  ALL: 'all',
  APPROVED: APPLICATION_STATUS.APPROVED,
  PENDING: APPLICATION_STATUS.PENDING,
  REJECTED: APPLICATION_STATUS.REJECTED,
} as const;

export const HISTORY_TEST_IDS = {
  CARD_BADGE_PREFIX: 'history-card-badge-',
  CARD_PREFIX: 'history-card-',
  CARD_PRINT_BUTTON_PREFIX: 'history-card-print-button-',
  CARD_RETRY_BUTTON_PREFIX: 'history-card-retry-button-',
  CARD_VIEW_BUTTON_PREFIX: 'history-card-view-button-',
  DOSSIER_LIST: 'history-dossier-list',
  EMPTY_STATE: 'history-empty-state',
  ERROR_BANNER: 'history-error-banner',
  FILTER_PILL_PREFIX: 'history-filter-pill-',
  HEADER: 'history-header',
  LOADING_INDICATOR: 'history-loading-indicator',
  NOTIFICATIONS_BADGE: 'history-notifications-badge',
  NOTIFICATIONS_BELL: 'history-notifications-bell',
  NOTIFICATIONS_CLOSE_BUTTON: 'history-notifications-close-button',
  NOTIFICATIONS_EMPTY: 'history-notifications-empty',
  NOTIFICATIONS_ITEM_PREFIX: 'history-notifications-item-',
  NOTIFICATIONS_MARK_READ_BUTTON: 'history-notifications-mark-read-button',
  NOTIFICATIONS_PANEL: 'history-notifications-panel',
  RETRY_BUTTON: 'history-retry-button',
  SCREEN_CONTAINER: 'history-screen-container',
  SEARCH_CLEAR_BUTTON: 'history-search-clear-button',
  SEARCH_INPUT: 'history-search-input',
} as const;
