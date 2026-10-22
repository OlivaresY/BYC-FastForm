import type { CustomSelectOption } from '@/shared/ui/CustomSelect';

export const LEGAL_ENTITY_FORM_COLORS = {
  HEADER_ICON_STROKE: '#111111',
  HEADER_TITLE_COLOR: '#111111',
} as const;

export const LEGAL_ENTITY_FORM_COPY = {
  IDENTIFICATION_NUMBER_HELPER: 'Formato oficial costarricense con guiones.',
  IDENTIFICATION_NUMBER_LABEL: 'Número de Identificación',
  IDENTIFICATION_NUMBER_PLACEHOLDER: '3-101-123456',
  IDENTIFICATION_TYPE_LABEL: 'Tipo de Identificación',
  IDENTIFICATION_TYPE_PLACEHOLDER: 'Seleccione tipo de documento',
  LEGAL_NAME_LABEL: 'Nombre Legal de la Empresa',
  LEGAL_NAME_PLACEHOLDER: 'Inversiones Tecnológicas S.A.',
  REPRESENTATIVE_IDENTIFICATION_LABEL: 'Cédula del Representante',
  REPRESENTATIVE_IDENTIFICATION_PLACEHOLDER: '1-1150-0222',
  REPRESENTATIVE_NAME_LABEL: 'Nombre Completo del Representante',
  REPRESENTATIVE_NAME_PLACEHOLDER: 'Juan Alberto Pérez Rojas',
  SECTION_1_TITLE: 'DATOS DE LA EMPRESA',
  SECTION_2_TITLE: 'RAZÓN SOCIAL',
  SECTION_3_TITLE: 'REPRESENTANTE LEGAL',
} as const;

export const LEGAL_ENTITY_FORM_DEFAULT_OPTIONS = {
  IDENTIFICATION_TYPE: [
    { label: 'Cédula Jurídica', value: 'legal_id' },
    { label: 'DIMEX', value: 'dimex' },
    { label: 'NITE', value: 'nite' },
  ] as const satisfies readonly CustomSelectOption[],
} as const;

export const LEGAL_ENTITY_FORM_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const LEGAL_ENTITY_FORM_STYLES = {
  CONTAINER: 'w-full gap-6',
  SECTION_CONTAINER: 'w-full gap-3',
  SECTION_HEADER_ROW: 'flex-row items-center gap-2 mb-1',
  SECTION_HEADER_TITLE: 'text-xs font-bold tracking-wider text-text-primary',
} as const;

export const LEGAL_ENTITY_FORM_SVG_ATTRIBUTES = {
  FILL_NONE: 'none',
  STROKE_LINE_CAP: 'round',
  STROKE_LINE_JOIN: 'round',
} as const;

export const LEGAL_ENTITY_FORM_TEST_IDS = {
  CONTAINER: 'legal-entity-form-container',
  IDENTIFICATION_NUMBER_INPUT: 'legal-entity-identification-number-input',
  IDENTIFICATION_TYPE_DROPDOWN: 'legal-entity-identification-type-dropdown',
  IDENTIFICATION_TYPE_SELECT: 'legal-entity-identification-type-dropdown',
  LEGAL_NAME_INPUT: 'legal-entity-legal-name-input',
  REPRESENTATIVE_IDENTIFICATION_INPUT:
    'legal-entity-representative-identification-input',
  REPRESENTATIVE_NAME_INPUT: 'legal-entity-representative-name-input',
  SECTION_1_HEADER: 'legal-entity-section-1-header',
  SECTION_1_ICON: 'legal-entity-section-1-icon',
  SECTION_2_HEADER: 'legal-entity-section-2-header',
  SECTION_2_ICON: 'legal-entity-section-2-icon',
  SECTION_3_HEADER: 'legal-entity-section-3-header',
  SECTION_3_ICON: 'legal-entity-section-3-icon',
} as const;
