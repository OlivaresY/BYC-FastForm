import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { CUSTOM_SELECT_TEST_IDS } from '@/shared/ui/CustomSelect';
import { PROCESS_TOP_BAR_TEST_IDS } from '@/shared/ui/ProcessTopBar';
import { PhysicalPersonContactStepView } from '../components/PhysicalPersonContactStepView';
import { PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS } from '../constants/PhysicalPersonContactForm.constants';
import { PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/PhysicalPersonContactStepView.constants';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type { UsePhysicalPersonContactViewModelProps } from '../types/PhysicalPersonContact.types';
import type { PhysicalPersonContactStepViewProps } from '../types/PhysicalPersonContactStepView.types';

export interface PhysicalPersonContactStepViewTestContainerProps extends UsePhysicalPersonContactViewModelProps {
  disabled?: boolean;
  onClose?: () => void;
  testID?: string;
}

const PhysicalPersonContactStepViewTestContainer = ({
  disabled,
  onClose = jest.fn(),
  testID,
  ...hookProps
}: PhysicalPersonContactStepViewTestContainerProps): React.JSX.Element => {
  const viewModel = usePhysicalPersonContactViewModel(hookProps);
  return React.createElement(PhysicalPersonContactStepView, {
    disabled,
    onClose,
    testID,
    viewModel,
  });
};

export class PhysicalPersonContactStepViewPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props?: PhysicalPersonContactStepViewTestContainerProps,
  ): PhysicalPersonContactStepViewPageObject {
    render(
      React.createElement(
        PhysicalPersonContactStepViewTestContainer,
        props ?? {},
      ),
    );
    return new PhysicalPersonContactStepViewPageObject(props?.testID);
  }

  public static renderDirect(
    props: PhysicalPersonContactStepViewProps,
  ): PhysicalPersonContactStepViewPageObject {
    render(React.createElement(PhysicalPersonContactStepView, props));
    return new PhysicalPersonContactStepViewPageObject(props.testID);
  }

  // =========================================================================
  // Structural Layout Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ?? PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER,
    );
  }

  public get processTopBar(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR,
    );
  }

  public get closeButton(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.CLOSE_BUTTON);
  }

  public get scrollView(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW,
    );
  }

  public get wizardHeader(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER,
    );
  }

  public get title(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.TITLE);
  }

  public get description(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION,
    );
  }

  public get form(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM);
  }

  public get bottomBar(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR,
    );
  }

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON,
    );
  }

  // =========================================================================
  // Section Cards & Headers Getters
  // =========================================================================

  public get section1Card(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_CARD,
    );
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER,
    );
  }

  public get section2Card(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_CARD,
    );
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER,
    );
  }

  public get section3Card(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_CARD,
    );
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER,
    );
  }

  public get section4Card(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_CARD,
    );
  }

  public get section4Header(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER,
    );
  }

  // =========================================================================
  // Form Field Getters
  // =========================================================================

  public get emailInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMAIL_INPUT,
    );
  }

  public get cellPhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT,
    );
  }

  public get homePhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.HOME_PHONE_INPUT,
    );
  }

  public get provinceTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.PROVINCE_SELECT}-trigger`,
    );
  }

  public get cantonTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CANTON_SELECT}-trigger`,
    );
  }

  public get districtTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.DISTRICT_SELECT}-trigger`,
    );
  }

  public get exactAddressInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EXACT_ADDRESS_INPUT,
    );
  }

  public get employmentStatusTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMPLOYMENT_STATUS_SELECT}-trigger`,
    );
  }

  public get professionInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.PROFESSION_INPUT,
    );
  }

  public get employerInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMPLOYER_INPUT,
    );
  }

  public get entryDateInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.ENTRY_DATE_INPUT,
    );
  }

  public get officePhoneInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OFFICE_PHONE_INPUT,
    );
  }

  public get currencyTrigger(): ReactTestInstance {
    return screen.getByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CURRENCY_SELECT}-trigger`,
    );
  }

  public get grossIncomeInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT,
    );
  }

  public get netIncomeInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT,
    );
  }

  public get otherIncomesInput(): ReactTestInstance {
    return screen.getByTestId(
      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OTHER_INCOMES_INPUT,
    );
  }

  // =========================================================================
  // Error Message Getters
  // =========================================================================

  public get cellPhoneError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT}-error`,
    );
  }

  public get emailError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMAIL_INPUT}-error`,
    );
  }

  public get entryDateError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.ENTRY_DATE_INPUT}-error`,
    );
  }

  public get grossIncomeError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT}-error`,
    );
  }

  public get netIncomeError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT}-error`,
    );
  }

  public get officePhoneError(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OFFICE_PHONE_INPUT}-error`,
    );
  }

  // =========================================================================
  // Action Setters (Fluent Chaining)
  // =========================================================================

  public setEmail(email: string): this {
    fireEvent.changeText(this.emailInput, email);
    return this;
  }

  public setCellPhone(phone: string): this {
    fireEvent.changeText(this.cellPhoneInput, phone);
    return this;
  }

  public setHomePhone(phone: string): this {
    fireEvent.changeText(this.homePhoneInput, phone);
    return this;
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

  public selectEmploymentStatus(value: string): this {
    fireEvent.press(this.employmentStatusTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public setProfession(profession: string): this {
    fireEvent.changeText(this.professionInput, profession);
    return this;
  }

  public setEmployer(employer: string): this {
    fireEvent.changeText(this.employerInput, employer);
    return this;
  }

  public setEntryDate(date: string): this {
    fireEvent.changeText(this.entryDateInput, date);
    return this;
  }

  public setOfficePhone(phone: string): this {
    fireEvent.changeText(this.officePhoneInput, phone);
    return this;
  }

  public selectCurrency(value: string): this {
    fireEvent.press(this.currencyTrigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public setGrossIncome(amount: number | string): this {
    fireEvent.changeText(this.grossIncomeInput, String(amount));
    return this;
  }

  public setNetIncome(amount: number | string): this {
    fireEvent.changeText(this.netIncomeInput, String(amount));
    return this;
  }

  public setOtherIncomes(amount: number | string): this {
    fireEvent.changeText(this.otherIncomesInput, String(amount));
    return this;
  }

  public clickClose(): this {
    fireEvent.press(this.closeButton);
    return this;
  }

  public clickSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public fillAllValidData(overrides?: {
    cellPhone?: string;
    currency?: string;
    district?: string;
    email?: string;
    employer?: string;
    employmentStatus?: string;
    entryDate?: string;
    exactAddress?: string;
    grossIncome?: number | string;
    homePhone?: string;
    netIncome?: number | string;
    officePhone?: string;
    otherIncomes?: number | string;
    profession?: string;
    province?: string;
    canton?: string;
  }): this {
    this.setEmail(overrides?.email ?? 'carlos.rodriguez@byc.cr')
      .setCellPhone(overrides?.cellPhone ?? '+506 8888-8888')
      .setHomePhone(overrides?.homePhone ?? '+506 2222-2222')
      .selectProvince(overrides?.province ?? 'San José')
      .selectCanton(overrides?.canton ?? 'Central')
      .selectDistrict(overrides?.district ?? 'Carmen')
      .setExactAddress(
        overrides?.exactAddress ??
          '100 metros norte del Parque Central, Casa #123',
      )
      .selectEmploymentStatus(overrides?.employmentStatus ?? 'salaried_private')
      .setProfession(overrides?.profession ?? 'Ingeniero de Software')
      .setEmployer(overrides?.employer ?? 'CoriMotors S.A.')
      .setEntryDate(overrides?.entryDate ?? '15-05-2019')
      .setOfficePhone(overrides?.officePhone ?? '+506 2200-0000')
      .selectCurrency(overrides?.currency ?? 'CRC')
      .setGrossIncome(overrides?.grossIncome ?? 2500000)
      .setNetIncome(overrides?.netIncome ?? 2000000)
      .setOtherIncomes(overrides?.otherIncomes ?? 500000);

    return this;
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
}
