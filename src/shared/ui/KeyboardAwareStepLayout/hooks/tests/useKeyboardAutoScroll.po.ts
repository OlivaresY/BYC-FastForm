import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { useKeyboardAutoScroll } from '../useKeyboardAutoScroll';
import type {
  UseKeyboardAutoScrollOptions,
  UseKeyboardAutoScrollReturn,
} from '../useKeyboardAutoScroll';

type MockKeyboardWithEmitter = typeof Keyboard & {
  _emitter: { emit: (event: string, ...args: unknown[]) => void };
  emit: (event: string, ...args: unknown[]) => void;
};

const mockKeyboard = Keyboard as unknown as MockKeyboardWithEmitter;

// Polyfill Keyboard.emit in Jest using React Native's internal _emitter
if (!mockKeyboard.emit) {
  mockKeyboard.emit = (event: string, ...args: unknown[]) =>
    mockKeyboard._emitter.emit(event, ...args);
}

export class KeyboardAutoScrollPageObject {
  private readonly hookResult: RenderHookResult<
    UseKeyboardAutoScrollReturn,
    UseKeyboardAutoScrollOptions | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseKeyboardAutoScrollReturn,
      UseKeyboardAutoScrollOptions | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    options?: UseKeyboardAutoScrollOptions,
  ): KeyboardAutoScrollPageObject {
    const result = renderHook(
      (currentOptions?: UseKeyboardAutoScrollOptions) =>
        useKeyboardAutoScroll(currentOptions),
      { initialProps: options },
    );
    return new KeyboardAutoScrollPageObject(result);
  }

  public get current(): UseKeyboardAutoScrollReturn {
    return this.hookResult.result.current;
  }

  public get keyboardHeight(): number {
    return this.hookResult.result.current.keyboardHeight;
  }

  public get paddingBottom(): number {
    return this.hookResult.result.current.contentContainerStyle.paddingBottom;
  }

  public onInputFocus(eventOrNode?: unknown): void {
    act(() => {
      this.hookResult.result.current.onInputFocus(eventOrNode);
    });
  }

  public scrollToInput(node?: unknown, customKeyboardHeight?: number): void {
    act(() => {
      this.hookResult.result.current.scrollToInput(node, customKeyboardHeight);
    });
  }

  public setFocusedNode(node: unknown): void {
    act(() => {
      this.hookResult.result.current.setFocusedNode(node);
    });
  }

  public static act(callback: () => void): void {
    act(callback);
  }

  public emitKeyboardDidShow(height = 300): void {
    act(() => {
      mockKeyboard.emit('keyboardDidShow', {
        endCoordinates: { height, screenX: 0, screenY: 500, width: 390 },
      });
    });
  }

  public emitKeyboardDidHide(): void {
    act(() => {
      mockKeyboard.emit('keyboardDidHide');
    });
  }

  public createMockNode(metrics: {
    height?: number;
    left?: number;
    top?: number;
    width?: number;
  }): { measureLayout: jest.Mock } {
    return {
      measureLayout: jest.fn(
        (
          _relativeTo: unknown,
          onSuccess: (
            left: number,
            top: number,
            width: number,
            height: number,
          ) => void,
        ) => {
          onSuccess(
            metrics.left ?? 0,
            metrics.top ?? 0,
            metrics.width ?? 100,
            metrics.height ?? 50,
          );
        },
      ),
    };
  }

  public unmount(): void {
    this.hookResult.unmount();
  }
}
