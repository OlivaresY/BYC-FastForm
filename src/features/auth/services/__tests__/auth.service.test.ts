import type { SupabaseClient } from '@supabase/supabase-js';
import {
  AUTH_SERVICE_ERRORS,
  SupabaseAuthProvider,
  mapAuthErrorToSpanishMessage,
} from '../auth.service';

interface MockSupabaseAuthHarness {
  client: SupabaseClient;
  signInWithPasswordMock: jest.Mock;
  signOutMock: jest.Mock;
}

const createMockSupabaseAuthClient = (): MockSupabaseAuthHarness => {
  const signInWithPasswordMock = jest.fn().mockResolvedValue({
    data: {
      user: {
        email: 'asesor@corimotors.cr',
        id: 'advisor-auth-uuid-001',
      },
    },
    error: null,
  });
  const signOutMock = jest.fn().mockResolvedValue({ error: null });

  const client = {
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
    },
  } as unknown as SupabaseClient;

  return {
    client,
    signInWithPasswordMock,
    signOutMock,
  };
};

describe('SupabaseAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes email with trim and lowercase before calling signInWithPassword', async () => {
    const { client, signInWithPasswordMock } = createMockSupabaseAuthClient();
    const provider = new SupabaseAuthProvider(client);

    const user = await provider.signInWithEmail({
      email: '  Asesor.CR@CoriMotors.COM  ',
      password: '  StrongPassword123!  ',
    });

    expect(signInWithPasswordMock).toHaveBeenCalledTimes(1);
    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: 'asesor.cr@corimotors.com',
      password: '  StrongPassword123!  ',
    });
    expect(user).toEqual({
      email: 'asesor@corimotors.cr',
      id: 'advisor-auth-uuid-001',
    });
  });

  it('maps invalid credentials errors to canonical Spanish message', async () => {
    const { client, signInWithPasswordMock } = createMockSupabaseAuthClient();
    signInWithPasswordMock.mockResolvedValueOnce({
      data: { user: null },
      error: {
        code: 'invalid_credentials',
        message: 'Invalid login credentials',
        status: 400,
      },
    });
    const provider = new SupabaseAuthProvider(client);

    await expect(
      provider.signInWithEmail({
        email: 'asesor@corimotors.cr',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);
  });

  it('maps network and timeout failures to Spanish network error message', async () => {
    const { client, signInWithPasswordMock } = createMockSupabaseAuthClient();
    signInWithPasswordMock.mockRejectedValueOnce(
      new TypeError('Network request failed'),
    );
    const provider = new SupabaseAuthProvider(client);

    await expect(
      provider.signInWithEmail({
        email: 'asesor@corimotors.cr',
        password: 'StrongPassword123!',
      }),
    ).rejects.toThrow(AUTH_SERVICE_ERRORS.NETWORK_ERROR);
  });

  it('maps HTTP 429 rate limit responses to Spanish rate-limit error message', () => {
    const message = mapAuthErrorToSpanishMessage({
      code: 'over_request_rate_limit',
      message: 'Request rate limit reached',
      status: 429,
    });

    expect(message).toBe(AUTH_SERVICE_ERRORS.RATE_LIMITED);
  });

  it('sanitizes arbitrary internal SDK and Postgres errors without leaking raw strings', async () => {
    const { client, signInWithPasswordMock } = createMockSupabaseAuthClient();
    signInWithPasswordMock.mockRejectedValueOnce(
      new Error('Postgres internal: relation auth.users failed'),
    );
    const provider = new SupabaseAuthProvider(client);

    let caughtError: unknown;
    try {
      await provider.signInWithEmail({
        email: 'asesor@corimotors.cr',
        password: 'StrongPassword123!',
      });
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(Error);
    const errorMessage = (caughtError as Error).message;
    expect(errorMessage).toBe(AUTH_SERVICE_ERRORS.SERVICE_ERROR);
    expect(errorMessage).not.toContain('Postgres');
    expect(errorMessage).not.toContain('auth.users');
  });

  it('invokes supabase.auth.signOut() explicitly to revoke active tokens', async () => {
    const { client, signOutMock } = createMockSupabaseAuthClient();
    const provider = new SupabaseAuthProvider(client);

    await expect(provider.signOut()).resolves.toBeUndefined();
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('sanitizes signOut SDK errors without exposing internal details', async () => {
    const { client, signOutMock } = createMockSupabaseAuthClient();
    signOutMock.mockResolvedValueOnce({
      error: {
        message: 'Internal token revocation failure on auth.sessions',
        status: 500,
      },
    });
    const provider = new SupabaseAuthProvider(client);

    let caughtError: unknown;
    try {
      await provider.signOut();
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(Error);
    const errorMessage = (caughtError as Error).message;
    expect(errorMessage).toBe(AUTH_SERVICE_ERRORS.SIGNOUT_ERROR);
    expect(errorMessage).not.toContain('auth.sessions');
  });
});
