import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { MAINTENANCE_MODAL_TEST_IDS } from '@/features/auth';
import RootLayout from '../_layout';

export const ROOT_LAYOUT_TEST_IDS = {
  STACK: 'mock-root-stack',
} as const;

export class RootLayoutPageObject {
  private readonly screen: RenderResult;

  public constructor(screen: RenderResult) {
    this.screen = screen;
  }

  public static render = (): RootLayoutPageObject => {
    const rendered = render(React.createElement(RootLayout));
    return new RootLayoutPageObject(rendered);
  };

  public get stack() {
    return this.screen.getByTestId(ROOT_LAYOUT_TEST_IDS.STACK);
  }

  public get maintenanceModal() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.MODAL);
  }

  public queryMaintenanceModal = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.MODAL);

  public get maintenanceTitle() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.TITLE);
  }

  public get maintenanceBody() {
    return this.screen.getByTestId(MAINTENANCE_MODAL_TEST_IDS.BODY);
  }

  public queryMaintenanceTitle = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.TITLE);

  public queryMaintenanceBody = () =>
    this.screen.queryByTestId(MAINTENANCE_MODAL_TEST_IDS.BODY);
}
