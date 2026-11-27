import type { APP_ROUTES } from '@/shared/constants';
import type { WIZARD_LAUNCH_ORIGINS } from '../constants/WizardLauncher.constants';

export type WizardLaunchOrigin =
  (typeof WIZARD_LAUNCH_ORIGINS)[keyof typeof WIZARD_LAUNCH_ORIGINS];

export interface CreditWizardNavigationTarget {
  params: {
    sessionId: string;
  };
  pathname: typeof APP_ROUTES.CREDIT_WIZARD;
}
