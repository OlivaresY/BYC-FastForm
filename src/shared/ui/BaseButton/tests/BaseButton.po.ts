import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { BaseButton } from "../BaseButton";
import { BASE_BUTTON_TEST_IDS } from "../constants/BaseButton.constants";
import type { BaseButtonProps } from "../BaseButton.types";

export class BaseButtonPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(props: BaseButtonProps): BaseButtonPageObject {
    const renderApi = render(React.createElement(BaseButton, props));
    return new BaseButtonPageObject(renderApi);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get button(): ReactTestInstance {
    return screen.getByTestId(BASE_BUTTON_TEST_IDS.BUTTON);
  }

  public get label(): ReactTestInstance | null {
    return screen.queryByTestId(BASE_BUTTON_TEST_IDS.LABEL);
  }

  public get loader(): ReactTestInstance | null {
    return screen.queryByTestId(BASE_BUTTON_TEST_IDS.LOADER);
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public press(): this {
    fireEvent.press(this.button);
    return this;
  }
}
