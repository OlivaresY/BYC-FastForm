import type { NAVIGATION_TAB_ROUTES } from '../constants/BottomTabBarView.constants';

export type NavigationTabRoute =
  (typeof NAVIGATION_TAB_ROUTES)[keyof typeof NAVIGATION_TAB_ROUTES];

export interface BottomTabBarViewProps {
  activeRoute: NavigationTabRoute;
  onPressNewApplication: () => void;
  onSelectTab: (route: NavigationTabRoute) => void;
  testID?: string;
}
