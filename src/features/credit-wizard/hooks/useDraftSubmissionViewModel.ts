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

const SHA256_INITIAL_HASH: readonly number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];

const SHA256_ROUND_CONSTANTS: readonly number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const UTF8_REPLACEMENT_BYTES: readonly number[] = [0xef, 0xbf, 0xbd];

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

const encodeUtf8Bytes = (input: string): number[] => {
  const bytes: number[] = [];

  for (let index = 0; index < input.length; index += 1) {
    const codeUnit = input.charCodeAt(index);

    if (codeUnit < 0x80) {
      bytes.push(codeUnit);
    } else if (codeUnit < 0x800) {
      bytes.push(0xc0 | (codeUnit >> 6), 0x80 | (codeUnit & 0x3f));
    } else if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit =
        index + 1 < input.length ? input.charCodeAt(index + 1) : 0;

      if (nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff) {
        const codePoint =
          0x10000 + (((codeUnit & 0x3ff) << 10) | (nextCodeUnit & 0x3ff));
        bytes.push(
          0xf0 | (codePoint >> 18),
          0x80 | ((codePoint >> 12) & 0x3f),
          0x80 | ((codePoint >> 6) & 0x3f),
          0x80 | (codePoint & 0x3f),
        );
        index += 1;
      } else {
        bytes.push(...UTF8_REPLACEMENT_BYTES);
      }
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      bytes.push(...UTF8_REPLACEMENT_BYTES);
    } else {
      bytes.push(
        0xe0 | (codeUnit >> 12),
        0x80 | ((codeUnit >> 6) & 0x3f),
        0x80 | (codeUnit & 0x3f),
      );
    }
  }

  return bytes;
};

const rotateRight = (value: number, bits: number): number =>
  (value >>> bits) | (value << (32 - bits));

const computeSha256Hex = (input: string): string => {
  const utf8Bytes = encodeUtf8Bytes(input);
  const originalByteLength = utf8Bytes.length;
  const bitLength = originalByteLength * 8;

  const paddedBytes = [...utf8Bytes, 0x80];
  while ((paddedBytes.length + 8) % 64 !== 0) {
    paddedBytes.push(0);
  }

  const highBitLengthWord = Math.floor(bitLength / 0x100000000) >>> 0;
  const lowBitLengthWord = bitLength >>> 0;

  paddedBytes.push(
    (highBitLengthWord >>> 24) & 0xff,
    (highBitLengthWord >>> 16) & 0xff,
    (highBitLengthWord >>> 8) & 0xff,
    highBitLengthWord & 0xff,
    (lowBitLengthWord >>> 24) & 0xff,
    (lowBitLengthWord >>> 16) & 0xff,
    (lowBitLengthWord >>> 8) & 0xff,
    lowBitLengthWord & 0xff,
  );

  const hashState = [...SHA256_INITIAL_HASH];
  const wordSchedule = new Array<number>(64);

  for (let offset = 0; offset < paddedBytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const byteIndex = offset + index * 4;
      wordSchedule[index] =
        ((paddedBytes[byteIndex] << 24) |
          (paddedBytes[byteIndex + 1] << 16) |
          (paddedBytes[byteIndex + 2] << 8) |
          paddedBytes[byteIndex + 3]) >>>
        0;
    }

    for (let index = 16; index < 64; index += 1) {
      const wordMinus15 = wordSchedule[index - 15];
      const wordMinus2 = wordSchedule[index - 2];
      const s0 =
        rotateRight(wordMinus15, 7) ^
        rotateRight(wordMinus15, 18) ^
        (wordMinus15 >>> 3);
      const s1 =
        rotateRight(wordMinus2, 17) ^
        rotateRight(wordMinus2, 19) ^
        (wordMinus2 >>> 10);
      wordSchedule[index] =
        (wordSchedule[index - 16] + s0 + wordSchedule[index - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hashState;

    for (let index = 0; index < 64; index += 1) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 =
        (h +
          s1 +
          choice +
          SHA256_ROUND_CONSTANTS[index] +
          wordSchedule[index]) >>>
        0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hashState[0] = (hashState[0] + a) >>> 0;
    hashState[1] = (hashState[1] + b) >>> 0;
    hashState[2] = (hashState[2] + c) >>> 0;
    hashState[3] = (hashState[3] + d) >>> 0;
    hashState[4] = (hashState[4] + e) >>> 0;
    hashState[5] = (hashState[5] + f) >>> 0;
    hashState[6] = (hashState[6] + g) >>> 0;
    hashState[7] = (hashState[7] + h) >>> 0;
  }

  return hashState
    .map((word) => (word >>> 0).toString(16).padStart(8, '0'))
    .join('');
};

export const buildPayloadIdempotencyKey = (
  payload: MasterCreditApplicationPayload,
): string => {
  const serializedPayload = JSON.stringify(canonicalizeJsonValue(payload));
  const sha256Hex = computeSha256Hex(serializedPayload);
  const normalizedUserId = payload.userId.trim();
  return `${IDEMPOTENCY_KEY_PREFIX}-${normalizedUserId}-${sha256Hex}`;
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
          let repositoryPromise: Promise<unknown>;
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
