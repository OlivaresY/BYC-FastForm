import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Keyboard, Platform } from 'react-native';
import type {
  KeyboardEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from 'react-native';
import { KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS } from '../constants/KeyboardAwareStepLayout.constants';

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
  onInputFocus: (eventOrNode?: unknown) => void;
  scrollViewRef: React.RefObject<ScrollViewInstance | null>;
  scrollToFocusedInput: (customKeyboardHeight?: number) => void;
  scrollToInput: (node?: unknown, customKeyboardHeight?: number) => void;
  setFocusedNode: (node: unknown) => void;
}

interface MeasurableNode {
  measureLayout?: (
    relativeToNativeComponentRef: ScrollViewInstance,
    onSuccess: (x: number, y: number, width: number, height: number) => void,
    onFail: () => void,
  ) => void;
}

export const useKeyboardAutoScroll = (
  options?: UseKeyboardAutoScrollOptions,
): UseKeyboardAutoScrollReturn => {
  const {
    bottomBarHeight = KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS.BOTTOM_BAR_HEIGHT,
    extraScrollPadding = KEYBOARD_AWARE_STEP_LAYOUT_DIMENSIONS.EXTRA_KEYBOARD_SCROLL_OFFSET,
  } = options ?? {};

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const keyboardHeightRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const scrollYRef = useRef<number>(0);
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const focusedNodeRef = useRef<unknown>(null);

  const scrollToInput = useCallback(
    (targetNode?: unknown, customKeyboardHeight?: number): void => {
      const activeKeyboardHeight =
        customKeyboardHeight ?? keyboardHeightRef.current;
      if (activeKeyboardHeight <= 0 || !scrollViewRef.current) {
        return;
      }

      const nodeToMeasure = targetNode ?? focusedNodeRef.current;
      if (!nodeToMeasure) {
        return;
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame((): void => {
        rafIdRef.current = null;
        try {
          const measurable = nodeToMeasure as MeasurableNode;

          if (
            typeof measurable?.measureLayout === 'function' &&
            scrollViewRef.current
          ) {
            measurable.measureLayout(
              scrollViewRef.current,
              (
                _left: number,
                top: number,
                _width: number,
                height: number,
              ): void => {
                const windowHeight = Dimensions.get('window').height;
                const visibleHeight =
                  windowHeight - activeKeyboardHeight - bottomBarHeight;
                const inputBottom = top + height;

                if (
                  inputBottom > scrollYRef.current + visibleHeight ||
                  top < scrollYRef.current
                ) {
                  const targetY = Math.max(
                    0,
                    inputBottom - visibleHeight + extraScrollPadding,
                  );
                  scrollViewRef.current?.scrollTo({
                    animated: true,
                    y: targetY,
                  });
                }
              },
              (): void => {
                // If measureLayout fails, skip auto-scroll safely
              },
            );
          } else if (typeof scrollViewRef.current?.scrollTo === 'function') {
            // Deterministic fallback for test environments or synthetic nodes
            scrollViewRef.current.scrollTo({
              animated: true,
              y: Math.max(0, activeKeyboardHeight + extraScrollPadding),
            });
          }
        } catch {
          // Graceful fallback for non-native environments
        }
      });
    },
    [bottomBarHeight, extraScrollPadding],
  );

  const setFocusedNode = useCallback(
    (node: unknown): void => {
      focusedNodeRef.current = node;
      if (keyboardHeightRef.current > 0 && node) {
        scrollToInput(node, keyboardHeightRef.current);
      }
    },
    [scrollToInput],
  );

  const onInputFocus = useCallback(
    (eventOrNode?: unknown): void => {
      const extractedNode =
        (
          eventOrNode as {
            nativeEvent?: { target?: unknown };
            target?: unknown;
          }
        )?.nativeEvent?.target ??
        (eventOrNode as { target?: unknown })?.target ??
        eventOrNode ??
        null;

      if (extractedNode) {
        setFocusedNode(extractedNode);
      } else if (keyboardHeightRef.current > 0) {
        scrollToInput(focusedNodeRef.current, keyboardHeightRef.current);
      }
    },
    [scrollToInput, setFocusedNode],
  );

  const scrollToFocusedInput = useCallback(
    (customKeyboardHeight?: number): void => {
      scrollToInput(focusedNodeRef.current, customKeyboardHeight);
    },
    [scrollToInput],
  );

  useEffect(() => {
    const showEvents: readonly string[] =
      Platform.OS === 'ios'
        ? ['keyboardWillShow', 'keyboardDidShow']
        : ['keyboardDidShow', 'keyboardWillShow'];
    const hideEvents: readonly string[] =
      Platform.OS === 'ios'
        ? ['keyboardWillHide', 'keyboardDidHide']
        : ['keyboardDidHide', 'keyboardWillHide'];

    const onShow = (event: KeyboardEvent): void => {
      const height = event?.endCoordinates?.height ?? 0;
      keyboardHeightRef.current = height;
      setKeyboardHeight(height);
      if (focusedNodeRef.current) {
        scrollToInput(focusedNodeRef.current, height);
      }
    };

    const onHide = (): void => {
      keyboardHeightRef.current = 0;
      setKeyboardHeight(0);
      focusedNodeRef.current = null;
    };

    const subscriptions: ({ remove?: () => void } | null)[] = [];

    showEvents.forEach((eventName) => {
      if (Keyboard?.addListener) {
        subscriptions.push(Keyboard.addListener(eventName as never, onShow));
      }
    });

    hideEvents.forEach((eventName) => {
      if (Keyboard?.addListener) {
        subscriptions.push(Keyboard.addListener(eventName as never, onHide));
      }
    });

    return (): void => {
      subscriptions.forEach((sub) => sub?.remove?.());
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [scrollToInput]);

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
    scrollToInput,
    setFocusedNode,
  };
};
