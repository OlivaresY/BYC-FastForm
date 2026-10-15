import React from "react";
import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CUSTOM_SELECT_TEST_IDS } from "@/shared/ui/CustomSelect";
import { LegalEntityForm } from "../components/LegalEntityForm";
import { LEGAL_ENTITY_FORM_TEST_IDS } from "../constants/LegalEntityForm.constants";
import type {
  LegalEntityFormField,
  LegalEntityFormProps,
} from "../types/LegalEntityForm.types";

export type TextInputField =
  | "identificationNumber"
  | "legalName"
  | "representativeIdentification"
  | "representativeName";

export type SelectField = "identificationType";

const TEXT_FIELD_TEST_ID_MAP: Record<TextInputField, string> = {
  identificationNumber: LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT,
  legalName: LEGAL_ENTITY_FORM_TEST_IDS.LEGAL_NAME_INPUT,
  representativeIdentification:
    LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_IDENTIFICATION_INPUT,
  representativeName: LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT,
};

const SELECT_FIELD_TEST_ID_MAP: Record<SelectField, string> = {
  identificationType: LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_TYPE_DROPDOWN,
};

export class LegalEntityFormPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(props: LegalEntityFormProps): LegalEntityFormPageObject {
    render(React.createElement(LegalEntityForm, props));
    return new LegalEntityFormPageObject(props.testID);
  }

  // =========================================================================
  // Section Headers & Container Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    const id = this.customTestId ?? LEGAL_ENTITY_FORM_TEST_IDS.CONTAINER;
    return screen.getByTestId(id);
  }

  public get section1Header(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_1_HEADER);
  }

  public get section1Icon(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_1_ICON);
  }

  public get section2Header(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_2_HEADER);
  }

  public get section2Icon(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_2_ICON);
  }

  public get section3Header(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_3_HEADER);
  }

  public get section3Icon(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_FORM_TEST_IDS.SECTION_3_ICON);
  }

  // =========================================================================
  // Field Elements Getters (Scoped with within() to prevent collisions)
  // =========================================================================

  public getFieldContainer(field: LegalEntityFormField): ReactTestInstance {
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

  public getSelectTrigger(
    field: SelectField = "identificationType",
  ): ReactTestInstance {
    const container = this.getFieldContainer(field);
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return within(container).getByTestId(`${baseId}-trigger`);
  }

  public getSelectTriggerText(
    field: SelectField = "identificationType",
  ): string {
    const container = this.getFieldContainer(field);
    const baseId = SELECT_FIELD_TEST_ID_MAP[field];
    return within(container).getByTestId(`${baseId}-trigger-text`).props
      .children;
  }

  public getFieldLabel(field: LegalEntityFormField): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-label`);
  }

  public getRequiredAsterisk(
    field: LegalEntityFormField,
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-required-asterisk`);
  }

  public getFieldError(field: LegalEntityFormField): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId =
      field in TEXT_FIELD_TEST_ID_MAP
        ? TEXT_FIELD_TEST_ID_MAP[field as TextInputField]
        : SELECT_FIELD_TEST_ID_MAP[field as SelectField];
    return within(container).queryByTestId(`${baseId}-error`);
  }

  public getFieldHelperText(
    field: "identificationNumber",
  ): ReactTestInstance | null {
    const container = this.getFieldContainer(field);
    const baseId = TEXT_FIELD_TEST_ID_MAP[field];
    return within(container).queryByTestId(`${baseId}-helper-text`);
  }

  public get identificationLeftIcon(): ReactTestInstance | null {
    const container = this.getFieldContainer("identificationNumber");
    return within(container).queryByTestId(
      `${LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-left-icon`,
    );
  }

  public get identificationValidIcon(): ReactTestInstance | null {
    const container = this.getFieldContainer("identificationNumber");
    return within(container).queryByTestId(
      `${LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}-valid-icon`,
    );
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public fillField(field: TextInputField, text: string): this {
    fireEvent.changeText(this.getTextInput(field), text);
    return this;
  }

  public openSelect(field: SelectField = "identificationType"): this {
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

  public isSelectDisabled(field: SelectField = "identificationType"): boolean {
    return (
      this.getSelectTrigger(field).props.accessibilityState?.disabled === true
    );
  }
}
