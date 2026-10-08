import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { RenderAPI } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CloseProcessModal } from "../components/CloseProcessModal";
import { CLOSE_PROCESS_MODAL_TEST_IDS } from "../constants/CloseProcessModal.constants";
import type { CloseProcessModalProps } from "../components/CloseProcessModal";

export class CloseProcessModalPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(
    props: CloseProcessModalProps,
  ): CloseProcessModalPageObject {
    const renderApi = render(React.createElement(CloseProcessModal, props));
    return new CloseProcessModalPageObject(renderApi);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get backdrop(): ReactTestInstance | null {
    return screen.queryByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.BACKDROP);
  }

  public get container(): ReactTestInstance | null {
    return screen.queryByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.CONTAINER);
  }

  public get closeButton(): ReactTestInstance {
    return screen.getByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.CLOSE_BUTTON);
  }

  public get title(): ReactTestInstance | null {
    return screen.queryByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.TITLE);
  }

  public get body(): ReactTestInstance | null {
    return screen.queryByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.BODY);
  }

  public get saveDraftButton(): ReactTestInstance {
    return screen.getByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.SAVE_DRAFT_BUTTON);
  }

  public get discardButton(): ReactTestInstance {
    return screen.getByTestId(CLOSE_PROCESS_MODAL_TEST_IDS.DISCARD_BUTTON);
  }

  // =========================================================================
  // Fluent Action Helpers
  // =========================================================================

  public pressClose(): this {
    fireEvent.press(this.closeButton);
    return this;
  }

  public pressSaveDraft(): this {
    fireEvent.press(this.saveDraftButton);
    return this;
  }

  public pressDiscard(): this {
    fireEvent.press(this.discardButton);
    return this;
  }
}
