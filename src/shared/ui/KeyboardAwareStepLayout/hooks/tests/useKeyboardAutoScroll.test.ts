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

    // Assert - measureLayout called relative to the ScrollView ref
    expect(mockInputNode.measureLayout).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function),
      expect.any(Function),
    );
    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        animated: true,
        y: expect.any(Number),
      }),
    );
  });

  it('triggers fallback scrollTo when node lacks measureLayout in test environment', () => {
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
    expect(mockScrollTo).toHaveBeenCalledWith({
      animated: true,
      y: 280 + 24,
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
