import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import type { MasterCreditApplicationPayload } from '../../types/MasterCreditApplication.types';
import {
  useDraftSubmissionViewModel,
  type UseDraftSubmissionViewModelProps,
  type UseDraftSubmissionViewModelReturn,
} from '../useDraftSubmissionViewModel';

export class DraftSubmissionViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseDraftSubmissionViewModelReturn,
    UseDraftSubmissionViewModelProps
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseDraftSubmissionViewModelReturn,
      UseDraftSubmissionViewModelProps
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render = (
    props: UseDraftSubmissionViewModelProps,
  ): DraftSubmissionViewModelPageObject => {
    const result = renderHook(
      (currentProps: UseDraftSubmissionViewModelProps) =>
        useDraftSubmissionViewModel(currentProps),
      { initialProps: props },
    );
    return new DraftSubmissionViewModelPageObject(result);
  };

  public get isSubmitting(): boolean {
    return this.hookResult.result.current.isSubmitting;
  }

  public get submitError(): string | null {
    return this.hookResult.result.current.submitError;
  }

  public clearSubmitError = (): void => {
    act(() => {
      this.hookResult.result.current.clearSubmitError();
    });
  };

  public startSubmitDraft = (
    payload: MasterCreditApplicationPayload,
  ): Promise<void> => {
    let pendingCall!: Promise<void>;
    act(() => {
      pendingCall = this.hookResult.result.current.submitDraft(payload);
    });
    return pendingCall;
  };

  public startHandleSubmit = (
    payload: MasterCreditApplicationPayload,
  ): Promise<void> => {
    let pendingCall!: Promise<void>;
    act(() => {
      pendingCall = this.hookResult.result.current.handleSubmit(payload);
    });
    return pendingCall;
  };

  public rerenderWithAuthorizations = (
    props: UseDraftSubmissionViewModelProps,
    authorizationValues: Partial<BankAuthorizationsFormValues>,
  ): void => {
    act(() => {
      this.hookResult.rerender({
        ...props,
        authorizationValues,
      });
    });
  };

  public advanceTimers = async (ms: number): Promise<void> => {
    await act(async () => {
      jest.advanceTimersByTime(ms);
    });
  };

  public settle = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };

  public unmount = (): void => {
    act(() => {
      this.hookResult.unmount();
    });
  };
}
