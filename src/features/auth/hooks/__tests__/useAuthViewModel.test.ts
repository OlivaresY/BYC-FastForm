import { LOGIN_CREDENTIALS_ERRORS } from '../../schemas/LoginCredentials.schema';
import {
  AUTH_SERVICE_ERRORS,
  type IAuthProvider,
} from '../../services/auth.service';
import type { AuthUser, LoginCredentials } from '../../types/Auth.types';
import { AUTH_VIEW_MODEL_ERRORS } from '../useAuthViewModel';
import { AuthViewModelPageObject } from './useAuthViewModel.po';

const validCredentials: LoginCredentials = {
  email: 'asesor@corimotors.cr',
  password: 'StrongPassword123!',
};

const mockAuthUser: AuthUser = {
  email: 'asesor@corimotors.cr',
  id: 'advisor-auth-uuid-001',
};

const createMockAuthProvider = (
  overrides?: Partial<IAuthProvider>,
): IAuthProvider => ({
  signInWithEmail: jest.fn().mockResolvedValue(mockAuthUser),
  signOut: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('useAuthViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with isLoading false and authError null', () => {
    const authProvider = createMockAuthProvider();
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    expect(page.isLoading).toBe(false);
    expect(page.authError).toBeNull();
    expect(authProvider.signInWithEmail).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('toggles isLoading during successful sign-in and triggers onSuccess with normalized lowercase email', async () => {
    let resolveSignIn!: (user: AuthUser) => void;
    const signInPromise = new Promise<AuthUser>((resolve) => {
      resolveSignIn = resolve;
    });
    const signInWithEmail = jest.fn().mockReturnValue(signInPromise);
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    const pendingCall = page.startSignIn({
      email: '  Asesor@CoriMotors.CR  ',
      password: validCredentials.password,
    });

    expect(page.isLoading).toBe(true);
    expect(page.authError).toBeNull();
    expect(signInWithEmail).toHaveBeenCalledTimes(1);
    expect(signInWithEmail).toHaveBeenCalledWith(validCredentials);
    expect(onSuccess).not.toHaveBeenCalled();

    await page.settle(async () => {
      resolveSignIn(mockAuthUser);
      await pendingCall;
    });

    expect(page.isLoading).toBe(false);
    expect(page.authError).toBeNull();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('prevents concurrent duplicate sign-in requests while loading', async () => {
    let resolveSignIn!: (user: AuthUser) => void;
    const signInPromise = new Promise<AuthUser>((resolve) => {
      resolveSignIn = resolve;
    });
    const signInWithEmail = jest.fn().mockReturnValue(signInPromise);
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    const firstCall = page.startSignIn(validCredentials);
    const secondCall = page.startSignIn(validCredentials);

    expect(signInWithEmail).toHaveBeenCalledTimes(1);

    await page.settle(async () => {
      resolveSignIn(mockAuthUser);
      await Promise.all([firstCall, secondCall]);
    });

    expect(page.isLoading).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('blocks provider invocation and sets authError when schema validation fails', async () => {
    const signInWithEmail = jest.fn().mockResolvedValue(mockAuthUser);
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    await page.signIn({
      email: 'not-a-valid-email',
      password: 'StrongPassword123!',
    });

    expect(page.isLoading).toBe(false);
    expect(page.authError).toBe(LOGIN_CREDENTIALS_ERRORS.EMAIL_INVALID);
    expect(signInWithEmail).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('blocks provider invocation when password is empty', async () => {
    const signInWithEmail = jest.fn().mockResolvedValue(mockAuthUser);
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    await page.signIn({
      email: 'asesor@corimotors.cr',
      password: '',
    });

    expect(page.isLoading).toBe(false);
    expect(page.authError).toBe(LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED);
    expect(signInWithEmail).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('preserves canonical curated domain error message and resets isLoading when provider rejects', async () => {
    let rejectSignIn!: (error: Error) => void;
    const signInPromise = new Promise<AuthUser>((_, reject) => {
      rejectSignIn = reject;
    });
    const signInWithEmail = jest.fn().mockReturnValue(signInPromise);
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    const pendingCall = page.startSignIn(validCredentials);

    expect(page.isLoading).toBe(true);

    await page.settle(async () => {
      rejectSignIn(new Error(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS));
      await pendingCall;
    });

    expect(page.isLoading).toBe(false);
    expect(page.authError).toBe(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('never leaks arbitrary internal or Postgres error strings and returns Spanish fallback', async () => {
    const signInWithEmail = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Postgres internal: relation auth.users failed'),
      )
      .mockRejectedValueOnce('raw failure');
    const authProvider = createMockAuthProvider({ signInWithEmail });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    await page.signIn(validCredentials);
    expect(page.isLoading).toBe(false);
    expect(page.authError).toBe(AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR);
    expect(page.authError).not.toContain('Postgres');
    expect(page.authError).not.toContain('auth.users');

    await page.signIn(validCredentials);
    expect(page.authError).toBe(AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('clears authError when clearError is invoked', async () => {
    const authProvider = createMockAuthProvider({
      signInWithEmail: jest
        .fn()
        .mockRejectedValue(new Error(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS)),
    });
    const onSuccess = jest.fn();

    const page = AuthViewModelPageObject.render({ authProvider, onSuccess });

    await page.signIn(validCredentials);
    expect(page.authError).toBe(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);

    page.clearError();
    expect(page.authError).toBeNull();
  });

  it('delegates signOut cleanly and sanitizes unexpected signOut failures', async () => {
    const signOutMock = jest
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Raw signout SDK failure'));
    const authProvider = createMockAuthProvider({ signOut: signOutMock });
    const page = AuthViewModelPageObject.render({ authProvider });

    await page.signOut();
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(page.authError).toBeNull();
    expect(page.isLoading).toBe(false);

    await page.signOut();
    expect(signOutMock).toHaveBeenCalledTimes(2);
    expect(page.authError).toBe(AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR);
    expect(page.isLoading).toBe(false);
  });
});
