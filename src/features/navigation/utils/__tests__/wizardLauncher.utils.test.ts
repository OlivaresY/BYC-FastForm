import { APP_ROUTES } from '@/shared/constants';
import {
  WIZARD_LAUNCH_COOLDOWN_MS,
  WIZARD_LAUNCH_ORIGINS,
} from '../../constants';
import {
  canLaunchWizard,
  createCreditWizardRoute,
  createWizardSessionId,
} from '../wizardLauncher.utils';

const MOCK_NOW_MS = 1700000000000;

describe('wizardLauncher.utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exposes exact cooldown duration and origin constants', () => {
    expect(WIZARD_LAUNCH_COOLDOWN_MS).toBe(500);
    expect(WIZARD_LAUNCH_ORIGINS).toEqual({
      DIRECT: 'direct',
      FALLBACK: 'fallback',
      TAB: 'tab',
    });
  });

  it('generates distinct monotonically incrementing session IDs per origin within the same ms', () => {
    jest.spyOn(Date, 'now').mockReturnValue(MOCK_NOW_MS);

    const tabSessionId = createWizardSessionId(WIZARD_LAUNCH_ORIGINS.TAB);
    const directSessionId = createWizardSessionId(WIZARD_LAUNCH_ORIGINS.DIRECT);
    const fallbackSessionId = createWizardSessionId(
      WIZARD_LAUNCH_ORIGINS.FALLBACK,
    );
    const nextTabSessionId = createWizardSessionId(WIZARD_LAUNCH_ORIGINS.TAB);

    expect(tabSessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.TAB}-${MOCK_NOW_MS}-\\d+$`),
    );
    expect(directSessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.DIRECT}-${MOCK_NOW_MS}-\\d+$`),
    );
    expect(fallbackSessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.FALLBACK}-${MOCK_NOW_MS}-\\d+$`),
    );

    const uniqueIds = new Set([
      tabSessionId,
      directSessionId,
      fallbackSessionId,
      nextTabSessionId,
    ]);
    expect(uniqueIds.size).toBe(4);
  });

  it('enforces WIZARD_LAUNCH_COOLDOWN_MS strictly across elapsed timestamps', () => {
    expect(canLaunchWizard(null, MOCK_NOW_MS)).toBe(true);
    expect(canLaunchWizard(MOCK_NOW_MS, MOCK_NOW_MS)).toBe(false);
    expect(
      canLaunchWizard(
        MOCK_NOW_MS,
        MOCK_NOW_MS + WIZARD_LAUNCH_COOLDOWN_MS - 1,
      ),
    ).toBe(false);
    expect(
      canLaunchWizard(MOCK_NOW_MS, MOCK_NOW_MS + WIZARD_LAUNCH_COOLDOWN_MS),
    ).toBe(true);
    expect(
      canLaunchWizard(
        MOCK_NOW_MS,
        MOCK_NOW_MS + WIZARD_LAUNCH_COOLDOWN_MS + 250,
      ),
    ).toBe(true);
    expect(canLaunchWizard(MOCK_NOW_MS, MOCK_NOW_MS - 10)).toBe(true);
    expect(canLaunchWizard(Number.NaN, MOCK_NOW_MS)).toBe(true);

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(MOCK_NOW_MS + WIZARD_LAUNCH_COOLDOWN_MS);
    expect(canLaunchWizard(MOCK_NOW_MS)).toBe(true);
  });

  it('builds a unified CreditWizard navigation target pointing to APP_ROUTES.CREDIT_WIZARD', () => {
    jest.spyOn(Date, 'now').mockReturnValue(MOCK_NOW_MS);

    const target = createCreditWizardRoute(WIZARD_LAUNCH_ORIGINS.DIRECT);

    expect(target.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(target.params.sessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.DIRECT}-${MOCK_NOW_MS}-\\d+$`),
    );
  });
});
