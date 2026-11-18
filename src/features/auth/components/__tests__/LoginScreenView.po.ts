import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { BASE_BUTTON_TEST_IDS } from '@/shared/ui';
import { LOGIN_SCREEN_TEST_IDS } from '../../constants/LoginScreenView.constants';
import { LoginScreenView, type LoginScreenViewProps } from '../LoginScreenView';

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

  public get badge() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.BADGE);
  }

  public get logo() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.LOGO);
  }

  public get card() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.CARD);
  }

  public get divider() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.DIVIDER);
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

  public get googleButton() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.GOOGLE_BUTTON);
  }

  public get facebookButton() {
    return this.screen.getByTestId(LOGIN_SCREEN_TEST_IDS.FACEBOOK_BUTTON);
  }

  public querySubmitLoader = () =>
    this.screen.queryByTestId(BASE_BUTTON_TEST_IDS.LOADER);

  public queryEmailError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.EMAIL_ERROR);

  public queryPasswordError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.PASSWORD_ERROR);

  public queryAuthError = () =>
    this.screen.queryByTestId(LOGIN_SCREEN_TEST_IDS.AUTH_ERROR);

  public getByText = (text: string) => this.screen.getByText(text);

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

  public waitForCondition = async (assertion: () => void): Promise<void> => {
    await waitFor(assertion);
  };
}
