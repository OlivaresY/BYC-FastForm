import { MAINTENANCE_MODAL_COPY, useMaintenanceStatus } from '@/features/auth';
import { RootLayoutPageObject } from './_layout.po';

jest.mock('../../../global.css', () => ({}));

jest.mock('@/features/auth', () => {
  const actual =
    jest.requireActual<typeof import('@/features/auth')>('@/features/auth');

  return {
    ...actual,
    useMaintenanceStatus: jest.fn((props) =>
      actual.useMaintenanceStatus(props),
    ),
  };
});

jest.mock('expo-router', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  interface MockStackProps {
    children?: React.ReactNode;
    screenOptions?: Record<string, unknown>;
  }

  const MockStack = ({ children }: MockStackProps): React.JSX.Element =>
    MockReact.createElement(MockView, { testID: 'mock-root-stack' }, children);

  const MockStackScreen = (): null => null;

  return {
    Stack: Object.assign(MockStack, { Screen: MockStackScreen }),
  };
});

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    Wrench: () => MockReact.createElement(MockView, { testID: 'mock-wrench' }),
  };
});

describe('RootLayout global MaintenanceModalView integration', () => {
  const originalMaintenanceFlag = process.env.EXPO_PUBLIC_MAINTENANCE_MODE;
  const originalStorybookFlag = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_STORYBOOK_ENABLED = 'false';
    delete process.env.EXPO_PUBLIC_MAINTENANCE_MODE;
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_MAINTENANCE_MODE = originalMaintenanceFlag;
    process.env.EXPO_PUBLIC_STORYBOOK_ENABLED = originalStorybookFlag;
  });

  it('renders MaintenanceModalView globally blocking interaction when EXPO_PUBLIC_MAINTENANCE_MODE is true', () => {
    process.env.EXPO_PUBLIC_MAINTENANCE_MODE = 'true';

    const page = RootLayoutPageObject.render();

    expect(page.stack).toBeTruthy();
    expect(page.maintenanceModal.props.visible).toBe(true);
    expect(page.maintenanceTitle.props.children).toBe(
      MAINTENANCE_MODAL_COPY.TITLE,
    );
    expect(page.maintenanceBody.props.children).toBe(
      MAINTENANCE_MODAL_COPY.BODY,
    );
  });

  it('renders MaintenanceModalView with custom backend maintenance message when useMaintenanceStatus is active', () => {
    const customMessage = 'Mantenimiento de emergencia en servicios centrales.';
    jest.mocked(useMaintenanceStatus).mockReturnValueOnce({
      isMaintenanceActive: true,
      maintenanceMessage: customMessage,
      recheckMaintenance: jest.fn(),
    });

    const page = RootLayoutPageObject.render();

    expect(page.stack).toBeTruthy();
    expect(page.maintenanceModal.props.visible).toBe(true);
    expect(page.maintenanceTitle.props.children).toBe(
      MAINTENANCE_MODAL_COPY.TITLE,
    );
    expect(page.maintenanceBody.props.children).toBe(customMessage);
  });

  it('renders normal Stack routes without blocking maintenance modal when maintenance mode is inactive', () => {
    jest.mocked(useMaintenanceStatus).mockReturnValueOnce({
      isMaintenanceActive: false,
      maintenanceMessage: undefined,
      recheckMaintenance: jest.fn(),
    });

    const page = RootLayoutPageObject.render();

    expect(page.stack).toBeTruthy();
    expect(page.queryMaintenanceModal()).toBeNull();
    expect(page.queryMaintenanceTitle()).toBeNull();
    expect(page.queryMaintenanceBody()).toBeNull();
  });
});
