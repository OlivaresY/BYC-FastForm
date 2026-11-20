import { LOGIN_SCREEN_COPY } from '../../constants/LoginScreenView.constants';
import {
  useAuthViewModel,
  type UseAuthViewModelReturn,
} from '../../hooks/useAuthViewModel';
import { LOGIN_CREDENTIALS_ERRORS } from '../../schemas/LoginCredentials.schema';
import { AUTH_SERVICE_ERRORS } from '../../services/auth.service';
import { LoginScreenViewPageObject } from './LoginScreenView.po';

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  const createMockIcon = (name: string) => () =>
    MockReact.createElement(MockView, { testID: `mock-lucide-${name}` });

  return {
    ArrowRight: createMockIcon('arrow-right'),
    Car: createMockIcon('car'),
    Eye: createMockIcon('eye'),
    EyeOff: createMockIcon('eye-off'),
    Lock: createMockIcon('lock'),
    Mail: createMockIcon('mail'),
    ShieldCheck: createMockIcon('shield-check'),
  };
});

jest.mock('../../hooks/useAuthViewModel', () => ({
  useAuthViewModel: jest.fn(),
}));

const mockedUseAuthViewModel = jest.mocked(useAuthViewModel);

const createMockAuthViewModel = (
  overrides?: Partial<UseAuthViewModelReturn>,
): UseAuthViewModelReturn => ({
  authError: null,
  clearError: jest.fn(),
  isLoading: false,
  signIn: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('LoginScreenView Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuthViewModel.mockReturnValue(createMockAuthViewModel());
  });

  it('renders Header, Badge, Logo, Login Card, and HTTPS/TLS Footer without non-functional social login buttons', () => {
    const page = LoginScreenViewPageObject.render();

    expect(page.header).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.BRAND_CORIMOTORS)).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.BRAND_SEPARATOR_BYC)).toBeTruthy();

    expect(page.badge).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.BADGE_TEXT)).toBeTruthy();

    expect(page.logo).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.LOGO_SUBTITLE)).toBeTruthy();

    expect(page.card).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.CARD_TITLE)).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.CARD_SUBTITLE)).toBeTruthy();

    expect(page.emailInput).toBeTruthy();
    expect(page.passwordInput).toBeTruthy();
    expect(page.passwordToggleButton).toBeTruthy();
    expect(page.forgotPasswordButton).toBeTruthy();
    expect(page.submitButton).toBeTruthy();

    // Corporate auth only: Google/Facebook social buttons and divider are removed
    expect(page.querySocialDivider()).toBeNull();
    expect(page.queryGoogleButton()).toBeNull();
    expect(page.queryFacebookButton()).toBeNull();
    expect(page.queryByText('Google')).toBeNull();
    expect(page.queryByText('Facebook')).toBeNull();

    expect(page.footer).toBeTruthy();
    expect(
      page.getByText(
        'Conexión cifrada mediante HTTPS/TLS — Uso interno CoriMotors',
      ),
    ).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.FOOTER_SECURITY)).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.FOOTER_COPYRIGHT)).toBeTruthy();
  });

  it('toggles password secureTextEntry visibility when pressing the eye toggle button', () => {
    const page = LoginScreenViewPageObject.render();

    expect(page.passwordInput.props.secureTextEntry).toBe(true);

    page.togglePasswordVisibility();
    expect(page.passwordInput.props.secureTextEntry).toBe(false);

    page.togglePasswordVisibility();
    expect(page.passwordInput.props.secureTextEntry).toBe(true);
  });

  it('shows Zod validation errors and does not call signIn when submitting empty fields', async () => {
    const mockVm = createMockAuthViewModel();
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    await page.submit();

    await page.waitForCondition(() => {
      expect(page.queryEmailError()?.props.children).toBe(
        LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED,
      );
      expect(page.queryPasswordError()?.props.children).toBe(
        LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED,
      );
    });

    expect(mockVm.signIn).not.toHaveBeenCalled();
  });

  it('shows invalid email validation error and blocks signIn when email format is invalid', async () => {
    const mockVm = createMockAuthViewModel();
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    page.fillEmail('invalid-email');
    page.fillPassword('ValidPassword123!');

    await page.submit();

    await page.waitForCondition(() => {
      expect(page.queryEmailError()?.props.children).toBe(
        LOGIN_CREDENTIALS_ERRORS.EMAIL_INVALID,
      );
    });

    expect(page.queryPasswordError()).toBeNull();
    expect(mockVm.signIn).not.toHaveBeenCalled();
  });

  it('calls signIn with validated credentials when form submission is valid', async () => {
    const mockVm = createMockAuthViewModel();
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    page.fillEmail('asesor@corimotors.com');
    page.fillPassword('SecurePass123!');

    await page.submit();

    await page.waitForCondition(() => {
      expect(mockVm.signIn).toHaveBeenCalledTimes(1);
    });

    expect(mockVm.signIn).toHaveBeenCalledWith({
      email: 'asesor@corimotors.com',
      password: 'SecurePass123!',
    });
  });

  it('renders authError message above submit button and clears it on input change', () => {
    const mockVm = createMockAuthViewModel({
      authError: AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    });
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    expect(page.queryAuthError()?.props.children).toBe(
      AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    );

    page.fillEmail('nuevo@corimotors.com');
    expect(mockVm.clearError).toHaveBeenCalledTimes(1);
  });

  it('renders generic sanitized Spanish service error message cleanly when authError is SERVICE_ERROR', () => {
    const mockVm = createMockAuthViewModel({
      authError: AUTH_SERVICE_ERRORS.SERVICE_ERROR,
    });
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    expect(page.queryAuthError()?.props.children).toBe(
      AUTH_SERVICE_ERRORS.SERVICE_ERROR,
    );
  });

  it('disables submit button and renders loader spinner when isLoading is true', () => {
    const mockVm = createMockAuthViewModel({ isLoading: true });
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    expect(page.submitButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.querySubmitLoader()).toBeTruthy();
  });
});
