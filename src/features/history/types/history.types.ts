import type {
  ApplicationStatus,
  MasterCreditApplicationPayload,
  SelectedBankCode,
} from '@/features/credit-wizard';
import type { HISTORY_STATUS_FILTERS } from '../constants/history.constants';

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
  clearSearch: () => void;
  closeNotifications: () => void;
  dossiers: HistoryDossierItem[];
  error: string | null;
  isLoading: boolean;
  isNotificationsOpen: boolean;
  isRefreshing: boolean;
  markAllAsRead: () => void;
  markAsRead: (notificationId: string) => void;
  notifications: DossierNotificationItem[];
  openNotifications: () => void;
  printingDossierId: string | null;
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
