import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { APP_ROUTES } from '@/shared/constants';

const NUEVO_TRAMITE_SESSION_PREFIX = 'direct' as const;

const NUEVO_TRAMITE_STYLES = {
  CONTAINER: 'flex-1 bg-background',
} as const;

const NUEVO_TRAMITE_TEST_IDS = {
  CONTAINER: 'nuevo-tramite-fallback-container',
} as const;

const createDirectSessionId = ((): (() => string) => {
  let sequence = 0;

  return (): string => {
    sequence += 1;
    return `${NUEVO_TRAMITE_SESSION_PREFIX}-${Date.now()}-${sequence}`;
  };
})();

const NuevoTramiteFallbackScreen = (): React.JSX.Element => {
  const router = useRouter();
  const isLaunchingRef = useRef<boolean>(false);

  useFocusEffect(
    useCallback((): (() => void) => {
      if (isLaunchingRef.current) {
        return (): void => undefined;
      }

      isLaunchingRef.current = true;
      const sessionId = createDirectSessionId();

      router.replace(APP_ROUTES.HISTORIAL);
      queueMicrotask(() => {
        router.push({
          params: { sessionId },
          pathname: APP_ROUTES.CREDIT_WIZARD,
        });
      });

      return (): void => {
        isLaunchingRef.current = false;
      };
    }, [router]),
  );

  return (
    <View
      className={NUEVO_TRAMITE_STYLES.CONTAINER}
      testID={NUEVO_TRAMITE_TEST_IDS.CONTAINER}
    />
  );
};

export default NuevoTramiteFallbackScreen;
