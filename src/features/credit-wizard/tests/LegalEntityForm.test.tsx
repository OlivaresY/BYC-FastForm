import { LEGAL_ENTITY_FORM_COPY } from "../constants/LegalEntityForm.constants";
import { LegalEntityFormPageObject } from "./LegalEntityForm.po";
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from "../types/LegalEntityForm.types";

const initialValues: LegalEntityFormValues = {
  identificationNumber: "",
  identificationType: "",
  legalName: "",
  representativeIdentification: "",
  representativeName: "",
};

describe("LegalEntityForm Component", () => {
  describe("Section Headers & Visual Structure", () => {
    it("renders all 3 section headers with their respective SVG icons and titles", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.section1Header).toBeTruthy();
      expect(page.section1Icon).toBeTruthy();
      expect(page.section2Header).toBeTruthy();
      expect(page.section2Icon).toBeTruthy();
      expect(page.section3Header).toBeTruthy();
      expect(page.section3Icon).toBeTruthy();
    });
  });

  describe("Field Rendering & Required Asterisks", () => {
    it("renders red required asterisk on all 5 mandatory fields", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      const requiredFields: LegalEntityFormField[] = [
        "identificationType",
        "identificationNumber",
        "legalName",
        "representativeIdentification",
        "representativeName",
      ];

      // Assert
      requiredFields.forEach((field) => {
        expect(page.getRequiredAsterisk(field)).toBeTruthy();
      });
    });

    it("renders helper text on identificationNumber", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(
        page.getFieldHelperText("identificationNumber")?.props.children,
      ).toBe(LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_HELPER);
    });

    it("renders left icon on identificationNumber", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.identificationLeftIcon).toBeTruthy();
    });

    it("renders labels for all fields", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      const allFields: LegalEntityFormField[] = [
        "identificationType",
        "identificationNumber",
        "legalName",
        "representativeIdentification",
        "representativeName",
      ];

      // Assert
      allFields.forEach((field) => {
        expect(page.getFieldLabel(field)).toBeTruthy();
      });
    });
  });

  describe("Identification Validation Status", () => {
    it("renders green validation checkmark when isIdentificationValid is true", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        isIdentificationValid: true,
        onFieldChange: handleFieldChange,
        values: { ...initialValues, identificationNumber: "3-101-123456" },
      });

      // Assert
      expect(page.identificationValidIcon).toBeTruthy();
    });

    it("omits green validation checkmark when isIdentificationValid is false or omitted", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        isIdentificationValid: false,
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.identificationValidIcon).toBeNull();
    });
  });

  describe("Text Input Interactions & Value Propagation", () => {
    it("calls onFieldChange when identificationNumber is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("identificationNumber", "3-101-654321");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "identificationNumber",
        "3-101-654321",
      );
    });

    it("calls onFieldChange when legalName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("legalName", "Corporación Alpha S.A.");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "legalName",
        "Corporación Alpha S.A.",
      );
    });

    it("calls onFieldChange when representativeIdentification is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("representativeIdentification", "1-0987-0654");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "representativeIdentification",
        "1-0987-0654",
      );
    });

    it("calls onFieldChange when representativeName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("representativeName", "Mario Soto Delgado");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "representativeName",
        "Mario Soto Delgado",
      );
    });
  });

  describe("Select Dropdown Interactions & Value Propagation", () => {
    it("opens identificationType select and calls onFieldChange when an option is selected", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.openSelect("identificationType");
      page.selectOption("legal_id");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "identificationType",
        "legal_id",
      );
    });

    it("displays placeholder initially and selected option label when identificationType is set", () => {
      // Arrange & Assert - Placeholder initially
      const pageWithEmptyValue = LegalEntityFormPageObject.render({
        onFieldChange: jest.fn(),
        values: initialValues,
      });
      expect(
        pageWithEmptyValue.getSelectTriggerText("identificationType"),
      ).toBe(LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_TYPE_PLACEHOLDER);

      // Arrange & Assert - Selected option label
      const pageWithSelectedValue = LegalEntityFormPageObject.render({
        onFieldChange: jest.fn(),
        values: { ...initialValues, identificationType: "legal_id" },
      });
      expect(
        pageWithSelectedValue.getSelectTriggerText("identificationType"),
      ).toBe("Cédula Jurídica");
    });
  });

  describe("Validation Errors", () => {
    it("renders error feedback across all fields when errors are present", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        errors: {
          identificationNumber: "Número de cédula jurídica inválido",
          identificationType: "Seleccione un tipo de cédula",
          legalName: "La razón social es requerida",
          representativeIdentification: "Cédula del representante requerida",
          representativeName: "Nombre del representante requerido",
        },
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.getFieldError("identificationType")?.props.children).toBe(
        "Seleccione un tipo de cédula",
      );
      expect(page.getFieldError("identificationNumber")?.props.children).toBe(
        "Número de cédula jurídica inválido",
      );
      expect(page.getFieldError("legalName")?.props.children).toBe(
        "La razón social es requerida",
      );
      expect(
        page.getFieldError("representativeIdentification")?.props.children,
      ).toBe("Cédula del representante requerida");
      expect(page.getFieldError("representativeName")?.props.children).toBe(
        "Nombre del representante requerido",
      );
    });
  });

  describe("Disabled State", () => {
    it("disables all text inputs and select trigger when disabled is true", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        disabled: true,
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert - Text inputs
      expect(page.isInputEditable("identificationNumber")).toBe(false);
      expect(page.isInputEditable("legalName")).toBe(false);
      expect(page.isInputEditable("representativeIdentification")).toBe(false);
      expect(page.isInputEditable("representativeName")).toBe(false);

      // Assert - Select
      expect(page.isSelectDisabled("identificationType")).toBe(true);
    });

    it("leaves all text inputs editable and select enabled by default", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert - Text inputs
      expect(page.isInputEditable("identificationNumber")).toBe(true);
      expect(page.isInputEditable("legalName")).toBe(true);
      expect(page.isInputEditable("representativeIdentification")).toBe(true);
      expect(page.isInputEditable("representativeName")).toBe(true);

      // Assert - Select
      expect(page.isSelectDisabled("identificationType")).toBe(false);
    });
  });

  describe("Custom Options & Custom testID", () => {
    it("uses custom options overrides when provided in options prop", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const customIdTypeOptions = [
        { label: "Cédula Especial", value: "special_id" },
      ];

      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        options: {
          identificationTypeOptions: customIdTypeOptions,
        },
        values: initialValues,
      });

      // Act
      page.openSelect("identificationType");
      page.selectOption("special_id");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "identificationType",
        "special_id",
      );
    });

    it("renders with custom testID when provided", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = LegalEntityFormPageObject.render({
        onFieldChange: handleFieldChange,
        testID: "custom-legal-entity-form",
        values: initialValues,
      });

      // Assert
      expect(page.container.props.testID).toBe("custom-legal-entity-form");
    });
  });
});
