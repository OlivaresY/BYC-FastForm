import React from 'react';
import { Keyboard } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { BASE_BUTTON_TEST_IDS } from '@/shared/ui';
import { LOGIN_SCREEN_TEST_IDS } from '../../constants/LoginScreenView.constants';
import { LoginScreenView, type LoginScreenViewProps } from '../LoginScreenView';

type MockKeyboardWithEmitter = typeof Keyboard & {
  _emitter?: { emit: (event: string, ...args: unknown[]) => void };
  emit?: (event: string, ...args: unknown[]) => void;
};

const emitKeyboardEvent = (event: string, payload?: unknown): void => {
  const keyboardWithEmitter = Keyboard as unknown as MockKeyboardWithEmitter;
  if (typeof keyboardWithEmitter.emit === 'function') {
    keyboardWithEmitter.emit(event, payload);
    return;
  }
  keyboardWithEmitter._emitter?.emit(event, payload);
};

export class LoginScreenViewPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static render = (
    props?: LoginScreenViewProps,
  ): LoginScreenViewPageObject => {
    const rendered = render(React.createElement(LoginScreenView, props));
    return new LoginScreenViewPageObject(rendered);
  };

  public get header() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.HEADER);
  }

  public get scrollView() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.SCROLL_VIEW);
  }

  public get badge() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.BADGE);
  }

  public get logo() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.LOGO);
  }

  public get card() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.CARD);
  }

  public get footer() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.FOOTER);
  }

  public get emailInput() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.EMAIL_INPUT);
  }

  public get passwordInput() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.PASSWORD_INPUT);
  }

  public get passwordToggleButton() {
    return this.screen.getByTestId(
      LOGIN_SCREEN_TEST_IDS.PASSWORD_TOGGLE_BUTTON,
    );
  }

  public get forgotPasswordButton() {
    return this.screen.getByTestId(
      LOGIN_SCREEN_TEST_IDS.FORGOT_PASSWORD_BUTTON,
    );
  }

  public get submitButton() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.SUBMIT_BUTTON);
  }

  public get socialDivider() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.DIVIDER);
  }

  public get googleButton() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.GOOGLE_BUTTON);
  }

  public get facebookButton() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.FACEBOOK_BUTTON);
  }

  public querySocialNotice = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.SOCIAL_NOTICE);

  public querySubmitLoader = () =>
    this.screen.queryByTestId(BASE_BUTTON_TEST_IDS.LOADER);

  public queryEmailError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.EMAIL_ERROR);

  public queryPasswordError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.PASSWORD_ERROR);

  public queryAuthError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.AUTH_ERROR);

  public getByText = (text: string) => this.screen.getByText(text);

  public queryByText = (text: string) => this.screen.queryByText(text);

  public fillEmail = (value: string): void => {
    fireEvent.changeText(this.emailInput, value);
  };

  public fillPassword = (value: string): void => {
    fireEvent.changeText(this.passwordInput, value);
  };

  public togglePasswordVisibility = (): void => {
    fireEvent.press(this.passwordToggleButton);
  };

  public submit = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.submitButton);
    });
  };

  public pressForgotPasswordButton = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.forgotPasswordButton);
    });
  };

  public pressGoogleButton = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.googleButton);
    });
  };

  public pressFacebookButton = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.facebookButton);
    });
  };

  public emitKeyboardDidShow = (): void => {
    act(() => {
      emitKeyboardEvent('keyboardDidShow', {
        endCoordinates: { height: 300, screenX: 0, screenY: 500, width: 390 },
      });
    });
  };

  public emitKeyboardDidHide = (): void => {
    act(() => {
      emitKeyboardEvent('keyboardDidHide');
    });
  };

  public waitForCondition = async (assertion: () => void): Promise<void> => {
    await waitFor(assertion);
  };
}
