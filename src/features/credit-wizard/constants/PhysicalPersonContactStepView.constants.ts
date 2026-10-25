import { esCR } from '@/shared/i18n';

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS = {
  BACK_ICON: '#1F2937',
  SCREEN_BG: '#F7F7F6',
  SUBMIT_ICON: '#FFFFFF',
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_CONSTANTS = {
  MOCK_USER_INITIALS: esCR.creditWizard.mockUserInitials,
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY = {
  BACK_BUTTON: esCR.common.buttons.back,
  DESCRIPTION:
    'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
  HEADER_SUBTITLE:
    'Ingresa la información de contacto, residencia y situación laboral/financiera del solicitante para el análisis de capacidad de pago.',
  HEADER_TITLE: esCR.creditWizard.steps.physical,
  SUBMIT_BUTTON: esCR.common.buttons.next,
  TITLE: esCR.creditWizard.steps.physical,
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS = {
  BACK_ICON_SIZE: 16,
  BACK_ICON_STROKE_WIDTH: 2,
  BASE_FOOTER_HEIGHT: 64,
  EXTRA_KEYBOARD_SCROLL_OFFSET: 24,
  SUBMIT_ICON_SIZE: 16,
  SUBMIT_ICON_STROKE_WIDTH: 2,
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL = {
  SCROLL_EVENT_THROTTLE_MS: 16,
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES = {
  BACK_BUTTON: 'flex-1',
  BOTTOM_BAR:
    'w-full self-stretch border-t border-gray-200 bg-background px-4 pt-3 flex-row items-center gap-3',
  CONTAINER: 'w-full flex-1 self-stretch bg-background',
  DESCRIPTION: 'text-sm text-text-secondary leading-relaxed',
  HEADER_BLOCK: 'gap-1',
  KEYBOARD_AVOIDING_VIEW: 'flex-1',
  SCROLL_CONTENT: 'w-full self-stretch px-4 py-4 gap-6',
  SCROLL_VIEW: 'w-full flex-1 self-stretch',
  SUBMIT_BUTTON: 'flex-1',
  TITLE: 'text-xl font-bold text-text-primary',
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS = {
  BACK_BUTTON: 'physical-person-contact-step-back-button',
  BOTTOM_BAR: 'physical-person-contact-step-bottom-bar',
  CONTAINER: 'physical-person-contact-step-container',
  DESCRIPTION: 'physical-person-contact-step-description',
  FORM: 'physical-person-contact-step-form',
  PROCESS_TOP_BAR: 'physical-person-contact-step-process-top-bar',
  SCROLL_VIEW: 'physical-person-contact-step-scroll-view',
  SUBMIT_BUTTON: 'physical-person-contact-step-submit-button',
  TITLE: 'physical-person-contact-step-title',
  WIZARD_HEADER: 'physical-person-contact-step-wizard-header',
} as const;
