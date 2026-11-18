import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
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

  public startSubmitDraft = (
    payload: MasterCreditApplicationPayload,
  ): Promise<void> => {
    let pendingCall!: Promise<void>;
    act(() => {
      pendingCall = this.hookResult.result.current.submitDraft(payload);
    });
    return pendingCall;
  };

  public settle = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };
}
