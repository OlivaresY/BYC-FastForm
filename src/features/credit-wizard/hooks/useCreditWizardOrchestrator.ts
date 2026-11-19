import { useCallback, useRef, useState } from 'react';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../constants/LegalEntitySelector.constants';
import {
  supabaseCreditApplicationRepository,
  type ICreditApplicationRepository,
} from '../services/creditApplication.service';
import type { ApplicantStepData } from '../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';
import type { MasterDraftAggregatorInput } from '../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { buildMasterSubmissionPayload } from '../utils/masterDraftAggregator';
import {
  SUBMISSION_TIMEOUT_MS,
  useDraftSubmissionViewModel,
} from './useDraftSubmissionViewModel';

export const WIZARD_STEPS = {
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
  STEP_4: 4,
  TOTAL_STEPS: 4,
} as const;

export type WizardStepNumber =
  | typeof WIZARD_STEPS.STEP_1
  | typeof WIZARD_STEPS.STEP_2
  | typeof WIZARD_STEPS.STEP_3
  | typeof WIZARD_STEPS.STEP_4;

const SUBMISSION_MESSAGES = esCR.creditWizard.masterDraftSubmission;

const INVALID_SESSION_USER_ID_PATTERN =
  /(?:mock|placeholder|dummy|fake|until-auth)/i;

const isValidAuthenticatedUserId = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 && !INVALID_SESSION_USER_ID_PATTERN.test(trimmed);
};

const defaultResolveAuthenticatedUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) {
    return null;
  }
  return data.user.id;
};

export interface CreditWizardDraftState {
  step1?: ApplicantStepData;
  step2?: LegalEntityContact | PhysicalPersonContact;
  step3?: VehicleCreditFormValues;
  step4?: BankAuthorizationsFormValues;
}

export type AuthenticatedUserIdResolver = () => Promise<string | null>;

export interface UseCreditWizardOrchestratorProps {
  onSubmissionSuccess?: () => void | Promise<void>;
  repository?: ICreditApplicationRepository;
  resolveAuthenticatedUserId?: AuthenticatedUserIdResolver;
  submissionTimeoutMs?: number;
  userId?: string;
}

export interface UseCreditWizardOrchestratorReturn {
  clearSubmitError: () => void;
  currentStep: WizardStepNumber;
  draftState: CreditWizardDraftState;
  handlePreviousStep: () => void;
  handleStep1Submit: (data?: ApplicantStepData) => void;
  handleStep2Submit: (data: LegalEntityContact | PhysicalPersonContact) => void;
  handleStep3Submit: (data: VehicleCreditFormValues) => void;
  handleStep4Submit: (step4Data: BankAuthorizationsFormValues) => Promise<void>;
  hasSubmittedSuccessfully: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  resetDraft: () => void;
  resetWizard: () => void;
  restartWizard: () => void;
  submitError: string | null;
}

const isLegalEntityContact = (
  contact: LegalEntityContact | PhysicalPersonContact,
): contact is LegalEntityContact => 'commercialActivity' in contact;

const isPhysicalPersonContact = (
  contact: LegalEntityContact | PhysicalPersonContact,
): contact is PhysicalPersonContact => 'employmentData' in contact;

export const useCreditWizardOrchestrator = (
  props?: UseCreditWizardOrchestratorProps,
): UseCreditWizardOrchestratorReturn => {
  const {
    onSubmissionSuccess,
    repository = supabaseCreditApplicationRepository,
    resolveAuthenticatedUserId,
    submissionTimeoutMs = SUBMISSION_TIMEOUT_MS,
    userId: explicitUserId,
  } = props ?? {};

  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(
    WIZARD_STEPS.STEP_1,
  );
  const [draftState, setDraftState] = useState<CreditWizardDraftState>({});
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] =
    useState<boolean>(false);
  const [isResolvingAuth, setIsResolvingAuth] = useState<boolean>(false);
  const [orchestrationError, setOrchestrationError] = useState<string | null>(
    null,
  );

  const draftStateRef = useRef<CreditWizardDraftState>({});
  const hasSubmittedSuccessfullyRef = useRef<boolean>(false);
  const isSubmissionLockedRef = useRef<boolean>(false);

  const handleSubmissionComplete = useCallback(async (): Promise<void> => {
    hasSubmittedSuccessfullyRef.current = true;
    draftStateRef.current = {};
    setHasSubmittedSuccessfully(true);
    setDraftState({});
    setOrchestrationError(null);
    await onSubmissionSuccess?.();
  }, [onSubmissionSuccess]);

  const {
    clearSubmitError: clearDraftSubmitError,
    isSubmitting: isDraftSubmitting,
    submitDraft,
    submitError: draftSubmitError,
  } = useDraftSubmissionViewModel({
    onSuccess: handleSubmissionComplete,
    repository,
    timeoutMs: submissionTimeoutMs,
  });

  const clearSubmitError = useCallback((): void => {
    setOrchestrationError(null);
    clearDraftSubmitError();
  }, [clearDraftSubmitError]);

  const resetWizard = useCallback((): void => {
    hasSubmittedSuccessfullyRef.current = false;
    isSubmissionLockedRef.current = false;
    draftStateRef.current = {};
    setHasSubmittedSuccessfully(false);
    setIsResolvingAuth(false);
    setOrchestrationError(null);
    clearDraftSubmitError();
    setDraftState({});
    setCurrentStep(WIZARD_STEPS.STEP_1);
  }, [clearDraftSubmitError]);

  const handleStep1Submit = useCallback((data?: ApplicantStepData): void => {
    if (!data || hasSubmittedSuccessfullyRef.current) {
      return;
    }

    const previousState = draftStateRef.current;
    const isRegimeChanged =
      previousState.step1 !== undefined &&
      previousState.step1.regime !== data.regime;

    const nextState: CreditWizardDraftState = {
      ...previousState,
      step1: data,
      step2: isRegimeChanged ? undefined : previousState.step2,
    };

    draftStateRef.current = nextState;
    setDraftState(nextState);
    setCurrentStep(WIZARD_STEPS.STEP_2);
  }, []);

  const handleStep2Submit = useCallback(
    (data: LegalEntityContact | PhysicalPersonContact): void => {
      if (hasSubmittedSuccessfullyRef.current) {
        return;
      }

      const nextState: CreditWizardDraftState = {
        ...draftStateRef.current,
        step2: data,
      };

      draftStateRef.current = nextState;
      setDraftState(nextState);
      setCurrentStep(WIZARD_STEPS.STEP_3);
    },
    [],
  );

  const handleStep3Submit = useCallback(
    (data: VehicleCreditFormValues): void => {
      if (hasSubmittedSuccessfullyRef.current) {
        return;
      }

      const nextState: CreditWizardDraftState = {
        ...draftStateRef.current,
        step3: data,
      };

      draftStateRef.current = nextState;
      setDraftState(nextState);
      setCurrentStep(WIZARD_STEPS.STEP_4);
    },
    [],
  );

  const handlePreviousStep = useCallback((): void => {
    if (hasSubmittedSuccessfullyRef.current || isSubmissionLockedRef.current) {
      return;
    }

    clearSubmitError();

    setCurrentStep((previousStep): WizardStepNumber => {
      if (previousStep === WIZARD_STEPS.STEP_4) {
        return WIZARD_STEPS.STEP_3;
      }
      if (previousStep === WIZARD_STEPS.STEP_3) {
        return WIZARD_STEPS.STEP_2;
      }
      return WIZARD_STEPS.STEP_1;
    });
  }, [clearSubmitError]);

  const submitMasterFlow = useCallback(
    async (
      authenticatedUserId: string,
      step1: ApplicantStepData,
      step2: LegalEntityContact | PhysicalPersonContact,
      step3: VehicleCreditFormValues,
      step4Data: BankAuthorizationsFormValues,
    ): Promise<void> => {
      let aggregatorInput: MasterDraftAggregatorInput;

      if (
        step1.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL &&
        isPhysicalPersonContact(step2)
      ) {
        aggregatorInput = {
          applicant: step1,
          bankAuthorizations: step4Data,
          contact: step2,
          userId: authenticatedUserId,
          vehicleCredit: step3,
        };
      } else if (
        step1.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL &&
        isLegalEntityContact(step2)
      ) {
        aggregatorInput = {
          applicant: step1,
          bankAuthorizations: step4Data,
          contact: step2,
          userId: authenticatedUserId,
          vehicleCredit: step3,
        };
      } else {
        setOrchestrationError(SUBMISSION_MESSAGES.incompleteDraftErrorMessage);
        return;
      }

      try {
        const masterPayload = buildMasterSubmissionPayload(aggregatorInput);
        await submitDraft(masterPayload);
      } catch {
        setOrchestrationError(SUBMISSION_MESSAGES.errorMessage);
      }
    },
    [submitDraft],
  );

  const handleStep4Submit = useCallback(
    async (step4Data: BankAuthorizationsFormValues): Promise<void> => {
      if (
        hasSubmittedSuccessfullyRef.current ||
        isSubmissionLockedRef.current
      ) {
        return;
      }

      isSubmissionLockedRef.current = true;
      clearSubmitError();

      const nextState: CreditWizardDraftState = {
        ...draftStateRef.current,
        step4: step4Data,
      };

      draftStateRef.current = nextState;
      setDraftState(nextState);

      const { step1, step2, step3 } = nextState;

      if (!step1 || !step2 || !step3) {
        isSubmissionLockedRef.current = false;
        setOrchestrationError(SUBMISSION_MESSAGES.incompleteDraftErrorMessage);
        return;
      }

      if (
        resolveAuthenticatedUserId === undefined &&
        explicitUserId !== undefined
      ) {
        if (!isValidAuthenticatedUserId(explicitUserId)) {
          isSubmissionLockedRef.current = false;
          setOrchestrationError(SUBMISSION_MESSAGES.authErrorMessage);
          return;
        }

        try {
          await submitMasterFlow(
            explicitUserId.trim(),
            step1,
            step2,
            step3,
            step4Data,
          );
        } finally {
          isSubmissionLockedRef.current = false;
        }
        return;
      }

      setIsResolvingAuth(true);
      let resolvedUserId: string | null = null;
      let authFailed = false;

      try {
        const authResolver =
          resolveAuthenticatedUserId ?? defaultResolveAuthenticatedUserId;
        resolvedUserId = await authResolver();
      } catch {
        authFailed = true;
      } finally {
        setIsResolvingAuth(false);
      }

      if (authFailed || !isValidAuthenticatedUserId(resolvedUserId)) {
        isSubmissionLockedRef.current = false;
        setOrchestrationError(SUBMISSION_MESSAGES.authErrorMessage);
        return;
      }

      try {
        await submitMasterFlow(
          resolvedUserId.trim(),
          step1,
          step2,
          step3,
          step4Data,
        );
      } finally {
        isSubmissionLockedRef.current = false;
      }
    },
    [
      clearSubmitError,
      explicitUserId,
      resolveAuthenticatedUserId,
      submitMasterFlow,
    ],
  );

  return {
    clearSubmitError,
    currentStep,
    draftState,
    handlePreviousStep,
    handleStep1Submit,
    handleStep2Submit,
    handleStep3Submit,
    handleStep4Submit,
    hasSubmittedSuccessfully,
    isSubmitted: hasSubmittedSuccessfully,
    isSubmitting: isResolvingAuth || isDraftSubmitting,
    resetDraft: resetWizard,
    resetWizard,
    restartWizard: resetWizard,
    submitError: orchestrationError ?? draftSubmitError,
  };
};
