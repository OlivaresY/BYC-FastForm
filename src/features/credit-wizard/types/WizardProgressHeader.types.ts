import type { StyleProp, ViewStyle } from "react-native";

export interface WizardProgressHeaderProps {
  currentStep: number;
  style?: StyleProp<ViewStyle>;
  subtitle: string;
  testID?: string;
  title: string;
  totalSteps: number;
}
