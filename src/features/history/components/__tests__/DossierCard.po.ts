import { fireEvent, render, type RenderResult } from '@testing-library/react-native';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  type AccessibilityState,
} from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { esCR } from '@/shared/i18n';
import {
  DOSSIER_CARD_TEST_IDS,
  HISTORY_INTERNAL_STRINGS,
} from '../../constants';
import type { DossierCardProps } from '../../types';
import { DossierCard } from '../DossierCard';

export type DossierCardButtonTarget = 'quickPrint' | 'retry' | 'viewDossier';

export class DossierCardPageObject {
  private readonly screen: RenderResult;
  private rootTestId: string;

  public constructor(screen: RenderResult, rootTestId: string) {
    this.screen = screen;
    this.rootTestId = rootTestId;
  }

  public static render = (props: DossierCardProps): DossierCardPageObject => {
    const resolvedRootTestId = props.testID ?? DOSSIER_CARD_TEST_IDS.CARD_ROOT;
    const rendered = render(React.createElement(DossierCard, props));

    return new DossierCardPageObject(rendered, resolvedRootTestId);
  };

  public rerender = (props: DossierCardProps): this => {
    this.rootTestId = props.testID ?? DOSSIER_CARD_TEST_IDS.CARD_ROOT;
    this.screen.rerender(React.createElement(DossierCard, props));
    return this;
  };

  public get cardRoot(): ReactTestInstance {
    return this.screen.getByTestId(this.rootTestId);
  }

  public get statusBadge(): ReactTestInstance {
    return this.screen.getByTestId(DOSSIER_CARD_TEST_IDS.STATUS_BADGE);
  }

  public get quickPrintButton(): ReactTestInstance {
    return this.screen.getByTestId(DOSSIER_CARD_TEST_IDS.QUICK_PRINT_BUTTON);
  }

  public get retryButton(): ReactTestInstance {
    return this.screen.getByTestId(DOSSIER_CARD_TEST_IDS.RETRY_BUTTON);
  }

  public get viewDossierButton(): ReactTestInstance {
    return this.screen.getByTestId(DOSSIER_CARD_TEST_IDS.VIEW_DOSSIER_BUTTON);
  }

  public queryQuickPrintButton = (): ReactTestInstance | null =>
    this.screen.queryByTestId(DOSSIER_CARD_TEST_IDS.QUICK_PRINT_BUTTON);

  public queryRetryButton = (): ReactTestInstance | null =>
    this.screen.queryByTestId(DOSSIER_CARD_TEST_IDS.RETRY_BUTTON);

  public queryActivityIndicator = (): ReactTestInstance | null =>
    this.quickPrintButton.findAll(
      (node) => node.type === ActivityIndicator,
    )[0] ?? null;

  public getApplicantNameNode = (expectedName: string): ReactTestInstance =>
    this.screen.getByText(expectedName);

  public getIdentificationNode = (expectedId: string): ReactTestInstance =>
    this.screen.getByText(
      `${esCR.history.cards.idPrefix}${HISTORY_INTERNAL_STRINGS.SPACE}${expectedId}`,
    );

  public getVehicleSummaryNode = (expectedVehicle: string): ReactTestInstance =>
    this.screen.getByText(expectedVehicle);

  public getPrimaryBankNode = (expectedBank: string): ReactTestInstance =>
    this.screen.getByText(expectedBank);

  public getFormattedDateNode = (expectedDate: string): ReactTestInstance =>
    this.screen.getByText(expectedDate);

  public getStatusHelperMessageNode = (
    expectedMessage: string,
  ): ReactTestInstance => this.screen.getByText(expectedMessage);

  public getByText = (text: string): ReactTestInstance =>
    this.screen.getByText(text);

  public queryByText = (text: string): ReactTestInstance | null =>
    this.screen.queryByText(text);

  public pressQuickPrint = (): this => {
    fireEvent.press(this.quickPrintButton);
    return this;
  };

  public pressRetry = (): this => {
    fireEvent.press(this.retryButton);
    return this;
  };

  public pressViewDossier = (): this => {
    fireEvent.press(this.viewDossierButton);
    return this;
  };

  public isQuickPrintDisabled = (): boolean =>
    Boolean(
      this.quickPrintButton.props.disabled ??
        this.getQuickPrintAccessibilityState()?.disabled,
    );

  public isRetryDisabled = (): boolean =>
    Boolean(
      this.retryButton.props.disabled ??
        this.getRetryAccessibilityState()?.disabled,
    );

  public getQuickPrintAccessibilityState = (): AccessibilityState | undefined =>
    this.quickPrintButton.props.accessibilityState as
      | AccessibilityState
      | undefined;

  public getRetryAccessibilityState = (): AccessibilityState | undefined =>
    this.retryButton.props.accessibilityState as AccessibilityState | undefined;

  public getQuickPrintAccessibilityLabel = (): string | undefined =>
    this.quickPrintButton.props.accessibilityLabel as string | undefined;

  public getRetryAccessibilityLabel = (): string | undefined =>
    this.retryButton.props.accessibilityLabel as string | undefined;

  public getViewDossierAccessibilityLabel = (): string | undefined =>
    this.viewDossierButton.props.accessibilityLabel as string | undefined;

  public getStatusBadgeAccessibilityRole = (): string | undefined =>
    this.statusBadge.props.accessibilityRole as string | undefined;

  public getStatusBadgeContainerClasses = (): string =>
    String(
      this.statusBadge.props.className ?? HISTORY_INTERNAL_STRINGS.EMPTY,
    );

  public getStatusBadgeTextClasses = (): string =>
    String(
      this.statusBadge.findAll((node) => node.type === Text)[0]?.props
        .className ?? HISTORY_INTERNAL_STRINGS.EMPTY,
    );

  public getButtonStyleClasses = (target: DossierCardButtonTarget): string => {
    if (target === 'quickPrint') {
      return String(
        this.quickPrintButton.props.className ?? HISTORY_INTERNAL_STRINGS.EMPTY,
      );
    }

    if (target === 'retry') {
      return String(
        this.retryButton.props.className ?? HISTORY_INTERNAL_STRINGS.EMPTY,
      );
    }

    return String(
      this.viewDossierButton.props.className ?? HISTORY_INTERNAL_STRINGS.EMPTY,
    );
  };

  public getCardRootStyleClasses = (): string =>
    String(this.cardRoot.props.className ?? HISTORY_INTERNAL_STRINGS.EMPTY);

  public getRenderedTexts = (): string[] =>
    this.cardRoot
      .findAll((node) => node.type === Text)
      .flatMap((textNode) => {
        const children: unknown = textNode.props.children;
        if (typeof children === 'string') {
          return [children];
        }
        if (Array.isArray(children)) {
          return children.filter(
            (child): child is string => typeof child === 'string',
          );
        }
        return [];
      });

  public getDecorativeIconAccessibilityProps = (): {
    accessible: unknown;
    importantForAccessibility: unknown;
  }[] =>
    this.cardRoot
      .findAll((node) => typeof node.props?.size === 'number')
      .map((iconNode) => ({
        accessible: iconNode.props.accessible,
        importantForAccessibility: iconNode.props.importantForAccessibility,
      }));
}
