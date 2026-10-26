import { DATE_DD_MM_YYYY, INTERNATIONAL_PHONE_REGEX } from '@/shared/utils';
import { WIZARD_COPY } from './WizardCopy.constants';

export const LEGAL_ENTITY_CONTACT_DEFAULT_VALUES = {
  constitutionDate: '',
  corporateId: '',
  corporateName: '',
  email: '',
  grossIncome: undefined,
  netIncome: undefined,
  phone: '',
  representativeId: '',
  representativeName: '',
} as const;

export const LEGAL_ENTITY_CONTACT_ERRORS =
  WIZARD_COPY.STEP_2_LEGAL_CONTACT.ERRORS;

export const LEGAL_ENTITY_CONTACT_PATTERNS = {
  CORPORATE_ID: /^3-?\d{3}-?\d{6}$/,
  DATE_DD_MM_YYYY,
  PHONE: INTERNATIONAL_PHONE_REGEX,
} as const;
