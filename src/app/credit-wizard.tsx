import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { CreditWizardOrchestratorView } from '@/features/credit-wizard';
import { APP_ROUTES } from '@/shared/constants';

type CreditWizardRouteParams = {
  sessionId?: string | string[];
};

const CREDIT_WIZARD_CONSTANTS = {
  EMPTY_TEXT: '',
  FALLBACK_SESSION_PREFIX: 'fallback',
} as const;

const CREDIT_WIZARD_SAFE_AREA_EDGES: readonly Edge[] = ['top', 'bottom'];

const CREDIT_WIZARD_STYLES = {
  CONTAINER: 'flex-1 bg-background',
} as const;

const CREDIT_WIZARD_TEST_IDS = {
  ORCHESTRATOR: 'credit-wizard-screen-orchestrator',
  SAFE_AREA: 'credit-wizard-screen-safe-area',
} as const;

const createUniqueFallbackSessionKey = ((): (() => string) => {
  let sequence = 0;

  return (): string => {
    sequence += 1;
    return `${CREDIT_WIZARD_CONSTANTS.FALLBACK_SESSION_PREFIX}-${Date.now()}-${sequence}`;
  };
})();

const extractExplicitSessionKey = (
  rawSessionId?: string | string[],
): string | null => {
  const candidate = Array.isArray(rawSessionId)
    ? rawSessionId[0]
    : rawSessionId;
  const trimmed =
    typeof candidate === 'string'
      ? candidate.trim()
      : CREDIT_WIZARD_CONSTANTS.EMPTY_TEXT;

  return trimmed.length > 0 ? trimmed : null;
};

const CreditWizardScreen = (): React.JSX.Element => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<CreditWizardRouteParams>();
  const isReturningRef = useRef<boolean>(false);
  const [mountSessionKey] = useState<string>(() =>
    createUniqueFallbackSessionKey(),
  );

  const explicitSessionKey = extractExplicitSessionKey(sessionId);
  const resolvedSessionKey = explicitSessionKey ?? mountSessionKey;

  useEffect(() => {
    isReturningRef.current = false;
  }, [resolvedSessionKey]);

  useFocusEffect(
    useCallback((): void => {
      isReturningRef.current = false;
    }, []),
  );

  const handleReturnToHistory = useCallback((): void => {
    if (isReturningRef.current) {
      return;
    }
    isReturningRef.current = true;

    if (router.canDismiss()) {
      router.dismissTo(APP_ROUTES.HISTORIAL);
      return;
    }

    router.replace(APP_ROUTES.HISTORIAL);
  }, [router]);

  return (
    <SafeAreaView
      className={CREDIT_WIZARD_STYLES.CONTAINER}
      edges={CREDIT_WIZARD_SAFE_AREA_EDGES}
      testID={CREDIT_WIZARD_TEST_IDS.SAFE_AREA}
    >
      <CreditWizardOrchestratorView
        key={resolvedSessionKey}
        onClose={handleReturnToHistory}
        onSubmissionSuccess={handleReturnToHistory}
        testID={CREDIT_WIZARD_TEST_IDS.ORCHESTRATOR}
      />
    </SafeAreaView>
  );
};

export default CreditWizardScreen;
