import React from "react";
import { render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { WizardProgressHeader } from "../components/WizardProgressHeader";
import {
  WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES,
  WIZARD_PROGRESS_HEADER_TEST_IDS,
} from "../constants/WizardProgressHeader.constants";
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

  public get checkIcon(): ReactTestInstance | null {
    return screen.queryByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.CHECK_ICON);
  }

  public get container(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.CONTAINER);
  }

  public get percentageBadge(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_BADGE);
  }

  public get percentageText(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.PERCENTAGE_TEXT);
  }

  public get segmentedLine(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.SEGMENTED_LINE);
  }

  public get segments(): ReactTestInstance[] {
    return screen.queryAllByTestId(
      new RegExp(`^${WIZARD_PROGRESS_HEADER_TEST_IDS.SEGMENT_PREFIX}\\d+$`),
    );
  }

  public get stepIcon(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_ICON);
  }

  public get stepLabel(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_LABEL);
  }

  public get stepPill(): ReactTestInstance {
    return screen.getByTestId(WIZARD_PROGRESS_HEADER_TEST_IDS.STEP_PILL);
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

  public getActiveSegmentStates(): boolean[] {
    return this.segments.map((segment) =>
      String(segment.props.className).includes(
        WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.ACTIVE,
      ),
    );
  }

  public getBadgeClassName(): string {
    return String(this.percentageBadge.props.className);
  }

  public getBadgeTextClassName(): string {
    return String(this.percentageText.props.className);
  }

  public getPercentageText(): string {
    return this.percentageText.props.children;
  }

  public getSegmentClassNames(): string[] {
    return this.segments.map((segment) => String(segment.props.className));
  }

  public getSegmentCount(): number {
    return this.segments.length;
  }

  public getStepPillClassName(): string {
    return String(this.stepPill.props.className);
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

  // =========================================================================
  // Fluent Lifecycle Helpers
  // =========================================================================

  public unmount(): this {
    this.renderApi.unmount();
    return this;
  }
}
