import type React from 'react';
import { esCR } from '../../../../shared/i18n/es-CR';
import {
  LOGIN_SCREEN_COLORS,
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

const TEST_FIXTURES = {
  ALT_EMAIL: 'nuevo@corimotors.com',
  INVALID_EMAIL: 'invalid-email',
  PASSWORD_VALUE: 'SecurePass123!',
  RAW_TECHNICAL_ERROR: 'OAuth endpoint returned 401',
  VALID_EMAIL: 'asesor@corimotors.com',
} as const;

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  const createMockIcon =
    (name: string) => (props?: { color?: string; size?: number }) => {
      const viewProps = {
        color: props?.color,
        testID: `mock-lucide-${name}`,
      } as React.ComponentProps<typeof MockView> & { color?: string };
      return MockReact.createElement(MockView, viewProps);
    };

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
    LoginScreenViewPageObject.setupEnvironment();
    mockedUseAuthViewModel.mockReturnValue(createMockAuthViewModel());
  });

  afterEach(() => {
    jest.useRealTimers();
    LoginScreenViewPageObject.teardownEnvironment();
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
    expect(page.getByText(esCR.auth.login.logoSubtitle)).toBeTruthy();

    expect(page.card).toBeTruthy();
    expect(page.getByText(esCR.auth.login.cardTitle)).toBeTruthy();
    expect(page.getByText(esCR.auth.login.cardSubtitle)).toBeTruthy();

    expect(page.emailInput).toBeTruthy();
    expect(page.passwordInput).toBeTruthy();
    expect(page.passwordToggleButton).toBeTruthy();
    expect(page.isPasswordToggleVisuallyDisabled()).toBe(false);
    expect(page.getPasswordToggleIconColor()).toBe(
      LOGIN_SCREEN_COLORS.ICON_SECONDARY,
    );
    expect(page.forgotPasswordButton).toBeTruthy();
    expect(page.submitButton).toBeTruthy();

    expect(page.socialDivider).toBeTruthy();
    expect(page.getByText(esCR.auth.login.dividerText)).toBeTruthy();
    expect(page.googleButton).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.GOOGLE_BUTTON)).toBeTruthy();
    expect(page.facebookButton).toBeTruthy();
    expect(page.getByText(LOGIN_SCREEN_COPY.FACEBOOK_BUTTON)).toBeTruthy();
    expect(page.querySocialNotice()).toBeNull();

    expect(page.footer).toBeTruthy();
    expect(page.getByText(esCR.auth.login.footerSecurity)).toBeTruthy();
    expect(page.getByText(esCR.auth.login.footerCopyright)).toBeTruthy();
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

    page.fillEmail(TEST_FIXTURES.INVALID_EMAIL);
    page.fillPassword(TEST_FIXTURES.PASSWORD_VALUE);

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

    page.fillEmail(TEST_FIXTURES.VALID_EMAIL);
    page.fillPassword(TEST_FIXTURES.PASSWORD_VALUE);

    await page.submit();

    await page.waitForCondition(() => {
      expect(mockVm.signIn).toHaveBeenCalledTimes(1);
    });

    expect(mockVm.signIn).toHaveBeenCalledWith({
      email: TEST_FIXTURES.VALID_EMAIL,
      password: TEST_FIXTURES.PASSWORD_VALUE,
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

    page.fillEmail(TEST_FIXTURES.ALT_EMAIL);
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

  it('locks controls with disabled visuals, ignores password toggle, and prevents double submit while isLoading is true', async () => {
    const idleVm = createMockAuthViewModel();
    mockedUseAuthViewModel.mockReturnValue(idleVm);

    const page = LoginScreenViewPageObject.render();
    page.fillEmail(TEST_FIXTURES.VALID_EMAIL);
    page.fillPassword(TEST_FIXTURES.PASSWORD_VALUE);

    await page.submit();

    await page.waitForCondition(() => {
      expect(idleVm.signIn).toHaveBeenCalledTimes(1);
    });

    const loadingVm = createMockAuthViewModel({ isLoading: true });
    mockedUseAuthViewModel.mockReturnValue(loadingVm);
    page.rerender({ onSuccess: jest.fn() });

    expect(page.submitButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.passwordToggleButton.props.accessibilityState?.disabled).toBe(
      true,
    );
    expect(page.isPasswordToggleVisuallyDisabled()).toBe(true);
    expect(page.getPasswordToggleIconColor()).toBe(
      LOGIN_SCREEN_COLORS.ICON_DISABLED,
    );
    expect(page.forgotPasswordButton.props.accessibilityState?.disabled).toBe(
      true,
    );
    expect(page.googleButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.facebookButton.props.accessibilityState?.disabled).toBe(true);
    expect(page.querySubmitLoader()).toBeTruthy();

    expect(page.passwordInput.props.secureTextEntry).toBe(true);
    page.togglePasswordVisibility();
    expect(page.passwordInput.props.secureTextEntry).toBe(true);

    await page.submit();
    await page.submit();
    expect(loadingVm.signIn).not.toHaveBeenCalled();
  });

  it('displays esCR fallback notices when unconfigured actions are pressed and clears them on input change', async () => {
    const page = LoginScreenViewPageObject.render();

    await page.pressGoogleButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.login.externalProviderNotice,
      );
    });

    page.fillEmail(TEST_FIXTURES.VALID_EMAIL);
    expect(page.querySocialNotice()).toBeNull();

    await page.pressFacebookButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.login.externalProviderNotice,
      );
    });

    page.fillPassword(TEST_FIXTURES.PASSWORD_VALUE);
    expect(page.querySocialNotice()).toBeNull();

    await page.pressForgotPasswordButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.login.forgotPasswordNotice,
      );
    });

    page.fillEmail(TEST_FIXTURES.ALT_EMAIL);
    expect(page.querySocialNotice()).toBeNull();
  });

  it('clears active notice banner immediately on invalid form submit and enforces a single alert banner when authError is present', async () => {
    const mockVm = createMockAuthViewModel();
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    await page.pressGoogleButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.login.externalProviderNotice,
      );
    });

    await page.submit();

    await page.waitForCondition(() => {
      expect(page.queryEmailError()?.props.children).toBe(
        LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED,
      );
      expect(page.queryPasswordError()?.props.children).toBe(
        LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED,
      );
    });

    expect(page.querySocialNotice()).toBeNull();

    const errorVm = createMockAuthViewModel({
      authError: AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    });
    mockedUseAuthViewModel.mockReturnValue(errorVm);
    page.rerender({ onSuccess: jest.fn() });

    await page.pressForgotPasswordButton();

    expect(errorVm.clearError).toHaveBeenCalledTimes(1);
    expect(page.queryAuthError()?.props.children).toBe(
      AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    );
    expect(page.querySocialNotice()).toBeNull();
  });

  it('prevents zombie notice banner from reappearing after authError appears and clears', async () => {
    const idleVm = createMockAuthViewModel({ authError: null });
    mockedUseAuthViewModel.mockReturnValue(idleVm);

    const page = LoginScreenViewPageObject.render();

    await page.pressGoogleButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.login.externalProviderNotice,
      );
    });

    const errorVm = createMockAuthViewModel({
      authError: AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    });
    mockedUseAuthViewModel.mockReturnValue(errorVm);
    page.rerender({ onSuccess: jest.fn() });
    await page.flushMicrotasks();

    expect(page.queryAuthError()?.props.children).toBe(
      AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
    );
    expect(page.querySocialNotice()).toBeNull();

    mockedUseAuthViewModel.mockReturnValue(idleVm);
    page.rerender({ onSuccess: jest.fn() });
    await page.flushMicrotasks();

    expect(page.queryAuthError()).toBeNull();
    expect(page.querySocialNotice()).toBeNull();
  });

  it('prevents synchronous rapid double-submit while a pending signIn promise is in flight before isLoading propagates', async () => {
    let resolveSignIn: (() => void) | undefined;
    const pendingSignIn = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    const mockVm = createMockAuthViewModel({
      isLoading: false,
      signIn: pendingSignIn,
    });
    mockedUseAuthViewModel.mockReturnValue(mockVm);

    const page = LoginScreenViewPageObject.render();

    page.fillEmail(TEST_FIXTURES.VALID_EMAIL);
    page.fillPassword(TEST_FIXTURES.PASSWORD_VALUE);

    await page.doubleSubmit();

    await page.waitForCondition(() => {
      expect(pendingSignIn).toHaveBeenCalledTimes(1);
    });

    resolveSignIn?.();
    await page.flushMicrotasks();

    await page.submit();

    await page.waitForCondition(() => {
      expect(pendingSignIn).toHaveBeenCalledTimes(2);
    });
  });

  it('logs technical error and surfaces only localized unexpectedLoginError when custom Google, Facebook, or forgot-password handlers reject', async () => {
    const technicalError = new Error(TEST_FIXTURES.RAW_TECHNICAL_ERROR);
    const rejectingGoogle = jest.fn().mockRejectedValue(technicalError);
    const rejectingFacebook = jest.fn().mockRejectedValue('non-error-failure');
    const rejectingForgotPassword = jest.fn().mockRejectedValue(new Error(''));

    const page = LoginScreenViewPageObject.render({
      onFacebookPress: rejectingFacebook,
      onForgotPasswordPress: rejectingForgotPassword,
      onGooglePress: rejectingGoogle,
    });

    await page.pressGoogleButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.errors.unexpectedLoginError,
      );
    });
    expect(page.queryByText(TEST_FIXTURES.RAW_TECHNICAL_ERROR)).toBeNull();

    await page.pressFacebookButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.errors.unexpectedLoginError,
      );
    });

    await page.pressForgotPasswordButton();

    await page.waitForCondition(() => {
      expect(page.querySocialNotice()?.props.children).toBe(
        esCR.auth.errors.unexpectedLoginError,
      );
    });

    expect(LoginScreenViewPageObject.getConsoleErrorCalls()).toHaveLength(3);
    expect(LoginScreenViewPageObject.getConsoleErrorCalls()[0]).toEqual([
      '[LoginScreenView] Action handler failed:',
      technicalError,
    ]);
  });

  it('coordinates smart scrollEnabled across idle, password focus, keyboard visibility, and small viewport overflow via useKeyboardAutoScroll', () => {
    const page = LoginScreenViewPageObject.render();

    expect(page.scrollView.props.scrollEnabled).toBe(false);
    expect(page.scrollView.props.bounces).toBe(false);
    expect(page.scrollView.props.overScrollMode).toBe('never');
    expect(page.scrollView.props.contentContainerStyle).toMatchObject({
      flexGrow: 1,
      justifyContent: 'space-between',
    });

    page.focusPassword();
    expect(page.scrollView.props.scrollEnabled).toBe(true);

    page.blurPassword();
    expect(page.scrollView.props.scrollEnabled).toBe(false);

    page.emitKeyboardDidShow(300);
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

    page.triggerScrollViewLayout(500);
    page.triggerScrollViewContentSizeChange(620);
    expect(page.scrollView.props.scrollEnabled).toBe(true);

    page.triggerScrollViewContentSizeChange(480);
    expect(page.scrollView.props.scrollEnabled).toBe(false);
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
