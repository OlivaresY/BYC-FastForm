import { useCallback, useRef, useState } from 'react';
import { LoginCredentialsSchema } from '../schemas/LoginCredentials.schema';
import type { IAuthProvider } from '../services/auth.service';
import type { LoginCredentials } from '../types/Auth.types';

export const AUTH_VIEW_MODEL_ERRORS = {
  UNEXPECTED_ERROR:
    'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
} as const;

export interface UseAuthViewModelProps {
  authProvider: IAuthProvider;
  onSuccess?: () => void | Promise<void>;
}

export interface UseAuthViewModelReturn {
  authError: string | null;
  clearError: () => void;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
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
        const resolvedMessage =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : AUTH_VIEW_MODEL_ERRORS.UNEXPECTED_ERROR;
        setAuthError(resolvedMessage);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [authProvider, onSuccess],
  );

  return {
    authError,
    clearError,
    isLoading,
    signIn,
  };
};
