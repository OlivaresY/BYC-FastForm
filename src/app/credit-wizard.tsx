import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { CreditWizardOrchestratorView } from '@/features/credit-wizard';
import {
  createWizardSessionId,
  WIZARD_LAUNCH_ORIGINS,
} from '@/features/navigation';
import { APP_ROUTES } from '@/shared/constants';

type CreditWizardRouteParams = {
  sessionId?: string | string[];
};

const CREDIT_WIZARD_CONSTANTS = {
  EMPTY_TEXT: '',
} as const;

const CREDIT_WIZARD_SAFE_AREA_EDGES: readonly Edge[] = ['top', 'bottom'];

const CREDIT_WIZARD_STYLES = {
  CONTAINER: 'flex-1 bg-background',
} as const;

const CREDIT_WIZARD_TEST_IDS = {
  ORCHESTRATOR: 'credit-wizard-screen-orchestrator',
  SAFE_AREA: 'credit-wizard-screen-safe-area',
} as const;

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
  const isExitingRef = useRef<boolean>(false);
  const explicitSessionKey = extractExplicitSessionKey(sessionId);

  const [activeSessionKey, setActiveSessionKey] = useState<string>(
    () =>
      explicitSessionKey ??
      createWizardSessionId(WIZARD_LAUNCH_ORIGINS.FALLBACK),
  );

  if (
    explicitSessionKey !== null &&
    explicitSessionKey !== activeSessionKey
  ) {
    setActiveSessionKey(explicitSessionKey);
  }

  useEffect(() => {
    isExitingRef.current = false;
  }, [activeSessionKey]);

  const handleExitWizard = useCallback((): void => {
    if (isExitingRef.current) {
      return;
    }

    isExitingRef.current = true;
    Keyboard.dismiss();

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
        key={activeSessionKey}
        onClose={handleExitWizard}
        onSubmissionSuccess={handleExitWizard}
        testID={CREDIT_WIZARD_TEST_IDS.ORCHESTRATOR}
      />
    </SafeAreaView>
  );
};

export default CreditWizardScreen;
