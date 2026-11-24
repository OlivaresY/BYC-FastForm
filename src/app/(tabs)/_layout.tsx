import { useRouter } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import React, { useCallback } from 'react';
import {
  BottomTabBarView,
  NAVIGATION_TAB_ROUTES,
  type NavigationTabRoute,
} from '@/features/navigation';

const TAB_ROUTE_PATHS = {
  CREDIT_WIZARD: '/credit-wizard',
  HISTORIAL: '/(tabs)/historial',
  PERFIL: '/(tabs)/perfil',
} as const;

const TAB_SCREEN_NAMES = {
  HISTORIAL: 'historial',
  NUEVO_TRAMITE: 'nuevo-tramite',
  PERFIL: 'perfil',
} as const;

const TABS_SCREEN_OPTIONS = {
  headerShown: false,
} as const;

export const unstable_settings = {
  anchor: TAB_SCREEN_NAMES.HISTORIAL,
} as const;

const TabsLayout = (): React.JSX.Element => {
  const router = useRouter();

  const handleSelectTab = useCallback(
    (route: NavigationTabRoute): void => {
      const targetRoute =
        route === NAVIGATION_TAB_ROUTES.PROFILE
          ? TAB_ROUTE_PATHS.PERFIL
          : TAB_ROUTE_PATHS.HISTORIAL;

      router.navigate(targetRoute);
    },
    [router],
  );

  const handlePressNewApplication = useCallback((): void => {
    router.push({
      params: { sessionId: String(Date.now()) },
      pathname: TAB_ROUTE_PATHS.CREDIT_WIZARD,
    });
  }, [router]);

  const renderTabBar = useCallback(
    ({ state }: BottomTabBarProps): React.JSX.Element => {
      const currentRouteName = state.routes[state.index]?.name;
      const activeRoute: NavigationTabRoute =
        currentRouteName === TAB_SCREEN_NAMES.PERFIL
          ? NAVIGATION_TAB_ROUTES.PROFILE
          : NAVIGATION_TAB_ROUTES.HISTORY;

      return (
        <BottomTabBarView
          activeRoute={activeRoute}
          onPressNewApplication={handlePressNewApplication}
          onSelectTab={handleSelectTab}
        />
      );
    },
    [handlePressNewApplication, handleSelectTab],
  );

  return (
    <Tabs
      screenOptions={TABS_SCREEN_OPTIONS}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name={TAB_SCREEN_NAMES.NUEVO_TRAMITE} />
      <Tabs.Screen name={TAB_SCREEN_NAMES.HISTORIAL} />
      <Tabs.Screen name={TAB_SCREEN_NAMES.PERFIL} />
    </Tabs>
  );
};

export default TabsLayout;
