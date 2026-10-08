import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CustomTextInput } from "../CustomTextInput";
import { CUSTOM_TEXT_INPUT_TEST_IDS } from "../constants/CustomTextInput.constants";
import type { CustomTextInputProps } from "../CustomTextInput.types";

export class CustomTextInputPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(
    props: CustomTextInputProps = {},
  ): CustomTextInputPageObject {
    const renderApi = render(React.createElement(CustomTextInput, props));
    return new CustomTextInputPageObject(renderApi);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(CUSTOM_TEXT_INPUT_TEST_IDS.CONTAINER);
  }

  public get input(): ReactTestInstance {
    return screen.getByTestId(CUSTOM_TEXT_INPUT_TEST_IDS.INPUT);
  }

  public get label(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_TEXT_INPUT_TEST_IDS.LABEL);
  }

  public get error(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_TEXT_INPUT_TEST_IDS.ERROR);
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
}
