import type {
  ApplicationStatus,
  MasterCreditApplicationPayload,
  SelectedBankCode,
} from '@/features/credit-wizard';
import type {
  HISTORY_ERROR_CODES,
  HISTORY_STATUS_FILTERS,
} from '../constants/history.constants';

export type {
  ApplicationStatus,
  MasterCreditApplicationPayload,
  SelectedBankCode,
};

export type CreditApplicationRegime = MasterCreditApplicationPayload['regime'];

export type DossierNotificationStatus = Extract<
  ApplicationStatus,
  'Approved' | 'Rejected'
>;

export type HistoryErrorCode =
  (typeof HISTORY_ERROR_CODES)[keyof typeof HISTORY_ERROR_CODES];

export type HistoryStatusFilter =
  (typeof HISTORY_STATUS_FILTERS)[keyof typeof HISTORY_STATUS_FILTERS];

export interface CreditApplicationRow {
  created_at: string;
  id: string;
  payload: MasterCreditApplicationPayload;
  regime: CreditApplicationRegime;
  selected_banks: SelectedBankCode[];
  status: ApplicationStatus;
  template_version: string;
  user_id: string;
}

export interface FetchAdvisorCreditApplicationsPage {
  hasMore: boolean;
  nextOffset: number;
  rows: CreditApplicationRow[];
}

export interface HistoryDossierItem {
  applicantName: string;
  canQuickPrint: boolean;
  createdAt: string;
  formattedDate: string;
  id: string;
  identificationNumber: string;
  primaryBankLabel: string;
  rawPayload: MasterCreditApplicationPayload;
  regime: CreditApplicationRegime;
  selectedBanks: SelectedBankCode[];
  status: ApplicationStatus;
  templateVersion: string;
  vehicleSummary: string;
}

export interface DossierNotificationItem {
  applicantName: string;
  description: string;
  dossierId: string;
  id: string;
  isRead: boolean;
  relativeTime: string;
  status: DossierNotificationStatus;
  title: string;
}

export interface UseHistoryViewModelResult {
  clearQuickPrintError: () => void;
  clearSearch: () => void;
  closeNotifications: () => void;
  dossiers: HistoryDossierItem[];
  error: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isNotificationsOpen: boolean;
  isRefreshing: boolean;
  loadMore: () => Promise<void>;
  markAllAsRead: () => void;
  markAsRead: (notificationId: string) => void;
  notifications: DossierNotificationItem[];
  openNotifications: () => void;
  printingDossierId: string | null;
  quickPrintError: string | null;
  refresh: () => Promise<void>;
  requestQuickPrint: (dossier: HistoryDossierItem) => Promise<void>;
  retry: () => Promise<void>;
  searchQuery: string;
  selectedFilter: HistoryStatusFilter;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: HistoryStatusFilter) => void;
  totalCount: number;
  unreadCount: number;
}
