import type { TextInputProps } from "react-native";

export interface CustomTextInputProps extends Omit<
  TextInputProps,
  "secureTextEntry"
> {
  error?: string;
  isPassword?: boolean;
  label?: string;
  testID?: string;
}
