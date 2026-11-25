import { APPLICATION_STATUS_VALUES } from './history.constants';
import type {
  ApplicationStatus,
  DossierCardStatusStyle,
} from '../types';

export const DOSSIER_CARD_COLORS = {
  CORPORATE_RED: '#B91C1C',
  MUTED_ICON: '#9CA3AF',
  PRIMARY_GREEN: '#054F31',
  PRIMARY_TEXT: '#111111',
  SECONDARY_TEXT: '#5A6B80',
  WARM_TAUPE: '#CCC7BD',
} as const;

export const DOSSIER_CARD_DIMENSIONS = {
  ACTION_ICON_SIZE_PX: 18,
  META_ICON_SIZE_PX: 16,
  MIN_TOUCH_TARGET_PX: 48,
  STATUS_ICON_SIZE_PX: 14,
} as const;

export const DOSSIER_CARD_STATUS_STYLES: Readonly<
  Record<ApplicationStatus, DossierCardStatusStyle>
> = {
  [APPLICATION_STATUS_VALUES.APPROVED]: {
    containerClassName:
      'bg-status-approved-bg border border-status-approved-border',
    textClassName: 'text-status-approved-text',
  },
  [APPLICATION_STATUS_VALUES.DRAFT]: {
    containerClassName: 'bg-background border border-border-base',
    textClassName: 'text-text-secondary',
  },
  [APPLICATION_STATUS_VALUES.PENDING]: {
    containerClassName:
      'bg-status-pending-bg border border-status-pending-border',
    textClassName: 'text-status-pending-text',
  },
  [APPLICATION_STATUS_VALUES.REJECTED]: {
    containerClassName:
      'bg-status-rejected-bg border border-status-rejected-border',
    textClassName: 'text-status-rejected-text',
  },
} as const;

export const DOSSIER_CARD_STYLES = {
  ACTIONS_ROW: 'mt-3 flex-row items-center justify-between gap-2',
  APPLICANT_NAME: 'text-base font-bold text-text-primary',
  CARD_ROOT: 'rounded-2xl border border-border-base bg-brand-taupe p-4',
  DETAILS_BOX:
    'mt-3 gap-2 rounded-xl border border-border-subtle bg-surface p-3',
  DETAILS_META_TEXT: 'flex-1 text-xs text-text-secondary',
  DETAILS_PRIMARY_TEXT: 'flex-1 text-sm font-medium text-text-primary',
  DETAILS_ROW: 'flex-row items-center gap-2',
  HEADER_INFO: 'flex-1 pr-3',
  HEADER_ROW: 'flex-row items-start justify-between gap-2',
  ID_SUBTITLE: 'mt-0.5 text-xs text-text-secondary',
  QUICK_PRINT_ACTIVE_BUTTON:
    'min-h-[48px] min-w-[48px] flex-row items-center justify-center gap-2 rounded-xl border border-status-approved-border bg-status-approved-bg px-3 py-2',
  QUICK_PRINT_ACTIVE_TEXT:
    'flex-shrink text-center text-sm font-semibold text-status-approved-text',
  QUICK_PRINT_LOCKED_BUTTON:
    'min-h-[48px] min-w-[48px] flex-row items-center justify-center gap-2 rounded-xl border border-border-base bg-background px-3 py-2 opacity-50',
  QUICK_PRINT_LOCKED_TEXT:
    'flex-shrink text-center text-sm font-medium text-text-secondary',
  RETRY_BUTTON:
    'min-h-[48px] min-w-[48px] flex-row items-center justify-center gap-2 rounded-xl border border-status-rejected-border bg-status-rejected-bg px-3 py-2',
  RETRY_TEXT: 'flex-shrink text-center text-sm font-semibold text-brand-red',
  STATUS_BADGE_BASE: 'rounded-full px-2.5 py-1',
  STATUS_BADGE_TEXT_BASE: 'text-xs font-bold uppercase',
  STATUS_INDICATOR_ROW: 'mt-3 flex-row items-center gap-2',
  STATUS_INDICATOR_TEXT_APPROVED:
    'flex-1 text-xs font-medium text-status-approved-text',
  STATUS_INDICATOR_TEXT_LOCKED: 'flex-1 text-xs font-medium text-text-secondary',
  STATUS_INDICATOR_TEXT_REJECTED: 'flex-1 text-xs font-medium text-brand-red',
  VIEW_DOSSIER_BUTTON:
    'min-h-[48px] min-w-[48px] flex-row items-center justify-center gap-1 rounded-xl px-2 py-2',
  VIEW_DOSSIER_TEXT:
    'flex-shrink text-center text-sm font-semibold text-text-primary',
} as const;

export const DOSSIER_CARD_TEST_IDS = {
  CARD_ROOT: 'dossier-card-root',
  QUICK_PRINT_BUTTON: 'dossier-card-quick-print-button',
  RETRY_BUTTON: 'dossier-card-retry-button',
  STATUS_BADGE: 'dossier-card-status-badge',
  VIEW_DOSSIER_BUTTON: 'dossier-card-view-dossier-button',
} as const;
