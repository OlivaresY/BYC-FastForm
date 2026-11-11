import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type {
  UsePhysicalPersonContactViewModelProps,
  UsePhysicalPersonContactViewModelReturn,
} from '../types/PhysicalPersonContact.types';

export class PhysicalPersonContactViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UsePhysicalPersonContactViewModelReturn,
    UsePhysicalPersonContactViewModelProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UsePhysicalPersonContactViewModelReturn,
      UsePhysicalPersonContactViewModelProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props?: UsePhysicalPersonContactViewModelProps,
  ): PhysicalPersonContactViewModelPageObject {
    const result = renderHook(
      (currentProps?: UsePhysicalPersonContactViewModelProps) =>
        usePhysicalPersonContactViewModel(currentProps),
      { initialProps: props },
    );
    return new PhysicalPersonContactViewModelPageObject(result);
  }

  public get current(): UsePhysicalPersonContactViewModelReturn {
    return this.hookResult.result.current;
  }

  public get isValid(): boolean {
    return this.hookResult.result.current.isValid;
  }

  public async handleNextStep(dataOrEvent?: unknown): Promise<void> {
    await act(async () => {
      await this.hookResult.result.current.handleNextStep(dataOrEvent);
    });
  }

  public async waitForValid(expected = true): Promise<this> {
    await waitFor(() => {
      expect(this.hookResult.result.current.isValid).toBe(expected);
    });
    return this;
  }
}

