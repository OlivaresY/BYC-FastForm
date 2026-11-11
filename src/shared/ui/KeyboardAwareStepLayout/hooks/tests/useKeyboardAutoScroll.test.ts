import { TextInput } from 'react-native';
import { KeyboardAutoScrollPageObject } from './useKeyboardAutoScroll.po';

describe('useKeyboardAutoScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with keyboardHeight 0 and zero paddingBottom', () => {
    // Arrange & Act
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    // Assert
    expect(page.keyboardHeight).toBe(0);
    expect(page.paddingBottom).toBe(0);
    expect(page.current.scrollViewRef).toBeDefined();
  });

  it('updates keyboardHeight and expands paddingBottom when keyboardDidShow emits', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    // Act - keyboard opens
    page.emitKeyboardDidShow(320);

    // Assert
    expect(page.keyboardHeight).toBe(320);
    expect(page.paddingBottom).toBe(320 + 64 + 24);
  });

  it('resets keyboardHeight and restores paddingBottom when keyboardDidHide emits', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    // Act - open then hide
    page.emitKeyboardDidShow(300);
    expect(page.keyboardHeight).toBe(300);

    page.emitKeyboardDidHide();

    // Assert
    expect(page.keyboardHeight).toBe(0);
    expect(page.paddingBottom).toBe(0);
  });

  it('measures layout relative to ScrollView when an input node is focused', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const mockInputNode = page.createMockNode({
      height: 50,
      left: 0,
      top: 1000,
      width: 300,
    });

    // Act - Keyboard opens then input is focused
    page.emitKeyboardDidShow(300);

    page.onInputFocus({ nativeEvent: { target: mockInputNode } });

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert - input measured in window coordinates and scrolled by the
    // exact amount it was covered by the keyboard (screenY 500, gap 24)
    expect(mockInputNode.measureInWindow).toHaveBeenCalledWith(
      expect.any(Function),
    );
    expect(mockScrollTo).toHaveBeenCalledWith({
      animated: true,
      y: 1000 + 50 - (500 - 24),
    });
  });

  it('does not scroll when the focused input is already above the keyboard', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const mockInputNode = page.createMockNode({
      height: 50,
      left: 0,
      top: 200,
      width: 300,
    });

    // Act
    page.emitKeyboardDidShow(300);
    page.onInputFocus({ nativeEvent: { target: mockInputNode } });

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockInputNode.measureInWindow).toHaveBeenCalled();
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('falls back to the currently focused TextInput when the event target is a numeric native tag', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const focusedInput = page.createMockNode({ height: 50, top: 600 });
    const focusedInputSpy = jest
      .spyOn(TextInput.State, 'currentlyFocusedInput')
      .mockReturnValue(focusedInput as never);

    // Act - RN delivers an integer tag as the event target
    page.emitKeyboardDidShow(300);
    page.onInputFocus({ nativeEvent: { target: 4217 } });

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert
    expect(focusedInput.measureInWindow).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith({
      animated: true,
      y: 600 + 50 - (500 - 24),
    });

    focusedInputSpy.mockRestore();
  });

  it('does not trigger blind scrollTo when node lacks measureInWindow', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 24,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const mockInputNodeWithoutMeasure = { id: 'synthetic-node' };

    // Act
    page.emitKeyboardDidShow(280);

    page.scrollToInput(mockInputNodeWithoutMeasure);

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('uses default constants with 64px extra scroll padding when options are omitted', () => {
    // Arrange & Act
    const page = KeyboardAutoScrollPageObject.render();
    page.emitKeyboardDidShow(300);

    // Assert (keyboard 300 + bottomBar 84 + extraPadding 64 = 448)
    expect(page.keyboardHeight).toBe(300);
    expect(page.paddingBottom).toBe(300 + 84 + 64);
  });

  it('automatically triggers measurement and scroll when keyboard opens if an input is already focused', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 64,
      extraScrollPadding: 64,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const mockInputNode = page.createMockNode({
      height: 50,
      left: 0,
      top: 600,
      width: 300,
    });

    // Act - Focus input before keyboard emits show
    page.onInputFocus({ nativeEvent: { target: mockInputNode } });
    page.emitKeyboardDidShow(300);

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockInputNode.measureInWindow).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith({
      animated: true,
      y: 600 + 50 - (500 - 64),
    });
  });

  it('cleans up all subscriptions cleanly upon unmount', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render();

    // Act & Assert
    expect(() => {
      page.unmount();
    }).not.toThrow();
  });
});
