import { APP_ROUTES } from '@/shared/constants';
import { NavigationRoutingPageObject } from './navigation.po';

describe('Expo Router Navigation Integration Tests', () => {
  beforeEach(() => {
    NavigationRoutingPageObject.resetMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('blocks rapid double-taps on Nuevo Trámite and generates non-colliding sessionIds even within the same millisecond after return', () => {
    // Arrange
    jest.spyOn(Date, 'now').mockReturnValue(1700000001000);
    const page = NavigationRoutingPageObject.renderTabsLayout();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act: Rapid double-tap inside cooldown window should push only once
    page.pressNewApplicationTab().pressNewApplicationTab();

    // Assert: Duplicate push prevented
    expect(routerSpies.push).toHaveBeenCalledTimes(1);
    expect(routerSpies.push).toHaveBeenNthCalledWith(1, {
      params: { sessionId: '1700000001000-1' },
      pathname: APP_ROUTES.CREDIT_WIZARD,
    });

    // Act: Simulate focus returning to TabsLayout even within the same ms
    NavigationRoutingPageObject.triggerTabsFocusReset();
    page.pressNewApplicationTab();

    // Assert: Second launch produces a distinct sessionId despite identical ms
    expect(routerSpies.push).toHaveBeenCalledTimes(2);
    expect(routerSpies.push).toHaveBeenNthCalledWith(2, {
      params: { sessionId: '1700000001000-2' },
      pathname: APP_ROUTES.CREDIT_WIZARD,
    });
  });

  it('replaces direct /(tabs)/nuevo-tramite hits with historial, schedules /credit-wizard push via microtask, and resets guard on blur', async () => {
    // Arrange
    jest.spyOn(Date, 'now').mockReturnValue(1700000002000);
    const page = NavigationRoutingPageObject.renderNuevoTramiteFallback();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Assert immediate replace before microtask push
    expect(page.nuevoTramiteContainer).toBeTruthy();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    expect(routerSpies.replace).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);

    await NavigationRoutingPageObject.flushMicrotasks();
    expect(routerSpies.push).toHaveBeenCalledTimes(1);
    const firstPushArgs = routerSpies.push.mock.calls[0]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(firstPushArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(
      firstPushArgs.params.sessionId.startsWith('direct-1700000002000-'),
    ).toBe(true);

    // Act: Duplicate focus fire without blur must be ignored
    NavigationRoutingPageObject.triggerLatestFocusEffectAgain();
    await NavigationRoutingPageObject.flushMicrotasks();
    expect(routerSpies.push).toHaveBeenCalledTimes(1);

    // Act: Blur and refocus must launch a brand new distinct sessionId
    NavigationRoutingPageObject.triggerFocusBlurAndRefocus();
    await NavigationRoutingPageObject.flushMicrotasks();
    expect(routerSpies.replace).toHaveBeenCalledTimes(2);
    expect(routerSpies.push).toHaveBeenCalledTimes(2);
    const secondPushArgs = routerSpies.push.mock.calls[1]?.[0] as {
      params: { sessionId: string };
      pathname: string;
    };
    expect(secondPushArgs.pathname).toBe(APP_ROUTES.CREDIT_WIZARD);
    expect(secondPushArgs.params.sessionId).not.toBe(
      firstPushArgs.params.sessionId,
    );
  });

  it('remounts CreditWizardOrchestratorView blank when sessionId changes and guards duplicate close calls', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderCreditWizard('session-1');
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();
    expect(page.wizardOrchestrator).toBeTruthy();
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);

    // Act: Mutate internal wizard draft state, then change sessionId
    page.markWizardDraftDirty();
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    page.rerenderCreditWizardWithSession('session-2');

    // Assert: Key change remounts CreditWizardOrchestratorView cleanly blank
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(2);
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);

    // Act: Rapid double-tap on close button
    page.triggerWizardClose().triggerWizardClose();

    // Assert: dismissTo invoked once for historial when canDismiss is true
    expect(routerSpies.canDismiss).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);
  });

  it('preserves active draft across blur/modal refocus when sessionId is omitted while isolating separate mounts blank', () => {
    // Arrange: Render without sessionId (deep link / direct web URL)
    jest.spyOn(Date, 'now').mockReturnValue(1700000003000);
    const page = NavigationRoutingPageObject.renderCreditWizard(['  ', 's2']);
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);

    page.markWizardDraftDirty();
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    // Act: Simulate modal/sub-route blur & refocus during active session
    NavigationRoutingPageObject.triggerFocusBlurAndRefocus();

    // Assert: Must NOT wipe active in-progress draft
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(1);
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    // Act: Switch to an explicit sessionId, then unmount & reopen anonymously
    page.rerenderCreditWizardWithSession('session-array-next');
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(2);
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);
    page.unmount();

    const reopenedPage = NavigationRoutingPageObject.renderCreditWizard();
    expect(NavigationRoutingPageObject.getWizardMountCount()).toBe(3);
    expect(reopenedPage.wizardDraftState.props.children).toBe(
      reopenedPage.blankDraftValue,
    );
  });

  it('falls back cleanly to router.replace when canDismiss() is false on cold deep-link exit or submit', () => {
    // Arrange
    NavigationRoutingPageObject.setCanDismiss(false);
    const page = NavigationRoutingPageObject.renderCreditWizard();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act
    page.triggerWizardSubmissionSuccess();

    // Assert
    expect(routerSpies.canDismiss).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).not.toHaveBeenCalled();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    expect(routerSpies.replace).toHaveBeenCalledWith(APP_ROUTES.HISTORIAL);
  });
});
