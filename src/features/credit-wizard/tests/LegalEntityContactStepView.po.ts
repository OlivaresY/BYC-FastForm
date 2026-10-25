import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { PROCESS_TOP_BAR_TEST_IDS } from '@/shared/ui/ProcessTopBar';
import { LegalEntityContactStepView } from '../components/LegalEntityContactStepView';
import { LEGAL_ENTITY_CONTACT_FORM_TEST_IDS } from '../constants/LegalEntityContactForm.constants';
import { LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS } from '../constants/LegalEntityContactStepView.constants';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type { UseLegalEntityContactViewModelProps } from '../types/LegalEntityContact.types';

export interface LegalEntityContactStepViewTestContainerProps
  extends UseLegalEntityContactViewModelProps {
  currentStep?: number;
  disabled?: boolean;
  onClose?: () => void;
  testID?: string;
  totalSteps?: number;
}

const LegalEntityContactStepViewTestContainer = ({
  currentStep,
  disabled,
  onClose = jest.fn(),
  testID,
  totalSteps,
  ...hookProps
}: LegalEntityContactStepViewTestContainerProps): React.JSX.Element => {
  const viewModel = useLegalEntityContactViewModel(hookProps);
  return React.createElement(LegalEntityContactStepView, {
    currentStep,
    disabled,
    onClose,
    testID,
    totalSteps,
    viewModel,
  });
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

  // --- Section 1: INFORMACIÓN CORPORATIVA ---

  public get section1Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_1,
    );
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER,
    );
  }

  public get corporateNameInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CORPORATE_NAME_INPUT,
    );
  }

  public get corporateIdInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CORPORATE_ID_INPUT,
    );
  }

  public get constitutionDateInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CONSTITUTION_DATE_INPUT,
    );
  }

  // --- Section 2: CONTACTO CORPORATIVO ---

  public get section2Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_2,
    );
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER,
    );
  }

  public get phoneInput(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.PHONE_INPUT);
  }

  public get emailInput(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EMAIL_INPUT);
  }

  // --- Section 3: REPRESENTANTE LEGAL ---

  public get section3Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_3,
    );
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER,
    );
  }

  public get representativeNameInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT,
    );
  }

  public get representativeIdInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REPRESENTATIVE_ID_INPUT,
    );
  }

  // --- Section 4: CAPACIDAD FINANCIERA ---

  public get section4Card(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_4,
    );
  }

  public get section4Header(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER,
    );
  }

  public get grossIncomeInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT,
    );
  }

  public get netIncomeInput(): ReactTestInstance {
    return screen.getByTestId(
      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT,
    );
  }

  // --- User Actions ---

  public changeCorporateName(text: string): this {
    fireEvent.changeText(this.corporateNameInput, text);
    return this;
  }

  public changeCorporateId(text: string): this {
    fireEvent.changeText(this.corporateIdInput, text);
    return this;
  }

  public changeConstitutionDate(text: string): this {
    fireEvent.changeText(this.constitutionDateInput, text);
    return this;
  }

  public changePhone(text: string): this {
    fireEvent.changeText(this.phoneInput, text);
    return this;
  }

  public changeEmail(text: string): this {
    fireEvent.changeText(this.emailInput, text);
    return this;
  }

  public changeRepresentativeName(text: string): this {
    fireEvent.changeText(this.representativeNameInput, text);
    return this;
  }

  public changeRepresentativeId(text: string): this {
    fireEvent.changeText(this.representativeIdInput, text);
    return this;
  }

  public changeGrossIncome(text: string): this {
    fireEvent.changeText(this.grossIncomeInput, text);
    return this;
  }

  public changeNetIncome(text: string): this {
    fireEvent.changeText(this.netIncomeInput, text);
    return this;
  }

  public pressBack(): this {
    fireEvent.press(this.backButton);
    return this;
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public fillValidForm(): this {
    this.changeCorporateName('Distribuidora del Este S.A.');
    this.changeCorporateId('3-101-123456');
    this.changeConstitutionDate('15-05-2015');
    this.changePhone('+506 2200-0000');
    this.changeEmail('contacto@distribuidora.cr');
    this.changeRepresentativeName('Juan Alberto Perez Rojas');
    this.changeRepresentativeId('1-1150-0222');
    this.changeGrossIncome('5000000');
    this.changeNetIncome('3500000');
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

