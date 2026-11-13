import { esCR } from '@/shared/i18n';
import type { CustomSelectOption } from '@/shared/ui';
import { EMPLOYMENT_STATUSES } from './PhysicalPersonContact.constants';

export const PHYSICAL_PERSON_CONTACT_FORM_COLORS = {
  HEADER_ICON_STROKE: '#111111',
  HEADER_TITLE_COLOR: '#111111',
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_COPY = {
  CANTON_LABEL: 'CANTÓN',
  CANTON_PLACEHOLDER: 'Seleccione cantón',
  CELL_PHONE_LABEL: 'TELÉFONO CELULAR',
  CELL_PHONE_PLACEHOLDER: '+506 8888-8888',
  COMPANY_REFERENCE_LABEL: 'REFERENCIA LABORAL / EMPRESA',
  COMPANY_REFERENCE_PLACEHOLDER: 'Ej: Corporación CoriMotors S.A.',
  CURRENCY_LABEL: 'MONEDA DE INGRESOS',
  CURRENCY_PLACEHOLDER: 'Seleccione moneda',
  DISTRICT_LABEL: 'DISTRITO',
  DISTRICT_PLACEHOLDER: 'Seleccione distrito',
  EMAIL_LABEL: 'CORREO ELECTRÓNICO',
  EMAIL_PLACEHOLDER: 'ejemplo@correo.com',
  EMPLOYER_LABEL: 'PATRONO / EMPRESA',
  EMPLOYER_PLACEHOLDER: 'Ej: Corporación CoriMotors S.A.',
  EMPLOYMENT_STATUS_LABEL: 'CONDICIÓN LABORAL',
  EMPLOYMENT_STATUS_PLACEHOLDER: 'Seleccione situación laboral',
  ENTRY_DATE_LABEL: 'FECHA DE INGRESO',
  ENTRY_DATE_PLACEHOLDER: 'DD-MM-YYYY',
  EXACT_ADDRESS_LABEL: 'DIRECCIÓN EXACTA',
  EXACT_ADDRESS_PLACEHOLDER: 'Frente a parque, casa esquinera color blanco...',
  GROSS_INCOME_LABEL: 'INGRESO BRUTO',
  GROSS_INCOME_PLACEHOLDER: '1500000',
  HOME_PHONE_LABEL: 'TELÉFONO HABITACIÓN',
  HOME_PHONE_PLACEHOLDER: '+506 2222-2222',
  IBAN_ACCOUNT_LABEL: 'CUENTA IBAN',
  IBAN_ACCOUNT_PLACEHOLDER: 'CR05015202001026284066',
  NET_INCOME_LABEL: 'INGRESO NETO',
  NET_INCOME_PLACEHOLDER: '1200000',
  OFFICE_PHONE_LABEL: 'TEL. OFICINA',
  OFFICE_PHONE_PLACEHOLDER: '+506 2200-0000',
  OPTIONAL_BADGE: esCR.common.badges.optional,
  OTHER_INCOMES_BADGE: esCR.common.badges.optional,
  OTHER_INCOMES_HELPER:
    'Ingresos demostrables con constancia salarial adicional o certificación de CPA.',
  OTHER_INCOMES_LABEL: 'OTROS INGRESOS MENSUALES',
  OTHER_INCOMES_PLACEHOLDER: '0',
  PROFESSION_LABEL: 'PROFESIÓN U OFICIO',
  PROFESSION_PLACEHOLDER: 'Ej: Ingeniero de Sistemas, Administrador',
  PROVINCE_LABEL: 'PROVINCIA',
  PROVINCE_PLACEHOLDER: 'Seleccione provincia',
  REFERENCE_PHONE_LABEL: 'TELÉFONO DE REFERENCIA',
  REFERENCE_PHONE_PLACEHOLDER: '+506 2200-0000',
  SECTION_1_TITLE: '1. INFORMACIÓN DE CONTACTO',
  SECTION_2_TITLE: '2. DOMICILIO RESIDENCIAL',
  SECTION_3_TITLE: '3. DATOS LABORALES',
  SECTION_4_TITLE: '4. CAPACIDAD FINANCIERA',
  SECTION_5_TITLE: '5. REFERENCIA COMERCIAL Y CUENTA',
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS = {
  SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_NUMERICAL = {
  EXACT_ADDRESS_NUMBER_OF_LINES: 3,
  MAX_LENGTH_DATE: 14,
  MAX_LENGTH_IBAN: 22,
  MAX_LENGTH_INCOME: 15,
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_OPTIONS = {
  EMPLOYMENT_STATUS: [
    {
      label: 'Asalariado (Planilla CCSS)',
      value: EMPLOYMENT_STATUSES.SALARIED_CCSS,
    },
    {
      label: 'Asalariado (Sector Privado)',
      value: EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
    },
    {
      label: 'Asalariado (Sector Público)',
      value: EMPLOYMENT_STATUSES.SALARIED_PUBLIC,
    },
    {
      label: 'Empresario / Negocio Propio',
      value: EMPLOYMENT_STATUSES.BUSINESS_OWNER,
    },
    {
      label: 'Jubilado / Pensionado',
      value: EMPLOYMENT_STATUSES.RETIRED,
    },
    {
      label: 'Trabajador Independiente',
      value: EMPLOYMENT_STATUSES.INDEPENDENT,
    },
  ] as const satisfies readonly CustomSelectOption[],
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_STYLES = {
  CARD_CONTAINER: 'w-full rounded-2xl bg-stone-200 p-4 gap-4',
  CONTAINER: 'w-full gap-6',
  GRID_COLUMN: 'flex-1',
  GRID_ROW: 'flex-row gap-3',
  OTHER_INCOMES_BADGE_TEXT: 'text-xs font-semibold text-text-secondary',
  SECTION_HEADER_ROW: 'flex-row items-center gap-2 mb-1',
  SECTION_HEADER_TITLE:
    'text-xs font-bold tracking-wider text-text-primary uppercase',
} as const;

export const PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS = {
  CANTON_SELECT: 'physical-person-contact-canton-select',
  CELL_PHONE_INPUT: 'physical-person-contact-cell-phone-input',
  COMPANY_REFERENCE_INPUT: 'physical-person-contact-company-reference-input',
  CONTAINER: 'physical-person-contact-form-container',
  CURRENCY_SELECT: 'physical-person-contact-currency-select',
  DISTRICT_SELECT: 'physical-person-contact-district-select',
  EMAIL_INPUT: 'physical-person-contact-email-input',
  EMPLOYER_INPUT: 'physical-person-contact-employer-input',
  EMPLOYMENT_STATUS_SELECT: 'physical-person-contact-employment-status-select',
  ENTRY_DATE_INPUT: 'physical-person-contact-entry-date-input',
  EXACT_ADDRESS_INPUT: 'physical-person-contact-exact-address-input',
  GROSS_INCOME_INPUT: 'physical-person-contact-gross-income-input',
  HOME_PHONE_INPUT: 'physical-person-contact-home-phone-input',
  IBAN_ACCOUNT_INPUT: 'physical-person-contact-iban-account-input',
  NET_INCOME_INPUT: 'physical-person-contact-net-income-input',
  OFFICE_PHONE_INPUT: 'physical-person-contact-office-phone-input',
  OTHER_INCOMES_INPUT: 'physical-person-contact-other-incomes-input',
  PROFESSION_INPUT: 'physical-person-contact-profession-input',
  PROVINCE_SELECT: 'physical-person-contact-province-select',
  REFERENCE_PHONE_INPUT: 'physical-person-contact-reference-phone-input',
  SECTION_1_CARD: 'physical-person-contact-section-1-card',
  SECTION_1_HEADER: 'physical-person-contact-section-1-header',
  SECTION_1_ICON: 'physical-person-contact-section-1-icon',
  SECTION_2_CARD: 'physical-person-contact-section-2-card',
  SECTION_2_HEADER: 'physical-person-contact-section-2-header',
  SECTION_2_ICON: 'physical-person-contact-section-2-icon',
  SECTION_3_CARD: 'physical-person-contact-section-3-card',
  SECTION_3_HEADER: 'physical-person-contact-section-3-header',
  SECTION_3_ICON: 'physical-person-contact-section-3-icon',
  SECTION_4_CARD: 'physical-person-contact-section-4-card',
  SECTION_4_HEADER: 'physical-person-contact-section-4-header',
  SECTION_4_ICON: 'physical-person-contact-section-4-icon',
  SECTION_5_CARD: 'physical-person-contact-section-5-card',
  SECTION_5_HEADER: 'physical-person-contact-section-5-header',
  SECTION_5_ICON: 'physical-person-contact-section-5-icon',
} as const;
