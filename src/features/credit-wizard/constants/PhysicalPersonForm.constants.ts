import type { CustomSelectOption } from "@/shared/ui/CustomSelect";

export const PHYSICAL_PERSON_FORM_COLORS = {
  HEADER_ICON_STROKE: "#111111",
  HEADER_TITLE_COLOR: "#111111",
} as const;

export const PHYSICAL_PERSON_FORM_COPY = {
  BIRTH_DATE_HELPER: "Debe ser mayor de edad para trámite crediticio.",
  BIRTH_DATE_LABEL: "Fecha de Nacimiento",
  BIRTH_DATE_PLACEHOLDER: "15 / 08 / 1988",
  FIRST_LAST_NAME_LABEL: "Primer Apellido",
  FIRST_LAST_NAME_PLACEHOLDER: "Rodríguez",
  FIRST_NAME_LABEL: "Primer Nombre",
  FIRST_NAME_PLACEHOLDER: "Carlos",
  GENDER_LABEL: "Género",
  GENDER_PLACEHOLDER: "Seleccione género",
  IDENTIFICATION_NUMBER_HELPER: "Formato oficial costarricense con guiones.",
  IDENTIFICATION_NUMBER_LABEL: "Número de Identificación",
  IDENTIFICATION_NUMBER_PLACEHOLDER: "1-1234-0567",
  IDENTIFICATION_TYPE_LABEL: "Tipo de Identificación",
  IDENTIFICATION_TYPE_PLACEHOLDER: "Seleccione tipo de documento",
  MARITAL_STATUS_LABEL: "Estado Civil",
  MARITAL_STATUS_PLACEHOLDER: "Seleccione estado civil",
  MIDDLE_NAME_LABEL: "Segundo Nombre",
  MIDDLE_NAME_PLACEHOLDER: "Alberto",
  NATIONALITY_LABEL: "Nacionalidad",
  NATIONALITY_PLACEHOLDER: "Seleccione nacionalidad",
  SECOND_LAST_NAME_LABEL: "Segundo Apellido",
  SECOND_LAST_NAME_PLACEHOLDER: "Castro",
  SECTION_1_TITLE: "DOCUMENTO DE IDENTIDAD",
  SECTION_2_TITLE: "NOMBRES Y APELLIDOS OFICIALES",
  SECTION_3_TITLE: "DATOS DEMOGRÁFICOS",
} as const;

export const PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS = {
  GENDER: [
    { label: "Masculino", value: "male" },
    { label: "Femenino", value: "female" },
    { label: "Otro", value: "other" },
  ] as const satisfies readonly CustomSelectOption[],
  IDENTIFICATION_TYPE: [
    { label: "Cédula Nacional (Física)", value: "national_id" },
    { label: "DIMEX / Residencia", value: "dimex" },
    { label: "Pasaporte", value: "passport" },
  ] as const satisfies readonly CustomSelectOption[],
  MARITAL_STATUS: [
    { label: "Casado(a)", value: "married" },
    { label: "Soltero(a)", value: "single" },
    { label: "Divorciado(a)", value: "divorced" },
    { label: "Viudo(a)", value: "widowed" },
    { label: "Unión Libre", value: "common_law" },
  ] as const satisfies readonly CustomSelectOption[],
  NATIONALITY: [
    { label: "Costarricense", value: "CR" },
    { label: "Nicaragüense", value: "NI" },
    { label: "Colombiana", value: "CO" },
    { label: "Estadounidense", value: "US" },
    { label: "Otra", value: "other" },
  ] as const satisfies readonly CustomSelectOption[],
} as const;

export const PHYSICAL_PERSON_FORM_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: "0 0 24 24",
} as const;

export const PHYSICAL_PERSON_FORM_STYLES = {
  CONTAINER: "w-full gap-6",
  GRID_COLUMN: "flex-1",
  GRID_ROW: "flex-row gap-3",
  SECTION_CONTAINER: "w-full gap-3",
  SECTION_HEADER_ROW: "flex-row items-center gap-2 mb-1",
  SECTION_HEADER_TITLE: "text-xs font-bold tracking-wider text-text-primary",
} as const;

export const PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES = {
  FILL_NONE: "none",
  STROKE_LINE_CAP: "round",
  STROKE_LINE_JOIN: "round",
} as const;

export const PHYSICAL_PERSON_FORM_TEST_IDS = {
  BIRTH_DATE_INPUT: "physical-person-birth-date-input",
  CONTAINER: "physical-person-form-container",
  FIRST_LAST_NAME_INPUT: "physical-person-first-last-name-input",
  FIRST_NAME_INPUT: "physical-person-first-name-input",
  GENDER_DROPDOWN: "physical-person-gender-dropdown",
  GENDER_SELECT: "physical-person-gender-dropdown",
  IDENTIFICATION_NUMBER_INPUT: "physical-person-identification-number-input",
  IDENTIFICATION_TYPE_DROPDOWN: "physical-person-identification-type-dropdown",
  IDENTIFICATION_TYPE_SELECT: "physical-person-identification-type-dropdown",
  MARITAL_STATUS_DROPDOWN: "physical-person-marital-status-dropdown",
  MARITAL_STATUS_SELECT: "physical-person-marital-status-dropdown",
  MIDDLE_NAME_INPUT: "physical-person-middle-name-input",
  NATIONALITY_DROPDOWN: "physical-person-nationality-dropdown",
  NATIONALITY_SELECT: "physical-person-nationality-dropdown",
  SECOND_LAST_NAME_INPUT: "physical-person-second-last-name-input",
  SECTION_1_HEADER: "physical-person-section-1-header",
  SECTION_1_ICON: "physical-person-section-1-icon",
  SECTION_2_HEADER: "physical-person-section-2-header",
  SECTION_2_ICON: "physical-person-section-2-icon",
  SECTION_3_HEADER: "physical-person-section-3-header",
  SECTION_3_ICON: "physical-person-section-3-icon",
} as const;
