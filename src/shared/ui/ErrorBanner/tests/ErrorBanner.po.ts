import React from "react";
import { render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { ErrorBanner } from "../ErrorBanner";
import { ERROR_BANNER_TEST_IDS } from "../constants/ErrorBanner.constants";
import type { ErrorBannerProps } from "../ErrorBanner.types";

export class ErrorBannerPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(props: ErrorBannerProps): ErrorBannerPageObject {
    const renderApi = render(React.createElement(ErrorBanner, props));
    return new ErrorBannerPageObject(renderApi);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(ERROR_BANNER_TEST_IDS.CONTAINER);
  }

  public get message(): ReactTestInstance {
    return screen.getByTestId(ERROR_BANNER_TEST_IDS.MESSAGE);
  }

  public get title(): ReactTestInstance | null {
    return screen.queryByTestId(ERROR_BANNER_TEST_IDS.TITLE);
  }
}
