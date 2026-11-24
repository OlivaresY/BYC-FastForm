import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { CreditWizardOrchestratorView } from '@/features/credit-wizard';

type CreditWizardRouteParams = {
  sessionId?: string | string[];
};

const CREDIT_WIZARD_CONSTANTS = {
  DEFAULT_SESSION_KEY: 'default',
  HISTORIAL_ROUTE: '/(tabs)/historial',
} as const;

const CREDIT_WIZARD_SAFE_AREA_EDGES: readonly Edge[] = ['top', 'bottom'];

const CREDIT_WIZARD_STYLES = {
  CONTAINER: 'flex-1 bg-background',
} as const;

const CREDIT_WIZARD_TEST_IDS = {
  ORCHESTRATOR: 'credit-wizard-screen-orchestrator',
  SAFE_AREA: 'credit-wizard-screen-safe-area',
} as const;

const resolveSessionKey = (rawSessionId?: string | string[]): string => {
  const candidate = Array.isArray(rawSessionId)
    ? rawSessionId[0]
    : rawSessionId;
  const trimmed = typeof candidate === 'string' ? candidate.trim() : '';

  return trimmed.length > 0
    ? trimmed
    : CREDIT_WIZARD_CONSTANTS.DEFAULT_SESSION_KEY;
};

const CreditWizardScreen = (): React.JSX.Element => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<CreditWizardRouteParams>();
  const isReturningRef = useRef<boolean>(false);

  const resolvedSessionKey = resolveSessionKey(sessionId);

  useEffect(() => {
    isReturningRef.current = false;
  }, [resolvedSessionKey]);

  const handleReturnToHistory = useCallback((): void => {
    if (isReturningRef.current) {
      return;
    }
    isReturningRef.current = true;
    router.dismissTo(CREDIT_WIZARD_CONSTANTS.HISTORIAL_ROUTE);
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
