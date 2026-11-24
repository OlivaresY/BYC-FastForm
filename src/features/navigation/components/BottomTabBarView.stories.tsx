import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';
import { esCR } from '@/shared/i18n';
import { NAVIGATION_TAB_ROUTES } from '../constants';
import { BottomTabBarView } from './BottomTabBarView';

const STORYBOOK_SAFE_AREA_METRICS: Metrics = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 34, left: 0, right: 0, top: 47 },
};

const STORYBOOK_CONTAINER_CLASS =
  'w-full flex-1 justify-end self-stretch bg-background' as const;

const handleStorySelectTab = (): void => undefined;
const handleStoryNewApplication = (): void => undefined;

const meta = {
  argTypes: {
    activeRoute: {
      control: 'radio',
      options: [
        NAVIGATION_TAB_ROUTES.HISTORY,
        NAVIGATION_TAB_ROUTES.PROFILE,
      ],
    },
    onPressNewApplication: { control: false },
    onSelectTab: { control: false },
  },
  args: {
    activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
    onPressNewApplication: handleStoryNewApplication,
    onSelectTab: handleStorySelectTab,
  },
  component: BottomTabBarView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <SafeAreaProvider initialMetrics={STORYBOOK_SAFE_AREA_METRICS}>
        <View className={STORYBOOK_CONTAINER_CLASS}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    notes: esCR.navigation.accessibility.tabBarLabel,
  },
  title: 'Features/Navigation/Bottom Tab Bar View',
} satisfies Meta<typeof BottomTabBarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HistorialActive: Story = {
  args: {
    activeRoute: NAVIGATION_TAB_ROUTES.HISTORY,
  },
  name: esCR.navigation.tabs.history,
};

export const PerfilActive: Story = {
  args: {
    activeRoute: NAVIGATION_TAB_ROUTES.PROFILE,
  },
  name: esCR.navigation.tabs.profile,
};
