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

export const DOSSIER_CARD_TEST_IDS = {
  CARD_ROOT: 'dossier-card-root',
  QUICK_PRINT_BUTTON: 'dossier-card-quick-print-button',
  RETRY_BUTTON: 'dossier-card-retry-button',
  STATUS_BADGE: 'dossier-card-status-badge',
  VIEW_DOSSIER_BUTTON: 'dossier-card-view-dossier-button',
} as const;
