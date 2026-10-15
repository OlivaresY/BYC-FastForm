import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { BaseButton } from "../BaseButton";
import { BASE_BUTTON_TEST_IDS } from "../constants/BaseButton.constants";
import type { BaseButtonProps } from "../BaseButton.types";

export class BaseButtonPageObject {
  public static render(props: BaseButtonProps): BaseButtonPageObject {
    render(React.createElement(BaseButton, props));
    return new BaseButtonPageObject();
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
