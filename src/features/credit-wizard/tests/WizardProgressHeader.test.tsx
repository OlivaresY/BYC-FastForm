import { WizardProgressHeaderPageObject } from "./WizardProgressHeader.po";

describe("WizardProgressHeader Component", () => {
  it("renders step counter, percentage badge, title, and subtitle correctly for initial step", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 1,
      subtitle: "Ingrese la información personal del solicitante.",
      title: "Datos Personales",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getStepText()).toBe("PASO 1 DE 4");
    expect(pom.getPercentageText()).toBe("25% LISTO");
    expect(pom.getTitleText()).toBe("Datos Personales");
    expect(pom.getSubtitleText()).toBe(
      "Ingrese la información personal del solicitante.",
    );
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "25%" }),
    );
  });

  it("calculates 50% completion and sets dynamic progress bar width correctly for intermediate step", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 2,
      subtitle: "Detalle de ingresos y estabilidad laboral.",
      title: "Información Laboral",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getStepText()).toBe("PASO 2 DE 4");
    expect(pom.getPercentageText()).toBe("50% LISTO");
    expect(pom.getTitleText()).toBe("Información Laboral");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "50%" }),
    );
  });

  it("calculates 100% completion and sets full progress bar width for final step", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 4,
      subtitle: "Verifique y confirme la solicitud de crédito.",
      title: "Revisión Final",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getStepText()).toBe("PASO 4 DE 4");
    expect(pom.getPercentageText()).toBe("100% LISTO");
    expect(pom.getTitleText()).toBe("Revisión Final");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "100%" }),
    );
  });

  it("handles edge case when totalSteps is zero gracefully without crashing or producing NaN", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 0,
      subtitle: "Configuración inicial.",
      title: "Inicio",
      totalSteps: 0,
    });

    // Assert
    expect(pom.getStepText()).toBe("PASO 0 DE 0");
    expect(pom.getPercentageText()).toBe("0% LISTO");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "0%" }),
    );
  });

  it("handles negative totalSteps by defaulting percentage to 0%", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 1,
      subtitle: "Prueba de valores negativos.",
      title: "Validación",
      totalSteps: -4,
    });

    // Assert
    expect(pom.getPercentageText()).toBe("0% LISTO");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "0%" }),
    );
  });

  it("clamps percentage at 0% when currentStep is negative", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: -2,
      subtitle: "Paso negativo.",
      title: "Reverso",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getPercentageText()).toBe("0% LISTO");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "0%" }),
    );
  });

  it("clamps percentage at 100% when currentStep exceeds totalSteps", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: 6,
      subtitle: "Paso adicional fuera de rango.",
      title: "Extras",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getPercentageText()).toBe("100% LISTO");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "100%" }),
    );
  });

  it("handles non-finite NaN values gracefully by defaulting to 0%", () => {
    // Arrange & Act
    const pom = WizardProgressHeaderPageObject.render({
      currentStep: NaN,
      subtitle: "Valores inválidos.",
      title: "Error de entrada",
      totalSteps: 4,
    });

    // Assert
    expect(pom.getPercentageText()).toBe("0% LISTO");
    expect(pom.getProgressBarFillStyle()).toEqual(
      expect.objectContaining({ width: "0%" }),
    );
  });
});
