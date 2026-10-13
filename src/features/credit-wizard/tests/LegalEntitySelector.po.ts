import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { LegalEntitySelector } from "../components/LegalEntitySelector";
import { LEGAL_ENTITY_SELECTOR_TEST_IDS } from "../constants/LegalEntitySelector.constants";
import type { LegalEntitySelectorProps } from "../types/LegalEntitySelector.types";

export class LegalEntitySelectorPageObject {
  private readonly customTestId?: string;
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI, customTestId?: string) {
    this.renderApi = renderApi;
    this.customTestId = customTestId;
  }

  public static render(
    props: LegalEntitySelectorProps,
  ): LegalEntitySelectorPageObject {
    const renderApi = render(React.createElement(LegalEntitySelector, props));
    return new LegalEntitySelectorPageObject(renderApi, props.testID);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ?? LEGAL_ENTITY_SELECTOR_TEST_IDS.CONTAINER,
    );
  }

  public get headerTitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.HEADER_TITLE);
  }

  public get headerSubtitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.HEADER_SUBTITLE);
  }

  public get physicalCard(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_CARD);
  }

  public get legalCard(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_CARD);
  }

  public get physicalBadge(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_BADGE);
  }

  public get legalBadge(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_BADGE);
  }

  public get physicalTitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_TITLE);
  }

  public get physicalSubtitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_SUBTITLE);
  }

  public get legalTitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_TITLE);
  }

  public get legalSubtitle(): ReactTestInstance {
    return screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_SUBTITLE);
  }

  // =========================================================================
  // Value & State Helpers
  // =========================================================================

  public getHeaderTitleText(): string {
    return this.headerTitle.props.children;
  }

  public getHeaderSubtitleText(): string {
    return this.headerSubtitle.props.children;
  }

  public getPhysicalTitleText(): string {
    return this.physicalTitle.props.children;
  }

  public getPhysicalSubtitleText(): string {
    return this.physicalSubtitle.props.children;
  }

  public getLegalTitleText(): string {
    return this.legalTitle.props.children;
  }

  public getLegalSubtitleText(): string {
    return this.legalSubtitle.props.children;
  }

  public isPhysicalSelected(): boolean {
    return this.physicalCard.props.accessibilityState?.selected === true;
  }

  public isLegalSelected(): boolean {
    return this.legalCard.props.accessibilityState?.selected === true;
  }

  public isPhysicalDisabled(): boolean {
    return this.physicalCard.props.accessibilityState?.disabled === true;
  }

  public isLegalDisabled(): boolean {
    return this.legalCard.props.accessibilityState?.disabled === true;
  }

  public getPhysicalCardClassName(): string {
    return String(this.physicalCard.props.className);
  }

  public getLegalCardClassName(): string {
    return String(this.legalCard.props.className);
  }

  public getPhysicalBadgeClassName(): string {
    return String(this.physicalBadge.props.className);
  }

  public getLegalBadgeClassName(): string {
    return String(this.legalBadge.props.className);
  }

  public getPhysicalTitleClassName(): string {
    return String(this.physicalTitle.props.className);
  }

  public getLegalTitleClassName(): string {
    return String(this.legalTitle.props.className);
  }

  public getPhysicalSubtitleClassName(): string {
    return String(this.physicalSubtitle.props.className);
  }

  public getLegalSubtitleClassName(): string {
    return String(this.legalSubtitle.props.className);
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public pressPhysical(): this {
    fireEvent.press(this.physicalCard);
    return this;
  }

  public pressLegal(): this {
    fireEvent.press(this.legalCard);
    return this;
  }

  public unmount(): this {
    this.renderApi.unmount();
    return this;
  }
}
