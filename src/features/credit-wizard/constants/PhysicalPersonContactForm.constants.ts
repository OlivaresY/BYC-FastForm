import { esCR } from '@/shared/i18n';
import type { CustomSelectOption } from '@/shared/ui';
import { EMPLOYMENT_STATUSES } from './PhysicalPersonContact.constants';

export const PHYSICAL_PERSON_CONTACT_FORM_COLORS = {
  HEADER_ICON_STROKE: '#111111',
  HEADER_TITLE_COLOR: '#111111',
} as const;

const FORM_I18N = esCR.creditWizard.step2PhysicalContact.form;

export const PHYSICAL_PERSON_CONTACT_FORM_COPY = {
  CANTON_LABEL: FORM_I18N.labels.canton,
  CANTON_PLACEHOLDER: FORM_I18N.placeholders.canton,
  CELL_PHONE_LABEL: FORM_I18N.labels.cellPhone,
  CELL_PHONE_PLACEHOLDER: FORM_I18N.placeholders.cellPhone,
  COMPANY_REFERENCE_LABEL: FORM_I18N.labels.companyReference,
  COMPANY_REFERENCE_PLACEHOLDER: FORM_I18N.placeholders.companyReference,
  CURRENCY_LABEL: FORM_I18N.labels.currency,
  CURRENCY_PLACEHOLDER: FORM_I18N.placeholders.currency,
  DISTRICT_LABEL: FORM_I18N.labels.district,
  DISTRICT_PLACEHOLDER: FORM_I18N.placeholders.district,
  EMAIL_LABEL: FORM_I18N.labels.email,
  EMAIL_PLACEHOLDER: FORM_I18N.placeholders.email,
  EMPLOYER_LABEL: FORM_I18N.labels.employer,
  EMPLOYER_PLACEHOLDER: FORM_I18N.placeholders.employer,
  EMPLOYMENT_STATUS_LABEL: FORM_I18N.labels.employmentStatus,
  EMPLOYMENT_STATUS_PLACEHOLDER: FORM_I18N.placeholders.employmentStatus,
  ENTRY_DATE_LABEL: FORM_I18N.labels.entryDate,
  ENTRY_DATE_PLACEHOLDER: FORM_I18N.placeholders.entryDate,
  EXACT_ADDRESS_LABEL: FORM_I18N.labels.exactAddress,
  EXACT_ADDRESS_PLACEHOLDER: FORM_I18N.placeholders.exactAddress,
  GROSS_INCOME_LABEL: FORM_I18N.labels.grossIncome,
  GROSS_INCOME_PLACEHOLDER: FORM_I18N.placeholders.grossIncome,
  HOME_PHONE_LABEL: FORM_I18N.labels.homePhone,
  HOME_PHONE_PLACEHOLDER: FORM_I18N.placeholders.homePhone,
  IBAN_ACCOUNT_LABEL: FORM_I18N.labels.ibanAccount,
  IBAN_ACCOUNT_PLACEHOLDER: FORM_I18N.placeholders.ibanAccount,
  NET_INCOME_LABEL: FORM_I18N.labels.netIncome,
  NET_INCOME_PLACEHOLDER: FORM_I18N.placeholders.netIncome,
  OFFICE_PHONE_LABEL: FORM_I18N.labels.officePhone,
  OFFICE_PHONE_PLACEHOLDER: FORM_I18N.placeholders.officePhone,
  OPTIONAL_BADGE: esCR.common.badges.optional,
  OTHER_INCOMES_BADGE: esCR.common.badges.optional,
  OTHER_INCOMES_HELPER: FORM_I18N.helpers.otherIncomes,
  OTHER_INCOMES_LABEL: FORM_I18N.labels.otherIncomes,
  OTHER_INCOMES_PLACEHOLDER: FORM_I18N.placeholders.otherIncomes,
  PROFESSION_LABEL: FORM_I18N.labels.profession,
  PROFESSION_PLACEHOLDER: FORM_I18N.placeholders.profession,
  PROVINCE_LABEL: FORM_I18N.labels.province,
  PROVINCE_PLACEHOLDER: FORM_I18N.placeholders.province,
  REFERENCE_PHONE_LABEL: FORM_I18N.labels.referencePhone,
  REFERENCE_PHONE_PLACEHOLDER: FORM_I18N.placeholders.referencePhone,
  SECTION_1_TITLE: FORM_I18N.sections.section1,
  SECTION_2_TITLE: FORM_I18N.sections.section2,
  SECTION_3_TITLE: FORM_I18N.sections.section3,
  SECTION_4_TITLE: FORM_I18N.sections.section4,
  SECTION_5_TITLE: FORM_I18N.sections.section5,
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
