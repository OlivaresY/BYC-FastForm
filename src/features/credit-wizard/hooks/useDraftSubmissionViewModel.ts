import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { esCR } from '@/shared/i18n';
import {
  CREDIT_APPLICATION_SERVICE_ERRORS,
  type ICreditApplicationRepository,
  type SubmitMasterDraftOptions,
} from '../services/creditApplication.service';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export const SUBMISSION_TIMEOUT_MS = 15000 as const;

export type { SubmitMasterDraftOptions };

const IDEMPOTENCY_KEY_PREFIX = 'byc-draft' as const;
const FNV1A_PRIMARY_OFFSET = 0x811c9dc5;
const FNV1A_SECONDARY_OFFSET = 0x811c9dc5 ^ 0x9e3779b9;
const FNV1A_PRIME = 0x01000193;

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

interface InFlightSubmission {
  abortController: AbortController;
  cancelTimeout: () => void;
  idempotencyKey: string;
  promise: Promise<void>;
}

const canonicalizeJsonValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJsonValue);
  }

  if (value !== null && typeof value === 'object') {
    const sortedEntries = Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0))
      .map(([key, entryValue]) => [key, canonicalizeJsonValue(entryValue)]);

    return Object.fromEntries(sortedEntries);
  }

  return value;
};

const computeDeterministicHash = (input: string): string => {
  let primaryHash = FNV1A_PRIMARY_OFFSET >>> 0;
  let secondaryHash = FNV1A_SECONDARY_OFFSET >>> 0;

  for (let index = 0; index < input.length; index += 1) {
    const codeUnit = input.charCodeAt(index);
    primaryHash ^= codeUnit;
    primaryHash = Math.imul(primaryHash, FNV1A_PRIME) >>> 0;
    secondaryHash ^= codeUnit + ((index & 0xff) << 8);
    secondaryHash = Math.imul(secondaryHash, FNV1A_PRIME) >>> 0;
  }

  return `${primaryHash.toString(16).padStart(8, '0')}${secondaryHash.toString(16).padStart(8, '0')}`;
};

export const buildPayloadIdempotencyKey = (
  payload: MasterCreditApplicationPayload,
): string => {
  const serializedPayload = JSON.stringify(canonicalizeJsonValue(payload));
  const payloadHash = computeDeterministicHash(serializedPayload);
  const normalizedUserId = payload.userId.trim();
  return `${IDEMPOTENCY_KEY_PREFIX}-${normalizedUserId}-${payloadHash}`;
};

const awaitWithAbortSignal = <T>(
  operationPromise: Promise<T>,
  signal: AbortSignal,
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const rejectOnAbort = (): void => {
      const abortError = new Error(SUBMISSION_MESSAGES.timeoutErrorMessage);
      abortError.name = 'AbortError';
      reject(abortError);
    };

    if (signal.aborted) {
      rejectOnAbort();
      return;
    }

    signal.addEventListener('abort', rejectOnAbort, { once: true });

    operationPromise.then(
      (value) => {
        signal.removeEventListener('abort', rejectOnAbort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener('abort', rejectOnAbort);
        reject(error);
      },
    );
  });

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
  const isUnmountedRef = useRef<boolean>(false);
  const inFlightSubmissionRef = useRef<InFlightSubmission | null>(null);
  const lastAbortControllerRef = useRef<AbortController | null>(null);

  const serializedAuthorizations = useMemo<string | undefined>(
    () =>
      authorizationValues ? JSON.stringify(authorizationValues) : undefined,
    [authorizationValues],
  );
  const previousAuthorizationsRef = useRef<string | undefined>(
    serializedAuthorizations,
  );

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      inFlightSubmissionRef.current?.cancelTimeout();
      inFlightSubmissionRef.current?.abortController.abort();
      inFlightSubmissionRef.current = null;
      isSubmittingRef.current = false;
    };
  }, []);

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
      const idempotencyKey = buildPayloadIdempotencyKey(payload);
      const existingSubmission = inFlightSubmissionRef.current;

      if (
        existingSubmission &&
        existingSubmission.idempotencyKey === idempotencyKey &&
        !existingSubmission.abortController.signal.aborted
      ) {
        return existingSubmission.promise;
      }

      if (
        isSubmittingRef.current &&
        existingSubmission &&
        !existingSubmission.abortController.signal.aborted
      ) {
        return;
      }

      if (
        lastAbortControllerRef.current &&
        !lastAbortControllerRef.current.signal.aborted
      ) {
        lastAbortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      lastAbortControllerRef.current = abortController;
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);

      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const executionPromise = (async (): Promise<void> => {
        timeoutId = setTimeout(() => {
          abortController.abort();
        }, timeoutMs);

        try {
          let repositoryPromise: Promise<void>;
          try {
            repositoryPromise = Promise.resolve(
              repository.submitMasterDraft(payload, {
                idempotencyKey,
                signal: abortController.signal,
              }),
            );
          } catch (syncError) {
            repositoryPromise = Promise.reject(syncError);
          }

          await awaitWithAbortSignal(repositoryPromise, abortController.signal);

          if (
            abortController.signal.aborted ||
            isUnmountedRef.current ||
            inFlightSubmissionRef.current?.abortController !== abortController
          ) {
            return;
          }

          await onSuccess?.();
        } catch (error) {
          if (
            inFlightSubmissionRef.current?.abortController !==
              abortController ||
            isUnmountedRef.current
          ) {
            return;
          }

          const resolvedErrorMessage = abortController.signal.aborted
            ? SUBMISSION_MESSAGES.timeoutErrorMessage
            : resolveSubmissionErrorMessage(error);
          setSubmitError(resolvedErrorMessage);
        } finally {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }

          if (
            inFlightSubmissionRef.current?.abortController === abortController
          ) {
            inFlightSubmissionRef.current = null;
            isSubmittingRef.current = false;
            if (!isUnmountedRef.current) {
              setIsSubmitting(false);
            }
          }
        }
      })();

      inFlightSubmissionRef.current = {
        abortController,
        cancelTimeout: () => {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
        },
        idempotencyKey,
        promise: executionPromise,
      };

      return executionPromise;
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
