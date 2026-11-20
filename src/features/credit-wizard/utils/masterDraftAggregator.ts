import {
  ECONOMIC_SECTOR_OTHER_VALUE,
  NATIONALITY_OTHER_VALUE,
} from '../constants';
import { AVAILABLE_BANKS } from '../constants/BankAuthorizations.constants';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../constants/LegalEntitySelector.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../constants/VehicleBeneficiarySection.constants';
import { MasterCreditApplicationSchema } from '../schemas/MasterCreditApplication.schema';
import type {
  ApplicantStepData,
  LegalApplicantStepData,
  PhysicalApplicantStepData,
} from '../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';
import {
  APPLICATION_STATUS,
  BANK_KEY_TO_CODE_MAP,
  DEFAULT_TEMPLATE_VERSION,
  type MasterCreditApplicationPayload,
  type MasterDraftAggregatorInput,
  type PhysicalMasterDraftAggregatorInput,
  type SelectedBankCode,
} from '../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';

const EMPTY_STRING = '';

/**
 * Extracts a deterministic list of selected bank codes from Step 4 boolean flags.
 */
export const extractSelectedBanks = (
  bankAuthorizations: BankAuthorizationsFormValues,
): SelectedBankCode[] =>
  AVAILABLE_BANKS.filter((bankKey) => bankAuthorizations[bankKey] === true).map(
    (bankKey) => BANK_KEY_TO_CODE_MAP[bankKey],
  );

/**
 * Sanitizes Step 1 physical applicant data by eradicating residual ghost data:
 * - Clears `nationalityOther` when `nationality` is not `'other'`.
 * - Strips all third-party beneficiary fields when `vehicleBeneficiary` is `'same_holder'`.
 */
export const sanitizePhysicalApplicantData = (
  applicant: PhysicalApplicantStepData,
): PhysicalApplicantStepData => {
  const sanitizedValues = {
    ...applicant.values,
    nationalityOther:
      applicant.values.nationality === NATIONALITY_OTHER_VALUE
        ? applicant.values.nationalityOther
        : EMPTY_STRING,
  };

  if (
    applicant.vehicleBeneficiary ===
    VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER
  ) {
    return {
      regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
      values: sanitizedValues,
      vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    };
  }

  return {
    isThirdPartyRegistration: applicant.isThirdPartyRegistration,
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    thirdPartyBirthDate: applicant.thirdPartyBirthDate,
    thirdPartyDocNumber: applicant.thirdPartyDocNumber,
    thirdPartyDocType: applicant.thirdPartyDocType,
    thirdPartyEmail: applicant.thirdPartyEmail,
    thirdPartyFullName: applicant.thirdPartyFullName,
    thirdPartyNationality: applicant.thirdPartyNationality,
    thirdPartyPhone: applicant.thirdPartyPhone,
    thirdPartyRelationship: applicant.thirdPartyRelationship,
    values: sanitizedValues,
    vehicleBeneficiary: applicant.vehicleBeneficiary,
  };
};

/**
 * Sanitizes Step 1 legal entity applicant data by stripping residual
 * third-party beneficiary fields when `vehicleBeneficiary` is `'same_holder'`.
 */
export const sanitizeLegalApplicantData = (
  applicant: LegalApplicantStepData,
): LegalApplicantStepData => {
  const sanitizedValues = {
    ...applicant.values,
  };

  if (
    applicant.vehicleBeneficiary ===
    VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER
  ) {
    return {
      regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
      values: sanitizedValues,
      vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    };
  }

  return {
    isThirdPartyRegistration: applicant.isThirdPartyRegistration,
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    thirdPartyBirthDate: applicant.thirdPartyBirthDate,
    thirdPartyDocNumber: applicant.thirdPartyDocNumber,
    thirdPartyDocType: applicant.thirdPartyDocType,
    thirdPartyEmail: applicant.thirdPartyEmail,
    thirdPartyFullName: applicant.thirdPartyFullName,
    thirdPartyNationality: applicant.thirdPartyNationality,
    thirdPartyPhone: applicant.thirdPartyPhone,
    thirdPartyRelationship: applicant.thirdPartyRelationship,
    values: sanitizedValues,
    vehicleBeneficiary: applicant.vehicleBeneficiary,
  };
};

/**
 * Sanitizes Step 1 applicant data regardless of regime.
 */
export const sanitizeApplicantStepData = (
  applicant: ApplicantStepData,
): ApplicantStepData => {
  if (applicant.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL) {
    return sanitizePhysicalApplicantData(applicant);
  }
  return sanitizeLegalApplicantData(applicant);
};

/**
 * Sanitizes Step 2 legal entity contact data by clearing residual
 * `commercialActivity.economicSectorOther` when `economicSector` is not `'Otro'`.
 */
export const sanitizeLegalEntityContactData = (
  contact: LegalEntityContact,
): LegalEntityContact => {
  if (!contact?.commercialActivity) {
    return contact;
  }

  const sanitizedEconomicSectorOther =
    contact.commercialActivity.economicSector === ECONOMIC_SECTOR_OTHER_VALUE
      ? contact.commercialActivity.economicSectorOther
      : EMPTY_STRING;

  return {
    ...contact,
    commercialActivity: {
      ...contact.commercialActivity,
      economicSectorOther: sanitizedEconomicSectorOther,
    },
  };
};

/**
 * Produces a shallow immutable copy of Step 2 physical person contact data.
 */
export const sanitizePhysicalPersonContactData = (
  contact: PhysicalPersonContact,
): PhysicalPersonContact => {
  if (!contact) {
    return contact;
  }

  return {
    ...contact,
  };
};

const isPhysicalAggregatorInput = (
  input: MasterDraftAggregatorInput,
): input is PhysicalMasterDraftAggregatorInput =>
  input.applicant.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL;

/**
 * Aggregates Steps 1–4 into a sanitized, schema-validated, immutable Master
 * Credit Application JSON payload strictly in memory (Zero-Storage compliant).
 */
export const buildMasterSubmissionPayload = (
  input: MasterDraftAggregatorInput,
): MasterCreditApplicationPayload => {
  const selectedBanks = extractSelectedBanks(input.bankAuthorizations);
  const status = input.status ?? APPLICATION_STATUS.PENDING;
  const templateVersion = input.templateVersion ?? DEFAULT_TEMPLATE_VERSION;

  if (isPhysicalAggregatorInput(input)) {
    const candidate = {
      applicant: sanitizePhysicalApplicantData(input.applicant),
      bankAuthorizations: { ...input.bankAuthorizations },
      contact: sanitizePhysicalPersonContactData(input.contact),
      regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
      selectedBanks,
      status,
      templateVersion,
      userId: input.userId,
      vehicleCredit: { ...input.vehicleCredit },
    };

    return MasterCreditApplicationSchema.parse(candidate);
  }

  const candidate = {
    applicant: sanitizeLegalApplicantData(input.applicant),
    bankAuthorizations: { ...input.bankAuthorizations },
    contact: sanitizeLegalEntityContactData(input.contact),
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    selectedBanks,
    status,
    templateVersion,
    userId: input.userId,
    vehicleCredit: { ...input.vehicleCredit },
  };

  return MasterCreditApplicationSchema.parse(candidate);
};
