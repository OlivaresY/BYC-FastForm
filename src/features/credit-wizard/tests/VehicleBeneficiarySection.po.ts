import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { VehicleBeneficiarySection } from "../components/VehicleBeneficiarySection";
import { VEHICLE_BENEFICIARY_SECTION_TEST_IDS } from "../constants/VehicleBeneficiarySection.constants";
import type { VehicleBeneficiarySectionProps } from "../types/VehicleBeneficiarySection.types";

export class VehicleBeneficiarySectionPageObject {
  private readonly customTestId?: string;
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI, customTestId?: string) {
    this.renderApi = renderApi;
    this.customTestId = customTestId;
  }

  public static render(
    props: VehicleBeneficiarySectionProps,
  ): VehicleBeneficiarySectionPageObject {
    const renderApi = render(
      React.createElement(VehicleBeneficiarySection, props),
    );
    return new VehicleBeneficiarySectionPageObject(renderApi, props.testID);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get carIcon(): ReactTestInstance {
    return screen.getByTestId(VEHICLE_BENEFICIARY_SECTION_TEST_IDS.CAR_ICON);
  }

  public get container(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ?? VEHICLE_BENEFICIARY_SECTION_TEST_IDS.CONTAINER,
    );
  }

  public get headerRow(): ReactTestInstance {
    return screen.getByTestId(VEHICLE_BENEFICIARY_SECTION_TEST_IDS.HEADER_ROW);
  }

  public get headerTitle(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.HEADER_TITLE,
    );
  }

  public get prompt(): ReactTestInstance {
    return screen.getByTestId(VEHICLE_BENEFICIARY_SECTION_TEST_IDS.PROMPT);
  }

  public get sameHolderButton(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_BUTTON,
    );
  }

  public get sameHolderIcon(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_ICON,
    );
  }

  public get sameHolderLabel(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_LABEL,
    );
  }

  public get thirdPartyButton(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_BUTTON,
    );
  }

  public get thirdPartyIcon(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_ICON,
    );
  }

  public get thirdPartyLabel(): ReactTestInstance {
    return screen.getByTestId(
      VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_LABEL,
    );
  }

  // =========================================================================
  // Value & State Helpers
  // =========================================================================

  public getHeaderTitleText(): string {
    return this.headerTitle.props.children;
  }

  public getPromptText(): string {
    return this.prompt.props.children;
  }

  public getSameHolderLabelText(): string {
    return this.sameHolderLabel.props.children;
  }

  public getThirdPartyLabelText(): string {
    return this.thirdPartyLabel.props.children;
  }

  public isSameHolderSelected(): boolean {
    return this.sameHolderButton.props.accessibilityState?.selected === true;
  }

  public isThirdPartySelected(): boolean {
    return this.thirdPartyButton.props.accessibilityState?.selected === true;
  }

  public isSameHolderDisabled(): boolean {
    return this.sameHolderButton.props.accessibilityState?.disabled === true;
  }

  public isThirdPartyDisabled(): boolean {
    return this.thirdPartyButton.props.accessibilityState?.disabled === true;
  }

  public getSameHolderButtonClassName(): string {
    return String(this.sameHolderButton.props.className);
  }

  public getThirdPartyButtonClassName(): string {
    return String(this.thirdPartyButton.props.className);
  }

  public getSameHolderLabelClassName(): string {
    return String(this.sameHolderLabel.props.className);
  }

  public getThirdPartyLabelClassName(): string {
    return String(this.thirdPartyLabel.props.className);
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public pressSameHolder(): this {
    fireEvent.press(this.sameHolderButton);
    return this;
  }

  public pressThirdParty(): this {
    fireEvent.press(this.thirdPartyButton);
    return this;
  }

  public unmount(): this {
    this.renderApi.unmount();
    return this;
  }
}
