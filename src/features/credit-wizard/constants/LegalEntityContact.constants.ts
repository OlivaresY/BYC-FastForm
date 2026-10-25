import { DATE_DD_MM_YYYY, INTERNATIONAL_PHONE_REGEX } from '@/shared/utils';

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

export const LEGAL_ENTITY_CONTACT_ERRORS = {
  CONSTITUTION_DATE_FUTURE:
    'La fecha de constitución no puede ser una fecha futura.',
  CONSTITUTION_DATE_INVALID:
    'La fecha de constitución debe tener un formato DD-MM-YYYY válido.',
  CONSTITUTION_DATE_REQUIRED: 'La fecha de constitución es obligatoria.',
  CORPORATE_ID_INVALID:
    'La cédula jurídica debe tener un formato válido (ej. 3-101-123456).',
  CORPORATE_ID_REQUIRED: 'La cédula jurídica es obligatoria.',
  CORPORATE_NAME_REQUIRED: 'La razón social es obligatoria.',
  EMAIL_INVALID: 'El formato del correo electrónico no es válido.',
  EMAIL_REQUIRED: 'El correo electrónico es obligatorio.',
  GROSS_INCOME_POSITIVE: 'El ingreso bruto debe ser mayor a 0.',
  GROSS_INCOME_REQUIRED: 'El ingreso bruto es obligatorio.',
  NET_INCOME_EXCEEDS_GROSS:
    'El ingreso neto no puede ser mayor al ingreso bruto.',
  NET_INCOME_POSITIVE: 'El ingreso neto debe ser mayor a 0.',
  NET_INCOME_REQUIRED: 'El ingreso neto es obligatorio.',
  PHONE_INVALID: 'El formato del teléfono no es válido.',
  PHONE_REQUIRED: 'El teléfono es obligatorio.',
  REPRESENTATIVE_ID_REQUIRED: 'La cédula del representante es obligatoria.',
  REPRESENTATIVE_NAME_REQUIRED:
    'El nombre del representante legal es obligatorio.',
  SUBMIT_FAILED:
    'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
} as const;

export const LEGAL_ENTITY_CONTACT_PATTERNS = {
  CORPORATE_ID: /^3-?\d{3}-?\d{6}$/,
  DATE_DD_MM_YYYY,
  PHONE: INTERNATIONAL_PHONE_REGEX,
} as const;
