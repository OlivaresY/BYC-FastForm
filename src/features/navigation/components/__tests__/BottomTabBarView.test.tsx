import type React from 'react';
import { esCR } from '@/shared/i18n';
import {
  BOTTOM_TAB_BAR_COLORS,
  BOTTOM_TAB_BAR_DIMENSIONS,
  BOTTOM_TAB_BAR_STYLES,
  NAVIGATION_TAB_ROUTES,
} from '../../constants';
import { BottomTabBarViewPageObject } from './BottomTabBarView.po';

const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

const CUSTOM_BOTTOM_INSETS = {
  bottom: 34,
  left: 0,
  right: 0,
  top: 47,
} as const;

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  const createMockIcon =
    () =>
    (props: Record<string, unknown>): React.JSX.Element =>
      MockReact.createElement(MockView, props);

  return {
    CircleUserRound: createMockIcon(),
    ClipboardList: createMockIcon(),
    ClipboardPlus: createMockIcon(),
  };
});

describe('BottomTabBarView Component Tests', () => {
  it('renders 3 tabs in exact order (Nuevo Trámite, Historial, Mi Perfil) with zero emojis', () => {
    // Arrange
    const onSelectTab = jest.fn();
    const onPressNewApplication = jest.fn();

    // Act
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
      onPressNewApplication,
      onSelectTab,
    });

    // Assert
    const orderedLabels = page.allTabs.map(
      (tab) => tab.props.accessibilityLabel as string,
    );
    expect(orderedLabels).toEqual([
      esCR.navigation.accessibility.newApplicationLabel,
      esCR.navigation.accessibility.historyLabel,
      esCR.navigation.accessibility.profileLabel,
    ]);
    expect(page.newApplicationLabel.props.children).toBe(
      esCR.navigation.tabs.newApplication,
    );
    expect(page.historialLabel.props.children).toBe(
      esCR.navigation.tabs.history,
    );
    expect(page.perfilLabel.props.children).toBe(esCR.navigation.tabs.profile);

    orderedLabels.forEach((label) => {
      expect(EMOJI_PATTERN.test(label)).toBe(false);
    });
  });

  it('marks Historial as selected when activeRoute is historial', () => {
    // Arrange
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
      onPressNewApplication: jest.fn(),
      onSelectTab: jest.fn(),
    });

    // Assert
    expect(page.newApplicationTab.props.accessibilityState).toEqual({
      selected: false,
    });
    expect(page.historialTab.props.accessibilityState).toEqual({
      selected: true,
    });
    expect(page.perfilTab.props.accessibilityState).toEqual({
      selected: false,
    });
    expect(page.historialLabel.props.className).toBe(
      BOTTOM_TAB_BAR_STYLES.TAB_LABEL_ACTIVE,
    );
    expect(page.perfilLabel.props.className).toBe(
      BOTTOM_TAB_BAR_STYLES.TAB_LABEL_INACTIVE,
    );
    expect(page.newApplicationLabel.props.className).toBe(
      BOTTOM_TAB_BAR_STYLES.TAB_LABEL_INACTIVE,
    );
  });

  it('marks Mi Perfil as selected when activeRoute is perfil', () => {
    // Arrange
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.PROFILE,
      onPressNewApplication: jest.fn(),
      onSelectTab: jest.fn(),
    });

    // Assert
    expect(page.newApplicationTab.props.accessibilityState).toEqual({
      selected: false,
    });
    expect(page.historialTab.props.accessibilityState).toEqual({
      selected: false,
    });
    expect(page.perfilTab.props.accessibilityState).toEqual({
      selected: true,
    });
    expect(page.perfilLabel.props.className).toBe(
      BOTTOM_TAB_BAR_STYLES.TAB_LABEL_ACTIVE,
    );
    expect(page.historialLabel.props.className).toBe(
      BOTTOM_TAB_BAR_STYLES.TAB_LABEL_INACTIVE,
    );
  });

  it('invokes onPressNewApplication without calling onSelectTab when Nuevo Trámite is pressed', () => {
    // Arrange
    const onSelectTab = jest.fn();
    const onPressNewApplication = jest.fn();
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
      onPressNewApplication,
      onSelectTab,
    });

    // Act
    page.pressNewApplication();

    // Assert
    expect(onPressNewApplication).toHaveBeenCalledTimes(1);
    expect(onSelectTab).not.toHaveBeenCalled();
  });

  it('invokes onSelectTab with historial or perfil when pressing Historial or Mi Perfil', () => {
    // Arrange
    const onSelectTab = jest.fn();
    const onPressNewApplication = jest.fn();
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
      onPressNewApplication,
      onSelectTab,
    });

    // Act
    page.pressPerfil().pressHistorial();

    // Assert
    expect(onSelectTab).toHaveBeenNthCalledWith(
      1,
      NAVIGATION_TAB_ROUTES.PROFILE,
    );
    expect(onSelectTab).toHaveBeenNthCalledWith(
      2,
      NAVIGATION_TAB_ROUTES.HISTORY,
    );
    expect(onPressNewApplication).not.toHaveBeenCalled();
  });

  it('enforces tab accessibility roles, 48px touch targets, decorative icon hiding, and safe-area padding', () => {
    // Arrange
    const page = BottomTabBarViewPageObject.render({
      activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
      insets: CUSTOM_BOTTOM_INSETS,
      onPressNewApplication: jest.fn(),
      onSelectTab: jest.fn(),
    });

    // Assert
    expect(page.container.props.className).toBe(BOTTOM_TAB_BAR_STYLES.CONTAINER);
    expect(page.container.props.style).toEqual({
      paddingBottom: CUSTOM_BOTTOM_INSETS.bottom,
    });

    page.allTabs.forEach((tab) => {
      expect(tab.props.accessibilityRole).toBe('tab');
      expect(tab.props.className).toContain('min-h-[48px]');
      expect(tab.props.className).toContain('min-w-[48px]');
      expect(tab.props.className).toContain('flex-1');
    });

    expect(page.newApplicationLabel.props.numberOfLines).toBe(
      BOTTOM_TAB_BAR_DIMENSIONS.LABEL_MAX_LINES,
    );
    expect(page.historialLabel.props.numberOfLines).toBe(
      BOTTOM_TAB_BAR_DIMENSIONS.LABEL_MAX_LINES,
    );
    expect(page.perfilLabel.props.numberOfLines).toBe(
      BOTTOM_TAB_BAR_DIMENSIONS.LABEL_MAX_LINES,
    );

    const iconColors = page.allDecorativeIcons.map((icon) => icon.props.color);
    expect(iconColors).toEqual([
      BOTTOM_TAB_BAR_COLORS.INACTIVE_ICON,
      BOTTOM_TAB_BAR_COLORS.ACTIVE_ICON,
      BOTTOM_TAB_BAR_COLORS.INACTIVE_ICON,
    ]);
  });
});
