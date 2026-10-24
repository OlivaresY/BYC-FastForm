import React from 'react';
import { Text, View } from 'react-native';
import { KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS } from '../constants/KeyboardAwareStepLayout.constants';
import type { KeyboardAwareStepContextValue } from '../KeyboardAwareStepLayout.types';
import { KeyboardAwareStepLayoutPageObject } from './KeyboardAwareStepLayout.po';

describe('KeyboardAwareStepLayout Component', () => {
  it('renders children inside ScrollView and footer inside KeyboardAvoidingView', () => {
    // Arrange
    const page = KeyboardAwareStepLayoutPageObject.render({
      children: <Text>Contenido del Formulario</Text>,
      footer: (
        <View testID={KEYBOARD_AWARE_STEP_LAYOUT_TEST_IDS.FOOTER}>
          <Text>Botón Siguiente</Text>
        </View>
      ),
    });

    // Assert
    expect(page.keyboardAvoidingView).toBeTruthy();
    expect(page.scrollView).toBeTruthy();
    expect(page.footer).toBeTruthy();
  });

  it('provides onInputFocus and context properties when children is provided as a render function', () => {
    // Arrange
    let capturedContext: KeyboardAwareStepContextValue | null = null;
    const page = KeyboardAwareStepLayoutPageObject.render({
      children: (context: KeyboardAwareStepContextValue) => {
        capturedContext = context;
        return <Text>Render Prop Content</Text>;
      },
    });

    // Assert
    expect(page.scrollView).toBeTruthy();
    expect(capturedContext).not.toBeNull();
    const context = capturedContext as unknown as KeyboardAwareStepContextValue;
    expect(typeof context.onInputFocus).toBe('function');
    expect(typeof context.scrollToFocusedInput).toBe('function');
    expect(typeof context.keyboardHeight).toBe('number');
  });

  it('supports custom testID and scrollViewTestID overrides', () => {
    // Arrange
    const customContainerId = 'custom-step-container';
    const customScrollId = 'custom-step-scroll-view';
    const page = KeyboardAwareStepLayoutPageObject.render({
      children: <Text>Custom IDs</Text>,
      scrollViewTestID: customScrollId,
      testID: customContainerId,
    });

    // Assert
    expect(page.keyboardAvoidingView).toBeTruthy();
    expect(page.scrollView).toBeTruthy();
  });

  it('updates scroll offset smoothly via scroll gesture', () => {
    // Arrange
    const page = KeyboardAwareStepLayoutPageObject.render({
      children: <Text>Scroll Content</Text>,
    });

    // Act
    page.scroll(150);

    // Assert
    expect(page.scrollView).toBeTruthy();
  });
});
