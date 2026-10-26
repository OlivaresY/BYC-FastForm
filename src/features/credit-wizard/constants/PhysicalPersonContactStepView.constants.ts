import { WIZARD_COPY } from './WizardCopy.constants';

export const PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY = {
  BACK_BUTTON: WIZARD_COPY.BUTTONS.BACK,
  DESCRIPTION: WIZARD_COPY.STEP_2_PHYSICAL_CONTACT.DESCRIPTION,
  HEADER_SUBTITLE: WIZARD_COPY.STEP_2_PHYSICAL_CONTACT.HEADER_SUBTITLE,
  HEADER_TITLE: WIZARD_COPY.STEP_2_PHYSICAL_CONTACT.HEADER_TITLE,
  SUBMIT_BUTTON: WIZARD_COPY.BUTTONS.NEXT,
  TITLE: WIZARD_COPY.STEP_2_PHYSICAL_CONTACT.TITLE,
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
