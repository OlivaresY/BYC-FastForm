import { useCallback, useRef, useState } from 'react';
import { esCR } from '@/shared/i18n';
import { LoginCredentialsSchema } from '../schemas/LoginCredentials.schema';
import {
  AUTH_SERVICE_ERRORS,
  type IAuthProvider,
} from '../services/auth.service';
import type { LoginCredentials } from '../types/Auth.types';

export const AUTH_VIEW_MODEL_ERRORS = {
  UNEXPECTED_ERROR: esCR.auth.errors.unexpectedLoginError,
} as const;

const PRESERVED_AUTH_ERROR_MESSAGES = new Set<string>([
  AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS,
  AUTH_SERVICE_ERRORS.NETWORK_ERROR,
  AUTH_SERVICE_ERRORS.RATE_LIMITED,
  AUTH_SERVICE_ERRORS.SERVICE_ERROR,
  AUTH_SERVICE_ERRORS.SIGNOUT_ERROR,
  AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR,
]);

export const resolveAuthErrorMessage = (error: unknown): string => {
  if (
    error instanceof Error &&
    PRESERVED_AUTH_ERROR_MESSAGES.has(error.message)
  ) {
    return error.message;
  }

  return AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR;
};

export interface UseAuthViewModelProps {
  authProvider: IAuthProvider;
  onSuccess?: () => void | Promise<void>;
}

export interface UseAuthViewModelReturn {
  authError: string | null;
  clearError: () => void;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut?: () => Promise<void>;
}

export const useAuthViewModel = ({
  authProvider,
  onSuccess,
}: UseAuthViewModelProps): UseAuthViewModelReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  const clearError = useCallback((): void => {
    setAuthError(null);
  }, []);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      if (isLoadingRef.current) {
        return;
      }

      setAuthError(null);

      const validationResult = LoginCredentialsSchema.safeParse(credentials);
      if (!validationResult.success) {
        const firstIssueMessage =
          validationResult.error.issues[0]?.message ??
          AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR;
        setAuthError(firstIssueMessage);
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        await authProvider.signInWithEmail(validationResult.data);
        await onSuccess?.();
      } catch (error) {
        setAuthError(resolveAuthErrorMessage(error));
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [authProvider, onSuccess],
  );

  const signOut = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    setAuthError(null);
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      await authProvider.signOut();
    } catch (error) {
      setAuthError(resolveAuthErrorMessage(error));
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [authProvider]);

  return {
    authError,
    clearError,
    isLoading,
    signIn,
    signOut,
  };
};
