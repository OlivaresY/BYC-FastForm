import {
  fireEvent,
  render,
  type RenderResult,
} from '@testing-library/react-native';
import React from 'react';
import {
  SafeAreaInsetsContext,
  type EdgeInsets,
} from 'react-native-safe-area-context';
import type { ReactTestInstance } from 'react-test-renderer';
import { BOTTOM_TAB_BAR_TEST_IDS } from '../../constants';
import type { BottomTabBarViewProps } from '../../types';
import { BottomTabBarView } from '../BottomTabBarView';

const DEFAULT_SAFE_AREA_INSETS: EdgeInsets = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

export interface BottomTabBarViewRenderOptions extends BottomTabBarViewProps {
  insets?: EdgeInsets;
}

export class BottomTabBarViewPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static render = ({
    insets = DEFAULT_SAFE_AREA_INSETS,
    ...props
  }: BottomTabBarViewRenderOptions): BottomTabBarViewPageObject => {
    const rendered = render(
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: insets },
        React.createElement(BottomTabBarView, props),
      ),
    );

    return new BottomTabBarViewPageObject(rendered);
  };

  public get container(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.CONTAINER);
  }

  public get newApplicationTab(): ReactTestInstance {
    return this.screen.getByTestId(
      BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_TAB,
    );
  }

  public get newApplicationLabel(): ReactTestInstance {
    return this.screen.getByTestId(
      BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_LABEL,
    );
  }

  public get historialTab(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.HISTORY_TAB);
  }

  public get historialLabel(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.HISTORY_LABEL);
  }

  public get perfilTab(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.PROFILE_TAB);
  }

  public get perfilLabel(): ReactTestInstance {
    return this.screen.getByTestId(BOTTOM_TAB_BAR_TEST_IDS.PROFILE_LABEL);
  }

  public get allTabs(): ReactTestInstance[] {
    return this.screen.getAllByRole('tab');
  }

  public get newApplicationIcon(): ReactTestInstance {
    return this.getTabDecorativeIcon(this.newApplicationTab);
  }

  public get historialIcon(): ReactTestInstance {
    return this.getTabDecorativeIcon(this.historialTab);
  }

  public get perfilIcon(): ReactTestInstance {
    return this.getTabDecorativeIcon(this.perfilTab);
  }

  public get allDecorativeIcons(): ReactTestInstance[] {
    return [this.newApplicationIcon, this.historialIcon, this.perfilIcon];
  }

  private readonly getTabDecorativeIcon = (
    tab: ReactTestInstance,
  ): ReactTestInstance =>
    tab.find(
      (node) =>
        typeof node.type === 'string' &&
        node.props.accessible === false &&
        node.props.importantForAccessibility === 'no',
    );

  public pressNewApplication = (): this => {
    fireEvent.press(this.newApplicationTab);
    return this;
  };

  public pressHistorial = (): this => {
    fireEvent.press(this.historialTab);
    return this;
  };

  public pressPerfil = (): this => {
    fireEvent.press(this.perfilTab);
    return this;
  };
}
