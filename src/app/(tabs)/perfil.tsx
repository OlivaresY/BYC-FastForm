import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTranslation } from '@/shared/i18n';

const PERFIL_SAFE_AREA_EDGES: readonly Edge[] = ['top'];

const PERFIL_STYLES = {
  CONTAINER: 'flex-1 bg-background',
  CONTENT: 'flex-1 items-center justify-center px-6',
  SUBTITLE: 'mt-2 text-center text-sm text-text-secondary',
  TITLE: 'text-center text-xl font-bold text-text-primary',
} as const;

const PERFIL_TEST_IDS = {
  CONTAINER: 'perfil-shell-container',
  SUBTITLE: 'perfil-shell-subtitle',
  TITLE: 'perfil-shell-title',
} as const;

const PerfilScreen = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <SafeAreaView
      className={PERFIL_STYLES.CONTAINER}
      edges={PERFIL_SAFE_AREA_EDGES}
      testID={PERFIL_TEST_IDS.CONTAINER}
    >
      <View className={PERFIL_STYLES.CONTENT}>
        <Text
          accessibilityRole='header'
          className={PERFIL_STYLES.TITLE}
          testID={PERFIL_TEST_IDS.TITLE}
        >
          {t.navigation.shells.profileTitle}
        </Text>
        <Text
          className={PERFIL_STYLES.SUBTITLE}
          testID={PERFIL_TEST_IDS.SUBTITLE}
        >
          {t.navigation.shells.profileSubtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PerfilScreen;
