import {
  APPLICATION_STATUS,
  SELECTED_BANK_CODES,
  type SelectedBankCode,
} from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';

export const APPLICATION_STATUS_VALUES = {
  APPROVED: APPLICATION_STATUS.APPROVED,
  DRAFT: APPLICATION_STATUS.DRAFT,
  PENDING: APPLICATION_STATUS.PENDING,
  REJECTED: APPLICATION_STATUS.REJECTED,
} as const;

export const BANK_DISPLAY_LABELS: Readonly<Record<SelectedBankCode, string>> = {
  [SELECTED_BANK_CODES.BAC]: esCR.history.banks.bac,
  [SELECTED_BANK_CODES.BNCR]: esCR.history.banks.bncr,
  [SELECTED_BANK_CODES.CARRO_FACIL]: esCR.history.banks.carroFacil,
  [SELECTED_BANK_CODES.PROMERICA]: esCR.history.banks.promerica,
  [SELECTED_BANK_CODES.SCOTIABANK]: esCR.history.banks.scotiabank,
} as const;

export const CREDIT_APPLICATION_REGIMES = {
  LEGAL: 'legal',
  PHYSICAL: 'physical',
} as const;

export const HISTORY_DATE_LIMITS = {
  // America/Costa_Rica observes fixed UTC-6 year-round with no DST.
  COSTA_RICA_UTC_OFFSET_MS: -21600000,
  DATE_ONLY_PATTERN: /^(\d{4})-(\d{2})-(\d{2})$/,
  MAX_RELATIVE_DAYS: 7,
  MIN_MONTH_NUMBER: 1,
  PAD_WIDTH_CHARS: 2,
  PAD_ZERO_CHAR: '0',
} as const;

export const HISTORY_DB_COLUMNS = {
  CREATED_AT: 'created_at',
  ID: 'id',
  PAYLOAD: 'payload',
  REGIME: 'regime',
  SELECTED_BANKS: 'selected_banks',
  STATUS: 'status',
  TEMPLATE_VERSION: 'template_version',
  USER_ID: 'user_id',
} as const;

export const HISTORY_DB_TABLES = {
  CREDIT_APPLICATIONS: 'credit_applications',
} as const;

export const HISTORY_ERROR_CLASSIFICATION = {
  AUTH_CODES: ['PGRST301', 'PGRST302'] as readonly string[],
  AUTH_HTTP_STATUSES: [401, 403] as readonly number[],
  AUTH_MESSAGE_PATTERNS: [
    'auth session missing',
    'invalid jwt',
    'invalid token',
    'jwt',
    'not authenticated',
    'refresh token',
    'session expired',
    'session missing',
    'token expired',
    'unauthorized',
  ] as readonly string[],
  AUTH_NAMES: ['AuthApiError', 'AuthSessionMissingError'] as readonly string[],
  ERROR_NAME: 'HistoryServiceError',
  NETWORK_CODES: [
    'ECONNABORTED',
    'ECONNREFUSED',
    'ECONNRESET',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'ENOTFOUND',
    'ERR_NETWORK',
    'ETIMEDOUT',
  ] as readonly string[],
  NETWORK_MESSAGE_PATTERNS: [
    'econnrefused',
    'econnreset',
    'enotfound',
    'err_network',
    'etimedout',
    'failed to fetch',
    'network error',
    'network request failed',
    'offline',
    'socket hang up',
  ] as readonly string[],
  NETWORK_NAMES: ['FetchError'] as readonly string[],
} as const;

export const HISTORY_ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  LOAD_FAILED: 'LOAD_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const;

export const HISTORY_EVENT_NAMES = {
  ABORT: 'abort',
} as const;

export const HISTORY_INTERNAL_STRINGS = {
  ABORT_ERROR_NAME: 'AbortError',
  EMPTY: '',
  LOG_FETCH_FAILED:
    '[history.service] Failed to fetch advisor credit applications:',
  LOG_FETCH_UNEXPECTED:
    '[history.service] Unexpected error fetching advisor credit applications:',
  LOG_QUICK_PRINT_FAILED: '[useHistoryViewModel] Quick print failed:',
  SPACE: ' ',
} as const;

export const HISTORY_PAGINATION_MODES = {
  APPEND: 'append',
  REPLACE: 'replace',
} as const;

export const HISTORY_QUERY_LIMITS = {
  DEFAULT_DOSSIERS_PAGE_SIZE: 50,
  DEFAULT_OFFSET: 0,
  MAX_NOTIFICATIONS_COUNT: 20,
  MIN_PAGE_SIZE: 1,
  REQUEST_TIMEOUT_MS: 15000,
} as const;

export const HISTORY_SELECT_COLUMNS =
  'id, user_id, regime, status, template_version, selected_banks, payload, created_at' as const;

export const HISTORY_STATUS_FILTERS = {
  ALL: 'all',
  APPROVED: APPLICATION_STATUS.APPROVED,
  PENDING: APPLICATION_STATUS.PENDING,
  REJECTED: APPLICATION_STATUS.REJECTED,
} as const;

export const HISTORY_TEMPLATE_TOKENS = {
  APPLICANT: '{{applicant}}',
  COUNT: '{{count}}',
  VEHICLE: '{{vehicle}}',
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

export const HISTORY_TIME_UNITS_MS = {
  DAY_MS: 86400000,
  HOUR_MS: 3600000,
  MINUTE_MS: 60000,
} as const;
