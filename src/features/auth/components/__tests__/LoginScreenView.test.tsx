import {
  LOGIN_SCREEN_COPY,
  LOGIN_SCREEN_NUMERICAL,
} from '../../constants/LoginScreenView.constants';
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
    AlertCircle: createMockIcon('alert-circle'),
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

  it('renders CoriMotors | BYC Header, Badge, Logo, Login Card with O CONTINUAR CON social row, and HTTPS/TLS Footer with idle scroll disabled', () => {
    const page = LoginScreenViewPageObject.render();

    expect(page.header).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.BRAND_CORIMOTORS)).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.BRAND_SEPARATOR_BYC)).toBeTruthy();

    expect(page.scrollView.props.scrollEnabled).toBe(false);
    expect(page.scrollView.props.bounces).toBe(false);
    expect(page.scrollView.props.overScrollMode).toBe('never');

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

    expect(page.socialDivider).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.DIVIDER_TEXT)).toBeTruthy();
    expect(page.googleButton).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.GOOGLE_BUTTON)).toBeTruthy();
    expect(page.facebookButton).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.FACEBOOK_BUTTON)).toBeTruthy();
    expect(page.querySocialNotice()).toBeNull();

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
      expect(page.emailInput.props['aria-invalid']).toBe(true);
      expect(page.passwordInput.props['aria-invalid']).toBe(true);
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

  it('disables submit, forgot password, Google, and Facebook buttons and renders loader spinner when isLoading is true', () => {
    const mockVm = createMockAuthViewModel({ isLoading: true });
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    expect(page.submitButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.passwordToggleButton.props.accessibilityState?.disabled).toBe(
      true,
    );
    expect(page.forgotPasswordButton.props.accessibilityState?.disabled).toBe(
      true,
    );
    expect(page.googleButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.facebookButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.querySubmitLoader()).toBeTruthy();
  });

  it('displays exact Spanish notice when pressing Google or Facebook without external handlers and clears it on input change', async () => {
    const page = LoginScreenViewPageObject.render();

    await page.pressGoogleButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        'El acceso con Google o Facebook no está habilitado. Inicia sesión con tu correo y contraseña.',
      );
      expect(page.querySocialNotice()?.props.children).toBe(
        LOGIN_SCREEN_COPY.EXTERNAL_PROVIDER_NOTICE,
      );
    });

    page.fillEmail('asesor@corimotors.com');
    expect(page.querySocialNotice()).toBeNull();

    await page.pressFacebookButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        LOGIN_SCREEN_COPY.EXTERNAL_PROVIDER_NOTICE,
      );
    });

    page.fillPassword('Secret123!');
    expect(page.querySocialNotice()).toBeNull();
  });

  it('displays forgot-password Spanish notice when pressed without handler and clears it on input change', async () => {
    const page = LoginScreenViewPageObject.render();

    await page.pressForgotPasswordButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        'Para restablecer tu contraseña, contacta al administrador del sistema.',
      );
      expect(page.querySocialNotice()?.props.children).toBe(
        LOGIN_SCREEN_COPY.FORGOT_PASSWORD_NOTICE,
      );
    });

    page.fillEmail('asesor@corimotors.com');
    expect(page.querySocialNotice()).toBeNull();
  });

  it('enables scroll and switches contentContainerStyle to flex-start while soft keyboard is visible', () => {
    const page = LoginScreenViewPageObject.render();

    expect(page.scrollView.props.scrollEnabled).toBe(false);
    expect(page.scrollView.props.contentContainerStyle).toMatchObject({
      flexGrow: 1,
      justifyContent: 'space-between',
    });

    page.emitKeyboardDidShow();
    expect(page.scrollView.props.scrollEnabled).toBe(true);
    expect(page.scrollView.props.contentContainerStyle).toMatchObject({
      flexGrow: 1,
      justifyContent: 'flex-start',
      paddingBottom: LOGIN_SCREEN_NUMERICAL.KEYBOARD_OPEN_PADDING_BOTTOM,
    });

    page.emitKeyboardDidHide();
    expect(page.scrollView.props.scrollEnabled).toBe(false);
    expect(page.scrollView.props.contentContainerStyle).toMatchObject({
      flexGrow: 1,
      justifyContent: 'space-between',
    });
  });

  it('invokes custom onForgotPasswordPress, onGooglePress, and onFacebookPress callbacks without showing fallback notice', async () => {
    const handleForgotPasswordPress = jest.fn().mockResolvedValue(undefined);
    const handleGooglePress = jest.fn().mockResolvedValue(undefined);
    const handleFacebookPress = jest.fn().mockResolvedValue(undefined);

    const page = LoginScreenViewPageObject.render({
      onFacebookPress: handleFacebookPress,
      onForgotPasswordPress: handleForgotPasswordPress,
      onGooglePress: handleGooglePress,
    });

    await page.pressForgotPasswordButton();
    await page.pressGoogleButton();
    await page.pressFacebookButton();

    expect(handleForgotPasswordPress).toHaveBeenCalledTimes(1);
    expect(handleGooglePress).toHaveBeenCalledTimes(1);
    expect(handleFacebookPress).toHaveBeenCalledTimes(1);
    expect(page.querySocialNotice()).toBeNull();
  });
});
