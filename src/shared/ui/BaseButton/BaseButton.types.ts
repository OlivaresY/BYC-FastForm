import type { PressableProps, StyleProp, ViewStyle } from "react-native";

export type BaseButtonVariant = "outline" | "primary" | "secondary";

export interface BaseButtonProps extends Omit<PressableProps, "style"> {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  variant?: BaseButtonVariant;
}
