import React from "react";
import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CUSTOM_SELECT_TEST_IDS } from "@/shared/ui/CustomSelect";
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
  gender: PHYSICAL_PERSON_FORM_TEST_IDS.GENDER_DROPDOWN,
  identificationType:
    PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_TYPE_DROPDOWN,
  maritalStatus: PHYSICAL_PERSON_FORM_TEST_IDS.MARITAL_STATUS_DROPDOWN,
  nationality: PHYSICAL_PERSON_FORM_TEST_IDS.NATIONALITY_DROPDOWN,
};

export class PhysicalPersonFormPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props: PhysicalPersonFormProps,
  ): PhysicalPersonFormPageObject {
    render(React.createElement(PhysicalPersonForm, props));
    return new PhysicalPersonFormPageObject(props.testID);
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
  // Field Elements Getters (Scoped with within() to prevent collisions)
  // =========================================================================

  public getFieldContainer(field: PhysicalPersonFormField): ReactTestInstance {
    if (field in TEXT_FIELD_TEST_ID_MAP) {
      const baseId = TEXT_FIELD_TEST_ID_MAP[field as TextInputField];
      return screen.getByTestId(`${baseId}-container`);
    }
    const baseId = SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return screen.getByTestId(baseId);
  }

  public getTextInput(field: TextInputField): ReactTestInstance {
    const container = this.getFieldContainer(field);
    return within(container).getByTestId(TEXT_FIELD_TEST_ID_MAP[field]);
  }

  public getSelectTrigger(field: SelectField): ReactTestInstance {
    const container = this.getFieldContainer(field);
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return within(container).getByTestId(`${baseId}-trigger`);
  }

  public getSelectTriggerText(field: SelectField): string {
    const container = this.getFieldContainer(field);
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return within(container).getByTestId(`${baseId}-trigger-text`).props
      .children;
  }

  public getFieldLabel(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-label`);
  }

  public getRequiredAsterisk(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-required-asterisk`);
  }

  public getFieldError(
    field: PhysicalPersonFormField,
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-error`);
  }

  public getFieldHelperText(
    field: "birthDate" | "identificationNumber",
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId = TEXT_FIELD_TEST_ID_MAP[field];
    return within(container).queryByTestId(`${baseId}-helper-text`);
  }

  public get identificationValidIcon(): ReactTestInstance | null {
    const container = this.getFieldContainer("identificationNumber");
    return within(container).queryByTestId(
      `${PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-valid-icon`,
    );
  }

  public get identificationLeftIcon(): ReactTestInstance | null {
    const container = this.getFieldContainer("identificationNumber");
    return within(container).queryByTestId(
      `${PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-left-icon`,
    );
  }

  public get birthDateLeftIcon(): ReactTestInstance | null {
    const container = this.getFieldContainer("birthDate");
    return within(container).queryByTestId(
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
