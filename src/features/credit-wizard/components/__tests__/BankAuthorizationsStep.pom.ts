import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  type RenderResult,
} from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useForm, type Control } from 'react-hook-form';
import { BankAuthorizationsStepView } from '../BankAuthorizationsStepView';
import type { BankAuthorizationsStepViewProps } from '../BankAuthorizationsStepView';
import {
  type BankKey,
  BANK_AUTHORIZATIONS_STEP_COPY,
  BANK_AUTHORIZATIONS_STEP_TEST_IDS,
} from '../../constants/BankAuthorizations.constants';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

const STEP4_SUBMIT_ERROR_BANNER_TEST_ID = 'step4-submit-error-banner' as const;
const STEP4_SUBMIT_ERROR_MESSAGE_TEST_ID =
  'step4-submit-error-message' as const;

const buildWrappedStepView = (
  props?: BankAuthorizationsStepViewProps,
): React.ReactElement =>
  React.createElement(
    SafeAreaInsetsContext.Provider,
    { value: { bottom: 0, left: 0, right: 0, top: 0 } },
    React.createElement(BankAuthorizationsStepView, props ?? {}),
  );

export class BankAuthorizationsStepPOM {
  private readonly renderResult: RenderResult;

  public constructor(renderResult: RenderResult) {
    this.renderResult = renderResult;
  }

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
    const result = render(buildWrappedStepView(props));
    return new BankAuthorizationsStepPOM(result);
  }

  public rerender(props: BankAuthorizationsStepViewProps): this {
    this.renderResult.rerender(buildWrappedStepView(props));
    return this;
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
  // Submit / Back Buttons & Inline Error Alert
  // =========================================================================

  public get backButton(): ReactTestInstance | null {
    return screen.queryByTestId('wizard-step-layout-back-button');
  }

  public get submitButton(): ReactTestInstance {
    return (
      screen.queryByTestId('wizard-step-layout-submit-button') ??
      screen.getByText(BANK_AUTHORIZATIONS_STEP_COPY.SUBMIT_BUTTON_LABEL)
    );
  }

  public get submitErrorBanner(): ReactTestInstance | null {
    return screen.queryByTestId(STEP4_SUBMIT_ERROR_BANNER_TEST_ID);
  }

  public get submitErrorMessage(): ReactTestInstance | null {
    return screen.queryByTestId(STEP4_SUBMIT_ERROR_MESSAGE_TEST_ID);
  }

  public get submitErrorAlert(): ReactTestInstance | null {
    return screen.queryByRole('alert');
  }

  public isElementDisabled(element: ReactTestInstance | null): boolean {
    if (!element) {
      return false;
    }
    return (
      element.props.accessibilityState?.disabled === true ||
      element.props.disabled === true
    );
  }

  public isSubmitButtonDisabled(): boolean {
    return this.isElementDisabled(this.submitButton);
  }

  public isBackButtonDisabled(): boolean {
    return this.isElementDisabled(this.backButton);
  }

  public areAllCheckboxesDisabled(): boolean {
    const checkboxes = [
      this.toggleAllButton,
      this.bancoBacCheckbox,
      this.bancoBncrCheckbox,
      this.bancoScotiabankCheckbox,
      this.bancoPromericaCheckbox,
      this.bancoCarroFacilCheckbox,
      this.autorizaSugefCicCheckbox,
      this.autorizaBurosCreditoCheckbox,
    ];
    return checkboxes.every((checkbox) => this.isElementDisabled(checkbox));
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

  public static async act(callback: () => Promise<void> | void): Promise<void> {
    await act(callback);
  }

  public async act(callback: () => Promise<void> | void): Promise<void> {
    await act(callback);
  }

  public async waitFor(callback: () => void | Promise<void>): Promise<void> {
    await waitFor(callback);
  }

  public pressToggleAll(): this {
    act(() => {
      fireEvent.press(this.toggleAllButton);
    });
    return this;
  }

  public toggleBancoBac(): this {
    act(() => {
      fireEvent.press(this.bancoBacCheckbox);
    });
    return this;
  }

  public toggleBancoBncr(): this {
    act(() => {
      fireEvent.press(this.bancoBncrCheckbox);
    });
    return this;
  }

  public toggleBancoScotiabank(): this {
    act(() => {
      fireEvent.press(this.bancoScotiabankCheckbox);
    });
    return this;
  }

  public toggleBancoPromerica(): this {
    act(() => {
      fireEvent.press(this.bancoPromericaCheckbox);
    });
    return this;
  }

  public toggleBancoCarroFacil(): this {
    act(() => {
      fireEvent.press(this.bancoCarroFacilCheckbox);
    });
    return this;
  }

  public toggleBank(key: BankKey): this {
    switch (key) {
      case 'banco_bac':
        return this.toggleBancoBac();
      case 'banco_bncr':
        return this.toggleBancoBncr();
      case 'banco_scotiabank':
        return this.toggleBancoScotiabank();
      case 'banco_promerica':
        return this.toggleBancoPromerica();
      case 'banco_carro_facil':
        return this.toggleBancoCarroFacil();
    }
  }

  public toggleAutorizaSugefCic(): this {
    act(() => {
      fireEvent.press(this.autorizaSugefCicCheckbox);
    });
    return this;
  }

  public toggleAutorizaBurosCredito(): this {
    act(() => {
      fireEvent.press(this.autorizaBurosCreditoCheckbox);
    });
    return this;
  }

  public fillAllValidData(
    overrides?: Partial<BankAuthorizationsFormValues>,
  ): this {
    const shouldSelectBac = overrides?.banco_bac ?? true;
    if (shouldSelectBac) {
      this.toggleBancoBac();
    }
    const shouldSelectSugef = overrides?.autoriza_sugef_cic ?? true;
    if (shouldSelectSugef) {
      this.toggleAutorizaSugefCic();
    }
    const shouldSelectBuros = overrides?.autoriza_buros_credito ?? true;
    if (shouldSelectBuros) {
      this.toggleAutorizaBurosCredito();
    }
    return this;
  }

  public pressSubmit(): this {
    act(() => {
      fireEvent.press(this.submitButton);
    });
    return this;
  }
}
