import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type {
  UseLegalEntityContactViewModelProps,
  UseLegalEntityContactViewModelReturn,
} from '../types/LegalEntityContact.types';

export class LegalEntityContactViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseLegalEntityContactViewModelReturn,
    UseLegalEntityContactViewModelProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseLegalEntityContactViewModelReturn,
      UseLegalEntityContactViewModelProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props?: UseLegalEntityContactViewModelProps,
  ): LegalEntityContactViewModelPageObject {
    const result = renderHook(
      (currentProps?: UseLegalEntityContactViewModelProps) =>
        useLegalEntityContactViewModel(currentProps),
      { initialProps: props },
    );
    return new LegalEntityContactViewModelPageObject(result);
  }

  public get current(): UseLegalEntityContactViewModelReturn {
    return this.hookResult.result.current;
  }

  public get isValid(): boolean {
    return this.hookResult.result.current.isValid;
  }

  public changeEconomicSector(economicSector: string): this {
    act(() => {
      this.hookResult.result.current.handleEconomicSectorChange(economicSector);
    });
    return this;
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

  public async waitForEconomicSectorOtherError(
    expectedDefined: boolean,
  ): Promise<this> {
    await waitFor(() => {
      const error =
        this.hookResult.result.current.errors.commercialActivity
          ?.economicSectorOther;
      if (expectedDefined) {
        expect(error?.message).toBeTruthy();
      } else {
        expect(error).toBeUndefined();
      }
    });
    return this;
  }
}
