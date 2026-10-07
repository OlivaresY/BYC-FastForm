import type { StyleProp, ViewStyle } from "react-native";

export interface ErrorBannerProps {
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string;
}
