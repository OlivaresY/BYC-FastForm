import { DATE_DD_MM_YYYY, INTERNATIONAL_PHONE_REGEX } from '@/shared/utils';
import { WIZARD_COPY } from './WizardCopy.constants';

export const FINANCIAL_CURRENCIES = {
  CRC: 'CRC',
  USD: 'USD',
} as const;

export const LEGAL_ENTITY_CONTACT_DEFAULT_VALUES = {
  commercialActivity: {
    accountingPhone: '',
    constitutionDate: '',
    economicSector: '',
    employeesCount: undefined,
    mainActivity: '',
  },
  commercialAddress: {
    canton: '',
    district: '',
    exactAddress: '',
    province: '',
  },
  commercialReference: {
    companyReference: '',
    ibanAccount: '',
    referencePhone: '',
  },
  contactInfo: {
    cellPhone: '',
    email: '',
    officePhone: '',
  },
  financialStatements: {
    currency: FINANCIAL_CURRENCIES.CRC,
    grossSales: undefined,
    netProfit: undefined,
    otherIncomes: undefined,
  },
} as const;

export const LEGAL_ENTITY_CONTACT_ERRORS =
  WIZARD_COPY.STEP_2_LEGAL_CONTACT.ERRORS;

export const LEGAL_ENTITY_CONTACT_PATTERNS = {
  CR_IBAN: /^CR\d{20}$/,
  DATE_DD_MM_YYYY,
  INTERNATIONAL_PHONE: INTERNATIONAL_PHONE_REGEX,
} as const;
