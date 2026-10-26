import { WIZARD_COPY } from './WizardCopy.constants';

export const CLOSE_PROCESS_MODAL_COLORS = {
  BADGE_ICON: '#3A5C45',
  CLOSE_ICON: '#5A6B80',
  SAVE_ICON: '#FFFFFF',
} as const;

export const CLOSE_PROCESS_MODAL_COPY = {
  BACKDROP_ACCESSIBILITY_LABEL:
    WIZARD_COPY.CLOSE_MODAL.BACKDROP_ACCESSIBILITY_LABEL,
  BODY: WIZARD_COPY.CLOSE_MODAL.BODY,
  CLOSE_ACCESSIBILITY_LABEL: WIZARD_COPY.CLOSE_MODAL.CLOSE_ACCESSIBILITY_LABEL,
  DISCARD: WIZARD_COPY.CLOSE_MODAL.DISCARD,
  SAVE_DRAFT: WIZARD_COPY.CLOSE_MODAL.SAVE_DRAFT,
  TITLE: WIZARD_COPY.CLOSE_MODAL.TITLE,
} as const;

export const CLOSE_PROCESS_MODAL_ICON_SIZES = {
  BADGE: 28,
  CLOSE: 20,
  SAVE: 20,
  STROKE_WIDTH: 2,
} as const;

export const CLOSE_PROCESS_MODAL_STYLES = {
  ACTIONS_WRAPPER: 'w-full gap-3',
  BACKDROP: 'flex-1 items-center justify-center bg-black/50 px-6',
  BADGE_WRAPPER:
    'h-14 w-14 items-center justify-center rounded-full bg-brand-beige',
  BODY: 'mb-8 mt-3 text-center text-base text-text-secondary',
  CLOSE_BUTTON:
    'absolute right-3 top-3 min-h-[48px] min-w-[48px] items-center justify-center rounded-full active:bg-black/5',
  CONTAINER:
    'w-[90%] max-w-[340px] items-center rounded-3xl bg-white px-6 py-8',
  TITLE: 'mt-6 text-center text-xl font-bold text-text-primary',
} as const;

export const CLOSE_PROCESS_MODAL_TEST_IDS = {
  BACKDROP: 'close-process-modal-backdrop',
  BODY: 'close-process-modal-body',
  CLOSE_BUTTON: 'close-process-modal-close',
  CONTAINER: 'close-process-modal-container',
  DISCARD_BUTTON: 'close-process-modal-discard',
  SAVE_DRAFT_BUTTON: 'close-process-modal-save-draft',
  TITLE: 'close-process-modal-title',
} as const;
