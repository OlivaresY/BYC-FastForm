import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import type { ApplicantStepData } from '../../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import type { LegalEntityContact } from '../../types/LegalEntityContact.types';
import type { PhysicalPersonContact } from '../../types/PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';
import {
  useCreditWizardOrchestrator,
  type UseCreditWizardOrchestratorProps,
  type UseCreditWizardOrchestratorReturn,
} from '../useCreditWizardOrchestrator';

export class CreditWizardOrchestratorHookPageObject {
  private readonly hookResult: RenderHookResult<
    UseCreditWizardOrchestratorReturn,
    UseCreditWizardOrchestratorProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseCreditWizardOrchestratorReturn,
      UseCreditWizardOrchestratorProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render = (
    props?: UseCreditWizardOrchestratorProps,
  ): CreditWizardOrchestratorHookPageObject => {
    const result = renderHook(
      (currentProps?: UseCreditWizardOrchestratorProps) =>
        useCreditWizardOrchestrator(currentProps),
      { initialProps: props },
    );
    return new CreditWizardOrchestratorHookPageObject(result);
  };

  public get current(): UseCreditWizardOrchestratorReturn {
    return this.hookResult.result.current;
  }

  public submitStep1 = (data: ApplicantStepData): this => {
    act(() => {
      this.hookResult.result.current.handleStep1Submit(data);
    });
    return this;
  };

  public submitStep2 = (
    data: LegalEntityContact | PhysicalPersonContact,
  ): this => {
    act(() => {
      this.hookResult.result.current.handleStep2Submit(data);
    });
    return this;
  };

  public submitStep3 = (data: VehicleCreditFormValues): this => {
    act(() => {
      this.hookResult.result.current.handleStep3Submit(data);
    });
    return this;
  };

  public completeThroughStep3 = (
    step1: ApplicantStepData,
    step2: LegalEntityContact | PhysicalPersonContact,
    step3: VehicleCreditFormValues,
  ): this => {
    return this.submitStep1(step1).submitStep2(step2).submitStep3(step3);
  };

  public submitStep4 = async (
    step4: BankAuthorizationsFormValues,
  ): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.handleStep4Submit(step4);
    });
  };

  public startSubmitStep4 = (
    step4: BankAuthorizationsFormValues,
  ): Promise<void> => {
    let pendingCall!: Promise<void>;
    act(() => {
      pendingCall = this.hookResult.result.current.handleStep4Submit(step4);
    });
    return pendingCall;
  };

  public settle = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };

  public advanceTimers = async (ms: number): Promise<void> => {
    await act(async () => {
      jest.advanceTimersByTime(ms);
    });
  };

  public goBack = (): this => {
    act(() => {
      this.hookResult.result.current.handlePreviousStep();
    });
    return this;
  };

  public clearSubmitError = (): this => {
    act(() => {
      this.hookResult.result.current.clearSubmitError();
    });
    return this;
  };

  public resetWizard = (): this => {
    act(() => {
      this.hookResult.result.current.resetWizard();
    });
    return this;
  };

  public restartWizard = (): this => {
    act(() => {
      this.hookResult.result.current.restartWizard();
    });
    return this;
  };
}
