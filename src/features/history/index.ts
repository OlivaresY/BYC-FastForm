export { DossierCard } from './components';

export {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  CREDIT_APPLICATION_REGIMES,
  DOSSIER_CARD_COLORS,
  DOSSIER_CARD_DIMENSIONS,
  DOSSIER_CARD_STATUS_STYLES,
  DOSSIER_CARD_STYLES,
  DOSSIER_CARD_TEST_IDS,
  HISTORY_DATE_LIMITS,
  HISTORY_DB_COLUMNS,
  HISTORY_DB_TABLES,
  HISTORY_EVENT_NAMES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_QUERY_LIMITS,
  HISTORY_SELECT_COLUMNS,
  HISTORY_STATUS_FILTERS,
  HISTORY_TEMPLATE_TOKENS,
  HISTORY_TEST_IDS,
  HISTORY_TIME_UNITS_MS,
} from './constants';

export { useHistoryViewModel } from './hooks';
export type { UseHistoryViewModelOptions } from './hooks';

export {
  fetchAdvisorCreditApplications,
  formatDossierDate,
  formatNotificationRelativeTime,
  mapCreditApplicationRowToDossierItem,
  mapDossiersToNotifications,
} from './services';
export type {
  FetchAdvisorCreditApplicationsOptions,
  HistoryCopy,
} from './services';

export type {
  ApplicationStatus,
  CreditApplicationRegime,
  CreditApplicationRow,
  DossierCardProps,
  DossierCardStatusStyle,
  DossierNotificationItem,
  DossierNotificationStatus,
  HistoryDossierItem,
  HistoryStatusFilter,
  MasterCreditApplicationPayload,
  SelectedBankCode,
  UseHistoryViewModelResult,
} from './types';
