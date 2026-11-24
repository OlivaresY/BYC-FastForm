import { NavigationRoutingPageObject } from './navigation.po';

describe('Expo Router Navigation Integration Tests', () => {
  beforeEach(() => {
    NavigationRoutingPageObject.resetMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('navigates from IndexScreen to /(tabs)/historial on login success', () => {
    // Arrange
    const page = NavigationRoutingPageObject.renderIndex();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act
    page.triggerLoginSuccess();

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

  it('pushes /credit-wizard with a unique sessionId param when Nuevo Trámite is pressed', () => {
    // Arrange
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1700000001000)
      .mockReturnValueOnce(1700000002000);
    const page = NavigationRoutingPageObject.renderTabsLayout();
    const routerSpies = NavigationRoutingPageObject.getRouterSpies();

    // Act
    page.pressNewApplicationTab().pressNewApplicationTab();

    // Assert
    expect(routerSpies.push).toHaveBeenCalledTimes(2);
    expect(routerSpies.push).toHaveBeenNthCalledWith(1, {
      params: { sessionId: '1700000001000' },
      pathname: '/credit-wizard',
    });
    expect(routerSpies.push).toHaveBeenNthCalledWith(2, {
      params: { sessionId: '1700000002000' },
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

  it('remounts CreditWizardOrchestratorView blank when sessionId changes and dismisses to /(tabs)/historial on close or submit', () => {
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

    // Act: Close and submit success callbacks
    page.triggerWizardClose().triggerWizardSubmissionSuccess();

    // Assert: Both return cleanly via dismissTo('/(tabs)/historial')
    expect(routerSpies.dismissTo).toHaveBeenCalledTimes(2);
    expect(routerSpies.dismissTo).toHaveBeenNthCalledWith(
      1,
      '/(tabs)/historial',
    );
    expect(routerSpies.dismissTo).toHaveBeenNthCalledWith(
      2,
      '/(tabs)/historial',
    );
  });
});
