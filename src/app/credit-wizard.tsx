import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { CreditWizardOrchestratorView } from '@/features/credit-wizard';

type CreditWizardRouteParams = {
  sessionId?: string;
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

const CreditWizardScreen = (): React.JSX.Element => {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<CreditWizardRouteParams>();

  const handleReturnToHistory = useCallback((): void => {
    router.dismissTo(CREDIT_WIZARD_CONSTANTS.HISTORIAL_ROUTE);
  }, [router]);

  const resolvedSessionKey =
    typeof sessionId === 'string' && sessionId.length > 0
      ? sessionId
      : CREDIT_WIZARD_CONSTANTS.DEFAULT_SESSION_KEY;

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
