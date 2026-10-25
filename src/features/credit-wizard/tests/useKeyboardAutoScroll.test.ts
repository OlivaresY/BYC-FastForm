import { KeyboardAutoScrollPageObject } from './useKeyboardAutoScroll.po';

describe('useKeyboardAutoScroll (Credit Wizard Binding)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates keyboardHeight and dynamically adjusts bottom offset on keyboardDidShow', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 80,
      extraScrollPadding: 24,
    });

    // Act
    page.emitKeyboardDidShow(320);

    // Assert
    expect(page.keyboardHeight).toBe(320);
    expect(page.paddingBottom).toBe(320 + 80 + 24);
  });

  it('delegates scroll calculations to explicit input nodes on focus', () => {
    // Arrange
    const page = KeyboardAutoScrollPageObject.render({
      bottomBarHeight: 80,
      extraScrollPadding: 24,
    });

    const mockScrollTo = jest.fn();
    (page.current.scrollViewRef as { current: unknown }).current = {
      scrollTo: mockScrollTo,
    };

    const mockInputNode = page.createMockNode({
      height: 50,
      left: 0,
      top: 1200,
      width: 300,
    });

    // Act
    page.emitKeyboardDidShow(320);

    page.onInputFocus({ nativeEvent: { target: mockInputNode } });

    KeyboardAutoScrollPageObject.act(() => {
      jest.runAllTimers();
    });

    // Assert
    expect(mockInputNode.measureLayout).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        animated: true,
        y: expect.any(Number),
      }),
    );
  });
});
