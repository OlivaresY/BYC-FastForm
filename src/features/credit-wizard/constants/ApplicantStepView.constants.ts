import type { CustomSelectOption } from '@/shared/ui/CustomSelect';
import type { LegalEntityFormValues } from '../types/LegalEntityForm.types';
import type { PhysicalPersonFormValues } from '../types/PhysicalPersonForm.types';
import type { ThirdPartyBeneficiaryValues } from '../types/ApplicantStepView.types';

export const APPLICANT_STEP_VIEW_COLORS = {
  DIVIDER_BG: '#D6D2CA',
  FOOTER_BORDER: '#E5E7EB',
  SCREEN_BG: '#F7F7F6',
  SUBMIT_ICON: '#FFFFFF',
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
  THIRD_PARTY: ThirdPartyBeneficiaryValues;
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
  THIRD_PARTY: {
    isThirdPartyRegistration: false,
    thirdPartyBirthDate: '',
    thirdPartyDocNumber: '',
    thirdPartyDocType: '',
    thirdPartyFullName: '',
    thirdPartyNationality: '',
    thirdPartyRelationship: '',
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
  THIRD_PARTY: {
    BIRTH_DATE: 'La fecha de nacimiento del beneficiario es obligatoria.',
    DOC_NUMBER: 'El número de identificación del beneficiario es obligatorio.',
    DOC_TYPE: 'Seleccione el tipo de identificación del beneficiario.',
    FULL_NAME: 'El nombre completo del beneficiario es obligatorio.',
    NATIONALITY: 'Seleccione la nacionalidad del beneficiario.',
    RELATIONSHIP: 'Seleccione el parentesco con el beneficiario.',
  },
} as const;

export const APPLICANT_STEP_VIEW_ICON_DIMENSIONS = {
  SUBMIT_ICON_SIZE: 20,
  SUBMIT_ICON_STROKE_WIDTH: 2,
} as const;

export const APPLICANT_STEP_VIEW_NUMERICAL = {
  CURRENT_STEP: 1,
  MIN_LEGAL_ID_LENGTH: 10,
  MIN_PHYSICAL_ID_LENGTH: 9,
  TOTAL_STEPS: 4,
} as const;

export const APPLICANT_STEP_VIEW_STYLES = {
  BOTTOM_BAR:
    'w-full self-stretch border-t border-gray-200 bg-background px-4 py-3 pb-6',
  CONTAINER: 'w-full flex-1 self-stretch bg-background',
  DESCRIPTION: 'text-sm text-text-secondary leading-relaxed',
  DIVIDER: 'h-px w-full bg-stone-300',
  HEADER_BLOCK: 'gap-1',
  KEYBOARD_AVOIDING_VIEW: 'flex-1',
  SCROLL_CONTENT: 'w-full self-stretch px-4 py-4 gap-6 pb-8',
  SCROLL_VIEW: 'w-full flex-1 self-stretch',
  SUBMIT_BUTTON: 'w-full self-stretch',
  TAUPE_CONTAINER: 'w-full self-stretch rounded-2xl bg-stone-200 p-4 gap-6',
  TITLE: 'text-xl font-bold text-text-primary',
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

export const BENEFICIARY_MODAL_COPY = {
  BACKDROP_ACCESSIBILITY_LABEL: 'Cerrar modal de beneficiario',
  BIRTH_DATE_LABEL: 'Fecha de Nacimiento',
  BIRTH_DATE_PLACEHOLDER: 'DD / MM / AAAA',
  CLOSE_ACCESSIBILITY_LABEL: 'Cerrar',
  DOC_NUMBER_LABEL: 'Número de Identificación',
  DOC_NUMBER_PLACEHOLDER: 'Ingrese el número de documento',
  DOC_TYPE_LABEL: 'Tipo de Documento',
  DOC_TYPE_PLACEHOLDER: 'Seleccione tipo de documento',
  FULL_NAME_LABEL: 'Nombre Completo',
  FULL_NAME_PLACEHOLDER: 'Ingrese nombre completo del tercero',
  NATIONALITY_LABEL: 'Nacionalidad',
  NATIONALITY_PLACEHOLDER: 'Seleccione nacionalidad',
  RELATIONSHIP_LABEL: 'Parentesco / Relación',
  RELATIONSHIP_PLACEHOLDER: 'Seleccione parentesco',
  SAVE_BUTTON: 'Guardar Datos',
  SUBTITLE:
    'Complete la información de la persona a cuyo nombre se registrará el vehículo.',
  TITLE: 'Beneficiario Final (Tercero)',
} as const;

export const BENEFICIARY_MODAL_DIMENSIONS = {
  BLUR_INTENSITY: 50,
  CLOSE_ICON_SIZE: 20,
} as const;

export const BENEFICIARY_MODAL_OPTIONS = {
  DOC_TYPE: [
    { label: 'Cédula Nacional (Física)', value: 'national_id' },
    { label: 'DIMEX / Residencia', value: 'dimex' },
    { label: 'Pasaporte', value: 'passport' },
  ] as const satisfies readonly CustomSelectOption[],
  NATIONALITY: [
    { label: 'Costarricense', value: 'CR' },
    { label: 'Nicaragüense', value: 'NI' },
    { label: 'Colombiana', value: 'CO' },
    { label: 'Estadounidense', value: 'US' },
    { label: 'Otra', value: 'other' },
  ] as const satisfies readonly CustomSelectOption[],
  RELATIONSHIP: [
    { label: 'Cónyuge', value: 'spouse' },
    { label: 'Hijo(a)', value: 'child' },
    { label: 'Padre / Madre', value: 'parent' },
    { label: 'Hermano(a)', value: 'sibling' },
    { label: 'Socio(a)', value: 'partner' },
    { label: 'Otro', value: 'other' },
  ] as const satisfies readonly CustomSelectOption[],
} as const;

export const BENEFICIARY_MODAL_STYLES = {
  CLOSE_BUTTON:
    'min-h-[48px] min-w-[48px] items-center justify-center text-text-primary',
  HEADER_ROW: 'flex-row items-start justify-between',
  HEADER_TEXT_BLOCK: 'flex-1 pr-4',
  MODAL_CONTAINER: 'w-full max-h-[85%] rounded-t-[2rem] bg-white p-6 gap-4',
  SAVE_BUTTON: 'mt-2 w-full self-stretch',
  SCROLL_VIEW: 'flex-1',
  SUBTITLE: 'mt-1 text-xs text-text-secondary leading-relaxed',
  TITLE: 'text-lg font-bold text-text-primary',
} as const;

export const BENEFICIARY_MODAL_TEST_IDS = {
  BACKDROP: 'beneficiary-modal-backdrop',
  BIRTH_DATE_INPUT: 'beneficiary-modal-birth-date-input',
  CLOSE_BUTTON: 'beneficiary-modal-close-button',
  DOC_NUMBER_INPUT: 'beneficiary-modal-doc-number-input',
  DOC_TYPE_INPUT: 'beneficiary-modal-doc-type-input',
  FULL_NAME_INPUT: 'beneficiary-modal-full-name-input',
  MODAL_CONTAINER: 'beneficiary-modal-container',
  NATIONALITY_INPUT: 'beneficiary-modal-nationality-input',
  RELATIONSHIP_INPUT: 'beneficiary-modal-relationship-input',
  SAVE_BUTTON: 'beneficiary-modal-save-button',
} as const;
