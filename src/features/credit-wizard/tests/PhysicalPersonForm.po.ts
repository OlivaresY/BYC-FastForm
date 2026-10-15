import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CUSTOM_SELECT_TEST_IDS } from "@/shared/ui/CustomSelect/constants/CustomSelect.constants";
import { PhysicalPersonForm } from "../components/PhysicalPersonForm";
import { PHYSICAL_PERSON_FORM_TEST_IDS } from "../constants/PhysicalPersonForm.constants";
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormProps,
} from "../types/PhysicalPersonForm.types";

export type TextInputField =
  | "birthDate"
  | "firstLastName"
  | "firstName"
  | "identificationNumber"
  | "middleName"
  | "secondLastName";

export type SelectField =
  "gender" | "identificationType" | "maritalStatus" | "nationality";

const TEXT_FIELD_TEST_ID_MAP: Record<TextInputField, string> = {
  birthDate: PHYSICAL_PERSON_FORM_TEST_IDS.BIRTH_DATE_INPUT,
  firstLastName: PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_LAST_NAME_INPUT,
  firstName: PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_NAME_INPUT,
  identificationNumber:
    PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT,
  middleName: PHYSICAL_PERSON_FORM_TEST_IDS.MIDDLE_NAME_INPUT,
  secondLastName: PHYSICAL_PERSON_FORM_TEST_IDS.SECOND_LAST_NAME_INPUT,
};

const SELECT_FIELD_TEST_ID_MAP: Record<SelectField, string> = {
  gender: PHYSICAL_PERSON_FORM_TEST_IDS.GENDER_SELECT,
  identificationType: PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_TYPE_SELECT,
  maritalStatus: PHYSICAL_PERSON_FORM_TEST_IDS.MARITAL_STATUS_SELECT,
  nationality: PHYSICAL_PERSON_FORM_TEST_IDS.NATIONALITY_SELECT,
};

export class PhysicalPersonFormPageObject {
  private readonly customTestId?: string;
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI, customTestId?: string) {
    this.renderApi = renderApi;
    this.customTestId = customTestId;
  }

  public static render(
    props: PhysicalPersonFormProps,
  ): PhysicalPersonFormPageObject {
    const renderApi = render(React.createElement(PhysicalPersonForm, props));
    return new PhysicalPersonFormPageObject(renderApi, props.testID);
  }

  // =========================================================================
  // Section Headers & Container Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    const id = this.customTestId ?? PHYSICAL_PERSON_FORM_TEST_IDS.CONTAINER;
    return screen.getByTestId(id);
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_1_HEADER);
  }

  public get section1Icon(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_1_ICON);
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_2_HEADER);
  }

  public get section2Icon(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_2_ICON);
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_3_HEADER);
  }

  public get section3Icon(): ReactTestInstance {
    return screen.getByTestId(PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_3_ICON);
  }

  // =========================================================================
  // Field Elements Getters
  // =========================================================================

  public getTextInput(field: TextInputField): ReactTestInstance {
    return screen.getByTestId(TEXT_FIELD_TEST_ID_MAP[field]);
  }

  public getSelectTrigger(field: SelectField): ReactTestInstance {
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return screen.getByTestId(`${baseId}-trigger`);
  }

  public getSelectTriggerText(field: SelectField): string {
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return screen.getByTestId(`${baseId}-trigger-text`).props.children;
  }

  public getFieldLabel(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    if (field in TEXT_FIELD_TEST_ID_MAP) {
      const baseId = TEXT_FIELD_TEST_ID_MAP[field as TextInputField];
      return screen.queryByTestId(`${baseId}-label`);
    }
    const baseId = SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return screen.queryByTestId(`${baseId}-${CUSTOM_SELECT_TEST_IDS.LABEL}`);
  }

  public getRequiredAsterisk(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    if (field in TEXT_FIELD_TEST_ID_MAP) {
      const baseId = TEXT_FIELD_TEST_ID_MAP[field as TextInputField];
      return screen.queryByTestId(`${baseId}-required-asterisk`);
    }
    const baseId = SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return screen.queryByTestId(
      `${baseId}-${CUSTOM_SELECT_TEST_IDS.REQUIRED_ASTERISK}`,
    );
  }

  public getFieldError(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    if (field in TEXT_FIELD_TEST_ID_MAP) {
      const baseId = TEXT_FIELD_TEST_ID_MAP[field as TextInputField];
      return screen.queryByTestId(`${baseId}-error`);
    }
    const baseId = SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return screen.queryByTestId(`${baseId}-error`);
  }

  public getFieldHelperText(
    field: "birthDate" | "identificationNumber",
  ): ReactTestInstance | null {
    const baseId = TEXT_FIELD_TEST_ID_MAP[field];
    return screen.queryByTestId(`${baseId}-helper-text`);
  }

  public get identificationValidIcon(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-valid-icon`,
    );
  }

  public get identificationLeftIcon(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-left-icon`,
    );
  }

  public get birthDateLeftIcon(): ReactTestInstance | null {
    return screen.queryByTestId(
      `${PHYSICAL_PERSON_FORM_TEST_IDS.BIRTH_DATE_INPUT}-left-icon`,
    );
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public fillField(field: TextInputField, text: string): this {
    fireEvent.changeText(this.getTextInput(field), text);
    return this;
  }

  public openSelect(field: SelectField): this {
    fireEvent.press(this.getSelectTrigger(field));
    return this;
  }

  public selectOption(value: string): this {
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  // =========================================================================
  // State Inspection Helpers
  // =========================================================================

  public isInputEditable(field: TextInputField): boolean {
    return this.getTextInput(field).props.editable !== false;
  }

  public isSelectDisabled(field: SelectField): boolean {
    return (
      this.getSelectTrigger(field).props.accessibilityState?.disabled === true
    );
  }
}
