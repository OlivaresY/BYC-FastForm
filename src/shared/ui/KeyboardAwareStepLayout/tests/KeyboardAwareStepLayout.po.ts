import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { RenderAPI } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS } from '../constants/KeyboardAwareStepLayout.constants';
import { KeyboardAwareStepLayout } from '../KeyboardAwareStepLayout';
import type { KeyboardAwareStepLayoutProps } from '../KeyboardAwareStepLayout.types';

export class KeyboardAwareStepLayoutPageObject {
  private readonly renderApi: RenderAPI;
  private readonly customScrollViewTestId?: string;
  private readonly customTestId?: string;

  public constructor(
    renderApi: RenderAPI,
    customTestId?: string,
    customScrollViewTestId?: string,
  ) {
    this.renderApi = renderApi;
    this.customTestId = customTestId;
    this.customScrollViewTestId = customScrollViewTestId;
  }

  public static render(
    props: KeyboardAwareStepLayoutProps,
  ): KeyboardAwareStepLayoutPageObject {
    const renderApi = render(
      React.createElement(KeyboardAwareStepLayout, props),
    );
    return new KeyboardAwareStepLayoutPageObject(
      renderApi,
      props.testID,
      props.scrollViewTestID,
    );
  }

  public get keyboardAvoidingView(): ReactTestInstance {
    return screen.getByTestId(
      this.customTestId ??
        KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.KEYBOARD_AVOIDING_VIEW,
    );
  }

  public get scrollView(): ReactTestInstance {
    return screen.getByTestId(
      this.customScrollViewTestId ??
        KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.SCROLL_VIEW,
    );
  }

  public get footer(): ReactTestInstance | null {
    return screen.queryByTestId(KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.FOOTER);
  }

  public scroll(contentOffsetY: number): this {
    fireEvent.scroll(this.scrollView, {
      nativeEvent: {
        contentOffset: {
          x: 0,
          y: contentOffsetY,
        },
      },
    });
    return this;
  }
}
