import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { FinalBeneficiaryModal } from '../components/FinalBeneficiaryModal';
import {
  BENEFICIARY_MODAL_COPY,
  BENEFICIARY_MODAL_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
import type { FinalBeneficiaryModalProps } from '../types/ApplicantStepView.types';

export class FinalBeneficiaryModalPageObject {
  public static render(
    props: FinalBeneficiaryModalProps,
  ): FinalBeneficiaryModalPageObject {
    render(React.createElement(FinalBeneficiaryModal, props));
    return new FinalBeneficiaryModalPageObject();
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get backdrop(): ReactTestInstance | null {
    return screen.queryByTestId(BENEFICIARY_MODAL_TEST_IDS.BACKDROP);
  }

  public get birthDateInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.BIRTH_DATE_INPUT);
  }

  public get birthDateValue(): string {
    return this.birthDateInput.props.value;
  }

  public get closeButton(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.CLOSE_BUTTON);
  }

  public get container(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.MODAL_CONTAINER);
  }

  public get docNumberInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.DOC_NUMBER_INPUT);
  }

  public get docTypeInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.DOC_TYPE_INPUT);
  }

  public get emailInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.EMAIL_INPUT);
  }

  public get fullNameInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.FULL_NAME_INPUT);
  }

  public get identificationLabel(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.IDENTIFICATION_LABEL);
  }

  public get modalContainer(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.MODAL_CONTAINER);
  }

  public get nationalityInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.NATIONALITY_INPUT);
  }

  public get phoneInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.PHONE_INPUT);
  }

  public get relationshipInput(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.RELATIONSHIP_INPUT);
  }

  public get saveButton(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.SAVE_BUTTON);
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.SECTION_1_HEADER);
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.SECTION_2_HEADER);
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.SECTION_3_HEADER);
  }

  public get section4Header(): ReactTestInstance {
    return screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.SECTION_4_HEADER);
  }

  public get subtitle(): ReactTestInstance | null {
    return screen.queryByText(BENEFICIARY_MODAL_COPY.SUBTITLE);
  }

  public get title(): ReactTestInstance | null {
    return screen.queryByText(BENEFICIARY_MODAL_COPY.TITLE);
  }

  // =========================================================================
  // Query Helpers
  // =========================================================================

  public queryErrorText(message: string): ReactTestInstance | null {
    return screen.queryByText(message);
  }

  // =========================================================================
  // Fluent Action Helpers (return this)
  // =========================================================================

  public fillBirthDate(date: string): this {
    fireEvent.changeText(this.birthDateInput, date);
    return this;
  }

  public fillDocNumber(docNumber: string): this {
    fireEvent.changeText(this.docNumberInput, docNumber);
    return this;
  }

  public fillEmail(email: string): this {
    fireEvent.changeText(this.emailInput, email);
    return this;
  }

  public fillFullName(name: string): this {
    fireEvent.changeText(this.fullNameInput, name);
    return this;
  }

  public fillPhone(phone: string): this {
    fireEvent.changeText(this.phoneInput, phone);
    return this;
  }

  public pressBackdrop(): this {
    fireEvent.press(screen.getByTestId(BENEFICIARY_MODAL_TEST_IDS.BACKDROP));
    return this;
  }

  public pressClose(): this {
    fireEvent.press(this.closeButton);
    return this;
  }

  public pressSave(): this {
    fireEvent.press(this.saveButton);
    return this;
  }
}
