import { APP_ROUTES } from '@/shared/constants';
import {
  NavigationRoutingPageObject,
  WIZARD_LAUNCH_COOLDOWN_MS,
  WIZARD_LAUNCH_ORIGINS,
} from './navigation.po';

const TEST_BASE_MS = 1700000001000;

describe('Expo Router Navigation Integration Tests', () => {
  beforeEach(() => {
    NavigationRoutingPageObject.resetMocks();
  });

  afterEach(() => {
    NavigationRoutingPageObject.restoreAllMocks();
  });

  it('navigates from IndexScreen to historial once even if onSuccess fires twice', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderIndex();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act
    page.triggerLoginSuccess().triggerLoginSuccess();

    // Assert
    expect(page.loginScreen).toBeTruthy();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    expect(routerSpies.replace).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);
  });

  it('configures TabsLayout with anchor historial and canonical screen order nuevo-tramite, historial, perfil', () => {
    // Arrange & Act
    const page = NavigationRoutingPageObject.renderTabsLayout();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Assert canonical Expo Router anchor & Tabs.Screen declaration order
    expect(page.tabsContainer).toBeTruthy();
    expect(NavigationRoutingPageObject.getTabsAnchorRoute()).toBe('historial');
    expect(NavigationRoutingPageObject.getRenderedTabScreenNames()).toEqual([
      'nuevo-tramite',
      'historial',
      'perfil',
    ]);
    expect(page.historialTab.props.accessibilityState).toEqual({
      selected: true,
    });
    expect(page.perfilTab.props.accessibilityState).toEqual({
      selected: false,
    });

    // Act: Switch to Mi Perfil then back to Historial
    page.pressPerfilTab().pressHistorialTab();

    // Assert navigation targets
    expect(routerSpies.navigate).toHaveBeenNthCalledWith(1, APP_ROUTES.PERFIL);
    expect(routerSpies.navigate).toHaveBeenNthCalledWith(
      2,
      APP_ROUTES.HISTORIAL,
    );
  });

  it('marks Mi Perfil active when active tab route is perfil', () => {
    // Arrange
    NavigationRoutingPageObject.setActiveTabRoute('perfil');

    // Act
    const page = NavigationRoutingPageObject.renderTabsLayout();

    // Assert
    expect(page.perfilTab.props.accessibilityState).toEqual({
      selected: true,
    });
    expect(page.historialTab.props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it('enforces WIZARD_LAUNCH_COOLDOWN_MS across rapid double taps on Nuevo Trámite and generates unified distinct sessionIds', () => {
    // Arrange
    const nowSpy = NavigationRoutingPageObject.setMockNowMs(TEST_BASE_MS);
    const page = NavigationRoutingPageObject.renderTabsLayout();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act: Tap once, then tap again at 499ms (< 500ms cooldown)
    page.pressNewApplicationTab();
    nowSpy.mockReturnValue(TEST_BASE_MS + WIZARD_LAUNCH_COOLDOWN_MS - 1);
    page.pressNewApplicationTab();

    // Assert: Rapid second tap inside cooldown blocked
    expect(routerSpies.push).toHaveBeenCalledTimes(1);
    const firstPushArgs = routerSpies.push.mock.calls[0]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(firstPushArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(firstPushArgs.params.sessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.TAB}-${TEST_BASE_MS}-\\d+$`),
    );

    // Act: Advance to exact WIZARD_LAUNCH_COOLDOWN_MS (500ms) -> launches cleanly
    const afterCooldownMs = TEST_BASE_MS + WIZARD_LAUNCH_COOLDOWN_MS;
    nowSpy.mockReturnValue(afterCooldownMs);
    page.pressNewApplicationTab();

    expect(routerSpies.push).toHaveBeenCalledTimes(2);
    const secondPushArgs = routerSpies.push.mock.calls[1]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(secondPushArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(secondPushArgs.params.sessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.TAB}-${afterCooldownMs}-\\d+$`),
    );
    expect(secondPushArgs.params.sessionId).not.toBe(
      firstPushArgs.params.sessionId,
    );

    // Act: Simulate focus return to TabsLayout within the same ms -> cooldown clears cleanly
    NavigationRoutingPageObject.triggerTabsFocusReset();
    page.pressNewApplicationTab();

    expect(routerSpies.push).toHaveBeenCalledTimes(3);
    const thirdPushArgs = routerSpies.push.mock.calls[2]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(thirdPushArgs.params.sessionId).not.toBe(
      secondPushArgs.params.sessionId,
    );
  });

  it('performs a single router.replace directly to /credit-wizard, renders null, and enforces cooldown on blur/refocus for /(tabs)/nuevo-tramite', () => {
    // Arrange
    const nowSpy = NavigationRoutingPageObject.setMockNowMs(TEST_BASE_MS);
    const page = NavigationRoutingPageObject.renderNuevoTramiteFallback();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Assert: Renders null and calls router.replace once (zero router.push)
    expect(page.renderedTree).toBeNull();
    expect(routerSpies.push).not.toHaveBeenCalled();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    const firstReplaceArgs = routerSpies.replace.mock.calls[0]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(firstReplaceArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(firstReplaceArgs.params.sessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.DIRECT}-${TEST_BASE_MS}-\\d+$`),
    );

    // Act: Duplicate focus fire without blur is ignored
    NavigationRoutingPageObject.triggerLatestFocusEffectAgain();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);

    // Act: Blur and refocus inside cooldown (< 500ms) is throttled by shared canLaunchWizard
    nowSpy.mockReturnValue(TEST_BASE_MS + WIZARD_LAUNCH_COOLDOWN_MS - 1);
    NavigationRoutingPageObject.triggerFocusBlurAndRefocus();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);

    // Act: Blur and refocus after WIZARD_LAUNCH_COOLDOWN_MS launches a fresh distinct session
    const nextAllowedMs = TEST_BASE_MS + WIZARD_LAUNCH_COOLDOWN_MS;
    nowSpy.mockReturnValue(nextAllowedMs);
    NavigationRoutingPageObject.triggerFocusBlurAndRefocus();

    expect(routerSpies.replace).toHaveBeenCalledTimes(2);
    const secondReplaceArgs = routerSpies.replace.mock.calls[1]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(secondReplaceArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(secondReplaceArgs.params.sessionId).toMatch(
      new RegExp(`^${WIZARD_LAUNCH_ORIGINS.DIRECT}-${nextAllowedMs}-\\d+$`),
    );
    expect(secondReplaceArgs.params.sessionId).not.toBe(
      firstReplaceArgs.params.sessionId,
    );
  });

  it('preserves activeSessionKey across blur and refocus even if params.sessionId drops to undefined', () => {
    // Arrange: Start with explicit sessionId and dirty draft
    const page = NavigationRoutingPageObject.renderCreditWizard('session-1');
    expect(page.wizardOrchestrator).toBeTruthy();
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);

    page.markWizardDraftDirty();
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    // Act: Simulate blur -> focus where params.sessionId becomes undefined or blank array
    page.simulateWizardBlurAndRefocus(undefined);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    page.simulateWizardBlurAndRefocus(['   ', 'ignored']);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    // Act: Arrive with a genuinely different explicit sessionId -> remounts blank
    page.rerenderCreditWizardWithSession('session-2');
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(2);
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);

    // Act: Start anonymously without sessionId, dirty draft, then blur/refocus -> stays preserved
    page.unmount();
    const anonymousPage = NavigationRoutingPageObject.renderCreditWizard();
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(3);

    anonymousPage.markWizardDraftDirty();
    anonymousPage.simulateWizardBlurAndRefocus(undefined);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(3);
    expect(anonymousPage.wizardDraftState.props.children).toBe(
      anonymousPage.dirtyDraftValue,
    );
  });

  it('dismisses keyboard and exits cleanly once via dismissTo when canDismiss() is true despite rapid double taps', () => {
    // Arrange
    NavigationRoutingPageObject.setCanDismiss(true);
    const page = NavigationRoutingPageObject.renderCreditWizard('session-exit');
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();
    const keyboardDismissSpy =
      NavigationRoutingPageObject.getKeyboardDismissSpy();

    // Act: Rapid double-tap on close button
    page.triggerWizardClose().triggerWizardClose();

    // Assert
    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);
    expect(routerSpies.canDismiss).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);
    expect(routerSpies.replace).not.toHaveBeenCalled();
  });

  it('dismisses keyboard and exits via router.replace when canDismiss() is false on cold deep-link exit or submit', () => {
    // Arrange
    NavigationRoutingPageObject.setCanDismiss(false);
    const page = NavigationRoutingPageObject.renderCreditWizard();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();
    const keyboardDismissSpy =
      NavigationRoutingPageObject.getKeyboardDismissSpy();

    // Act
    page.triggerWizardSubmissionSuccess().triggerWizardClose();

    // Assert
    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);
    expect(routerSpies.canDismiss).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).not.toHaveBeenCalled();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    expect(routerSpies.replace).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);
  });

  it('unlocks isExitingRef for a new explicit sessionKey while preserving lock across undefined params drops and generating fresh fallback key on remount', () => {
    // Arrange
    NavigationRoutingPageObject.setCanDismiss(true);
    const page = NavigationRoutingPageObject.renderCreditWizard('session-a');
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();
    const keyboardDismissSpy =
      NavigationRoutingPageObject.getKeyboardDismissSpy();

    // Act 1: Exit session-a -> guard locks exit; refocus with undefined must stay locked
    page.triggerWizardClose();
    page.simulateWizardBlurAndRefocus(undefined);
    page.triggerWizardClose();

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(1);

    // Act 2: New explicit session-b on reused screen instance unlocks exit guard
    page.rerenderCreditWizardWithSession('session-b');
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(2);
    page.triggerWizardClose();

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(2);
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(2);

    // Act 3: Exiting & remounting cleanly with no sessionId creates fresh fallback session that exits once
    page.unmount();
    const freshAnonymousPage =
      NavigationRoutingPageObject.renderCreditWizard();
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(3);
    expect(freshAnonymousPage.wizardDraftState.props.children).toBe(
      freshAnonymousPage.blankDraftValue,
    );

    freshAnonymousPage.triggerWizardClose();
    expect(keyboardDismissSpy).toHaveBeenCalledTimes(3);
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(3);
  });
});
