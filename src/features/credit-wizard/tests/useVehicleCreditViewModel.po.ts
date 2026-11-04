import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { useVehicleCreditViewModel } from '../hooks/useVehicleCreditViewModel';
import type {
  FinancialField,
  UseVehicleCreditViewModelProps,
  UseVehicleCreditViewModelReturn,
} from '../hooks/useVehicleCreditViewModel';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';

export class VehicleCreditViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseVehicleCreditViewModelReturn,
    UseVehicleCreditViewModelProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseVehicleCreditViewModelReturn,
      UseVehicleCreditViewModelProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props?: UseVehicleCreditViewModelProps,
  ): VehicleCreditViewModelPageObject {
    const result = renderHook(
      (currentProps?: UseVehicleCreditViewModelProps) =>
        useVehicleCreditViewModel(currentProps),
      { initialProps: props },
    );
    return new VehicleCreditViewModelPageObject(result);
  }

  public get current(): UseVehicleCreditViewModelReturn {
    return this.hookResult.result.current;
  }

  public get isValid(): boolean {
    return this.hookResult.result.current.isValid;
  }

  public async setFieldValue<K extends keyof VehicleCreditFormValues>(
    field: K,
    value: VehicleCreditFormValues[K],
  ): Promise<void> {
    await act(async () => {
      this.hookResult.result.current.setValue(field, value as never, {
        shouldValidate: true,
      });
    });
  }

  public async handleFinancialChange(
    field: FinancialField,
    value: number,
  ): Promise<void> {
    await act(async () => {
      this.hookResult.result.current.handleFinancialChange(field, value);
    });
  }

  public async handleNext(event?: unknown): Promise<void> {
    await act(async () => {
      await this.hookResult.result.current.handleNext(event);
    });
  }

  public async waitForValid(expected = true): Promise<this> {
    await waitFor(() => {
      expect(this.hookResult.result.current.isValid).toBe(expected);
    });
    return this;
  }
}
