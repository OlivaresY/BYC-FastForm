import { PHYSICAL_PERSON_FORM_COPY } from "../constants/PhysicalPersonForm.constants";
import { PhysicalPersonFormPageObject } from "./PhysicalPersonForm.po";
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from "../types/PhysicalPersonForm.types";

const initialValues: PhysicalPersonFormValues = {
  birthDate: "",
  firstLastName: "",
  firstName: "",
  gender: "",
  identificationNumber: "",
  identificationType: "",
  maritalStatus: "",
  middleName: "",
  nationality: "",
  secondLastName: "",
};

describe("PhysicalPersonForm Component", () => {
  describe("Section Headers & Visual Structure", () => {
    it("renders all 3 section headers with their respective SVG icons and titles", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
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
    it("renders red required asterisk on the 9 mandatory fields and omits it on middleName", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      const requiredFields: PhysicalPersonFormField[] = [
        "identificationType",
        "identificationNumber",
        "firstName",
        "firstLastName",
        "secondLastName",
        "birthDate",
        "nationality",
        "maritalStatus",
        "gender",
      ];

      // Assert - Mandatory fields have asterisks
      requiredFields.forEach((field) => {
        expect(page.getRequiredAsterisk(field)).toBeTruthy();
      });

      // Assert - middleName is optional
      expect(page.getRequiredAsterisk("middleName")).toBeNull();
    });

    it("renders helper texts on identificationNumber and birthDate", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(
        page.getFieldHelperText("identificationNumber")?.props.children,
      ).toBe(PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_HELPER);
      expect(page.getFieldHelperText("birthDate")?.props.children).toBe(
        PHYSICAL_PERSON_FORM_COPY.BIRTH_DATE_HELPER,
      );
    });

    it("renders left icons on identificationNumber and birthDate", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.identificationLeftIcon).toBeTruthy();
      expect(page.birthDateLeftIcon).toBeTruthy();
    });
  });

  describe("Identification Validation Status", () => {
    it("renders green validation checkmark when isIdentificationValid is true", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        isIdentificationValid: true,
        onFieldChange: handleFieldChange,
        values: { ...initialValues, identificationNumber: "1-1234-0567" },
      });

      // Assert
      expect(page.identificationValidIcon).toBeTruthy();
    });

    it("omits green validation checkmark when isIdentificationValid is false or omitted", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
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
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("identificationNumber", "1-1234-0567");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "identificationNumber",
        "1-1234-0567",
      );
    });

    it("calls onFieldChange when firstName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("firstName", "Carlos");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith("firstName", "Carlos");
    });

    it("calls onFieldChange when middleName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("middleName", "Alberto");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith("middleName", "Alberto");
    });

    it("calls onFieldChange when firstLastName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("firstLastName", "Rodríguez");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "firstLastName",
        "Rodríguez",
      );
    });

    it("calls onFieldChange when secondLastName is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("secondLastName", "Castro");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "secondLastName",
        "Castro",
      );
    });

    it("calls onFieldChange when birthDate is modified", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.fillField("birthDate", "15 / 08 / 1988");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "birthDate",
        "15 / 08 / 1988",
      );
    });
  });

  describe("Select Dropdown Interactions & Value Propagation", () => {
    it("opens identificationType select and calls onFieldChange when an option is selected", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.openSelect("identificationType");
      page.selectOption("national_id");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "identificationType",
        "national_id",
      );
    });

    it("opens nationality select and calls onFieldChange when an option is selected", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.openSelect("nationality");
      page.selectOption("CR");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith("nationality", "CR");
    });

    it("opens maritalStatus select and calls onFieldChange when an option is selected", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.openSelect("maritalStatus");
      page.selectOption("married");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith(
        "maritalStatus",
        "married",
      );
    });

    it("opens gender select and calls onFieldChange when an option is selected", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Act
      page.openSelect("gender");
      page.selectOption("male");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith("gender", "male");
    });
  });

  describe("Validation Errors", () => {
    it("renders error feedback across text inputs and select components when errors are present", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        errors: {
          birthDate: "Fecha inválida",
          firstLastName: "Primer apellido requerido",
          firstName: "Primer nombre requerido",
          gender: "Género requerido",
          identificationNumber: "Cédula inválida",
          identificationType: "Tipo requerido",
          maritalStatus: "Estado civil requerido",
          middleName: "Error en segundo nombre",
          nationality: "Nacionalidad requerida",
          secondLastName: "Segundo apellido requerido",
        },
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert
      expect(page.getFieldError("identificationType")?.props.children).toBe(
        "Tipo requerido",
      );
      expect(page.getFieldError("identificationNumber")?.props.children).toBe(
        "Cédula inválida",
      );
      expect(page.getFieldError("firstName")?.props.children).toBe(
        "Primer nombre requerido",
      );
      expect(page.getFieldError("middleName")?.props.children).toBe(
        "Error en segundo nombre",
      );
      expect(page.getFieldError("firstLastName")?.props.children).toBe(
        "Primer apellido requerido",
      );
      expect(page.getFieldError("secondLastName")?.props.children).toBe(
        "Segundo apellido requerido",
      );
      expect(page.getFieldError("birthDate")?.props.children).toBe(
        "Fecha inválida",
      );
      expect(page.getFieldError("nationality")?.props.children).toBe(
        "Nacionalidad requerida",
      );
      expect(page.getFieldError("maritalStatus")?.props.children).toBe(
        "Estado civil requerido",
      );
      expect(page.getFieldError("gender")?.props.children).toBe(
        "Género requerido",
      );
    });
  });

  describe("Disabled State", () => {
    it("disables all inputs and select triggers when disabled is true", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        disabled: true,
        onFieldChange: handleFieldChange,
        values: initialValues,
      });

      // Assert - Text inputs
      expect(page.isInputEditable("identificationNumber")).toBe(false);
      expect(page.isInputEditable("firstName")).toBe(false);
      expect(page.isInputEditable("middleName")).toBe(false);
      expect(page.isInputEditable("firstLastName")).toBe(false);
      expect(page.isInputEditable("secondLastName")).toBe(false);
      expect(page.isInputEditable("birthDate")).toBe(false);

      // Assert - Selects
      expect(page.isSelectDisabled("identificationType")).toBe(true);
      expect(page.isSelectDisabled("nationality")).toBe(true);
      expect(page.isSelectDisabled("maritalStatus")).toBe(true);
      expect(page.isSelectDisabled("gender")).toBe(true);
    });
  });

  describe("Custom Options & Custom testID", () => {
    it("uses custom options overrides when provided in options prop", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const customNationalityOptions = [
        { label: "Costarricense", value: "CR" },
        { label: "Panameña", value: "PA" },
      ];
      const customGenderOptions = [
        { label: "No binario", value: "non_binary" },
      ];
      const customMaritalOptions = [{ label: "Separado(a)", value: "separated" }];
      const customIdTypeOptions = [{ label: "Cédula", value: "id" }];

      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        options: {
          genderOptions: customGenderOptions,
          identificationTypeOptions: customIdTypeOptions,
          maritalStatusOptions: customMaritalOptions,
          nationalityOptions: customNationalityOptions,
        },
        values: initialValues,
      });

      // Act
      page.openSelect("nationality");
      page.selectOption("PA");

      // Assert
      expect(handleFieldChange).toHaveBeenCalledWith("nationality", "PA");
    });

    it("renders with custom testID when provided", () => {
      // Arrange
      const handleFieldChange = jest.fn();
      const page = PhysicalPersonFormPageObject.render({
        onFieldChange: handleFieldChange,
        testID: "custom-physical-person-form",
        values: initialValues,
      });

      // Assert
      expect(page.container.props.testID).toBe("custom-physical-person-form");
    });
  });
});
