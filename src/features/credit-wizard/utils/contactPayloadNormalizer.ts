import { LEGAL_ENTITY_CONTACT_DEFAULT_VALUES } from '../constants/LegalEntityContact.constants';
import { PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES } from '../constants/PhysicalPersonContact.constants';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';

const LEGACY_CANTON_SAN_JOSE = 'san_jose';
const CANONICAL_CANTON_CENTRAL = 'central';

export interface NormalizedPhysicalPersonContact {
  commercialReference: {
    companyReference: string;
    ibanAccount: string;
    referencePhone: string;
  };
  contactInfo: {
    cellPhone: string;
    email: string;
    homePhone?: string | null;
  };
  employmentData: {
    employer: string;
    employmentStatus?: PhysicalPersonContact['employmentData']['employmentStatus'];
    entryDate: string;
    officePhone: string;
    profession: string;
  };
  financialCapacity: {
    currency: PhysicalPersonContact['financialCapacity']['currency'];
    grossIncome?: number;
    netIncome?: number;
    otherIncomes?: number;
  };
  residentialAddress: {
    canton: string;
    district: string;
    exactAddress: string;
    province: string;
  };
}

export interface NormalizedLegalEntityContact {
  commercialActivity: {
    accountingPhone: string;
    constitutionDate: string;
    economicSector: string;
    employeesCount?: number;
    mainActivity: string;
  };
  commercialAddress: {
    canton: string;
    district: string;
    exactAddress: string;
    province: string;
  };
  commercialReference: {
    companyReference: string;
    ibanAccount: string;
    referencePhone: string;
  };
  contactInfo: {
    cellPhone: string;
    email: string;
    officePhone: string;
  };
  financialStatements: {
    currency: LegalEntityContact['financialStatements']['currency'];
    grossSales?: number;
    netProfit?: number;
    otherIncomes?: number;
  };
}

/**
 * Normalizes legacy canton values.
 * If the incoming canton strictly or case-insensitively matches 'san_jose',
 * it mutates it to the canonical 'central'.
 */
export const normalizeCantonValue = (canton?: unknown): string => {
  if (typeof canton !== 'string') {
    return '';
  }
  const trimmed = canton.trim();
  if (trimmed.toLowerCase() === LEGACY_CANTON_SAN_JOSE) {
    return CANONICAL_CANTON_CENTRAL;
  }
  return trimmed;
};

const isRecordObject = (
  value: unknown,
): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Normalizes an incoming physical person payload (flat or nested) into the
 * 5 canonical nested domain objects required by PhysicalPersonContact.schema.
 */
export const normalizePhysicalPersonContactPayload = (
  rawPayload?: Partial<PhysicalPersonContact> | Record<string, unknown> | null,
): NormalizedPhysicalPersonContact => {
  const defaults = PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES;
  const raw: Record<string, unknown> = isRecordObject(rawPayload)
    ? (rawPayload as Record<string, unknown>)
    : {};

  const nestedContact: Record<string, unknown> = isRecordObject(raw.contactInfo)
    ? (raw.contactInfo as Record<string, unknown>)
    : {};
  const nestedAddress: Record<string, unknown> = isRecordObject(
    raw.residentialAddress,
  )
    ? (raw.residentialAddress as Record<string, unknown>)
    : {};
  const nestedEmployment: Record<string, unknown> = isRecordObject(
    raw.employmentData,
  )
    ? (raw.employmentData as Record<string, unknown>)
    : {};
  const nestedFinancial: Record<string, unknown> = isRecordObject(
    raw.financialCapacity,
  )
    ? (raw.financialCapacity as Record<string, unknown>)
    : {};
  const nestedCommercialRef: Record<string, unknown> = isRecordObject(
    raw.commercialReference,
  )
    ? (raw.commercialReference as Record<string, unknown>)
    : {};

  const cellPhone = (nestedContact.cellPhone ??
    raw.cellPhone ??
    raw.phone ??
    defaults.contactInfo.cellPhone) as string;

  const email = (nestedContact.email ??
    raw.email ??
    defaults.contactInfo.email) as string;

  const homePhone = (nestedContact.homePhone ??
    raw.homePhone ??
    defaults.contactInfo.homePhone) as string;

  const rawCanton = nestedAddress.canton ?? raw.canton;
  const canton =
    rawCanton !== undefined
      ? normalizeCantonValue(rawCanton)
      : defaults.residentialAddress.canton;

  const district = (nestedAddress.district ??
    raw.district ??
    defaults.residentialAddress.district) as string;

  const exactAddress = (nestedAddress.exactAddress ??
    raw.exactAddress ??
    defaults.residentialAddress.exactAddress) as string;

  const province = (nestedAddress.province ??
    raw.province ??
    defaults.residentialAddress.province) as string;

  const employer = (nestedEmployment.employer ??
    raw.employer ??
    defaults.employmentData.employer) as string;

  const employmentStatus = (nestedEmployment.employmentStatus ??
    raw.employmentStatus ??
    defaults.employmentData.employmentStatus) as
    | PhysicalPersonContact['employmentData']['employmentStatus']
    | undefined;

  const entryDate = (nestedEmployment.entryDate ??
    raw.entryDate ??
    defaults.employmentData.entryDate) as string;

  const officePhone = (nestedEmployment.officePhone ??
    raw.officePhone ??
    defaults.employmentData.officePhone) as string;

  const profession = (nestedEmployment.profession ??
    raw.profession ??
    defaults.employmentData.profession) as string;

  const currency = (nestedFinancial.currency ??
    raw.currency ??
    defaults.financialCapacity.currency) as PhysicalPersonContact['financialCapacity']['currency'];

  const grossIncome = (nestedFinancial.grossIncome ??
    raw.grossIncome ??
    defaults.financialCapacity.grossIncome) as number | undefined;

  const netIncome = (nestedFinancial.netIncome ??
    raw.netIncome ??
    defaults.financialCapacity.netIncome) as number | undefined;

  const otherIncomes = (nestedFinancial.otherIncomes ??
    raw.otherIncomes ??
    defaults.financialCapacity.otherIncomes) as number | undefined;

  const companyReference = (nestedCommercialRef.companyReference ??
    raw.companyReference ??
    defaults.commercialReference.companyReference) as string;

  const ibanAccount = (nestedCommercialRef.ibanAccount ??
    raw.ibanAccount ??
    defaults.commercialReference.ibanAccount) as string;

  const referencePhone = (nestedCommercialRef.referencePhone ??
    raw.referencePhone ??
    defaults.commercialReference.referencePhone) as string;

  return {
    commercialReference: {
      companyReference,
      ibanAccount,
      referencePhone,
    },
    contactInfo: {
      cellPhone,
      email,
      homePhone,
    },
    employmentData: {
      employer,
      employmentStatus,
      entryDate,
      officePhone,
      profession,
    },
    financialCapacity: {
      currency,
      grossIncome,
      netIncome,
      otherIncomes,
    },
    residentialAddress: {
      canton,
      district,
      exactAddress,
      province,
    },
  };
};

/**
 * Normalizes an incoming legal entity payload (flat legacy or nested) into the
 * 5 canonical nested domain objects required by LegalEntityContact.schema.
 */
export const normalizeLegalEntityContactPayload = (
  rawPayload?: Partial<LegalEntityContact> | Record<string, unknown> | null,
): NormalizedLegalEntityContact => {
  const defaults = LEGAL_ENTITY_CONTACT_DEFAULT_VALUES;
  const raw: Record<string, unknown> = isRecordObject(rawPayload)
    ? (rawPayload as Record<string, unknown>)
    : {};

  const nestedContact: Record<string, unknown> = isRecordObject(raw.contactInfo)
    ? (raw.contactInfo as Record<string, unknown>)
    : {};
  const nestedAddress: Record<string, unknown> = isRecordObject(
    raw.commercialAddress,
  )
    ? (raw.commercialAddress as Record<string, unknown>)
    : {};
  const nestedActivity: Record<string, unknown> = isRecordObject(
    raw.commercialActivity,
  )
    ? (raw.commercialActivity as Record<string, unknown>)
    : {};
  const nestedFinancial: Record<string, unknown> = isRecordObject(
    raw.financialStatements,
  )
    ? (raw.financialStatements as Record<string, unknown>)
    : {};
  const nestedCommercialRef: Record<string, unknown> = isRecordObject(
    raw.commercialReference,
  )
    ? (raw.commercialReference as Record<string, unknown>)
    : {};

  const cellPhone = (nestedContact.cellPhone ??
    raw.cellPhone ??
    raw.phone ??
    defaults.contactInfo.cellPhone) as string;

  const email = (nestedContact.email ??
    raw.email ??
    defaults.contactInfo.email) as string;

  const officePhone = (nestedContact.officePhone ??
    raw.officePhone ??
    defaults.contactInfo.officePhone) as string;

  const rawCanton = nestedAddress.canton ?? raw.canton;
  const canton =
    rawCanton !== undefined
      ? normalizeCantonValue(rawCanton)
      : defaults.commercialAddress.canton;

  const district = (nestedAddress.district ??
    raw.district ??
    defaults.commercialAddress.district) as string;

  const exactAddress = (nestedAddress.exactAddress ??
    raw.exactAddress ??
    defaults.commercialAddress.exactAddress) as string;

  const province = (nestedAddress.province ??
    raw.province ??
    defaults.commercialAddress.province) as string;

  const accountingPhone = (nestedActivity.accountingPhone ??
    raw.accountingPhone ??
    defaults.commercialActivity.accountingPhone) as string;

  const constitutionDate = (nestedActivity.constitutionDate ??
    raw.constitutionDate ??
    defaults.commercialActivity.constitutionDate) as string;

  const economicSector = (nestedActivity.economicSector ??
    raw.economicSector ??
    defaults.commercialActivity.economicSector) as string;

  const employeesCount = (nestedActivity.employeesCount ??
    raw.employeesCount ??
    defaults.commercialActivity.employeesCount) as number | undefined;

  const mainActivity = (nestedActivity.mainActivity ??
    raw.mainActivity ??
    defaults.commercialActivity.mainActivity) as string;

  const currency = (nestedFinancial.currency ??
    raw.currency ??
    defaults.financialStatements.currency) as LegalEntityContact['financialStatements']['currency'];

  const grossSales = (nestedFinancial.grossSales ??
    raw.grossSales ??
    raw.grossIncome ??
    defaults.financialStatements.grossSales) as number | undefined;

  const netProfit = (nestedFinancial.netProfit ??
    raw.netProfit ??
    raw.netIncome ??
    defaults.financialStatements.netProfit) as number | undefined;

  const otherIncomes = (nestedFinancial.otherIncomes ??
    raw.otherIncomes ??
    defaults.financialStatements.otherIncomes) as number | undefined;

  const companyReference = (nestedCommercialRef.companyReference ??
    raw.companyReference ??
    defaults.commercialReference.companyReference) as string;

  const ibanAccount = (nestedCommercialRef.ibanAccount ??
    raw.ibanAccount ??
    defaults.commercialReference.ibanAccount) as string;

  const referencePhone = (nestedCommercialRef.referencePhone ??
    raw.referencePhone ??
    defaults.commercialReference.referencePhone) as string;

  return {
    commercialActivity: {
      accountingPhone,
      constitutionDate,
      economicSector,
      employeesCount,
      mainActivity,
    },
    commercialAddress: {
      canton,
      district,
      exactAddress,
      province,
    },
    commercialReference: {
      companyReference,
      ibanAccount,
      referencePhone,
    },
    contactInfo: {
      cellPhone,
      email,
      officePhone,
    },
    financialStatements: {
      currency,
      grossSales,
      netProfit,
      otherIncomes,
    },
  };
};
