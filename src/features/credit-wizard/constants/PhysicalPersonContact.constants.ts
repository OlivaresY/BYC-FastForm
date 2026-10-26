import { DATE_DD_MM_YYYY, INTERNATIONAL_PHONE_REGEX } from '@/shared/utils';
import { WIZARD_COPY } from './WizardCopy.constants';

export const EMPLOYMENT_STATUSES = {
  BUSINESS_OWNER: 'business_owner',
  INDEPENDENT: 'independent',
  RETIRED: 'retired',
  SALARIED_CCSS: 'salaried_ccss',
  SALARIED_PRIVATE: 'salaried_private',
  SALARIED_PUBLIC: 'salaried_public',
} as const;

export const FINANCIAL_CURRENCIES = {
  CRC: 'CRC',
  USD: 'USD',
} as const;

export const PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES = {
  contactInfo: {
    cellPhone: '',
    email: '',
    homePhone: '',
  },
  employmentData: {
    employer: '',
    employmentStatus: undefined,
    entryDate: '',
    officePhone: '',
    profession: '',
  },
  financialCapacity: {
    currency: FINANCIAL_CURRENCIES.CRC,
    grossIncome: undefined,
    netIncome: undefined,
    otherIncomes: undefined,
  },
  residentialAddress: {
    canton: '',
    district: '',
    exactAddress: '',
    province: '',
  },
} as const;

export const PHYSICAL_PERSON_CONTACT_ERRORS =
  WIZARD_COPY.STEP_2_PHYSICAL_CONTACT.ERRORS;

export const PHYSICAL_PERSON_CONTACT_PATTERNS = {
  DATE_DD_MM_YYYY,
  INTERNATIONAL_PHONE: INTERNATIONAL_PHONE_REGEX,
} as const;
