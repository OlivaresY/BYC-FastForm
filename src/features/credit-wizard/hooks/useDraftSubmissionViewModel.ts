import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { esCR } from '@/shared/i18n';
import {
  CREDIT_APPLICATION_SERVICE_ERRORS,
  type ICreditApplicationRepository,
} from '../services/creditApplication.service';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export const SUBMISSION_TIMEOUT_MS = 15000 as const;

const SUBMISSION_MESSAGES = esCR.creditWizard.masterDraftSubmission;

const PRESERVED_DOMAIN_ERROR_MESSAGES = new Set<string>([
  CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED,
  CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED,
  SUBMISSION_MESSAGES.authErrorMessage,
  SUBMISSION_MESSAGES.errorMessage,
  SUBMISSION_MESSAGES.incompleteDraftErrorMessage,
  SUBMISSION_MESSAGES.timeoutErrorMessage,
]);

export interface UseDraftSubmissionViewModelProps {
  authorizationValues?: Partial<BankAuthorizationsFormValues>;
  onSuccess?: () => void | Promise<void>;
  repository: ICreditApplicationRepository;
  timeoutMs?: number;
}

export interface UseDraftSubmissionViewModelReturn {
  clearSubmitError: () => void;
  handleSubmit: (payload: MasterCreditApplicationPayload) => Promise<void>;
  isSubmitting: boolean;
  submitDraft: (payload: MasterCreditApplicationPayload) => Promise<void>;
  submitError: string | null;
}

const executeWithTimeout = async <T>(
  operation: () => Promise<T>,
  timeoutMs: number,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(SUBMISSION_MESSAGES.timeoutErrorMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
};

export const resolveSubmissionErrorMessage = (error: unknown): string => {
  if (error instanceof ZodError) {
    return SUBMISSION_MESSAGES.errorMessage;
  }

  if (
    error instanceof Error &&
    PRESERVED_DOMAIN_ERROR_MESSAGES.has(error.message)
  ) {
    return error.message;
  }

  return SUBMISSION_MESSAGES.errorMessage;
};

export const useDraftSubmissionViewModel = ({
  authorizationValues,
  onSuccess,
  repository,
  timeoutMs = SUBMISSION_TIMEOUT_MS,
}: UseDraftSubmissionViewModelProps): UseDraftSubmissionViewModelReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const serializedAuthorizations = useMemo<string | undefined>(
    () =>
      authorizationValues ? JSON.stringify(authorizationValues) : undefined,
    [authorizationValues],
  );
  const previousAuthorizationsRef = useRef<string | undefined>(
    serializedAuthorizations,
  );

  useEffect(() => {
    if (
      previousAuthorizationsRef.current !== undefined &&
      serializedAuthorizations !== undefined &&
      previousAuthorizationsRef.current !== serializedAuthorizations
    ) {
      setSubmitError(null);
    }
    if (serializedAuthorizations !== undefined) {
      previousAuthorizationsRef.current = serializedAuthorizations;
    }
  }, [serializedAuthorizations]);

  const clearSubmitError = useCallback((): void => {
    setSubmitError(null);
  }, []);

  const submitDraft = useCallback(
    async (payload: MasterCreditApplicationPayload): Promise<void> => {
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await executeWithTimeout(
          () => repository.submitMasterDraft(payload),
          timeoutMs,
        );
        await onSuccess?.();
      } catch (error) {
        setSubmitError(resolveSubmissionErrorMessage(error));
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [onSuccess, repository, timeoutMs],
  );

  return {
    clearSubmitError,
    handleSubmit: submitDraft,
    isSubmitting,
    submitDraft,
    submitError,
  };
};
