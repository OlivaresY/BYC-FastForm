import { useFocusEffect, useRouter } from 'expo-router';
import type React from 'react';
import { useCallback, useRef } from 'react';
import {
  canLaunchWizard,
  createCreditWizardRoute,
  WIZARD_LAUNCH_ORIGINS,
} from '@/features/navigation';

const NuevoTramiteFallbackScreen = (): React.JSX.Element | null => {
  const router = useRouter();
  const isLaunchingRef = useRef<boolean>(false);
  const lastLaunchTimestampRef = useRef<number | null>(null);

  useFocusEffect(
    useCallback((): (() => void) => {
      const nowMs = Date.now();

      if (
        isLaunchingRef.current ||
        !canLaunchWizard(lastLaunchTimestampRef.current, nowMs)
      ) {
        return (): void => undefined;
      }

      isLaunchingRef.current = true;
      lastLaunchTimestampRef.current = nowMs;
      router.replace(createCreditWizardRoute(WIZARD_LAUNCH_ORIGINS.DIRECT));

      return (): void => {
        isLaunchingRef.current = false;
      };
    }, [router]),
  );

  return null;
};

export default NuevoTramiteFallbackScreen;
