import { useCallback, useRef, useState } from 'react';
import type { ICreditApplicationRepository } from '../services/creditApplication.service';
import type { MasterCreditApplicationPayload } from '../types/MasterCreditApplication.types';

export interface UseDraftSubmissionViewModelProps {
  onSuccess?: () => void | Promise<void>;
  repository: ICreditApplicationRepository;
}

export interface UseDraftSubmissionViewModelReturn {
  isSubmitting: boolean;
  submitDraft: (payload: MasterCreditApplicationPayload) => Promise<void>;
}

export const useDraftSubmissionViewModel = ({
  onSuccess,
  repository,
}: UseDraftSubmissionViewModelProps): UseDraftSubmissionViewModelReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  const submitDraft = useCallback(
    async (payload: MasterCreditApplicationPayload): Promise<void> => {
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        await repository.submitMasterDraft(payload);
        await onSuccess?.();
      } catch (error) {
        console.error(
          '[useDraftSubmissionViewModel] Failed to submit master draft:',
          error,
        );
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [onSuccess, repository],
  );

  return {
    isSubmitting,
    submitDraft,
  };
};
