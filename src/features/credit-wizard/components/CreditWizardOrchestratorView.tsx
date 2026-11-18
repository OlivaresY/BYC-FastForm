import React from 'react';
import { View } from 'react-native';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../constants/LegalEntitySelector.constants';
import {
  WIZARD_STEPS,
  useCreditWizardOrchestrator,
  type UseCreditWizardOrchestratorReturn,
} from '../hooks/useCreditWizardOrchestrator';
import type { ICreditApplicationRepository } from '../services/creditApplication.service';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';
import { ApplicantStepView } from './ApplicantStepView';
import { BankAuthorizationsStepView } from './BankAuthorizationsStepView';
import { LegalEntityContactStepView } from './LegalEntityContactStepView';
import { PhysicalPersonContactStepView } from './PhysicalPersonContactStepView';
import { VehicleCreditStepView } from './VehicleCreditStepView';
import { WizardProgressHeader } from './WizardProgressHeader';

export const CREDIT_WIZARD_ORCHESTRATOR_STYLES = {
  CONTAINER: 'flex-1 bg-[#F7F7F6]',
  PROGRESS_WRAPPER: 'px-4 pt-2',
  STEP_CONTAINER: 'flex-1',
} as const;

export const CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS = {
  CONTAINER: 'credit-wizard-orchestrator-view',
  PROGRESS_HEADER: 'credit-wizard-orchestrator-progress-header',
  STEP_CONTAINER: 'credit-wizard-orchestrator-step-container',
} as const;

export interface CreditWizardOrchestratorViewProps {
  onClose?: () => void;
  onSubmissionSuccess?: () => void | Promise<void>;
  repository?: ICreditApplicationRepository;
  testID?: string;
  userId?: string;
  viewModel?: UseCreditWizardOrchestratorReturn;
}

const isLegalEntityContact = (
  contact?: LegalEntityContact | PhysicalPersonContact,
): contact is LegalEntityContact =>
  Boolean(contact && 'commercialActivity' in contact);

const isPhysicalPersonContact = (
  contact?: LegalEntityContact | PhysicalPersonContact,
): contact is PhysicalPersonContact =>
  Boolean(contact && 'employmentData' in contact);

export const CreditWizardOrchestratorView = React.memo(
  ({
    onClose,
    onSubmissionSuccess,
    repository,
    testID = CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS.CONTAINER,
    userId,
    viewModel: viewModelProp,
  }: CreditWizardOrchestratorViewProps): React.JSX.Element => {
    const defaultViewModel = useCreditWizardOrchestrator({
      onSubmissionSuccess,
      repository,
      userId,
    });
    const viewModel = viewModelProp ?? defaultViewModel;

    const {
      currentStep,
      draftState,
      handlePreviousStep,
      handleStep1Submit,
      handleStep2Submit,
      handleStep3Submit,
      handleStep4Submit,
      isSubmitting,
    } = viewModel;

    const renderCurrentStep = (): React.JSX.Element => {
      switch (currentStep) {
        case WIZARD_STEPS.STEP_1:
          return (
            <ApplicantStepView
              defaultValues={draftState.step1}
              onClose={onClose}
              onSubmit={handleStep1Submit}
            />
          );

        case WIZARD_STEPS.STEP_2: {
          if (
            draftState.step1?.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL
          ) {
            return (
              <LegalEntityContactStepView
                currentStep={WIZARD_STEPS.STEP_2}
                defaultValues={
                  isLegalEntityContact(draftState.step2)
                    ? draftState.step2
                    : undefined
                }
                onBack={handlePreviousStep}
                onClose={onClose}
                onSubmit={handleStep2Submit}
                totalSteps={WIZARD_STEPS.TOTAL_STEPS}
              />
            );
          }

          return (
            <PhysicalPersonContactStepView
              currentStep={WIZARD_STEPS.STEP_2}
              defaultValues={
                isPhysicalPersonContact(draftState.step2)
                  ? draftState.step2
                  : undefined
              }
              onBack={handlePreviousStep}
              onClose={onClose}
              onSubmit={handleStep2Submit}
              totalSteps={WIZARD_STEPS.TOTAL_STEPS}
            />
          );
        }

        case WIZARD_STEPS.STEP_3:
          return (
            <VehicleCreditStepView
              currentStep={WIZARD_STEPS.STEP_3}
              defaultValues={draftState.step3}
              onBack={handlePreviousStep}
              onClose={onClose}
              onSubmit={handleStep3Submit}
              totalSteps={WIZARD_STEPS.TOTAL_STEPS}
            />
          );

        case WIZARD_STEPS.STEP_4:
          return (
            <BankAuthorizationsStepView
              currentStep={WIZARD_STEPS.STEP_4}
              defaultValues={draftState.step4}
              isSubmitting={isSubmitting}
              onBack={handlePreviousStep}
              onClose={onClose}
              onSubmit={handleStep4Submit}
              totalSteps={WIZARD_STEPS.TOTAL_STEPS}
            />
          );
      }
    };

    return (
      <View
        className={CREDIT_WIZARD_ORCHESTRATOR_STYLES.CONTAINER}
        testID={testID}
      >
        <View className={CREDIT_WIZARD_ORCHESTRATOR_STYLES.PROGRESS_WRAPPER}>
          <WizardProgressHeader
            currentStep={currentStep}
            testID={CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS.PROGRESS_HEADER}
            totalSteps={WIZARD_STEPS.TOTAL_STEPS}
          />
        </View>
        <View
          className={CREDIT_WIZARD_ORCHESTRATOR_STYLES.STEP_CONTAINER}
          testID={CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS.STEP_CONTAINER}
        >
          {renderCurrentStep()}
        </View>
      </View>
    );
  },
);

CreditWizardOrchestratorView.displayName = 'CreditWizardOrchestratorView';

export default CreditWizardOrchestratorView;
