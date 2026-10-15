import type { CustomSelectOption } from "@/shared/ui/CustomSelect/CustomSelect.types";

export const LEGAL_ENTITY_FORM_COLORS = {
  HEADER_ICON_STROKE: "#111111",
  HEADER_TITLE_COLOR: "#111111",
} as const;

export const LEGAL_ENTITY_FORM_COPY = {
  IDENTIFICATION_NUMBER_HELPER: "Formato oficial costarricense con guiones.",
  IDENTIFICATION_NUMBER_LABEL: "Número de Identificación",
  IDENTIFICATION_NUMBER_PLACEHOLDER: "3-101-123456",
  IDENTIFICATION_TYPE_LABEL: "Tipo de Identificación",
  IDENTIFICATION_TYPE_PLACEHOLDER: "Seleccione tipo de documento",
  LEGAL_NAME_LABEL: "Nombre Legal de la Empresa",
  LEGAL_NAME_PLACEHOLDER: "Inversiones Tecnológicas S.A.",
  REPRESENTATIVE_IDENTIFICATION_LABEL: "Cédula del Representante",
  REPRESENTATIVE_IDENTIFICATION_PLACEHOLDER: "1-1150-0222",
  REPRESENTATIVE_NAME_LABEL: "Nombre Completo del Representante",
  REPRESENTATIVE_NAME_PLACEHOLDER: "Juan Alberto Pérez Rojas",
  SECTION_1_TITLE: "DATOS DE LA EMPRESA",
  SECTION_2_TITLE: "RAZÓN SOCIAL",
  SECTION_3_TITLE: "REPRESENTANTE LEGAL",
} as const;

export const LEGAL_ENTITY_FORM_DEFAULT_OPTIONS = {
  IDENTIFICATION_TYPE: [
    { label: "Cédula Jurídica", value: "legal_id" },
    { label: "DIMEX", value: "dimex" },
    { label: "NITE", value: "nite" },
  ] as const satisfies readonly CustomSelectOption[],
} as const;

export const LEGAL_ENTITY_FORM_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: "0 0 24 24",
} as const;

export const LEGAL_ENTITY_FORM_ICONS = {
  BUILDING: {
    paths: [
      "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
      "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
      "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
      "M10 6h4",
      "M10 10h4",
      "M10 14h4",
      "M10 18h4",
    ],
  },
  DOCUMENT: {
    paths: [
      "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      "M14 2v4a2 2 0 0 0 2 2h4",
      "M10 9H8",
      "M16 13H8",
      "M16 17H8",
    ],
  },
  USER: {
    circle: {
      cx: 12,
      cy: 7,
      r: 4,
    },
    path: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  },
} as const;

export const LEGAL_ENTITY_FORM_STYLES = {
  CONTAINER: "w-full gap-6",
  SECTION_CONTAINER: "w-full gap-3",
  SECTION_HEADER_ROW: "flex-row items-center gap-2 mb-1",
  SECTION_HEADER_TITLE: "text-xs font-bold tracking-wider text-[#111111]",
} as const;

export const LEGAL_ENTITY_FORM_SVG_ATTRIBUTES = {
  FILL_NONE: "none",
  STROKE_LINE_CAP: "round",
  STROKE_LINE_JOIN: "round",
} as const;

export const LEGAL_ENTITY_FORM_TEST_IDS = {
  CONTAINER: "legal-entity-form-container",
  IDENTIFICATION_NUMBER_INPUT: "legal-entity-identification-number-input",
  IDENTIFICATION_TYPE_DROPDOWN: "legal-entity-identification-type-dropdown",
  IDENTIFICATION_TYPE_SELECT: "legal-entity-identification-type-dropdown",
  LEGAL_NAME_INPUT: "legal-entity-legal-name-input",
  REPRESENTATIVE_IDENTIFICATION_INPUT:
    "legal-entity-representative-identification-input",
  REPRESENTATIVE_NAME_INPUT: "legal-entity-representative-name-input",
  SECTION_1_HEADER: "legal-entity-section-1-header",
  SECTION_1_ICON: "legal-entity-section-1-icon",
  SECTION_2_HEADER: "legal-entity-section-2-header",
  SECTION_2_ICON: "legal-entity-section-2-icon",
  SECTION_3_HEADER: "legal-entity-section-3-header",
  SECTION_3_ICON: "legal-entity-section-3-icon",
} as const;
