import { DATE_DD_MM_YYYY } from '@/shared/utils';

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
    grossIncome: 0,
    netIncome: 0,
    otherIncomes: undefined,
  },
  residentialAddress: {
    canton: '',
    district: '',
    exactAddress: '',
    province: '',
  },
} as const;

export const PHYSICAL_PERSON_CONTACT_ERRORS = {
  CONTACT_INFO: {
    CELL_PHONE_INVALID: 'El formato del teléfono celular no es válido.',
    CELL_PHONE_REQUIRED: 'El teléfono celular es obligatorio.',
    EMAIL_INVALID: 'El formato del correo electrónico no es válido.',
    EMAIL_REQUIRED: 'El correo electrónico es obligatorio.',
    HOME_PHONE_INVALID: 'El formato del teléfono fijo no es válido.',
  },
  EMPLOYMENT_DATA: {
    EMPLOYER_REQUIRED: 'El nombre del patrono o empresa es obligatorio.',
    EMPLOYMENT_STATUS_REQUIRED: 'La situación laboral es obligatoria.',
    ENTRY_DATE_FUTURE: 'La fecha de ingreso no puede ser una fecha futura.',
    ENTRY_DATE_INVALID:
      'La fecha de ingreso debe tener un formato DD-MM-YYYY válido.',
    OFFICE_PHONE_INVALID: 'El formato del teléfono de oficina no es válido.',
    OFFICE_PHONE_REQUIRED: 'El teléfono de oficina es obligatorio.',
    PROFESSION_REQUIRED: 'La profesión u ocupación es obligatoria.',
  },
  FINANCIAL_CAPACITY: {
    CURRENCY_INVALID: 'Seleccione una moneda válida (CRC o USD).',
    GROSS_INCOME_POSITIVE: 'El ingreso bruto debe ser mayor a 0.',
    GROSS_INCOME_REQUIRED: 'El ingreso bruto es obligatorio.',
    NET_INCOME_POSITIVE: 'El ingreso neto debe ser mayor a 0.',
    NET_INCOME_REQUIRED: 'El ingreso neto es obligatorio.',
    OTHER_INCOMES_MIN: 'Otros ingresos no puede ser negativo.',
    OTHER_INCOMES_REQUIRED: 'Otros ingresos debe ser un valor numérico.',
  },
  RESIDENTIAL_ADDRESS: {
    CANTON_REQUIRED: 'El cantón es obligatorio.',
    DISTRICT_REQUIRED: 'El distrito es obligatorio.',
    EXACT_ADDRESS_REQUIRED: 'La dirección exacta es obligatoria.',
    PROVINCE_REQUIRED: 'La provincia es obligatoria.',
  },
  SUBMIT_FAILED:
    'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
} as const;

export const PHYSICAL_PERSON_CONTACT_PATTERNS = {
  DATE_DD_MM_YYYY,
  INTERNATIONAL_PHONE:
    /^(\+?[1-9]\d{0,3}|\([1-9]\d{0,3}\))?\s?[\d\-\s()]{6,16}$/,
} as const;
