import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";

import type { BASE_BUTTON_VARIANTS } from "./constants/BaseButton.constants";

export type BaseButtonVariant =
  (typeof BASE_BUTTON_VARIANTS)[keyof typeof BASE_BUTTON_VARIANTS];

export interface BaseButtonProps extends Omit<PressableProps, "style"> {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  variant?: BaseButtonVariant;
}
