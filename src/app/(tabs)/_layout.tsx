import { useFocusEffect, useRouter } from 'expo-router';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import React, { useCallback, useRef } from 'react';
import {
  BottomTabBarView,
  canLaunchWizard,
  createCreditWizardRoute,
  NAVIGATION_TAB_ROUTES,
  type NavigationTabRoute,
  WIZARD_LAUNCH_ORIGINS,
} from '@/features/navigation';
import { APP_ROUTES } from '@/shared/constants';

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
  const lastLaunchTimestampRef = useRef<number | null>(null);

  useFocusEffect(
    useCallback((): void => {
      lastLaunchTimestampRef.current = null;
    }, []),
  );

  const handleSelectTab = useCallback(
    (route: NavigationTabRoute): void => {
      const targetRoute =
        route === NAVIGATION_TAB_ROUTES.PROFILE
          ? APP_ROUTES.PERFIL
          : APP_ROUTES.HISTORIAL;

      router.navigate(targetRoute);
    },
    [router],
  );

  const handlePressNewApplication = useCallback((): void => {
    const nowMs = Date.now();

    if (!canLaunchWizard(lastLaunchTimestampRef.current, nowMs)) {
      return;
    }

    lastLaunchTimestampRef.current = nowMs;
    router.push(createCreditWizardRoute(WIZARD_LAUNCH_ORIGINS.TAB));
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
