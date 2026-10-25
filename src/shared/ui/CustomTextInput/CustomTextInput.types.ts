import type { TextInputProps } from 'react-native';

export type CustomTextInputPresetIcon =
  | 'banknote'
  | 'calendar'
  | 'hash'
  | 'mail'
  | 'phone'
  | 'phone-call'
  | 'smartphone';

export interface CustomTextInputProps extends Omit<
  TextInputProps,
  'secureTextEntry'
> {
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  isValid?: boolean;
  label?: string;
  labelRight?: React.ReactNode;
  leftIcon?: CustomTextInputPresetIcon | React.ReactNode;
  required?: boolean;
  testID?: string;
}
