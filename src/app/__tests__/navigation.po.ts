import { BOTTOM_TAB_BAR_TEST_IDS } from '@/features/navigation';
import {
  act,
  fireEvent,
  render,
  type RenderResult,
} from '@testing-library/react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import TabsLayout, { unstable_settings as tabsUnstableSettings } from '../(tabs)/_layout';
import NuevoTramiteFallbackScreen from '../(tabs)/nuevo-tramite';
import CreditWizardScreen from '../credit-wizard';
import IndexScreen from '../index';

const MOCK_ROUTING_TEST_IDS = {
  LOGIN_SCREEN: 'mock-login-screen',
  LOGIN_SUCCESS_TRIGGER: 'mock-login-success-trigger',
  NUEVO_TRAMITE_CONTAINER: 'nuevo-tramite-fallback-container',
  TABS_CONTAINER: 'mock-tabs-container',
  WIZARD_CLOSE_TRIGGER: 'mock-wizard-close-trigger',
  WIZARD_DRAFT_DIRTY_TRIGGER: 'mock-wizard-draft-dirty-trigger',
  WIZARD_DRAFT_STATE: 'mock-wizard-draft-state',
  WIZARD_ORCHESTRATOR: 'mock-wizard-orchestrator',
  WIZARD_SUBMIT_SUCCESS_TRIGGER: 'mock-wizard-submit-success-trigger',
} as const;

const MOCK_WIZARD_DRAFT_VALUES = {
  BLANK: 'blank',
  DIRTY: 'dirty',
} as const;

interface FocusSubscriptionRecord {
  callback: () => undefined | void | (() => void);
  cleanup: void | (() => void);
}

const mockFocusState = {
  latestRecord: null as FocusSubscriptionRecord | null,
};

const mockTabsState = {
  activeRouteName: 'historial',
  renderedScreens: [] as string[],
};

const mockWizardState = {
  mountCount: 0,
};

jest.mock('expo-router', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');

  const mockRouter = {
    canDismiss: jest.fn(() => true),
    dismissTo: jest.fn(),
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };

  const mockUseLocalSearchParams = jest.fn(
    (): { sessionId?: string | string[] } => ({}),
  );

  const mockUseFocusEffect = jest.fn(
    (effect: () => undefined | void | (() => void)): void => {
      MockReact.useEffect(() => {
        const cleanup = effect();
        mockFocusState.latestRecord = { callback: effect, cleanup };

        return () => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        };
      }, [effect]);
    },
  );

  return {
    router: mockRouter,
    useFocusEffect: mockUseFocusEffect,
    useLocalSearchParams: mockUseLocalSearchParams,
    useRouter: () => mockRouter,
  };
});

jest.mock('expo-router/js-tabs', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  interface MockTabsProps {
    children?: React.ReactNode;
    tabBar?: (props: {
      state: { index: number; routes: { key: string; name: string }[] };
    }) => React.ReactNode;
  }

  interface MockTabsScreenProps {
    name: string;
  }

  const MockTabs = ({
    children,
    tabBar,
  }: MockTabsProps): React.JSX.Element => {
    mockTabsState.renderedScreens = [];

    const routes = [
      { key: 'nuevo-tramite-key', name: 'nuevo-tramite' },
      { key: 'historial-key', name: 'historial' },
      { key: 'perfil-key', name: 'perfil' },
    ];
    const activeIndex = routes.findIndex(
      (route) => route.name === mockTabsState.activeRouteName,
    );

    return MockReact.createElement(
      MockView,
      { testID: 'mock-tabs-container' },
      children,
      tabBar
        ? tabBar({
          state: {
            index: activeIndex >= 0 ? activeIndex : 1,
            routes,
          },
        })
        : null,
    );
  };

  const MockTabsScreen = ({ name }: MockTabsScreenProps): null => {
    mockTabsState.renderedScreens.push(name);
    return null;
  };

  return {
    Tabs: Object.assign(MockTabs, { Screen: MockTabsScreen }),
  };
});

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  const createMockIcon =
    () =>
      (props: Record<string, unknown>): React.JSX.Element =>
        MockReact.createElement(MockView, props);

  return {
    CircleUserRound: createMockIcon(),
    ClipboardList: createMockIcon(),
    ClipboardPlus: createMockIcon(),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  interface MockSafeAreaViewProps {
    children?: React.ReactNode;
    className?: string;
    testID?: string;
  }

  const MockSafeAreaView = ({
    children,
    className,
    testID,
  }: MockSafeAreaViewProps): React.JSX.Element =>
    MockReact.createElement(MockView, { className, testID }, children);

  return {
    SafeAreaView: MockSafeAreaView,
    useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  };
});

jest.mock('@/features/auth', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { Pressable: MockPressable, View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  interface MockLoginProps {
    onSuccess?: () => void | Promise<void>;
  }

  const MockLoginScreenView = ({
    onSuccess,
  }: MockLoginProps): React.JSX.Element =>
    MockReact.createElement(
      MockView,
      { testID: 'mock-login-screen' },
      MockReact.createElement(MockPressable, {
        onPress: onSuccess,
        testID: 'mock-login-success-trigger',
      }),
    );

  return {
    LoginScreenView: MockLoginScreenView,
  };
});

jest.mock('@/features/credit-wizard', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const {
    Pressable: MockPressable,
    Text: MockText,
    View: MockView,
  } = jest.requireActual<typeof import('react-native')>('react-native');

  interface MockWizardProps {
    onClose?: () => void;
    onSubmissionSuccess?: () => void | Promise<void>;
    testID?: string;
  }

  const MockCreditWizardOrchestratorView = ({
    onClose,
    onSubmissionSuccess,
  }: MockWizardProps): React.JSX.Element => {
    const [draftMarker, setDraftMarker] = MockReact.useState<string>('blank');

    MockReact.useEffect(() => {
      mockWizardState.mountCount += 1;
    }, []);

    return MockReact.createElement(
      MockView,
      { testID: 'mock-wizard-orchestrator' },
      MockReact.createElement(
        MockText,
        { testID: 'mock-wizard-draft-state' },
        draftMarker,
      ),
      MockReact.createElement(MockPressable, {
        onPress: () => setDraftMarker('dirty'),
        testID: 'mock-wizard-draft-dirty-trigger',
      }),
      MockReact.createElement(MockPressable, {
        onPress: onClose,
        testID: 'mock-wizard-close-trigger',
      }),
      MockReact.createElement(MockPressable, {
        onPress: onSubmissionSuccess,
        testID: 'mock-wizard-submit-success-trigger',
      }),
    );
  };

  return {
    CreditWizardOrchestratorView: MockCreditWizardOrchestratorView,
  };
});

export interface MockRouterSpies {
  canDismiss: jest.Mock;
  dismissTo: jest.Mock;
  navigate: jest.Mock;
  push: jest.Mock;
  replace: jest.Mock;
}

export class NavigationRoutingPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static getRouterSpies = (): MockRouterSpies =>
    router as unknown as MockRouterSpies;

  public static resetMocks = (): void => {
    const spies = NavigationRoutingPageObject.getRouterSpies();
    spies.canDismiss.mockClear();
    spies.canDismiss.mockReturnValue(true);
    spies.dismissTo.mockClear();
    spies.navigate.mockClear();
    spies.push.mockClear();
    spies.replace.mockClear();
    mockTabsState.activeRouteName = 'historial';
    mockTabsState.renderedScreens = [];
    mockFocusState.latestRecord = null;
    mockWizardState.mountCount = 0;
    jest.mocked(useLocalSearchParams).mockReturnValue({});
    jest.mocked(useFocusEffect).mockClear();
  };

  public static setActiveTabRoute = (
    routeName: 'historial' | 'nuevo-tramite' | 'perfil',
  ): void => {
    mockTabsState.activeRouteName = routeName;
  };

  public static setCanDismiss = (canDismiss: boolean): void => {
    NavigationRoutingPageObject.getRouterSpies().canDismiss.mockReturnValue(
      canDismiss,
    );
  };

  public static setWizardSessionId = (sessionId?: string | string[]): void => {
    jest
      .mocked(useLocalSearchParams)
      .mockReturnValue(sessionId !== undefined ? { sessionId } : {});
  };

  public static triggerTabsFocusReset = (): void => {
    act(() => {
      mockFocusState.latestRecord?.callback?.();
    });
  };

  public static triggerLatestFocusEffectAgain = (): void => {
    act(() => {
      mockFocusState.latestRecord?.callback?.();
    });
  };

  public static flushMicrotasks = async (): Promise<void> => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  public static triggerFocusBlurAndRefocus = (): void => {
    act(() => {
      const record = mockFocusState.latestRecord;
      if (!record) {
        return;
      }

      if (typeof record.cleanup === 'function') {
        record.cleanup();
      }
      record.cleanup = record.callback();
    });
  };

  public static getTabsAnchorRoute = (): string => tabsUnstableSettings.anchor;

  public static getRenderedTabScreenNames = (): string[] => [
    ...mockTabsState.renderedScreens,
  ];

  public static getWizardMountCount = (): number => mockWizardState.mountCount;

  public static renderIndex = (): NavigationRoutingPageObject =>
    new NavigationRoutingPageObject(render(React.createElement(IndexScreen)));

  public static renderTabsLayout = (): NavigationRoutingPageObject =>
    new NavigationRoutingPageObject(render(React.createElement(TabsLayout)));

  public static renderNuevoTramiteFallback = (): NavigationRoutingPageObject =>
    new NavigationRoutingPageObject(
      render(React.createElement(NuevoTramiteFallbackScreen)),
    );

  public static renderCreditWizard = (
    sessionId?: string | string[],
  ): NavigationRoutingPageObject => {
    NavigationRoutingPageObject.setWizardSessionId(sessionId);
    return new NavigationRoutingPageObject(
      render(React.createElement(CreditWizardScreen)),
    );
  };

  public get loginScreen(): ReactTestInstance {
    return this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.LOGIN_SCREEN);
  }

  public get tabsContainer(): ReactTestInstance {
    return this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.TABS_CONTAINER);
  }

  public get nuevoTramiteContainer(): ReactTestInstance {
    return this.screen.getByTestId(
      MOCK_ROUTING_TEST_IDS.NUEVO_TRAMITE_CONTAINER,
    );
  }

  public get newApplicationTab(): ReactTestInstance {
    return this.screen.getByTestId(
      BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_TAB,
    );
  }

  public get historialTab(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.HISTORY_TAB);
  }

  public get perfilTab(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.PROFILE_TAB);
  }

  public get wizardOrchestrator(): ReactTestInstance {
    return this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.WIZARD_ORCHESTRATOR);
  }

  public get wizardDraftState(): ReactTestInstance {
    return this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.WIZARD_DRAFT_STATE);
  }

  public get blankDraftValue(): string {
    return MOCK_WIZARD_DRAFT_VALUES.BLANK;
  }

  public get dirtyDraftValue(): string {
    return MOCK_WIZARD_DRAFT_VALUES.DIRTY;
  }

  public triggerLoginSuccess = (): this => {
    fireEvent.press(
      this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.LOGIN_SUCCESS_TRIGGER),
    );
    return this;
  };

  public pressNewApplicationTab = (): this => {
    fireEvent.press(this.newApplicationTab);
    return this;
  };

  public pressHistorialTab = (): this => {
    fireEvent.press(this.historialTab);
    return this;
  };

  public pressPerfilTab = (): this => {
    fireEvent.press(this.perfilTab);
    return this;
  };

  public markWizardDraftDirty = (): this => {
    fireEvent.press(
      this.screen.getByTestId(
        MOCK_ROUTING_TEST_IDS.WIZARD_DRAFT_DIRTY_TRIGGER,
      ),
    );
    return this;
  };

  public triggerWizardClose = (): this => {
    fireEvent.press(
      this.screen.getByTestId(MOCK_ROUTING_TEST_IDS.WIZARD_CLOSE_TRIGGER),
    );
    return this;
  };

  public triggerWizardSubmissionSuccess = (): this => {
    fireEvent.press(
      this.screen.getByTestId(
        MOCK_ROUTING_TEST_IDS.WIZARD_SUBMIT_SUCCESS_TRIGGER,
      ),
    );
    return this;
  };

  public rerenderCreditWizardWithSession = (
    sessionId?: string | string[],
  ): this => {
    NavigationRoutingPageObject.setWizardSessionId(sessionId);
    this.screen.rerender(React.createElement(CreditWizardScreen));
    return this;
  };

  public unmount = (): this => {
    this.screen.unmount();
    return this;
  };
}
