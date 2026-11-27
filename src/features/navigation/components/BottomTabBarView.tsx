import {
  CircleUserRound,
  ClipboardList,
  ClipboardPlus,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/shared/i18n';
import {
  BOTTOM_TAB_BAR_COLORS,
  BOTTOM_TAB_BAR_DIMENSIONS,
  BOTTOM_TAB_BAR_STYLES,
  BOTTOM_TAB_BAR_TEST_IDS,
  NAVIGATION_TAB_ROUTES,
} from '../constants';
import type { BottomTabBarViewProps } from '../types';

interface BottomTabItemProps {
  accessibilityHint: string;
  accessibilityLabel: string;
  Icon: LucideIcon;
  isActive: boolean;
  label: string;
  labelTestID: string;
  onPress: () => void;
  tabTestID: string;
}

interface BottomTabItemConfig extends BottomTabItemProps {
  key: string;
}

const BottomTabItem = ({
  accessibilityHint,
  accessibilityLabel,
  Icon,
  isActive,
  label,
  labelTestID,
  onPress,
  tabTestID,
}: BottomTabItemProps): React.JSX.Element => (
  <Pressable
    accessibilityHint={accessibilityHint}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole='tab'
    accessibilityState={{ selected: isActive }}
    className={BOTTOM_TAB_BAR_STYLES.TAB_BUTTON}
    onPress={onPress}
    testID={tabTestID}
  >
    <Icon
      accessible={false}
      color={
        isActive
          ? BOTTOM_TAB_BAR_COLORS.ACTIVE_ICON
          : BOTTOM_TAB_BAR_COLORS.INACTIVE_ICON
      }
      importantForAccessibility='no'
      size={BOTTOM_TAB_BAR_DIMENSIONS.ICON_SIZE_PX}
      strokeWidth={BOTTOM_TAB_BAR_DIMENSIONS.ICON_STROKE_WIDTH}
    />
    <Text
      className={
        isActive
          ? BOTTOM_TAB_BAR_STYLES.TAB_LABEL_ACTIVE
          : BOTTOM_TAB_BAR_STYLES.TAB_LABEL_INACTIVE
      }
      numberOfLines={BOTTOM_TAB_BAR_DIMENSIONS.LABEL_MAX_LINES}
      testID={labelTestID}
    >
      {label}
    </Text>
  </Pressable>
);

export const BottomTabBarView = React.memo(
  ({
    activeRoute,
    onPressNewApplication,
    onSelectTab,
    testID = BOTTOM_TAB_BAR_TEST_IDS.CONTAINER,
  }: BottomTabBarViewProps): React.JSX.Element => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const handleSelectHistory = useCallback((): void => {
      onSelectTab(NAVIGATION_TAB_ROUTES.HISTORY);
    }, [onSelectTab]);

    const handleSelectProfile = useCallback((): void => {
      onSelectTab(NAVIGATION_TAB_ROUTES.PROFILE);
    }, [onSelectTab]);

    const containerSafeAreaStyle = useMemo(
      () => ({
        paddingBottom: Math.max(
          insets.bottom,
          BOTTOM_TAB_BAR_DIMENSIONS.MIN_BOTTOM_PADDING_PX,
        ),
      }),
      [insets.bottom],
    );

    const tabItems = useMemo<BottomTabItemConfig[]>(
      () => [
        {
          accessibilityHint: t.navigation.accessibility.newApplicationHint,
          accessibilityLabel: t.navigation.accessibility.newApplicationLabel,
          Icon: ClipboardPlus,
          isActive: false,
          key: BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_TAB,
          label: t.navigation.tabs.newApplication,
          labelTestID: BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_LABEL,
          onPress: onPressNewApplication,
          tabTestID: BOTTOM_TAB_BAR_TEST_IDS.NEW_APPLICATION_TAB,
        },
        {
          accessibilityHint: t.navigation.accessibility.historyHint,
          accessibilityLabel: t.navigation.accessibility.historyLabel,
          Icon: ClipboardList,
          isActive: activeRoute === NAVIGATION_TAB_ROUTES.HISTORY,
          key: BOTTOM_TAB_BAR_TEST_IDS.HISTORY_TAB,
          label: t.navigation.tabs.history,
          labelTestID: BOTTOM_TAB_BAR_TEST_IDS.HISTORY_LABEL,
          onPress: handleSelectHistory,
          tabTestID: BOTTOM_TAB_BAR_TEST_IDS.HISTORY_TAB,
        },
        {
          accessibilityHint: t.navigation.accessibility.profileHint,
          accessibilityLabel: t.navigation.accessibility.profileLabel,
          Icon: CircleUserRound,
          isActive: activeRoute === NAVIGATION_TAB_ROUTES.PROFILE,
          key: BOTTOM_TAB_BAR_TEST_IDS.PROFILE_TAB,
          label: t.navigation.tabs.profile,
          labelTestID: BOTTOM_TAB_BAR_TEST_IDS.PROFILE_LABEL,
          onPress: handleSelectProfile,
          tabTestID: BOTTOM_TAB_BAR_TEST_IDS.PROFILE_TAB,
        },
      ],
      [
        activeRoute,
        handleSelectHistory,
        handleSelectProfile,
        onPressNewApplication,
        t,
      ],
    );

    return (
      <View
        accessibilityLabel={t.navigation.accessibility.tabBarLabel}
        accessibilityRole='tablist'
        className={BOTTOM_TAB_BAR_STYLES.CONTAINER}
        style={containerSafeAreaStyle}
        testID={testID}
      >
        {tabItems.map(({ key, ...itemProps }) => (
          <BottomTabItem key={key} {...itemProps} />
        ))}
      </View>
    );
  },
);

BottomTabBarView.displayName = 'BottomTabBarView';
