import { useCallback, useRef, useState } from 'react';
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
import { useDraftSubmissionViewModel } from './useDraftSubmissionViewModel';

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

export const MOCK_AUTH_USER_ID = 'mock-uuid-until-auth' as const;

export interface CreditWizardDraftState {
  step1?: ApplicantStepData;
  step2?: LegalEntityContact | PhysicalPersonContact;
  step3?: VehicleCreditFormValues;
  step4?: BankAuthorizationsFormValues;
}

export interface UseCreditWizardOrchestratorProps {
  onSubmissionSuccess?: () => void | Promise<void>;
  repository?: ICreditApplicationRepository;
  userId?: string;
}

export interface UseCreditWizardOrchestratorReturn {
  currentStep: WizardStepNumber;
  draftState: CreditWizardDraftState;
  handlePreviousStep: () => void;
  handleStep1Submit: (data?: ApplicantStepData) => void;
  handleStep2Submit: (data: LegalEntityContact | PhysicalPersonContact) => void;
  handleStep3Submit: (data: VehicleCreditFormValues) => void;
  handleStep4Submit: (step4Data: BankAuthorizationsFormValues) => Promise<void>;
  isSubmitting: boolean;
  resetDraft: () => void;
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
    userId = MOCK_AUTH_USER_ID,
  } = props ?? {};

  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(
    WIZARD_STEPS.STEP_1,
  );
  const [draftState, setDraftState] = useState<CreditWizardDraftState>({});
  const draftStateRef = useRef<CreditWizardDraftState>({});

  const resetDraft = useCallback((): void => {
    draftStateRef.current = {};
    setDraftState({});
    setCurrentStep(WIZARD_STEPS.STEP_1);
  }, []);

  const handleSubmissionComplete = useCallback(async (): Promise<void> => {
    draftStateRef.current = {};
    setDraftState({});
    await onSubmissionSuccess?.();
  }, [onSubmissionSuccess]);

  const { isSubmitting, submitDraft } = useDraftSubmissionViewModel({
    onSuccess: handleSubmissionComplete,
    repository,
  });

  const handleStep1Submit = useCallback((data?: ApplicantStepData): void => {
    if (!data) {
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
    setCurrentStep((previousStep): WizardStepNumber => {
      if (previousStep === WIZARD_STEPS.STEP_4) {
        return WIZARD_STEPS.STEP_3;
      }
      if (previousStep === WIZARD_STEPS.STEP_3) {
        return WIZARD_STEPS.STEP_2;
      }
      return WIZARD_STEPS.STEP_1;
    });
  }, []);

  const handleStep4Submit = useCallback(
    async (step4Data: BankAuthorizationsFormValues): Promise<void> => {
      const nextState: CreditWizardDraftState = {
        ...draftStateRef.current,
        step4: step4Data,
      };

      draftStateRef.current = nextState;
      setDraftState(nextState);

      const { step1, step2, step3 } = nextState;

      if (!step1 || !step2 || !step3) {
        console.error(
          '[useCreditWizardOrchestrator] Cannot submit incomplete wizard draft.',
        );
        return;
      }

      let aggregatorInput: MasterDraftAggregatorInput;

      if (
        step1.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL &&
        isPhysicalPersonContact(step2)
      ) {
        aggregatorInput = {
          applicant: step1,
          bankAuthorizations: step4Data,
          contact: step2,
          userId,
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
          userId,
          vehicleCredit: step3,
        };
      } else {
        console.error(
          '[useCreditWizardOrchestrator] Step 1 regime does not match Step 2 contact payload.',
        );
        return;
      }

      try {
        const masterPayload = buildMasterSubmissionPayload(aggregatorInput);
        await submitDraft(masterPayload);
      } catch (error) {
        console.error(
          '[useCreditWizardOrchestrator] Master payload validation failed:',
          error,
        );
      }
    },
    [submitDraft, userId],
  );

  return {
    currentStep,
    draftState,
    handlePreviousStep,
    handleStep1Submit,
    handleStep2Submit,
    handleStep3Submit,
    handleStep4Submit,
    isSubmitting,
    resetDraft,
  };
};
