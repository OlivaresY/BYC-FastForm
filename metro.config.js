const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
  withStorybook,
} = require('@storybook/react-native/metro/withStorybook');
const path = require('path');

let config = getDefaultConfig(__dirname);

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

config = withStorybook(config, {
  enabled: isStorybookEnabled,
  configPath: path.resolve(__dirname, './.storybook'),
});

module.exports = withNativeWind(config, { input: './global.css' });
