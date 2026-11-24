import { BASE_BUTTON_TEST_IDS } from '@/shared/ui';
import type { RenderResult } from '@testing-library/react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import {
  Keyboard,
  StyleSheet,
  type KeyboardEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  LOGIN_SCREEN_STYLES,
  LOGIN_SCREEN_TEST_IDS,
} from '../../constants/LoginScreenView.constants';
import { LoginScreenView, type LoginScreenViewProps } from '../LoginScreenView';

type KeyboardEventCallback = (event: KeyboardEvent) => void;

const createKeyboardEvent = (height: number): KeyboardEvent =>
  ({
    duration: 250,
    easing: 'keyboard',
    endCoordinates: { height, screenX: 0, screenY: 500, width: 390 },
    startCoordinates: { height: 0, screenX: 0, screenY: 800, width: 390 },
  }) as unknown as KeyboardEvent;

export class LoginScreenViewPageObject {
  private static readonly keyboardListeners = new Map<
    string,
    Set<KeyboardEventCallback>
  >();
  private static consoleErrorSpy: jest.SpyInstance | null = null;
  private static keyboardAddListenerSpy: jest.SpyInstance | null = null;

  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static setupEnvironment = (): void => {
    LoginScreenViewPageObject.keyboardListeners.clear();
    LoginScreenViewPageObject.consoleErrorSpy?.mockRestore();
    LoginScreenViewPageObject.keyboardAddListenerSpy?.mockRestore();

    LoginScreenViewPageObject.consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());

    LoginScreenViewPageObject.keyboardAddListenerSpy = jest
      .spyOn(Keyboard, 'addListener')
      .mockImplementation(((
        eventName: string,
        listener: KeyboardEventCallback,
      ) => {
        const listenersForEvent =
          LoginScreenViewPageObject.keyboardListeners.get(eventName) ??
          new Set<KeyboardEventCallback>();
        listenersForEvent.add(listener);
        LoginScreenViewPageObject.keyboardListeners.set(
          eventName,
          listenersForEvent,
        );
        return {
          remove: (): void => {
            listenersForEvent.delete(listener);
          },
        };
      }) as typeof Keyboard.addListener);
  };

  public static teardownEnvironment = (): void => {
    LoginScreenViewPageObject.keyboardListeners.clear();
    LoginScreenViewPageObject.consoleErrorSpy?.mockRestore();
    LoginScreenViewPageObject.consoleErrorSpy = null;
    LoginScreenViewPageObject.keyboardAddListenerSpy?.mockRestore();
    LoginScreenViewPageObject.keyboardAddListenerSpy = null;
  };

  public static getConsoleErrorCalls = (): unknown[][] =>
    LoginScreenViewPageObject.consoleErrorSpy?.mock.calls ?? [];

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

  public getPasswordToggleIconColor = (): string | undefined => {
    const iconChild = this.passwordToggleButton.findAll(
      (node) => typeof node.props?.color === 'string',
    )[0];
    return iconChild?.props?.color as string | undefined;
  };

  public isPasswordToggleVisuallyDisabled = (): boolean => {
    let current: typeof this.passwordToggleButton | null =
      this.passwordToggleButton;
    while (current) {
      const className = current.props?.className;
      if (
        typeof className === 'string' &&
        className.includes(LOGIN_SCREEN_STYLES.PASSWORD_TOGGLE_DISABLED)
      ) {
        return true;
      }
      const flattenedStyle = StyleSheet.flatten(
        current.props?.style as StyleProp<ViewStyle>,
      );
      if (flattenedStyle?.opacity === 0.4) {
        return true;
      }
      current = current.parent;
    }
    return false;
  };

  public rerender = (props?: LoginScreenViewProps): void => {
    this.screen.rerender(React.createElement(LoginScreenView, props));
  };

  public unmount = (): void => {
    this.screen.unmount();
  };

  public fillEmail = (value: string): void => {
    fireEvent.changeText(this.emailInput, value);
  };

  public fillPassword = (value: string): void => {
    fireEvent.changeText(this.passwordInput, value);
  };

  public focusPassword = (): void => {
    fireEvent(this.passwordInput, 'focus');
  };

  public blurPassword = (): void => {
    fireEvent(this.passwordInput, 'blur');
  };

  public togglePasswordVisibility = (): void => {
    fireEvent.press(this.passwordToggleButton);
  };

  public submit = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.submitButton);
    });
  };

  public doubleSubmit = async (): Promise<void> => {
    await act(async () => {
      fireEvent.press(this.submitButton);
      fireEvent.press(this.submitButton);
    });
  };

  public flushMicrotasks = async (): Promise<void> => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  public triggerScrollViewLayout = (height: number): void => {
    fireEvent(this.scrollView, 'layout', {
      nativeEvent: { layout: { height, width: 390, x: 0, y: 0 } },
    });
  };

  public triggerScrollViewContentSizeChange = (height: number): void => {
    fireEvent(this.scrollView, 'contentSizeChange', 390, height);
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

  public emitKeyboardDidShow = (height = 300): void => {
    const event = createKeyboardEvent(height);
    act(() => {
      LoginScreenViewPageObject.keyboardListeners
        .get('keyboardDidShow')
        ?.forEach((listener) => {
          listener(event);
        });
    });
  };

  public emitKeyboardDidHide = (): void => {
    const event = createKeyboardEvent(0);
    act(() => {
      LoginScreenViewPageObject.keyboardListeners
        .get('keyboardDidHide')
        ?.forEach((listener) => {
          listener(event);
        });
    });
  };

  public waitForCondition = async (assertion: () => void): Promise<void> => {
    await waitFor(assertion);
  };
}
