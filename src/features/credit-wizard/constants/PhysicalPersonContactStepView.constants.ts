import { esCR } from '@/shared/i18n';

const STEP_COPY = esCR.creditWizard.step2PhysicalContact;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY = {
  BACK_BUTTON: esCR.common.buttons.back,
  DESCRIPTION: STEP_COPY.description,
  HEADER_SUBTITLE: STEP_COPY.headerSubtitle,
  HEADER_TITLE: STEP_COPY.headerTitle,
  SUBMIT_BUTTON: esCR.common.buttons.next,
  TITLE: STEP_COPY.title,
} as const;

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL = {
  SCROLL_EVENT_THROTTLE_MS: 16,
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
