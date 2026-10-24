import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface KeyboardAwareStepContextValue {
  /** Height of the keyboard when visible, 0 when dismissed */
  keyboardHeight: number;
  /** Callback triggered when a text input receives focus */
  onInputFocus: () => void;
  /** Programmatically scroll the view to reveal the active input */
  scrollToFocusedInput: (customKeyboardHeight?: number) => void;
}

export type KeyboardAwareStepLayoutChildren =
  ReactNode | ((context: KeyboardAwareStepContextValue) => ReactNode);

export interface KeyboardAwareStepLayoutProps {
  /** Height reserved for the bottom bar (default: 84px) */
  bottomBarHeight?: number;
  /** Step content rendered inside the ScrollView; supports standard ReactNode or render-prop */
  children: KeyboardAwareStepLayoutChildren;
  /** Optional Tailwind / NativeWind class names for the outer wrapper */
  className?: string;
  /** Optional style override for the ScrollView contentContainer */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Additional vertical offset applied when scrolling to focused input (default: 24px) */
  extraScrollPadding?: number;
  /** Fixed action bar or controls rendered directly below ScrollView inside KeyboardAvoidingView */
  footer?: ReactNode;
  /** Vertical offset for iOS KeyboardAvoidingView (default: 64px) */
  keyboardVerticalOffset?: number;
  /** Optional ScrollView testID (defaults to 'keyboard-aware-step-layout-scroll-view') */
  scrollViewTestID?: string;
  /** Optional root container testID */
  testID?: string;
}
