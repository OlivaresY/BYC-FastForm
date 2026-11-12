import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useForm, type Control } from 'react-hook-form';
import { VehicleCreditStepView } from '../VehicleCreditStepView';
import type { VehicleCreditStepViewProps } from '../VehicleCreditStepView';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';

export class VehicleCreditStepPOM {
  public static createMockControl(): Control<VehicleCreditFormValues> {
    const { result } = renderHook(() =>
      useForm<VehicleCreditFormValues>({
        defaultValues: {
          anio: '2024',
          color: 'Blanco',
          marca: '',
          modelo: '',
          moneda: 'USD',
          monto_financiar: 0,
          monto_prima: 0,
          plazo_meses: '96 Meses (8 Años)',
          valor_vehiculo: 0,
        },
      }),
    );
    return result.current.control;
  }

  public static render(
    props?: VehicleCreditStepViewProps,
  ): VehicleCreditStepPOM {
    render(
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: { bottom: 0, left: 0, right: 0, top: 0 } },
        React.createElement(VehicleCreditStepView, props ?? {}),
      ),
    );
    return new VehicleCreditStepPOM();
  }

  // =========================================================================
  // Element Getters (Synchronous Queries)
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-step-view');
  }

  public get unitSpecificationsContainer(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-unit-specifications-container');
  }

  public get financingPlanContainer(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-financing-plan-container');
  }

  public get unitSpecificationsHeader(): ReactTestInstance {
    return screen.getByText('1. ESPECIFICACIONES DE LA UNIDAD');
  }

  public get financingPlanHeader(): ReactTestInstance {
    return screen.getByText('2. PLAN DE FINANCIAMIENTO');
  }

  public get marcaSelect(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-marca-select');
  }

  public get marcaInput(): ReactTestInstance {
    return this.marcaSelect;
  }

  public get modeloInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-modelo-input');
  }

  public get modeloSelect(): ReactTestInstance {
    return this.modeloInput;
  }

  public get colorInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-color-input');
  }

  public get colorAnoInput(): ReactTestInstance {
    return this.colorInput;
  }

  public get colorAnoSelect(): ReactTestInstance {
    return this.colorInput;
  }

  public get anioInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-anio-input');
  }

  public get monedaSelect(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-moneda-select');
  }

  public get valorVehiculoInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-valor-vehiculo-input');
  }

  public get montoPrimaInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-monto-prima-input');
  }

  public get montoPrimaHelperText(): ReactTestInstance | null {
    return (
      screen.queryByText('10% de prima mínima permitida') ??
      screen.queryByTestId('vehicle-credit-monto-prima-input-helper-text')
    );
  }

  public get derivedMontoFinanciar(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-derived-monto-financiar');
  }

  public get plazoMesesSelect(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-plazo-meses-select');
  }

  public get plazoMesesInput(): ReactTestInstance {
    return this.plazoMesesSelect;
  }

  public get plazoMesesTrigger(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-plazo-meses-select-trigger');
  }

  public get plazoMesesTriggerText(): string {
    return screen.getByTestId('vehicle-credit-plazo-meses-select-trigger-text')
      .props.children as string;
  }

  public isPlazoMesesDisabled(): boolean {
    return this.plazoMesesTrigger.props.accessibilityState?.disabled === true;
  }

  public get submitButton(): ReactTestInstance {
    return (
      screen.queryByTestId('wizard-step-layout-submit-button') ??
      screen.getByText('Siguiente')
    );
  }

  public isSubmitButtonDisabled(): boolean {
    return (
      this.submitButton.props.accessibilityState?.disabled === true ||
      this.submitButton.props.disabled === true
    );
  }

  // =========================================================================
  // Error Getters (Nullable Queries)
  // =========================================================================

  public get marcaError(): ReactTestInstance | null {
    return (
      screen.queryByTestId('vehicle-credit-marca-select-error') ??
      screen.queryByTestId('vehicle-credit-marca-input-error')
    );
  }

  public get modeloError(): ReactTestInstance | null {
    return (
      screen.queryByTestId('vehicle-credit-modelo-input-error') ??
      screen.queryByTestId('vehicle-credit-modelo-select-error')
    );
  }

  public get colorError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-color-input-error');
  }

  public get anioError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-anio-input-error');
  }

  public get colorAnoError(): ReactTestInstance | null {
    return (
      screen.queryByTestId('vehicle-credit-color-input-error') ??
      screen.queryByTestId('vehicle-credit-color-ano-select-error')
    );
  }

  public get valorVehiculoError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-valor-vehiculo-input-error');
  }

  public get montoPrimaError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-monto-prima-input-error');
  }

  public get montoFinanciarError(): ReactTestInstance | null {
    return (
      screen.queryByTestId('vehicle-credit-derived-monto-financiar-error') ??
      screen.queryByTestId('vehicle-credit-monto-financiar-error')
    );
  }

  public get plazoMesesError(): ReactTestInstance | null {
    return (
      screen.queryByTestId('vehicle-credit-plazo-meses-select-error') ??
      screen.queryByTestId('vehicle-credit-plazo-meses-input-error')
    );
  }

  // =========================================================================
  // Fluent Action Helpers (Method Chaining: return this)
  // =========================================================================

  public static async act(callback: () => Promise<void> | void): Promise<void> {
    await act(callback);
  }

  public async act(callback: () => Promise<void> | void): Promise<void> {
    await act(callback);
  }

  public fillModelo(value: string): this {
    act(() => {
      fireEvent.changeText(this.modeloInput, value);
    });
    return this;
  }

  public fillColor(value: string): this {
    act(() => {
      fireEvent.changeText(this.colorInput, value);
    });
    return this;
  }

  public fillAnio(value: string): this {
    act(() => {
      fireEvent.changeText(this.anioInput, value);
    });
    return this;
  }

  public fillValorVehiculo(value: string): this {
    act(() => {
      fireEvent.changeText(this.valorVehiculoInput, value);
    });
    return this;
  }

  public fillMontoPrima(value: string): this {
    act(() => {
      fireEvent.changeText(this.montoPrimaInput, value);
    });
    return this;
  }

  public pressSubmit(): this {
    act(() => {
      fireEvent.press(this.submitButton);
    });
    return this;
  }

  public selectMarca(brand: string): this {
    act(() => {
      fireEvent.press(
        screen.getByTestId('vehicle-credit-marca-select-trigger'),
      );
    });
    act(() => {
      fireEvent.press(screen.getByTestId(`custom-select-option-${brand}`));
    });
    return this;
  }

  public fillAllValidData(overrides?: Partial<VehicleCreditFormValues>): this {
    this.selectMarca((overrides?.marca as string) ?? 'BYD');
    this.fillModelo((overrides?.modelo as string) ?? 'Tang');
    this.fillColor((overrides?.color as string) ?? 'Negro');
    this.fillAnio((overrides?.anio as string) ?? '2024');
    this.fillValorVehiculo(
      overrides?.valor_vehiculo !== undefined
        ? String(overrides.valor_vehiculo)
        : '20000',
    );
    this.fillMontoPrima(
      overrides?.monto_prima !== undefined
        ? String(overrides.monto_prima)
        : '2000',
    );
    return this;
  }

  public async waitFor(callback: () => void | Promise<void>): Promise<void> {
    await waitFor(callback);
  }
}
