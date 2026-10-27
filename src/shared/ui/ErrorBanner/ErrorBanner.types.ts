import type { StyleProp, ViewStyle } from 'react-native';

export interface ErrorBannerProps {
  error?: string | null;
  message?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
}
