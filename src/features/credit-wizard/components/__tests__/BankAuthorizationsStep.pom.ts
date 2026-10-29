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
import { BankAuthorizationsStepView } from '../BankAuthorizationsStepView';
import type { BankAuthorizationsStepViewProps } from '../BankAuthorizationsStepView';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

export class BankAuthorizationsStepPOM {
  public static createMockControl(): Control<BankAuthorizationsFormValues> {
    const { result } = renderHook(() =>
      useForm<BankAuthorizationsFormValues>({
        defaultValues: {
          acepta_terminos: false,
          autoriza_buro: false,
          autoriza_sugef: false,
          banco_destino: '',
        },
      }),
    );
    return result.current.control;
  }

  public static render(
    props?: BankAuthorizationsStepViewProps,
  ): BankAuthorizationsStepPOM {
    render(
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: { bottom: 0, left: 0, right: 0, top: 0 } },
        React.createElement(BankAuthorizationsStepView, props ?? {}),
      ),
    );
    return new BankAuthorizationsStepPOM();
  }

  // =========================================================================
  // Layout & Container Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-step-view');
  }

  public get bankContainer(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-bank-container');
  }

  public get consentsContainer(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-consents-container');
  }

  // =========================================================================
  // Form Field Getters
  // =========================================================================

  public get bancoDestinoSelect(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-banco-destino-select');
  }

  public get autorizaBuroSwitch(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-autoriza-buro-switch');
  }

  public get autorizaSugefSwitch(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-autoriza-sugef-switch');
  }

  public get aceptaTerminosSwitch(): ReactTestInstance {
    return screen.getByTestId('bank-authorizations-acepta-terminos-switch');
  }

  // =========================================================================
  // Error Message Getters (Nullable)
  // =========================================================================

  public get bancoDestinoError(): ReactTestInstance | null {
    return screen.queryByTestId(
      'bank-authorizations-banco-destino-select-error',
    );
  }

  public get autorizaBuroError(): ReactTestInstance | null {
    return screen.queryByTestId('bank-authorizations-autoriza-buro-error');
  }

  public get autorizaSugefError(): ReactTestInstance | null {
    return screen.queryByTestId('bank-authorizations-autoriza-sugef-error');
  }

  public get aceptaTerminosError(): ReactTestInstance | null {
    return screen.queryByTestId('bank-authorizations-acepta-terminos-error');
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public toggleAutorizaBuro(value: boolean): this {
    fireEvent(this.autorizaBuroSwitch, 'valueChange', value);
    return this;
  }

  public toggleAutorizaSugef(value: boolean): this {
    fireEvent(this.autorizaSugefSwitch, 'valueChange', value);
    return this;
  }

  public toggleAceptaTerminos(value: boolean): this {
    fireEvent(this.aceptaTerminosSwitch, 'valueChange', value);
    return this;
  }
}
