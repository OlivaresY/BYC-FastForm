import React from "react";
import { render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { WizardProgressHeader } from "../components/WizardProgressHeader";
import { WIZARD_PROGRESS_HEADER_TEST_IDS } from "../constants/WizardProgressHeader.constants";
import type { WizardProgressHeaderProps } from "../types/WizardProgressHeader.types";

export class WizardProgressHeaderPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(
    props: WizardProgressHeaderProps,
  ): WizardProgressHeaderPageObject {
    const renderApi = render(React.createElement(WizardProgressHeader, props));
    return new WizardProgressHeaderPageObject(renderApi);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.CONTAINER);
  }

  public get percentageBadge(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_BADGE);
  }

  public get percentageText(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_TEXT);
  }

  public get progressBarFill(): ReactTestInstance {
    return screen.getByTestId(
      WIZARD_PROGRESS_HEADER_TEST_IDS.PROGRESS_BAR_FILL,
    );
  }

  public get progressBarTrack(): ReactTestInstance {
    return screen.getByTestId(
      WIZARD_PROGRESS_HEADER_TEST_IDS.PROGRESS_BAR_TRACK,
    );
  }

  public get stepLabel(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_LABEL);
  }

  public get subtitle(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.SUBTITLE);
  }

  public get title(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.TITLE);
  }

  // =========================================================================
  // Value & Style Helpers
  // =========================================================================

  public getPercentageText(): string {
    return this.percentageText.props.children;
  }

  public getProgressBarFillStyle(): { width?: string } {
    return this.progressBarFill.props.style;
  }

  public getStepText(): string {
    return this.stepLabel.props.children;
  }

  public getSubtitleText(): string {
    return this.subtitle.props.children;
  }

  public getTitleText(): string {
    return this.title.props.children;
  }
}
