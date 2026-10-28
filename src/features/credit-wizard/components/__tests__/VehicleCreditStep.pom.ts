import React from 'react';
import {
  fireEvent,
  render,
  renderHook,
  screen,
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
          color_ano: '',
          marca: '',
          modelo: '',
          moneda: 'USD',
          monto_financiar: 0,
          monto_prima: 0,
          plazo_meses: 84,
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

  public get marcaInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-marca-input');
  }

  public get modeloInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-modelo-input');
  }

  public get colorAnoInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-color-ano-input');
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

  public get derivedMontoFinanciar(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-derived-monto-financiar');
  }

  public get plazoMesesInput(): ReactTestInstance {
    return screen.getByTestId('vehicle-credit-plazo-meses-input');
  }

  // =========================================================================
  // Error Getters (Nullable Queries)
  // =========================================================================

  public get marcaError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-marca-input-error');
  }

  public get modeloError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-modelo-input-error');
  }

  public get colorAnoError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-color-ano-input-error');
  }

  public get valorVehiculoError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-valor-vehiculo-input-error');
  }

  public get montoPrimaError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-monto-prima-input-error');
  }

  public get montoFinanciarError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-monto-financiar-error');
  }

  public get plazoMesesError(): ReactTestInstance | null {
    return screen.queryByTestId('vehicle-credit-plazo-meses-input-error');
  }

  // =========================================================================
  // Fluent Action Helpers (Method Chaining: return this)
  // =========================================================================

  public fillMarca(value: string): this {
    fireEvent.changeText(this.marcaInput, value);
    return this;
  }

  public fillModelo(value: string): this {
    fireEvent.changeText(this.modeloInput, value);
    return this;
  }

  public fillColorAno(value: string): this {
    fireEvent.changeText(this.colorAnoInput, value);
    return this;
  }

  public fillValorVehiculo(value: string): this {
    fireEvent.changeText(this.valorVehiculoInput, value);
    return this;
  }

  public fillMontoPrima(value: string): this {
    fireEvent.changeText(this.montoPrimaInput, value);
    return this;
  }

  public fillPlazoMeses(value: string): this {
    fireEvent.changeText(this.plazoMesesInput, value);
    return this;
  }
}
