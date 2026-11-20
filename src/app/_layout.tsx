import '../../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { MaintenanceModalView, useMaintenanceStatus } from '@/features/auth';

const RootLayout = (): React.JSX.Element => {
  const { isMaintenanceActive, maintenanceMessage } = useMaintenanceStatus();

  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Storybook = require('../../.storybook/Storybook').default;
    return <Storybook />;
  }

  return (
    <>
      <Stack />
      <MaintenanceModalView
        isVisible={isMaintenanceActive}
        message={maintenanceMessage}
      />
    </>
  );
};

export default RootLayout;
