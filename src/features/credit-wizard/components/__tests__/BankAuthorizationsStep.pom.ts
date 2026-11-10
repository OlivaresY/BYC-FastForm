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
import {
  BANK_AUTHORIZATIONS_STEP_COPY,
  BANK_AUTHORIZATIONS_STEP_TEST_IDS,
} from '../../constants/BankAuthorizations.constants';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

export class BankAuthorizationsStepPOM {
  public static createMockControl(): Control<BankAuthorizationsFormValues> {
    const { result } = renderHook(() =>
      useForm<BankAuthorizationsFormValues>({
        defaultValues: {
          autoriza_buros_credito: false,
          autoriza_sugef_cic: false,
          banco_bac: false,
          banco_bncr: false,
          banco_carro_facil: false,
          banco_promerica: false,
          banco_scotiabank: false,
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
    return screen.getByTestId(BANK_AUTHORIZATIONS_STEP_TEST_IDS.CONTAINER);
  }

  public get section1Container(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.SECTION_1_CONTAINER,
    );
  }

  public get section2Container(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.SECTION_2_CONTAINER,
    );
  }

  // =========================================================================
  // Section 1: Bank Checkboxes & Toggle All Button
  // =========================================================================

  public get toggleAllButton(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.TOGGLE_ALL_BUTTON,
    );
  }

  public get bancoBacCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_BAC_CHECKBOX,
    );
  }

  public get bancoBncrCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_BNCR_CHECKBOX,
    );
  }

  public get bancoScotiabankCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_SCOTIABANK_CHECKBOX,
    );
  }

  public get bancoPromericaCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_PROMERICA_CHECKBOX,
    );
  }

  public get bancoCarroFacilCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_CARRO_FACIL_CHECKBOX,
    );
  }

  // =========================================================================
  // Section 2: Legal Authorization Checkboxes
  // =========================================================================

  public get autorizaSugefCicCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_SUGEF_CIC_CHECKBOX,
    );
  }

  public get autorizaBurosCreditoCheckbox(): ReactTestInstance {
    return screen.getByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_BUROS_CREDITO_CHECKBOX,
    );
  }

  // =========================================================================
  // Submit Button
  // =========================================================================

  public get submitButton(): ReactTestInstance {
    return (
      screen.queryByTestId('wizard-step-layout-submit-button') ??
      screen.getByText(BANK_AUTHORIZATIONS_STEP_COPY.SUBMIT_BUTTON_LABEL)
    );
  }

  // =========================================================================
  // Error Message Getters (Nullable)
  // =========================================================================

  public get bancoError(): ReactTestInstance | null {
    return screen.queryByTestId(BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_ERROR);
  }

  public get autorizaSugefCicError(): ReactTestInstance | null {
    return screen.queryByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_SUGEF_CIC_ERROR,
    );
  }

  public get autorizaBurosCreditoError(): ReactTestInstance | null {
    return screen.queryByTestId(
      BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_BUROS_CREDITO_ERROR,
    );
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public pressToggleAll(): this {
    fireEvent.press(this.toggleAllButton);
    return this;
  }

  public toggleBancoBac(): this {
    fireEvent.press(this.bancoBacCheckbox);
    return this;
  }

  public toggleBancoBncr(): this {
    fireEvent.press(this.bancoBncrCheckbox);
    return this;
  }

  public toggleBancoScotiabank(): this {
    fireEvent.press(this.bancoScotiabankCheckbox);
    return this;
  }

  public toggleBancoPromerica(): this {
    fireEvent.press(this.bancoPromericaCheckbox);
    return this;
  }

  public toggleBancoCarroFacil(): this {
    fireEvent.press(this.bancoCarroFacilCheckbox);
    return this;
  }

  public toggleAutorizaSugefCic(): this {
    fireEvent.press(this.autorizaSugefCicCheckbox);
    return this;
  }

  public toggleAutorizaBurosCredito(): this {
    fireEvent.press(this.autorizaBurosCreditoCheckbox);
    return this;
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }
}
