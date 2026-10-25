import { esCR } from '@/shared/i18n';
import type { CustomSelectOption } from '@/shared/ui';
import type { ThirdPartyBeneficiaryValues } from '../types/ApplicantStepView.types';
import type { LegalEntityFormValues } from '../types/LegalEntityForm.types';
import type { PhysicalPersonFormValues } from '../types/PhysicalPersonForm.types';
import { WIZARD_COPY } from './WizardCopy.constants';


export const APPLICANT_STEP_VIEW_COPY = {
  DESCRIPTION: WIZARD_COPY.STEP_1_APPLICANT.DESCRIPTION,
  HEADER_SUBTITLE: WIZARD_COPY.STEP_1_APPLICANT.HEADER_SUBTITLE,
  HEADER_TITLE: WIZARD_COPY.STEP_1_APPLICANT.HEADER_TITLE,
  SUBMIT_BUTTON: WIZARD_COPY.STEP_1_APPLICANT.SUBMIT_BUTTON,
  SUBTITLE: WIZARD_COPY.STEP_1_APPLICANT.SUBTITLE,
  TITLE: WIZARD_COPY.STEP_1_APPLICANT.TITLE,
} as const;

export const APPLICANT_STEP_VIEW_CONSTANTS = {
  MOCK_USER_INITIALS: esCR.creditWizard.mockUserInitials,
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
    thirdPartyEmail: '',
    thirdPartyFullName: '',
    thirdPartyNationality: '',
    thirdPartyPhone: '',
    thirdPartyRelationship: '',
  },
} as const;

export const APPLICANT_STEP_VIEW_ERRORS = WIZARD_COPY.STEP_1_APPLICANT.ERRORS;


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
  TITLE: 'text-xl font-bold uppercase text-text-primary',
} as const;

export const APPLICANT_STEP_VIEW_TEST_IDS = {
  BOTTOM_BAR: 'applicant-step-bottom-bar',
  CONTAINER: 'applicant-step-container',
  DESCRIPTION: 'applicant-step-description',
  DIVIDER: 'applicant-step-divider',
  LEGAL_FORM: 'applicant-step-legal-form',
  LEGAL_SELECTOR: 'applicant-step-legal-selector',
  PHYSICAL_FORM: 'applicant-step-physical-form',
  PROCESS_TOP_BAR: 'applicant-step-process-top-bar',
  SCROLL_VIEW: 'applicant-step-scroll-view',
  SUBMIT_BUTTON: 'applicant-step-submit-button',
  TAUPE_CONTAINER: 'applicant-step-taupe-container',
  TITLE: 'applicant-step-title',
  VEHICLE_BENEFICIARY: 'applicant-step-vehicle-beneficiary',
  WIZARD_HEADER: 'applicant-step-wizard-header',
} as const;

export const BENEFICIARY_MODAL_COPY =
  WIZARD_COPY.STEP_1_APPLICANT.BENEFICIARY_MODAL;

export const BENEFICIARY_MODAL_COLORS = {
  SECTION_ICON_STROKE: '#1E293B',
} as const;

export const BENEFICIARY_MODAL_DIMENSIONS = {
  BLUR_INTENSITY: 50,
  CLOSE_ICON_SIZE: 20,
  SECTION_ICON_SIZE: 20,
  SECTION_ICON_STROKE_WIDTH: 2,
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
  BOTTOM_BAR: '-mx-6 -mb-6 border-t border-gray-200 bg-white p-4',
  CLOSE_BUTTON:
    'min-h-[48px] min-w-[48px] items-center justify-center text-text-primary',
  GROUP_CONTAINER: 'w-full gap-3',
  GROUP_LABEL: 'text-sm font-medium text-text-primary',
  HEADER_ROW: 'flex-row items-start justify-between',
  HEADER_TEXT_BLOCK: 'flex-1 pr-4',
  MODAL_CONTAINER:
    'flex-1 w-full max-h-[85%] min-h-[500px] rounded-t-[2rem] bg-white p-6 gap-4',
  SAVE_BUTTON: 'w-full self-stretch',
  SCROLL_VIEW: 'flex-1 w-full',
  SECTION_HEADER_ROW: 'mb-2 mt-6 flex-row items-center gap-2',
  SECTION_HEADER_ROW_FIRST: 'mb-2 flex-row items-center gap-2',
  SECTION_HEADER_TITLE: 'text-sm font-bold uppercase text-slate-800',
  SUBTITLE: 'mt-1 text-xs text-text-secondary leading-relaxed',
  TITLE: 'text-lg font-bold text-text-primary',
} as const;

export const BENEFICIARY_MODAL_TEST_IDS = {
  BACKDROP: 'beneficiary-modal-backdrop',
  BIRTH_DATE_INPUT: 'beneficiary-modal-birth-date-input',
  BOTTOM_BAR: 'beneficiary-modal-bottom-bar',
  CLOSE_BUTTON: 'beneficiary-modal-close-button',
  DOC_NUMBER_INPUT: 'beneficiary-modal-doc-number-input',
  DOC_TYPE_INPUT: 'beneficiary-modal-doc-type-input',
  EMAIL_INPUT: 'beneficiary-modal-email-input',
  FULL_NAME_INPUT: 'beneficiary-modal-full-name-input',
  IDENTIFICATION_LABEL: 'beneficiary-modal-identification-label',
  MODAL_CONTAINER: 'beneficiary-modal-container',
  NATIONALITY_INPUT: 'beneficiary-modal-nationality-input',
  PHONE_INPUT: 'beneficiary-modal-phone-input',
  RELATIONSHIP_INPUT: 'beneficiary-modal-relationship-input',
  SAVE_BUTTON: 'beneficiary-modal-save-button',
  SECTION_1_HEADER: 'beneficiary-modal-section-1-header',
  SECTION_2_HEADER: 'beneficiary-modal-section-2-header',
  SECTION_3_HEADER: 'beneficiary-modal-section-3-header',
  SECTION_4_HEADER: 'beneficiary-modal-section-4-header',
} as const;
