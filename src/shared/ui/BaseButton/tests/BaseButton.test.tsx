import { BASE_BUTTON_VARIANTS } from "../constants/BaseButton.constants";
import { BaseButtonPageObject } from "./BaseButton.po";

describe("BaseButton Component", () => {
  it("renders button label properly in normal state", () => {
    // Arrange
    const page = BaseButtonPageObject.render({
      label: "Continuar",
    });

    // Assert
    expect(page.label).toBeTruthy();
    expect(page.label?.props.children).toBe("Continuar");
    expect(page.loader).toBeNull();
  });

  it("triggers onPress callback when enabled button is pressed", () => {
    // Arrange
    const handlePress = jest.fn();
    const page = BaseButtonPageObject.render({
      label: "Enviar Solicitud",
      onPress: handlePress,
    });

    // Act
    page.press();

    // Assert
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("applies 40% opacity and blocks interaction when disabled", () => {
    // Arrange
    const handlePress = jest.fn();
    const page = BaseButtonPageObject.render({
      disabled: true,
      label: "Acción Bloqueada",
      onPress: handlePress,
    });

    // Act
    page.press();

    // Assert
    expect(page.button.props.accessibilityState.disabled).toBe(true);
    expect(page.button.props.className).toContain("opacity-40");
    expect(handlePress).not.toHaveBeenCalled();
  });

  it("renders activity loader and hides label in loading state", () => {
    // Arrange
    const handlePress = jest.fn();
    const page = BaseButtonPageObject.render({
      label: "Procesando",
      loading: true,
      onPress: handlePress,
    });

    // Act
    page.press();

    // Assert
    expect(page.loader).toBeTruthy();
    expect(page.label).toBeNull();
    expect(page.button.props.accessibilityState.disabled).toBe(true);
    expect(page.button.props.className).toContain("opacity-40");
    expect(handlePress).not.toHaveBeenCalled();
  });

  it("applies secondary, outline, and ghost variant classes correctly", () => {
    // Arrange & Assert Secondary
    const secondaryPage = BaseButtonPageObject.render({
      label: "Cancelar",
      variant: BASE_BUTTON_VARIANTS.SECONDARY,
    });
    expect(secondaryPage.button.props.className).toContain("bg-primary-dark");

    // Arrange & Assert Outline
    const outlinePage = BaseButtonPageObject.render({
      label: "Volver",
      variant: BASE_BUTTON_VARIANTS.OUTLINE,
    });
    expect(outlinePage.button.props.className).toContain("border-brand-red");

    // Arrange & Assert Ghost
    const ghostPage = BaseButtonPageObject.render({
      label: "Descartar",
      variant: BASE_BUTTON_VARIANTS.GHOST,
    });
    expect(ghostPage.button.props.className).toContain("bg-transparent");
    expect(ghostPage.button.props.className).not.toContain("border-2");
    expect(ghostPage.label?.props.className).toContain("text-brand-red");
  });
});
