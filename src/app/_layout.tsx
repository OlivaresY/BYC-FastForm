import '../../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { MaintenanceModalView, useMaintenanceStatus } from '@/features/auth';

const ROOT_STACK_OPTIONS = {
  headerShown: false,
} as const;

const ROOT_STACK_SCREENS = {
  CREDIT_WIZARD: 'credit-wizard',
  INDEX: 'index',
  TABS: '(tabs)',
} as const;

const RootLayout = (): React.JSX.Element => {
  const { isMaintenanceActive, maintenanceMessage } = useMaintenanceStatus();

  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Storybook = require('../../.storybook/Storybook').default;
    return <Storybook />;
  }

  return (
    <>
      <Stack screenOptions={ROOT_STACK_OPTIONS}>
        <Stack.Screen name={ROOT_STACK_SCREENS.INDEX} />
        <Stack.Screen name={ROOT_STACK_SCREENS.TABS} />
        <Stack.Screen name={ROOT_STACK_SCREENS.CREDIT_WIZARD} />
      </Stack>
      <MaintenanceModalView
        isVisible={isMaintenanceActive}
        message={maintenanceMessage}
      />
    </>
  );
};

export default RootLayout;
