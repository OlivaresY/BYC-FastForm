import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { useBankAuthorizationsViewModel } from '../useBankAuthorizationsViewModel';
import type {
  UseBankAuthorizationsViewModelProps,
  UseBankAuthorizationsViewModelReturn,
} from '../useBankAuthorizationsViewModel';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

export class BankAuthorizationsViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseBankAuthorizationsViewModelReturn,
    UseBankAuthorizationsViewModelProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseBankAuthorizationsViewModelReturn,
      UseBankAuthorizationsViewModelProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props?: UseBankAuthorizationsViewModelProps,
  ): BankAuthorizationsViewModelPageObject {
    const result = renderHook(
      (currentProps?: UseBankAuthorizationsViewModelProps) =>
        useBankAuthorizationsViewModel(currentProps),
      { initialProps: props },
    );
    return new BankAuthorizationsViewModelPageObject(result);
  }

  public get current(): UseBankAuthorizationsViewModelReturn {
    return this.hookResult.result.current;
  }

  public get isValid(): boolean {
    return this.hookResult.result.current.isValid;
  }

  public get isAllBanksSelected(): boolean {
    return this.hookResult.result.current.isAllBanksSelected;
  }

  public get isSubmitting(): boolean {
    return this.hookResult.result.current.isSubmitting;
  }

  public getValues(): BankAuthorizationsFormValues {
    return this.hookResult.result.current.form.getValues();
  }

  public toggleAllBanks(): this {
    act(() => {
      this.hookResult.result.current.toggleAllBanks();
    });
    return this;
  }

  public setFieldValue<K extends keyof BankAuthorizationsFormValues>(
    field: K,
    value: BankAuthorizationsFormValues[K],
  ): this {
    act(() => {
      this.hookResult.result.current.form.setValue(
        field as never,
        value as never,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );
    });
    return this;
  }

  public async handleNext(): Promise<void> {
    await act(async () => {
      await this.hookResult.result.current.handleNext();
    });
  }

  public async waitForValid(expected = true): Promise<this> {
    await waitFor(() => {
      expect(this.isValid).toBe(expected);
    });
    return this;
  }
}
