import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CustomTextInput } from "../CustomTextInput";
import { CUSTOM_TEXT_INPUT_TEST_IDS } from "../constants/CustomTextInput.constants";
import type { CustomTextInputProps } from "../CustomTextInput.types";

export class CustomTextInputPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props: CustomTextInputProps = {},
  ): CustomTextInputPageObject {
    render(React.createElement(CustomTextInput, props));
    return new CustomTextInputPageObject(props.testID);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    const id = this.customTestId
      ? `${this.customTestId}-container`
      : CUSTOM_TEXT_INPUT_TEST_IDS.CONTAINER;
    return screen.getByTestId(id);
  }

  public get input(): ReactTestInstance {
    const id = this.customTestId ?? CUSTOM_TEXT_INPUT_TEST_IDS.INPUT;
    return screen.getByTestId(id);
  }

  public get inputWrapper(): ReactTestInstance {
    const id = this.customTestId
      ? `${this.customTestId}-wrapper`
      : CUSTOM_TEXT_INPUT_TEST_IDS.INPUT_WRAPPER;
    return screen.getByTestId(id);
  }

  public get label(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-label`
      : CUSTOM_TEXT_INPUT_TEST_IDS.LABEL;
    return screen.queryByTestId(id);
  }

  public get requiredAsterisk(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-required-asterisk`
      : CUSTOM_TEXT_INPUT_TEST_IDS.REQUIRED_ASTERISK;
    return screen.queryByTestId(id);
  }

  public get error(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-error`
      : CUSTOM_TEXT_INPUT_TEST_IDS.ERROR;
    return screen.queryByTestId(id);
  }

  public get helperText(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-helper-text`
      : CUSTOM_TEXT_INPUT_TEST_IDS.HELPER_TEXT;
    return screen.queryByTestId(id);
  }

  public get leftIcon(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-left-icon`
      : CUSTOM_TEXT_INPUT_TEST_IDS.LEFT_ICON;
    return screen.queryByTestId(id);
  }

  public get validIcon(): ReactTestInstance | null {
    const id = this.customTestId
      ? `${this.customTestId}-valid-icon`
      : CUSTOM_TEXT_INPUT_TEST_IDS.VALID_ICON;
    return screen.queryByTestId(id);
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public fill(text: string): this {
    fireEvent.changeText(this.input, text);
    return this;
  }

  public focus(): this {
    fireEvent(this.input, "focus");
    return this;
  }

  public blur(): this {
    fireEvent(this.input, "blur");
    return this;
  }

  public clear(): this {
    fireEvent.changeText(this.input, "");
    return this;
  }

  public getWrapperClassName(): string {
    return String(this.inputWrapper.props.className);
  }
}
