import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import type { ReactTestInstance } from 'react-test-renderer';
import {
  CUSTOM_SELECT_TEST_IDS,
  ERROR_BANNER_TEST_IDS,
  PROCESS_TOP_BAR_TEST_IDS,
} from '@/shared/ui';
import { LegalEntityContactStepView } from '../components/LegalEntityContactStepView';
import { LEGAL_ENTITY_CONTACT_FORM_TEST_IDS } from '../constants/LegalEntityContactForm.constants';
import { LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/LegalEntityContactStepView.constants';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type {
  UseLegalEntityContactViewModelProps,
  UseLegalEntityContactViewModelReturn,
} from '../types/LegalEntityContact.types';
import type { LegalEntityContactStepViewProps } from '../types/LegalEntityContactStepView.types';

type MockKeyboardWithEmitter = typeof Keyboard & {
  _emitter: { emit: (event: string, ...args: unknown[]) => void };
  emit: (event: string, ...args: unknown[]) => void;
};

const mockKeyboard = Keyboard as unknown as MockKeyboardWithEmitter;

if (!mockKeyboard.emit) {
  mockKeyboard.emit = (event: string, ...args: unknown[]) =>
    mockKeyboard._emitter.emit(event, ...args);
}

export interface LegalEntityContactStepViewTestContainerProps extends UseLegalEntityContactViewModelProps {
  currentStep?: number;
  disabled?: boolean;
  onClose?: () => void;
  testID?: string;
  totalSteps?: number;
  viewModel?: UseLegalEntityContactViewModelReturn;
}

const LegalEntityContactStepViewTestContainer = ({
  currentStep = 2,
  disabled,
  onClose = jest.fn(),
  testID,
  totalSteps = 4,
  viewModel: viewModelProp,
  ...hookProps
}: LegalEntityContactStepViewTestContainerProps): React.JSX.Element => {
  const defaultViewModel = useLegalEntityContactViewModel(hookProps);
  const viewModel = viewModelProp ?? defaultViewModel;
  return React.createElement(
    SafeAreaInsetsContext.Provider,
    { value: { bottom: 0, left: 0, right: 0, top: 0 } },
    React.createElement(LegalEntityContactStepView, {
      currentStep,
      disabled,
      onClose,
      testID,
      totalSteps,
      viewModel,
    }),
  );
};

export class LegalEntityContactStepViewPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props?: LegalEntityContactStepViewTestContainerProps,
  ): LegalEntityContactStepViewPageObject {
    render(
      React.createElement(
        LegalEntityContactStepViewTestContainer,
        props ?? {},
      ),
    );
    return new LegalEntityContactStepViewPageObject(props?.testID);
  }

  public static renderDirect(
    props: LegalEntityContactStepViewProps,
  ): LegalEntityContactStepViewPageObject {
    render(
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: { bottom: 0, left: 0, right: 0, top: 0 } },
        React.createElement(LegalEntityContactStepView, props),
      ),
    );
    return new LegalEntityContactStepViewPageObject(props.testID);
  }

  // --- Layout Getters ---

  public get container(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ?? LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
    );
  }

  public get processTopBar(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
    );
  }

  public get closeButton(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.CLOSE_BUTTON);
  }

  public get scrollView(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
    );
  }

  public get wizardHeader(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
    );
  }

  public get title(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.TITLE);
  }

  public get description(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
    );
  }

  public get form(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.FORM);
  }

  public get bottomBar(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
    );
  }

  public get backButton(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON,
    );
  }

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
    );
  }

  public get errorBanner(): ReactTestInstance | null {
    return screen.queryByTestId(ERROR_BANNER_TEST_IDS.CONTAINER);
  }

  // --- Section 1: CONTACTO CORPORATIVO ---

  public get section1Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_CARD,
    );
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER,
    );
  }

  public get section1Icon(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_ICON,
    );
  }

  public get emailInput(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EMAIL_INPUT);
  }

  public get cellPhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT,
    );
  }

  public get officePhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.OFFICE_PHONE_INPUT,
    );
  }

  // --- Section 2: DOMICILIO COMERCIAL ---

  public get section2Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_CARD,
    );
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER,
    );
  }

  public get section2Icon(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_ICON,
    );
  }

  public get provinceTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.PROVINCE_SELECT}-trigger`,
    );
  }

  public get cantonTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CANTON_SELECT}-trigger`,
    );
  }

  public get districtTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.DISTRICT_SELECT}-trigger`,
    );
  }

  public get exactAddressInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EXACT_ADDRESS_INPUT,
    );
  }

  // --- Section 3: ACTIVIDAD COMERCIAL ---

  public get section3Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_CARD,
    );
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER,
    );
  }

  public get section3Icon(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_ICON,
    );
  }

  public get economicSectorTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.ECONOMIC_SECTOR_SELECT}-trigger`,
    );
  }

  public get mainActivityInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.MAIN_ACTIVITY_INPUT,
    );
  }

  public get constitutionDateInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CONSTITUTION_DATE_INPUT,
    );
  }

  public get employeesCountInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EMPLOYEES_COUNT_INPUT,
    );
  }

  public get accountingPhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.ACCOUNTING_PHONE_INPUT,
    );
  }

  // --- Section 4: ESTADOS FINANCIEROS ---

  public get section4Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_CARD,
    );
  }

  public get section4Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER,
    );
  }

  public get section4Icon(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_ICON,
    );
  }

  public get currencyTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CURRENCY_SELECT}-trigger`,
    );
  }

  public get grossSalesInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.GROSS_SALES_INPUT,
    );
  }

  public get netProfitInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.NET_PROFIT_INPUT,
    );
  }

  public get netProfitError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.NET_PROFIT_INPUT}-error`,
    );
  }

  public get otherIncomesInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.OTHER_INCOMES_INPUT,
    );
  }

  // --- Section 5: REFERENCIA COMERCIAL Y CUENTA ---

  public get section5Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_CARD,
    );
  }

  public get section5Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_HEADER,
    );
  }

  public get section5Icon(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_ICON,
    );
  }

  public get companyReferenceInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.COMPANY_REFERENCE_INPUT,
    );
  }

  public get referencePhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REFERENCE_PHONE_INPUT,
    );
  }

  public get ibanAccountInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.IBAN_ACCOUNT_INPUT,
    );
  }

  // --- Action Setters (Fluent Chaining) ---

  public setEmail(email: string): this {
    fireEvent.changeText(this.emailInput, email);
    return this;
  }

  public fillEmail(email: string): this {
    return this.setEmail(email);
  }

  public changeEmail(email: string): this {
    return this.setEmail(email);
  }

  public setCellPhone(phone: string): this {
    fireEvent.changeText(this.cellPhoneInput, phone);
    return this;
  }

  public fillCellPhone(phone: string): this {
    return this.setCellPhone(phone);
  }

  public changeCellPhone(phone: string): this {
    return this.setCellPhone(phone);
  }

  public setOfficePhone(phone: string): this {
    fireEvent.changeText(this.officePhoneInput, phone);
    return this;
  }

  public fillOfficePhone(phone: string): this {
    return this.setOfficePhone(phone);
  }

  public changeOfficePhone(phone: string): this {
    return this.setOfficePhone(phone);
  }

  public selectProvince(value: string): this {
    fireEvent.press(this.provinceTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public selectCanton(value: string): this {
    fireEvent.press(this.cantonTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public selectDistrict(value: string): this {
    fireEvent.press(this.districtTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public setExactAddress(address: string): this {
    fireEvent.changeText(this.exactAddressInput, address);
    return this;
  }

  public fillExactAddress(address: string): this {
    return this.setExactAddress(address);
  }

  public changeExactAddress(address: string): this {
    return this.setExactAddress(address);
  }

  public selectEconomicSector(value: string): this {
    fireEvent.press(this.economicSectorTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public setMainActivity(activity: string): this {
    fireEvent.changeText(this.mainActivityInput, activity);
    return this;
  }

  public fillMainActivity(activity: string): this {
    return this.setMainActivity(activity);
  }

  public changeMainActivity(activity: string): this {
    return this.setMainActivity(activity);
  }

  public setConstitutionDate(date: string): this {
    fireEvent.changeText(this.constitutionDateInput, date);
    return this;
  }

  public fillConstitutionDate(date: string): this {
    return this.setConstitutionDate(date);
  }

  public changeConstitutionDate(date: string): this {
    return this.setConstitutionDate(date);
  }

  public setEmployeesCount(count: number | string): this {
    fireEvent.changeText(this.employeesCountInput, String(count));
    return this;
  }

  public fillEmployeesCount(count: number | string): this {
    return this.setEmployeesCount(count);
  }

  public changeEmployeesCount(count: number | string): this {
    return this.setEmployeesCount(count);
  }

  public setAccountingPhone(phone: string): this {
    fireEvent.changeText(this.accountingPhoneInput, phone);
    return this;
  }

  public fillAccountingPhone(phone: string): this {
    return this.setAccountingPhone(phone);
  }

  public changeAccountingPhone(phone: string): this {
    return this.setAccountingPhone(phone);
  }

  public selectCurrency(value: string): this {
    fireEvent.press(this.currencyTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public setGrossSales(amount: number | string): this {
    fireEvent.changeText(this.grossSalesInput, String(amount));
    return this;
  }

  public fillGrossSales(amount: number | string): this {
    return this.setGrossSales(amount);
  }

  public changeGrossSales(amount: number | string): this {
    return this.setGrossSales(amount);
  }

  public setNetProfit(amount: number | string): this {
    fireEvent.changeText(this.netProfitInput, String(amount));
    return this;
  }

  public fillNetProfit(amount: number | string): this {
    return this.setNetProfit(amount);
  }

  public changeNetProfit(amount: number | string): this {
    return this.setNetProfit(amount);
  }

  public setOtherIncomes(amount: number | string): this {
    fireEvent.changeText(this.otherIncomesInput, String(amount));
    return this;
  }

  public fillOtherIncomes(amount: number | string): this {
    return this.setOtherIncomes(amount);
  }

  public changeOtherIncomes(amount: number | string): this {
    return this.setOtherIncomes(amount);
  }

  public fillCompanyReference(reference: string): this {
    fireEvent.changeText(this.companyReferenceInput, reference);
    return this;
  }

  public setCompanyReference(reference: string): this {
    return this.fillCompanyReference(reference);
  }

  public changeCompanyReference(reference: string): this {
    return this.fillCompanyReference(reference);
  }

  public fillReferencePhone(phone: string): this {
    fireEvent.changeText(this.referencePhoneInput, phone);
    return this;
  }

  public setReferencePhone(phone: string): this {
    return this.fillReferencePhone(phone);
  }

  public changeReferencePhone(phone: string): this {
    return this.fillReferencePhone(phone);
  }

  public fillIbanAccount(iban: string): this {
    fireEvent.changeText(this.ibanAccountInput, iban);
    return this;
  }

  public setIbanAccount(iban: string): this {
    return this.fillIbanAccount(iban);
  }

  public changeIbanAccount(iban: string): this {
    return this.fillIbanAccount(iban);
  }

  public pressBack(): this {
    fireEvent.press(this.backButton);
    return this;
  }

  public clickBack(): this {
    return this.pressBack();
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public clickSubmit(): this {
    return this.pressSubmit();
  }

  public clickClose(): this {
    fireEvent.press(this.closeButton);
    return this;
  }

  public fillAllValidData(overrides?: {
    accountingPhone?: string;
    canton?: string;
    cellPhone?: string;
    companyReference?: string;
    constitutionDate?: string;
    currency?: string;
    district?: string;
    economicSector?: string;
    email?: string;
    employeesCount?: number | string;
    exactAddress?: string;
    grossSales?: number | string;
    ibanAccount?: string;
    mainActivity?: string;
    netProfit?: number | string;
    officePhone?: string;
    otherIncomes?: number | string;
    province?: string;
    referencePhone?: string;
  }): this {
    this.setEmail(overrides?.email ?? 'contacto@distribuidoradeleste.cr')
      .setCellPhone(overrides?.cellPhone ?? '+506 8888-9999')
      .setOfficePhone(overrides?.officePhone ?? '+506 2200-0000')
      .selectProvince(overrides?.province ?? 'San José')
      .selectCanton(overrides?.canton ?? 'Central')
      .selectDistrict(overrides?.district ?? 'Carmen')
      .setExactAddress(
        overrides?.exactAddress ??
          'De la rotonda de la Bandera 300m este, Edificio Corporativo Los Laureles, Piso 3.',
      )
      .selectEconomicSector(overrides?.economicSector ?? 'Comercio')
      .setMainActivity(
        overrides?.mainActivity ??
          'Venta de repuestos y mantenimiento vehicular',
      )
      .setConstitutionDate(overrides?.constitutionDate ?? '15052015')
      .setEmployeesCount(overrides?.employeesCount ?? '25')
      .setAccountingPhone(overrides?.accountingPhone ?? '+506 2200-1111')
      .selectCurrency(overrides?.currency ?? 'CRC')
      .setGrossSales(overrides?.grossSales ?? '50000000')
      .setNetProfit(overrides?.netProfit ?? '15000000')
      .setOtherIncomes(overrides?.otherIncomes ?? '2500000')
      .fillCompanyReference(
        overrides?.companyReference ?? 'Corporación CoriMotors S.A.',
      )
      .fillReferencePhone(overrides?.referencePhone ?? '+506 2200-2222')
      .fillIbanAccount(overrides?.ibanAccount ?? 'CR05015202001026284066');

    return this;
  }

  public fillValidForm(overrides?: {
    accountingPhone?: string;
    canton?: string;
    cellPhone?: string;
    companyReference?: string;
    constitutionDate?: string;
    currency?: string;
    district?: string;
    economicSector?: string;
    email?: string;
    employeesCount?: number | string;
    exactAddress?: string;
    grossSales?: number | string;
    ibanAccount?: string;
    mainActivity?: string;
    netProfit?: number | string;
    officePhone?: string;
    otherIncomes?: number | string;
    province?: string;
    referencePhone?: string;
  }): this {
    return this.fillAllValidData(overrides);
  }

  public isSubmitButtonDisabled(): boolean {
    return Boolean(
      this.submitButton.props.accessibilityState?.disabled ??
        this.submitButton.props.disabled,
    );
  }

  public async waitFor(
    callback: () => void | Promise<void>,
    options?: { interval?: number; timeout?: number },
  ): Promise<this> {
    await waitFor(callback, {
      interval: options?.interval ?? 50,
      timeout: options?.timeout ?? 10000,
    });
    return this;
  }

  public emitKeyboardDidShow(height = 320): this {
    act(() => {
      mockKeyboard.emit('keyboardDidShow', {
        endCoordinates: { height, screenX: 0, screenY: 500, width: 390 },
      });
    });
    return this;
  }

  public emitKeyboardDidHide(): this {
    act(() => {
      mockKeyboard.emit('keyboardDidHide');
    });
    return this;
  }

  public focusInputWithMockNode(
    input: ReactTestInstance,
    nodeMetrics?: {
      height?: number;
      left?: number;
      top?: number;
      width?: number;
    },
  ): this {
    const mockCallback = (
      onSuccess: (
        left: number,
        top: number,
        width: number,
        height: number,
      ) => void,
    ) => {
      onSuccess(
        nodeMetrics?.left ?? 0,
        nodeMetrics?.top ?? 1100,
        nodeMetrics?.width ?? 180,
        nodeMetrics?.height ?? 50,
      );
    };

    act(() => {
      fireEvent(input, 'focus', {
        nativeEvent: {
          target: {
            measureInWindow: jest.fn(mockCallback),
            measureLayout: jest.fn((_relativeTo: unknown, onSuccess: any) =>
              mockCallback(onSuccess),
            ),
          },
        },
      });
    });
    return this;
  }
}
