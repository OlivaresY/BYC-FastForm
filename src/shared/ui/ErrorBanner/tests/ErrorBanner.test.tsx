import { ErrorBannerPageObject } from "./ErrorBanner.po";

describe("ErrorBanner Component", () => {
  it("renders correctly with only an error message", () => {
    // Arrange
    const page = ErrorBannerPageObject.render({
      message: "Ocurrió un error al procesar el trámite",
    });

    // Assert
    expect(page.message).toBeTruthy();
    expect(page.message.props.children).toBe(
      "Ocurrió un error al procesar el trámite",
    );
    expect(page.title).toBeNull();
  });

  it("renders correctly with both title and error message", () => {
    // Arrange
    const page = ErrorBannerPageObject.render({
      message: "Revise los campos requeridos antes de continuar.",
      title: "Datos Incompletos",
    });

    // Assert
    expect(page.title).toBeTruthy();
    expect(page.title?.props.children).toBe("Datos Incompletos");
    expect(page.message).toBeTruthy();
    expect(page.message.props.children).toBe(
      "Revise los campos requeridos antes de continuar.",
    );
  });

  it("applies error styling classes and accessibility role properly", () => {
    // Arrange
    const page = ErrorBannerPageObject.render({
      message: "Error de conexión con el servidor",
      title: "Fallo de Red",
    });

    // Assert
    expect(page.container.props.accessibilityRole).toBe("alert");
    expect(page.container.props.className).toContain("bg-red-50");
    expect(page.container.props.className).toContain("p-4");
    expect(page.container.props.className).toContain("rounded-lg");
    expect(page.message.props.className).toContain("text-brand-red");
    expect(page.title?.props.className).toContain("text-brand-red");
  });
});
