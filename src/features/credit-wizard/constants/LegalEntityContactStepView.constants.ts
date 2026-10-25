import { WIZARD_COPY } from './WizardCopy.constants';

export const LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY = {
  BACK_BUTTON: WIZARD_COPY.BUTTONS.BACK,
  DESCRIPTION: WIZARD_COPY.STEP_2_LEGAL_CONTACT.DESCRIPTION,
  HEADER_SUBTITLE: WIZARD_COPY.STEP_2_LEGAL_CONTACT.HEADER_SUBTITLE,
  HEADER_TITLE: WIZARD_COPY.STEP_2_LEGAL_CONTACT.HEADER_TITLE,
  SUBMIT_BUTTON: WIZARD_COPY.BUTTONS.NEXT,
  TITLE: WIZARD_COPY.STEP_2_LEGAL_CONTACT.TITLE,
} as const;

export const LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL = {
  SCROLL_EVENT_THROTTLE_MS: 16,
} as const;

export const LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS = {
  BACK_BUTTON: 'legal-entity-contact-step-back-button',
  BOTTOM_BAR: 'legal-entity-contact-step-bottom-bar',
  CONTAINER: 'legal-entity-contact-step-container',
  DESCRIPTION: 'legal-entity-contact-step-description',
  FORM: 'legal-entity-contact-step-form',
  PROCESS_TOP_BAR: 'legal-entity-contact-step-process-top-bar',
  SCROLL_VIEW: 'legal-entity-contact-step-scroll-view',
  SUBMIT_BUTTON: 'legal-entity-contact-step-submit-button',
  TITLE: 'legal-entity-contact-step-title',
  WIZARD_HEADER: 'legal-entity-contact-step-wizard-header',
} as const;
