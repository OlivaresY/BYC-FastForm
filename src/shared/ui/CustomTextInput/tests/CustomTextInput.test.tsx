import { CustomTextInputPageObject } from "./CustomTextInput.po";

describe("CustomTextInput Component", () => {
  it("renders input with label and placeholder in default state", () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      label: "Cédula de Identidad",
      placeholder: "Ej: 1-1152-0491",
    });

    // Assert
    expect(page.label).toBeTruthy();
    expect(page.label?.props.children).toBe("Cédula de Identidad");
    expect(page.input.props.placeholder).toBe("Ej: 1-1152-0491");
    expect(page.error).toBeNull();
    expect(page.input.props.className).toContain("border-border-base");
  });

  it("updates text and dispatches onChangeText handler upon filling", () => {
    // Arrange
    const handleChangeText = jest.fn();
    const page = CustomTextInputPageObject.render({
      onChangeText: handleChangeText,
      placeholder: "Nombre completo",
    });

    // Act
    page.fill("Carlos Alvarado");

    // Assert
    expect(handleChangeText).toHaveBeenCalledTimes(1);
    expect(handleChangeText).toHaveBeenCalledWith("Carlos Alvarado");
  });

  it("updates border to active focus color on focus and restores on blur", () => {
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
    expect(page.input.props.className).toContain("border-text-secondary");

    // Act - Blur
    page.blur();

    // Assert - Blur
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(page.input.props.className).toContain("border-border-base");
  });

  it("renders error validation feedback and applies error border", () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      error: "Formato de cédula inválido",
      label: "Identificación",
    });

    // Assert
    expect(page.error).toBeTruthy();
    expect(page.error?.props.children).toBe("Formato de cédula inválido");
    expect(page.input.props.className).toContain("border-brand-red");
  });

  it("enables secureTextEntry when isPassword is true", () => {
    // Arrange
    const page = CustomTextInputPageObject.render({
      isPassword: true,
      label: "PIN de Asesor",
    });

    // Assert
    expect(page.input.props.secureTextEntry).toBe(true);
  });
});
