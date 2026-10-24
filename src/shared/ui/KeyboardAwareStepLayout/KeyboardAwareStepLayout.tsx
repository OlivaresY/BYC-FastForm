import React, { useContext, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS,
  KEYBOARD_AWARE_STEP_LAYOUT_STYLES,
  KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS,
} from './constants/KeyboardAwareStepLayout.constants';
import { useKeyboardAutoScroll } from './hooks/useKeyboardAutoScroll';
import type {
  KeyboardAwareStepContextValue,
  KeyboardAwareStepLayoutProps,
} from './KeyboardAwareStepLayout.types';

const defaultContextValue: KeyboardAwareStepContextValue = {
  keyboardHeight: 0,
  onInputFocus: (): void => undefined,
  scrollToFocusedInput: (): void => undefined,
};

export const KeyboardAwareStepContext =
  React.createContext<KeyboardAwareStepContextValue>(defaultContextValue);

export const useKeyboardAwareStepContext = (): KeyboardAwareStepContextValue =>
  useContext(KeyboardAwareStepContext);

export const KeyboardAwareStepLayout = ({
  bottomBarHeight,
  children,
  className,
  contentContainerStyle,
  extraScrollPadding,
  footer,
  keyboardVerticalOffset,
  scrollViewTestID,
  testID,
}: KeyboardAwareStepLayoutProps): React.JSX.Element => {
  const {
    contentContainerStyle: autoScrollContainerStyle,
    handleScroll,
    keyboardHeight,
    onInputFocus,
    scrollViewRef,
    scrollToFocusedInput,
  } = useKeyboardAutoScroll({
    bottomBarHeight,
    extraScrollPadding,
  });

  const contextValue = useMemo<KeyboardAwareStepContextValue>(
    () => ({
      keyboardHeight,
      onInputFocus,
      scrollToFocusedInput,
    }),
    [keyboardHeight, onInputFocus, scrollToFocusedInput],
  );

  const containerClasses = [
    KEYBOARD_AWARE_STEP_LAYOUT_STYLES.KEYBOARD_AVOIDING_VIEW,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const defaultIosOffset =
    Platform.OS === 'ios'
      ? KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS.KEYBOARD_VERTICAL_OFFSET_IOS
      : 0;

  const resolvedVerticalOffset = keyboardVerticalOffset ?? defaultIosOffset;

  const finalContentContainerStyle = useMemo(
    () => [autoScrollContainerStyle, contentContainerStyle],
    [autoScrollContainerStyle, contentContainerStyle],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className={containerClasses}
      keyboardVerticalOffset={resolvedVerticalOffset}
      testID={
        testID ?? KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.KEYBOARD_AVOIDING_VIEW
      }
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        className={KEYBOARD_AWARE_STEP_LAYOUT_STYLES.SCROLL_VIEW}
        contentContainerStyle={finalContentContainerStyle}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        onScroll={handleScroll}
        ref={scrollViewRef}
        scrollEventThrottle={
          KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS.SCROLL_EVENT_THROTTLE
        }
        showsVerticalScrollIndicator={false}
        testID={
          scrollViewTestID ?? KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.SCROLL_VIEW
        }
      >
        <KeyboardAwareStepContext.Provider value={contextValue}>
          {typeof children === 'function' ? children(contextValue) : children}
        </KeyboardAwareStepContext.Provider>
      </ScrollView>

      {footer ?? null}
    </KeyboardAvoidingView>
  );
};
