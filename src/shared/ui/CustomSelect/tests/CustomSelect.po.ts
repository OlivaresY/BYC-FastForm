import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CustomSelect } from "../CustomSelect";
import { CUSTOM_SELECT_TEST_IDS } from "../constants/CustomSelect.constants";
import type { CustomSelectProps } from "../CustomSelect.types";

export class CustomSelectPageObject {
  private readonly customTestId?: string;
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI, customTestId?: string) {
    this.renderApi = renderApi;
    this.customTestId = customTestId;
  }

  public static render(props: CustomSelectProps): CustomSelectPageObject {
    const renderApi = render(React.createElement(CustomSelect, props));
    return new CustomSelectPageObject(renderApi, props.testID);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ?? CUSTOM_SELECT_TEST_IDS.CONTAINER,
    );
  }

  public get trigger(): ReactTestInstance {
    return screen.getByTestId(CUSTOM_SELECT_TEST_IDS.TRIGGER);
  }

  public get triggerText(): ReactTestInstance {
    return screen.getByTestId(CUSTOM_SELECT_TEST_IDS.TRIGGER_TEXT);
  }

  public get chevronIcon(): ReactTestInstance {
    return screen.getByTestId(CUSTOM_SELECT_TEST_IDS.CHEVRON_ICON);
  }

  public get leftIcon(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.LEFT_ICON);
  }

  public get label(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.LABEL);
  }

  public get requiredAsterisk(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.REQUIRED_ASTERISK);
  }

  public get errorMessage(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.ERROR_MESSAGE);
  }

  public get helperText(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.HELPER_TEXT);
  }

  public get modal(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.MODAL);
  }

  public get modalBackdrop(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.MODAL_BACKDROP);
  }

  public get modalCard(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.MODAL_CARD);
  }

  public get modalTitle(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.MODAL_TITLE);
  }

  public get modalCloseButton(): ReactTestInstance | null {
    return screen.queryByTestId(CUSTOM_SELECT_TEST_IDS.MODAL_CLOSE_BUTTON);
  }

  public getOption(value: string): ReactTestInstance | null {
    return screen.queryByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
  }

  public getOptionCheck(value: string): ReactTestInstance | null {
    return screen.queryByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_CHECK_PREFIX}${value}`,
    );
  }

  // =========================================================================
  // Value & State Helpers
  // =========================================================================

  public getTriggerText(): string {
    return this.triggerText.props.children;
  }

  public getTriggerClassName(): string {
    return String(this.trigger.props.className);
  }

  public getLabelText(): string | undefined {
    return this.label?.props.children;
  }

  public getErrorMessageText(): string | undefined {
    return this.errorMessage?.props.children;
  }

  public getHelperText(): string | undefined {
    return this.helperText?.props.children;
  }

  public getModalTitleText(): string | undefined {
    return this.modalTitle?.props.children;
  }

  public isTriggerDisabled(): boolean {
    return this.trigger.props.accessibilityState?.disabled === true;
  }

  public isTriggerExpanded(): boolean {
    return this.trigger.props.accessibilityState?.expanded === true;
  }

  public isTriggerInvalid(): boolean {
    return this.trigger.props["aria-invalid"] === true;
  }

  public isModalVisible(): boolean {
    return this.modal?.props.visible === true;
  }

  public isOptionSelected(value: string): boolean {
    return this.getOption(value)?.props.accessibilityState?.selected === true;
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public pressTrigger(): this {
    fireEvent.press(this.trigger);
    return this;
  }

  public pressBackdrop(): this {
    if (this.modalBackdrop) {
      fireEvent.press(this.modalBackdrop);
    }
    return this;
  }

  public pressModalCard(): this {
    if (this.modalCard) {
      fireEvent.press(this.modalCard);
    }
    return this;
  }

  public pressCloseButton(): this {
    if (this.modalCloseButton) {
      fireEvent.press(this.modalCloseButton);
    }
    return this;
  }

  public selectOption(value: string): this {
    const option = this.getOption(value);
    if (option) {
      fireEvent.press(option);
    }
    return this;
  }

  public dismissModalViaNativeRequest(): this {
    if (this.modal) {
      fireEvent(this.modal, "requestClose");
    }
    return this;
  }

  public unmount(): this {
    this.renderApi.unmount();
    return this;
  }
}
