import type { LegalEntityFormValues } from '../types/LegalEntityForm.types';
import type { PhysicalPersonFormValues } from '../types/PhysicalPersonForm.types';

export const APPLICANT_STEP_VIEW_COLORS = {
  DIVIDER_BG: '#D6D2CA',
  FOOTER_BORDER: '#E5E7EB',
  SCREEN_BG: '#F7F7F6',
  TAUPE_CONTAINER_BG: '#E8E6E1',
} as const;

export const APPLICANT_STEP_VIEW_COPY = {
  DESCRIPTION:
    'Complete la información del solicitante principal y defina las condiciones del régimen legal.',
  HEADER_SUBTITLE: 'Ingrese la información básica del solicitante.',
  HEADER_TITLE: 'Datos del Solicitante',
  SUBMIT_BUTTON: 'Siguiente: Información de Contacto',
  TITLE: 'Información del Solicitante',
} as const;

export const APPLICANT_STEP_VIEW_DEFAULT_VALUES: {
  LEGAL: LegalEntityFormValues;
  PHYSICAL: PhysicalPersonFormValues;
} = {
  LEGAL: {
    identificationNumber: '',
    identificationType: '',
    legalName: '',
    representativeIdentification: '',
    representativeName: '',
  },
  PHYSICAL: {
    birthDate: '',
    firstLastName: '',
    firstName: '',
    gender: '',
    identificationNumber: '',
    identificationType: '',
    maritalStatus: '',
    middleName: '',
    nationality: '',
    secondLastName: '',
  },
} as const;

export const APPLICANT_STEP_VIEW_ERRORS = {
  LEGAL: {
    IDENTIFICATION_NUMBER: 'Ingrese un número de cédula jurídica válido.',
    IDENTIFICATION_TYPE: 'Seleccione un tipo de identificación.',
    LEGAL_NAME: 'La razón social es obligatoria.',
    REPRESENTATIVE_IDENTIFICATION:
      'La cédula del representante es obligatoria.',
    REPRESENTATIVE_NAME: 'El nombre del representante es obligatorio.',
  },
  PHYSICAL: {
    BIRTH_DATE: 'La fecha de nacimiento es obligatoria.',
    FIRST_LAST_NAME: 'El primer apellido es obligatorio.',
    FIRST_NAME: 'El primer nombre es obligatorio.',
    GENDER: 'Seleccione el género.',
    IDENTIFICATION_NUMBER: 'Ingrese un número de identificación válido.',
    IDENTIFICATION_TYPE: 'Seleccione un tipo de identificación.',
    MARITAL_STATUS: 'Seleccione el estado civil.',
    NATIONALITY: 'Seleccione la nacionalidad.',
    SECOND_LAST_NAME: 'El segundo apellido es obligatorio.',
  },
} as const;

export const APPLICANT_STEP_VIEW_NUMERICAL = {
  CURRENT_STEP: 1,
  MIN_LEGAL_ID_LENGTH: 10,
  MIN_PHYSICAL_ID_LENGTH: 9,
  TOTAL_STEPS: 4,
} as const;

export const APPLICANT_STEP_VIEW_STYLES = {
  BOTTOM_BAR: 'w-full border-t border-[#E5E7EB] bg-[#F7F7F6] px-4 py-3 pb-6',
  CONTAINER: 'flex-1 bg-[#F7F7F6]',
  DESCRIPTION: 'text-sm text-[#5A6B80] leading-relaxed',
  DIVIDER: 'h-px w-full bg-[#D6D2CA]',
  HEADER_BLOCK: 'gap-1',
  SCROLL_CONTENT: 'p-4 gap-6 pb-8',
  TAUPE_CONTAINER: 'w-full rounded-2xl bg-[#E8E6E1] p-4 gap-6',
  TITLE: 'text-xl font-bold text-[#111111]',
} as const;

export const APPLICANT_STEP_VIEW_TEST_IDS = {
  BOTTOM_BAR: 'applicant-step-bottom-bar',
  CONTAINER: 'applicant-step-container',
  DESCRIPTION: 'applicant-step-description',
  DIVIDER: 'applicant-step-divider',
  LEGAL_FORM: 'applicant-step-legal-form',
  LEGAL_SELECTOR: 'applicant-step-legal-selector',
  PHYSICAL_FORM: 'applicant-step-physical-form',
  SCROLL_VIEW: 'applicant-step-scroll-view',
  SUBMIT_BUTTON: 'applicant-step-submit-button',
  TAUPE_CONTAINER: 'applicant-step-taupe-container',
  TITLE: 'applicant-step-title',
  VEHICLE_BENEFICIARY: 'applicant-step-vehicle-beneficiary',
  WIZARD_HEADER: 'applicant-step-wizard-header',
} as const;
