import { NavigationRoutingPageObject } from './navigation.po';

describe('Expo Router Navigation Integration Tests', () => {
  beforeEach(() => {
    NavigationRoutingPageObject.resetMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('navigates from IndexScreen to /(tabs)/historial once even if onSuccess fires twice', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderIndex();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act
    page.triggerLoginSuccess().triggerLoginSuccess();

    // Assert
    expect(page.loginScreen).toBeTruthy();
    expect(routerSpies.replace).toHaveBeenCalledTimes(1);
    expect(routerSpies.replace).toHaveBeenCalledWith('/(tabs)/historial');
  });

  it('renders TabsLayout with Historial active by default and switches cleanly between tabs', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderTabsLayout();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Assert initial state
    expect(page.tabsContainer).toBeTruthy();
    expect(page.historialTab.props.accessibilityState).toEqual({
      selected: true,
    });
    expect(page.perfilTab.props.accessibilityState).toEqual({
      selected: false,
    });

    // Act: Switch to Mi Perfil then back to Historial
    page.pressPerfilTab().pressHistorialTab();

    // Assert navigation targets
    expect(routerSpies.navigate).toHaveBeenNthCalledWith(1, '/(tabs)/perfil');
    expect(routerSpies.navigate).toHaveBeenNthCalledWith(
      2,
      '/(tabs)/historial',
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
      pathname: '/credit-wizard',
    });

    // Act: Simulate focus returning to TabsLayout even within the same ms
    NavigationRoutingPageObject.triggerTabsFocusReset();
    page.pressNewApplicationTab();

    // Assert: Second launch produces a distinct sessionId despite identical ms
    expect(routerSpies.push).toHaveBeenCalledTimes(2);
    expect(routerSpies.push).toHaveBeenNthCalledWith(2, {
      params: { sessionId: '1700000001000-2' },
      pathname: '/credit-wizard',
    });
  });

  it('redirects nuevo-tramite fallback screen to /(tabs)/historial', () => {
    // Act
    const page = NavigationRoutingPageObject.renderNuevoTramiteFallback();

    // Assert
    expect(page.redirectElement.props.accessibilityLabel).toBe(
      '/(tabs)/historial',
    );
  });

  it('remounts CreditWizardOrchestratorView blank when sessionId changes and guards duplicate close calls', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderCreditWizard('session-1');
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();
    expect(page.wizardOrchestrator).toBeTruthy();
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);

    // Act: Mutate internal wizard draft state, then change sessionId
    page.markWizardDraftDirty();
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);

    page.rerenderCreditWizardWithSession('session-2');

    // Assert: Key change remounts CreditWizardOrchestratorView cleanly blank
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);

    // Act: Rapid double-tap on close button
    page.triggerWizardClose().triggerWizardClose();

    // Assert: dismissTo invoked once for /(tabs)/historial
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledWith('/(tabs)/historial');
  });

  it('handles array or blank sessionId safely and dismisses to /(tabs)/historial on submission success', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderCreditWizard(['  ', 's2']);
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act: Mutate dirty, then switch to array sessionId with valid first entry
    page.markWizardDraftDirty();
    expect(page.wizardDraftState.props.children).toBe(page.dirtyDraftValue);
    page.rerenderCreditWizardWithSession('session-array-next');

    // Assert: Remounted cleanly blank, then submit succeeds back to historial
    expect(page.wizardDraftState.props.children).toBe(page.blankDraftValue);
    page.triggerWizardSubmissionSuccess();

    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(1);
    expect(routerSpies.dismissTo).toHaveBeenCalledWith('/(tabs)/historial');
  });
});
