import type { TextInputProps } from 'react-native';

export type CustomTextInputPresetIcon = 'calendar' | 'hash' | 'mail' | 'phone';

export interface CustomTextInputProps extends Omit<
  TextInputProps,
  'secureTextEntry'
> {
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  isValid?: boolean;
  label?: string;
  leftIcon?: CustomTextInputPresetIcon;
  required?: boolean;
  testID?: string;
}
