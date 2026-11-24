import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { LoginScreenView } from '@/features/auth';

const INDEX_ROUTES = {
  HISTORIAL: '/(tabs)/historial',
} as const;

const IndexScreen = (): React.JSX.Element => {
  const router = useRouter();
  const hasNavigatedRef = useRef<boolean>(false);

  useFocusEffect(
    useCallback((): void => {
      hasNavigatedRef.current = false;
    }, []),
  );

  const handleLoginSuccess = useCallback((): void => {
    if (hasNavigatedRef.current) {
      return;
    }
    hasNavigatedRef.current = true;
    router.replace(INDEX_ROUTES.HISTORIAL);
  }, [router]);

  return <LoginScreenView onSuccess={handleLoginSuccess} />;
};

export default IndexScreen;
