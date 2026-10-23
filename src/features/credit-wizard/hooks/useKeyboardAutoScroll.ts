import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  findNodeHandle,
} from 'react-native';
import type {
  KeyboardEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export interface UseKeyboardAutoScrollOptions {
  bottomBarHeight?: number;
  extraScrollPadding?: number;
}

export interface UseKeyboardAutoScrollReturn {
  contentContainerStyle: {
    flexGrow: number;
    paddingBottom: number;
  };
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  keyboardHeight: number;
  onInputFocus: () => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToFocusedInput: (customKeyboardHeight?: number) => void;
}

const DEFAULT_BOTTOM_BAR_HEIGHT = 84;
const DEFAULT_EXTRA_SCROLL_PADDING = 24;

export const useKeyboardAutoScroll = (
  options?: UseKeyboardAutoScrollOptions,
): UseKeyboardAutoScrollReturn => {
  const {
    bottomBarHeight = DEFAULT_BOTTOM_BAR_HEIGHT,
    extraScrollPadding = DEFAULT_EXTRA_SCROLL_PADDING,
  } = options ?? {};

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const keyboardHeightRef = useRef<number>(0);
  const scrollYRef = useRef<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToFocusedInput = useCallback(
    (customKeyboardHeight?: number): void => {
      const activeKeyboardHeight =
        customKeyboardHeight ?? keyboardHeightRef.current;
      if (activeKeyboardHeight <= 0 || !scrollViewRef.current) {
        return;
      }

      requestAnimationFrame((): void => {
        try {
          const focusedInput = TextInput.State?.currentlyFocusedInput
            ? TextInput.State.currentlyFocusedInput()
            : null;

          if (!focusedInput) {
            return;
          }

          const inputAny = focusedInput as any;

          if (typeof inputAny.measureInWindow === 'function') {
            inputAny.measureInWindow(
              (_x: number, y: number, _width: number, height: number): void => {
                const windowHeight = Dimensions.get('window').height;
                const visibleBottom =
                  windowHeight - activeKeyboardHeight - bottomBarHeight;
                const inputBottom = y + height;

                if (inputBottom > visibleBottom) {
                  const overlap = inputBottom - visibleBottom;
                  const targetOffset =
                    scrollYRef.current + overlap + extraScrollPadding;
                  scrollViewRef.current?.scrollTo({
                    animated: true,
                    y: Math.max(0, targetOffset),
                  });
                }
              },
            );
          } else {
            const scrollResponder =
              scrollViewRef.current?.getScrollResponder?.();
            const node = findNodeHandle(focusedInput as never);
            if (
              node &&
              scrollResponder?.scrollResponderScrollNativeHandleToKeyboard
            ) {
              scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                node,
                extraScrollPadding + bottomBarHeight,
                true,
              );
            }
          }
        } catch {
          // Graceful fallback for non-native / test environments
        }
      });
    },
    [bottomBarHeight, extraScrollPadding],
  );

  const onInputFocus = useCallback((): void => {
    if (keyboardHeightRef.current > 0) {
      scrollToFocusedInput(keyboardHeightRef.current);
    }
  }, [scrollToFocusedInput]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent): void => {
      const height = event?.endCoordinates?.height ?? 0;
      keyboardHeightRef.current = height;
      setKeyboardHeight(height);
      scrollToFocusedInput(height);
    };

    const onHide = (): void => {
      keyboardHeightRef.current = 0;
      setKeyboardHeight(0);
    };

    const showSub = Keyboard?.addListener
      ? Keyboard.addListener(showEvent, onShow)
      : null;
    const hideSub = Keyboard?.addListener
      ? Keyboard.addListener(hideEvent, onHide)
      : null;

    return (): void => {
      showSub?.remove?.();
      hideSub?.remove?.();
    };
  }, [scrollToFocusedInput]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      scrollYRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const contentContainerStyle = useMemo(
    () => ({
      flexGrow: 1,
      paddingBottom:
        keyboardHeight > 0
          ? keyboardHeight + bottomBarHeight + extraScrollPadding
          : 0,
    }),
    [bottomBarHeight, extraScrollPadding, keyboardHeight],
  );

  return {
    contentContainerStyle,
    handleScroll,
    keyboardHeight,
    onInputFocus,
    scrollViewRef,
    scrollToFocusedInput,
  };
};
