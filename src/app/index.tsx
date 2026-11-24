import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { LoginScreenView } from '@/features/auth';

const INDEX_ROUTES = {
  HISTORIAL: '/(tabs)/historial',
} as const;

const IndexScreen = (): React.JSX.Element => {
  const router = useRouter();

  const handleLoginSuccess = useCallback((): void => {
    router.replace(INDEX_ROUTES.HISTORIAL);
  }, [router]);

  return <LoginScreenView onSuccess={handleLoginSuccess} />;
};

export default IndexScreen;
