import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTranslation } from '@/shared/i18n';

const HISTORIAL_SAFE_AREA_EDGES: readonly Edge[] = ['top'];

const HISTORIAL_STYLES = {
  CONTAINER: 'flex-1 bg-background',
  CONTENT: 'flex-1 items-center justify-center px-6',
  SUBTITLE: 'mt-2 text-center text-sm text-text-secondary',
  TITLE: 'text-center text-xl font-bold text-text-primary',
} as const;

const HISTORIAL_TEST_IDS = {
  CONTAINER: 'historial-shell-container',
  SUBTITLE: 'historial-shell-subtitle',
  TITLE: 'historial-shell-title',
} as const;

const HistorialScreen = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <SafeAreaView
      className={HISTORIAL_STYLES.CONTAINER}
      edges={HISTORIAL_SAFE_AREA_EDGES}
      testID={HISTORIAL_TEST_IDS.CONTAINER}
    >
      <View className={HISTORIAL_STYLES.CONTENT}>
        <Text
          accessibilityRole='header'
          className={HISTORIAL_STYLES.TITLE}
          testID={HISTORIAL_TEST_IDS.TITLE}
        >
          {t.navigation.shells.historyTitle}
        </Text>
        <Text
          className={HISTORIAL_STYLES.SUBTITLE}
          testID={HISTORIAL_TEST_IDS.SUBTITLE}
        >
          {t.navigation.shells.historySubtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HistorialScreen;
