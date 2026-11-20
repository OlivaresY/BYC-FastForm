import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthUser, LoginCredentials } from '../types/Auth.types';

export const AUTH_SERVICE_ERRORS = {
  INVALID_CREDENTIALS: esCR.auth.errors.invalidCredentials,
  NETWORK_ERROR: esCR.auth.errors.networkError,
  RATE_LIMITED: esCR.auth.errors.rateLimited,
  SERVICE_ERROR: esCR.auth.errors.serviceError,
  SIGNOUT_ERROR: esCR.auth.errors.signOutError,
} as const;

const INVALID_CREDENTIALS_STATUS = 400;
const INVALID_CREDENTIALS_CODE = 'invalid_credentials' as const;
const INVALID_CREDENTIALS_FRAGMENT = 'invalid login credentials' as const;
const RATE_LIMIT_STATUS = 429;
const NETWORK_TIMEOUT_STATUS = 408;
const GATEWAY_TIMEOUT_STATUS = 504;

const CURATED_SERVICE_ERROR_MESSAGES = new Set<string>(
  Object.values(AUTH_SERVICE_ERRORS),
);

interface AuthErrorLike {
  code?: unknown;
  message?: unknown;
  name?: unknown;
  status?: unknown;
}

const isAuthErrorLike = (error: unknown): error is AuthErrorLike =>
  typeof error === 'object' && error !== null;

export interface IAuthProvider {
  signInWithEmail: (credentials: LoginCredentials) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

/**
 * Sanitizes any Supabase SDK auth error or unexpected runtime exception into
 * a deterministic Spanish message without leaking internal strings.
 */
export const mapAuthErrorToSpanishMessage = (
  error: unknown,
  fallbackMessage: string = AUTH_SERVICE_ERRORS.SERVICE_ERROR,
): string => {
  if (!isAuthErrorLike(error)) {
    return fallbackMessage;
  }

  const normalizedCode =
    typeof error.code === 'string' ? error.code.toLowerCase() : '';
  const normalizedMessage =
    typeof error.message === 'string' ? error.message.toLowerCase() : '';
  const normalizedName =
    typeof error.name === 'string' ? error.name.toLowerCase() : '';
  const status = typeof error.status === 'number' ? error.status : undefined;

  if (
    normalizedCode === INVALID_CREDENTIALS_CODE ||
    normalizedMessage.includes(INVALID_CREDENTIALS_FRAGMENT) ||
    (status === INVALID_CREDENTIALS_STATUS &&
      normalizedMessage.includes('invalid'))
  ) {
    return AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS;
  }

  if (
    status === RATE_LIMIT_STATUS ||
    normalizedCode === 'over_request_rate_limit' ||
    normalizedCode === 'over_email_send_rate_limit' ||
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('too many requests')
  ) {
    return AUTH_SERVICE_ERRORS.RATE_LIMITED;
  }

  if (
    status === 0 ||
    status === NETWORK_TIMEOUT_STATUS ||
    status === GATEWAY_TIMEOUT_STATUS ||
    normalizedName.includes('retryablefetcherror') ||
    normalizedName === 'aborterror' ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('timeout') ||
    normalizedMessage.includes('timed out') ||
    normalizedMessage.includes('econn')
  ) {
    return AUTH_SERVICE_ERRORS.NETWORK_ERROR;
  }

  return fallbackMessage;
};

export class SupabaseAuthProvider implements IAuthProvider {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  public readonly signInWithEmail = async (
    credentials: LoginCredentials,
  ): Promise<AuthUser> => {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: normalizedEmail,
        password: credentials.password,
      });

      if (error) {
        throw new Error(mapAuthErrorToSpanishMessage(error));
      }

      if (!data.user) {
        throw new Error(AUTH_SERVICE_ERRORS.SERVICE_ERROR);
      }

      return {
        email: data.user.email?.trim().toLowerCase() ?? normalizedEmail,
        id: data.user.id,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        CURATED_SERVICE_ERROR_MESSAGES.has(error.message)
      ) {
        throw error;
      }

      throw new Error(
        mapAuthErrorToSpanishMessage(error, AUTH_SERVICE_ERRORS.SERVICE_ERROR),
      );
    }
  };

  public readonly signOut = async (): Promise<void> => {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        throw new Error(
          mapAuthErrorToSpanishMessage(
            error,
            AUTH_SERVICE_ERRORS.SIGNOUT_ERROR,
          ),
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        CURATED_SERVICE_ERROR_MESSAGES.has(error.message)
      ) {
        throw error;
      }

      throw new Error(
        mapAuthErrorToSpanishMessage(error, AUTH_SERVICE_ERRORS.SIGNOUT_ERROR),
      );
    }
  };
}

export const supabaseAuthProvider: IAuthProvider = new SupabaseAuthProvider();
