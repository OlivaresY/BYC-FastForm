import { esCR } from '@/shared/i18n';

const STEP_COPY = esCR.creditWizard.step2LegalContact;

export const LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY = {
  BACK_BUTTON: esCR.common.buttons.back,
  DESCRIPTION: STEP_COPY.description,
  HEADER_SUBTITLE: STEP_COPY.headerSubtitle,
  HEADER_TITLE: STEP_COPY.headerTitle,
  SUBMIT_BUTTON: esCR.common.buttons.next,
  TITLE: STEP_COPY.title,
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
