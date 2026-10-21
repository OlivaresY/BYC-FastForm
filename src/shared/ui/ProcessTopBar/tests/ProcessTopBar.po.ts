import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { ProcessTopBar } from "../ProcessTopBar";
import { PROCESS_TOP_BAR_TEST_IDS } from "../constants/ProcessTopBar.constants";
import type { ProcessTopBarProps } from "../ProcessTopBar.types";

export class ProcessTopBarPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props: ProcessTopBarProps = {},
  ): ProcessTopBarPageObject {
    render(React.createElement(ProcessTopBar, props));
    return new ProcessTopBarPageObject(props.testID);
  }

  // =========================================================================
  // Element Getters
  // =========================================================================

  public get avatarButton(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.AVATAR_BUTTON);
  }

  public get avatarInitials(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.AVATAR_INITIALS);
  }

  public get badge(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.BADGE);
  }

  public get badgeText(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.BADGE_TEXT);
  }

  public get closeButton(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.CLOSE_BUTTON);
  }

  public get container(): ReactTestInstance {
    const id = this.customTestId ?? PROCESS_TOP_BAR_TEST_IDS.CONTAINER;
    return screen.getByTestId(id);
  }

  public get divider(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.DIVIDER);
  }

  public get title(): ReactTestInstance {
    return screen.getByTestId(PROCESS_TOP_BAR_TEST_IDS.TITLE);
  }

  // =========================================================================
  // Actions & State Helpers
  // =========================================================================

  public isAvatarDisabled(): boolean {
    return this.avatarButton.props.accessibilityState?.disabled === true;
  }

  public pressAvatar(): this {
    fireEvent.press(this.avatarButton);
    return this;
  }

  public pressClose(): this {
    fireEvent.press(this.closeButton);
    return this;
  }
}
