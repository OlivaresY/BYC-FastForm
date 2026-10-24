import { CustomTextInputPageObject } from './CustomTextInput.po';

describe('CustomTextInput Component', () => {
  it('renders input with label and placeholder in default state', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      label: 'Cédula de Identidad',
      placeholder: 'Ej: 1-1152-0491',
    });

    // Assert
    expect(page.label).toBeTruthy();
    expect(page.label?.props.children).toBe('Cédula de Identidad');
    expect(page.input.props.placeholder).toBe('Ej: 1-1152-0491');
    expect(page.error).toBeNull();
    expect(page.getWrapperClassName()).toContain('border-border-base');
    expect(page.requiredAsterisk).toBeNull();
    expect(page.helperText).toBeNull();
    expect(page.leftIcon).toBeNull();
    expect(page.validIcon).toBeNull();
  });

  it('updates text and dispatches onChangeText handler upon filling and clears text', () => {
    // Arrange
    const handleChangeText = jest.fn();
    const page = CustomTextInputPageObject.render({
      onChangeText: handleChangeText,
      placeholder: 'Nombre completo',
    });

    // Act
    page.fill('Carlos Alvarado');

    // Assert
    expect(handleChangeText).toHaveBeenCalledTimes(1);
    expect(handleChangeText).toHaveBeenCalledWith('Carlos Alvarado');

    // Act - clear
    page.clear();
    expect(handleChangeText).toHaveBeenCalledTimes(2);
    expect(handleChangeText).toHaveBeenCalledWith('');
  });

  it('updates border to active focus color on focus and restores on blur', () => {
    // Arrange
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const page = CustomTextInputPageObject.render({
      onBlur: handleBlur,
      onFocus: handleFocus,
    });

    // Act - Focus
    page.focus();

    // Assert - Focus
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(page.getWrapperClassName()).toContain('border-text-secondary');

    // Act - Blur
    page.blur();

    // Assert - Blur
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(page.getWrapperClassName()).toContain('border-border-base');
  });

  it('manages smart selection to auto-scroll to start on blur and release on focus', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      placeholder: 'Ingreso mensual',
    });

    // Assert - initially blurred: selection is at start (0, 0)
    expect(page.input.props.selection).toEqual({ end: 0, start: 0 });

    // Act - Focus
    page.focus();

    // Assert - focused: selection is undefined to allow normal cursor movement
    expect(page.input.props.selection).toBeUndefined();

    // Act - Blur
    page.blur();

    // Assert - blurred: selection resets to start (0, 0) to scroll text back
    expect(page.input.props.selection).toEqual({ end: 0, start: 0 });
  });

  it('renders error validation feedback and applies error border', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      error: 'Formato de cédula inválido',
      label: 'Identificación',
    });

    // Assert
    expect(page.error).toBeTruthy();
    expect(page.error?.props.children).toBe('Formato de cédula inválido');
    expect(page.getWrapperClassName()).toContain('border-brand-red');
  });

  it('enables secureTextEntry when isPassword is true', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      isPassword: true,
      label: 'PIN de Asesor',
    });

    // Assert
    expect(page.input.props.secureTextEntry).toBe(true);
  });

  it('renders red required asterisk when required is true', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      label: 'Primer Nombre',
      required: true,
    });

    // Assert
    expect(page.requiredAsterisk).toBeTruthy();
    expect(page.requiredAsterisk?.props.children).toBe('*');
  });

  it('renders helperText when error is absent', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      helperText: 'Formato oficial costarricense con guiones.',
      label: 'Identificación',
    });

    // Assert
    expect(page.helperText).toBeTruthy();
    expect(page.helperText?.props.children).toBe(
      'Formato oficial costarricense con guiones.',
    );
  });

  it('prioritizes error over helperText when both are provided', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      error: 'Campo requerido',
      helperText: 'Formato oficial costarricense con guiones.',
      label: 'Identificación',
    });

    // Assert
    expect(page.error).toBeTruthy();
    expect(page.error?.props.children).toBe('Campo requerido');
    expect(page.helperText).toBeNull();
  });

  it('renders hash left icon when leftIcon is hash', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      leftIcon: 'hash',
    });

    // Assert
    expect(page.leftIcon).toBeTruthy();
  });

  it('renders calendar left icon when leftIcon is calendar', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      leftIcon: 'calendar',
    });

    // Assert
    expect(page.leftIcon).toBeTruthy();
  });

  it('renders valid checkmark icon when isValid is true', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      isValid: true,
    });

    // Assert
    expect(page.validIcon).toBeTruthy();
  });

  it('propagates custom testID to all child elements deterministically', () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      error: 'Error message',
      isValid: true,
      label: 'Número de Cédula',
      leftIcon: 'hash',
      required: true,
      testID: 'custom-id',
    });

    // Assert
    expect(page.container.props.testID).toBe('custom-id-container');
    expect(page.label?.props.testID).toBe('custom-id-label');
    expect(page.requiredAsterisk?.props.testID).toBe(
      'custom-id-required-asterisk',
    );
    expect(page.inputWrapper.props.testID).toBe('custom-id-wrapper');
    expect(page.input.props.testID).toBe('custom-id');
    expect(page.leftIcon?.props.testID).toBe('custom-id-left-icon');
    expect(page.validIcon?.props.testID).toBe('custom-id-valid-icon');
    expect(page.error?.props.testID).toBe('custom-id-error');
  });
});
