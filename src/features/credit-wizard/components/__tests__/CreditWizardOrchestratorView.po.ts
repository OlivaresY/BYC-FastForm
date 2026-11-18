import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import {
  CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS,
  CreditWizardOrchestratorView,
  type CreditWizardOrchestratorViewProps,
} from '../CreditWizardOrchestratorView';

export const MOCK_STEP_TEST_IDS = {
  STEP_1_CONTAINER: 'mock-applicant-step-view',
  STEP_1_SUBMIT_LEGAL: 'mock-step-1-submit-legal',
  STEP_1_SUBMIT_PHYSICAL: 'mock-step-1-submit-physical',
  STEP_2_LEGAL_BACK: 'mock-step-2-legal-back',
  STEP_2_LEGAL_CONTAINER: 'mock-legal-entity-contact-step-view',
  STEP_2_LEGAL_SUBMIT: 'mock-step-2-legal-submit',
  STEP_2_PHYSICAL_BACK: 'mock-step-2-physical-back',
  STEP_2_PHYSICAL_CONTAINER: 'mock-physical-person-contact-step-view',
  STEP_2_PHYSICAL_SUBMIT: 'mock-step-2-physical-submit',
  STEP_3_BACK: 'mock-step-3-back',
  STEP_3_CONTAINER: 'mock-vehicle-credit-step-view',
  STEP_3_SUBMIT: 'mock-step-3-submit',
  STEP_4_BACK: 'mock-step-4-back',
  STEP_4_CONTAINER: 'mock-bank-authorizations-step-view',
  STEP_4_IS_SUBMITTING: 'mock-step-4-is-submitting',
  STEP_4_SUBMIT: 'mock-step-4-submit',
} as const;

export class CreditWizardOrchestratorPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static render = (
    props?: CreditWizardOrchestratorViewProps,
  ): CreditWizardOrchestratorPageObject => {
    const rendered = render(
      React.createElement(CreditWizardOrchestratorView, props),
    );
    return new CreditWizardOrchestratorPageObject(rendered);
  };

  public get progressHeader() {
    return this.screen.getByTestId(
      CREDIT_WIZARD_ORCHESTRATOR_TEST_IDS.PROGRESS_HEADER,
    );
  }

  public queryStep = (testID: string) => this.screen.queryByTestId(testID);

  public getStep = (testID: string) => this.screen.getByTestId(testID);

  public getStep4SubmittingText = (): string =>
    String(
      this.screen.getByTestId(MOCK_STEP_TEST_IDS.STEP_4_IS_SUBMITTING).props
        .children,
    );

  public pressButton = (testID: string): void => {
    fireEvent.press(this.screen.getByTestId(testID));
  };

  public pressAsyncButton = async (testID: string): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.screen.getByTestId(testID));
    });
  };

  public flushAsync = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };
}
