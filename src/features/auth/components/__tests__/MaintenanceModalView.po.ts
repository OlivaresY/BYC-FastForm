import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { MAINTENANCE_MODAL_TEST_IDS } from '../../constants/MaintenanceModalView.constants';
import {
  MaintenanceModalView,
  type MaintenanceModalViewProps,
} from '../MaintenanceModalView';

export class MaintenanceModalViewPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static render = (
    props: MaintenanceModalViewProps,
  ): MaintenanceModalViewPageObject => {
    const rendered = render(React.createElement(MaintenanceModalView, props));
    return new MaintenanceModalViewPageObject(rendered);
  };

  public get modalRoot() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.MODAL);
  }

  public queryModalRoot = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.MODAL);

  public get backdrop() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.BACKDROP);
  }

  public get card() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.CARD);
  }

  public get iconContainer() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.ICON_CONTAINER);
  }

  public get title() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.TITLE);
  }

  public queryTitle = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.TITLE);

  public get body() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.BODY);
  }

  public queryBody = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.BODY);

  public queryAllButtons = () => this.screen.queryAllByRole('button');

  public triggerRequestClose = (): void => {
    const onRequestClose = this.modalRoot.props.onRequestClose as
      (() => void) | undefined;
    onRequestClose?.();
  };
}
