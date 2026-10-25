export const LEGAL_ENTITY_CONTACT_FORM_COLORS = {
  HEADER_ICON_STROKE: '#111111',
  HEADER_TITLE_COLOR: '#111111',
} as const;

export const LEGAL_ENTITY_CONTACT_FORM_COPY = {
  CONSTITUTION_DATE_HELPER:
    'Fecha oficial de constitución en formato DD-MM-YYYY.',
  CONSTITUTION_DATE_LABEL: 'FECHA DE CONSTITUCIÓN',
  CONSTITUTION_DATE_PLACEHOLDER: 'DD-MM-YYYY',
  CORPORATE_ID_HELPER: 'Formato oficial costarricense (ej. 3-101-123456).',
  CORPORATE_ID_LABEL: 'CÉDULA JURÍDICA',
  CORPORATE_ID_PLACEHOLDER: '3-101-123456',
  CORPORATE_NAME_LABEL: 'RAZÓN SOCIAL',
  CORPORATE_NAME_PLACEHOLDER: 'Ej: Distribuidora Automotriz del Este S.A.',
  EMAIL_LABEL: 'CORREO ELECTRÓNICO',
  EMAIL_PLACEHOLDER: 'contacto@empresa.cr',
  GROSS_INCOME_LABEL: 'INGRESO BRUTO MENSUAL',
  GROSS_INCOME_PLACEHOLDER: '5000000',
  NET_INCOME_LABEL: 'INGRESO NETO MENSUAL',
  NET_INCOME_PLACEHOLDER: '3500000',
  PHONE_LABEL: 'TELÉFONO DE CONTACTO',
  PHONE_PLACEHOLDER: '+506 2200-0000',
  REPRESENTATIVE_ID_LABEL: 'CÉDULA DEL REPRESENTANTE',
  REPRESENTATIVE_ID_PLACEHOLDER: '1-1150-0222',
  REPRESENTATIVE_NAME_LABEL: 'NOMBRE DEL REPRESENTANTE LEGAL',
  REPRESENTATIVE_NAME_PLACEHOLDER: 'Ej: Juan Alberto Pérez Rojas',
  SECTION_1_TITLE: '1. INFORMACIÓN CORPORATIVA',
  SECTION_2_TITLE: '2. CONTACTO CORPORATIVO',
  SECTION_3_TITLE: '3. REPRESENTANTE LEGAL',
  SECTION_4_TITLE: '4. CAPACIDAD FINANCIERA',
} as const;

export const LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const LEGAL_ENTITY_CONTACT_FORM_NUMERICAL = {
  MAX_LENGTH_CORPORATE_ID: 12,
  MAX_LENGTH_DATE: 14,
  MAX_LENGTH_INCOME: 15,
  MAX_LENGTH_PHONE: 20,
} as const;

export const LEGAL_ENTITY_CONTACT_FORM_STYLES = {
  CARD_CONTAINER:
    'w-full self-stretch rounded-2xl bg-white p-4 gap-4 border border-gray-200',
  CONTAINER: 'w-full self-stretch gap-4',
  GRID_COLUMN: 'flex-1',
  GRID_ROW: 'w-full flex-row gap-3',
  SECTION_HEADER_ROW: 'flex-row items-center gap-2 mb-1',
  SECTION_HEADER_TITLE:
    'text-xs font-bold uppercase tracking-wider text-text-primary',
} as const;

export const LEGAL_ENTITY_CONTACT_FORM_TEST_IDS = {
  CARD_SECTION_1: 'legal-entity-contact-card-section-1',
  CARD_SECTION_2: 'legal-entity-contact-card-section-2',
  CARD_SECTION_3: 'legal-entity-contact-card-section-3',
  CARD_SECTION_4: 'legal-entity-contact-card-section-4',
  CONSTITUTION_DATE_INPUT: 'legal-entity-contact-constitution-date-input',
  CONTAINER: 'legal-entity-contact-form-container',
  CORPORATE_ID_INPUT: 'legal-entity-contact-corporate-id-input',
  CORPORATE_NAME_INPUT: 'legal-entity-contact-corporate-name-input',
  EMAIL_INPUT: 'legal-entity-contact-email-input',
  GROSS_INCOME_INPUT: 'legal-entity-contact-gross-income-input',
  NET_INCOME_INPUT: 'legal-entity-contact-net-income-input',
  PHONE_INPUT: 'legal-entity-contact-phone-input',
  REPRESENTATIVE_ID_INPUT: 'legal-entity-contact-representative-id-input',
  REPRESENTATIVE_NAME_INPUT: 'legal-entity-contact-representative-name-input',
  SECTION_1_HEADER: 'legal-entity-contact-section-1-header',
  SECTION_1_ICON: 'legal-entity-contact-section-1-icon',
  SECTION_2_HEADER: 'legal-entity-contact-section-2-header',
  SECTION_2_ICON: 'legal-entity-contact-section-2-icon',
  SECTION_3_HEADER: 'legal-entity-contact-section-3-header',
  SECTION_3_ICON: 'legal-entity-contact-section-3-icon',
  SECTION_4_HEADER: 'legal-entity-contact-section-4-header',
  SECTION_4_ICON: 'legal-entity-contact-section-4-icon',
} as const;
