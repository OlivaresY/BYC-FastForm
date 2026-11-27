import { APP_ROUTES } from '@/shared/constants';
import { WIZARD_LAUNCH_COOLDOWN_MS } from '../constants';
import type {
  CreditWizardNavigationTarget,
  WizardLaunchOrigin,
} from '../types';

const INITIAL_WIZARD_SESSION_SEQUENCE = 0;

let wizardSessionSequence = INITIAL_WIZARD_SESSION_SEQUENCE;

export const createWizardSessionId = (origin: WizardLaunchOrigin): string => {
  wizardSessionSequence += 1;
  return `${origin}-${Date.now()}-${wizardSessionSequence}`;
};

export const canLaunchWizard = (
  lastLaunchTimestamp: number | null,
  now: number = Date.now(),
): boolean => {
  if (
    lastLaunchTimestamp === null ||
    !Number.isFinite(lastLaunchTimestamp) ||
    !Number.isFinite(now) ||
    now < lastLaunchTimestamp
  ) {
    return true;
  }

  return now - lastLaunchTimestamp >= WIZARD_LAUNCH_COOLDOWN_MS;
};

export const createCreditWizardRoute = (
  origin: WizardLaunchOrigin,
): CreditWizardNavigationTarget => ({
  params: {
    sessionId: createWizardSessionId(origin),
  },
  pathname: APP_ROUTES.CREDIT_WIZARD,
});
