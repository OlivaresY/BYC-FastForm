import { ZodError } from 'zod';
import {
  ECONOMIC_SECTOR_OTHER_VALUE,
  NATIONALITY_OTHER_VALUE,
} from '../../constants';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import type {
  LegalApplicantStepData,
  PhysicalApplicantStepData,
} from '../../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import type { LegalEntityContact } from '../../types/LegalEntityContact.types';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
  type LegalMasterDraftAggregatorInput,
  type MasterDraftAggregatorInput,
  type PhysicalMasterDraftAggregatorInput,
} from '../../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../../types/PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';
import {
  buildMasterSubmissionPayload,
  extractSelectedBanks,
  sanitizeApplicantStepData,
  sanitizeLegalEntityContactData,
} from '../masterDraftAggregator';

const VALID_CR_IBAN = 'CR05015202001026284066';

const createPhysicalApplicant = (
  overrides?: Partial<PhysicalApplicantStepData>,
): PhysicalApplicantStepData => ({
  regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
  values: {
    birthDate: '15-08-1988',
    firstLastName: 'Rodríguez',
    firstName: 'Carlos',
    gender: 'male',
    identificationNumber: '1-1234-0567',
    identificationType: 'national_id',
    maritalStatus: 'single',
    middleName: 'Alberto',
    nationality: 'CR',
    nationalityOther: '',
    secondLastName: 'Castro',
  },
  vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
  ...overrides,
});

const createLegalApplicant = (
  overrides?: Partial<LegalApplicantStepData>,
): LegalApplicantStepData => ({
  regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
  values: {
    identificationNumber: '3-101-123456',
    identificationType: 'legal_id',
    legalName: 'CoriMotors Inversiones S.A.',
    representativeIdentification: '1-1234-0567',
    representativeName: 'Carlos Rodríguez Castro',
  },
  vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
  ...overrides,
});

const createPhysicalContact = (): PhysicalPersonContact => ({
  commercialReference: {
    companyReference: 'Corporación CoriMotors S.A.',
    ibanAccount: VALID_CR_IBAN,
    referencePhone: '+506 2200-0000',
  },
  contactInfo: {
    cellPhone: '+506 8888-8888',
    email: 'carlos.rodriguez@correo.cr',
    homePhone: '+506 2222-2222',
  },
  employmentData: {
    employer: 'Tech Solutions CR',
    employmentStatus: EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
    entryDate: '01-03-2020',
    officePhone: '+506 2210-1010',
    profession: 'Ingeniero de Sistemas',
  },
  financialCapacity: {
    currency: FINANCIAL_CURRENCIES.CRC,
    grossIncome: 2500000,
    netIncome: 2100000,
    otherIncomes: 150000,
  },
  residentialAddress: {
    canton: 'Alajuela',
    district: 'Alajuela',
    exactAddress: '200 metros norte del parque central',
    province: 'Alajuela',
  },
});

const createLegalContact = (
  overrides?: Partial<LegalEntityContact>,
): LegalEntityContact => ({
  commercialActivity: {
    accountingPhone: '+506 2200-1111',
    constitutionDate: '10-05-2015',
    economicSector: 'Comercio',
    economicSectorOther: '',
    employeesCount: 35,
    mainActivity: 'Importación y venta de vehículos',
  },
  commercialAddress: {
    canton: 'Alajuela',
    district: 'Alajuela',
    exactAddress: 'Edificio Corporativo CoriMotors, Piso 2',
    province: 'Alajuela',
  },
  commercialReference: {
    companyReference: 'Distribuidora Automotriz S.A.',
    ibanAccount: VALID_CR_IBAN,
    referencePhone: '+506 2299-9999',
  },
  contactInfo: {
    cellPhone: '+506 8888-1234',
    email: 'finanzas@corimotors.cr',
    officePhone: '+506 2200-2222',
  },
  financialStatements: {
    currency: FINANCIAL_CURRENCIES.USD,
    grossSales: 500000,
    netProfit: 120000,
    otherIncomes: 15000,
  },
  ...overrides,
});

const createVehicleCredit = (): VehicleCreditFormValues => ({
  anio: '2026',
  color: 'Blanco Perla',
  marca: 'KAIYI',
  modelo: 'X3 Pro',
  moneda: 'USD',
  monto_financiar: 22500,
  monto_prima: 2500,
  plazo_meses: '72',
  valor_vehiculo: 25000,
});

const createBankAuthorizations = (
  overrides?: Partial<BankAuthorizationsFormValues>,
): BankAuthorizationsFormValues => ({
  autoriza_buros_credito: true,
  autoriza_sugef_cic: true,
  banco_bac: true,
  banco_bncr: false,
  banco_carro_facil: false,
  banco_promerica: false,
  banco_scotiabank: false,
  ...overrides,
});

const createPhysicalAggregatorInput = (
  overrides?: Partial<PhysicalMasterDraftAggregatorInput>,
): PhysicalMasterDraftAggregatorInput => ({
  applicant: createPhysicalApplicant(),
  bankAuthorizations: createBankAuthorizations(),
  contact: createPhysicalContact(),
  userId: 'advisor-uuid-001',
  vehicleCredit: createVehicleCredit(),
  ...overrides,
});

const createLegalAggregatorInput = (
  overrides?: Partial<LegalMasterDraftAggregatorInput>,
): LegalMasterDraftAggregatorInput => ({
  applicant: createLegalApplicant(),
  bankAuthorizations: createBankAuthorizations({
    banco_bac: true,
    banco_promerica: true,
  }),
  contact: createLegalContact(),
  userId: 'advisor-uuid-002',
  vehicleCredit: createVehicleCredit(),
  ...overrides,
});

describe('masterDraftAggregator Utility Suite', () => {
  describe('extractSelectedBanks', () => {
    it('maps a single selected bank flag to its corresponding bank code', () => {
      const result = extractSelectedBanks(
        createBankAuthorizations({
          banco_bac: false,
          banco_bncr: true,
        }),
      );

      expect(result).toEqual([SELECTED_BANK_CODES.BNCR]);
    });

    it('maps multiple selected bank flags in deterministic order', () => {
      const result = extractSelectedBanks(
        createBankAuthorizations({
          banco_bac: true,
          banco_bncr: true,
          banco_carro_facil: true,
          banco_promerica: true,
          banco_scotiabank: true,
        }),
      );

      expect(result).toEqual([
        SELECTED_BANK_CODES.BAC,
        SELECTED_BANK_CODES.BNCR,
        SELECTED_BANK_CODES.SCOTIABANK,
        SELECTED_BANK_CODES.PROMERICA,
        SELECTED_BANK_CODES.CARRO_FACIL,
      ]);
    });

    it('returns an empty array when no banks are enabled', () => {
      const result = extractSelectedBanks(
        createBankAuthorizations({
          banco_bac: false,
          banco_bncr: false,
          banco_carro_facil: false,
          banco_promerica: false,
          banco_scotiabank: false,
        }),
      );

      expect(result).toEqual([]);
    });
  });

  describe('buildMasterSubmissionPayload — Valid Aggregation', () => {
    it('aggregates and validates a complete Physical Person application with default status and template version', () => {
      const input = createPhysicalAggregatorInput();

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.regime).toBe(LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL);
      expect(payload.status).toBe(APPLICATION_STATUS.PENDING);
      expect(payload.templateVersion).toBe(DEFAULT_TEMPLATE_VERSION);
      expect(payload.selectedBanks).toEqual([SELECTED_BANK_CODES.BAC]);
      expect(payload.userId).toBe('advisor-uuid-001');
      expect(payload.vehicleCredit.monto_financiar).toBe(22500);
    });

    it('aggregates and validates a complete Legal Entity application', () => {
      const input = createLegalAggregatorInput();

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.regime).toBe(LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL);
      expect(payload.status).toBe(APPLICATION_STATUS.PENDING);
      expect(payload.templateVersion).toBe(DEFAULT_TEMPLATE_VERSION);
      expect(payload.selectedBanks).toEqual([
        SELECTED_BANK_CODES.BAC,
        SELECTED_BANK_CODES.PROMERICA,
      ]);
      expect(payload.userId).toBe('advisor-uuid-002');
    });

    it('respects explicit status and templateVersion overrides when provided', () => {
      const input = createPhysicalAggregatorInput({
        status: APPLICATION_STATUS.DRAFT,
        templateVersion: 'v2',
      });

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.status).toBe(APPLICATION_STATUS.DRAFT);
      expect(payload.templateVersion).toBe('v2');
    });
  });

  describe('Ghost Data Eradication', () => {
    it('strips residual third-party beneficiary fields when vehicleBeneficiary is same_holder (Physical)', () => {
      const applicantWithResidualThirdParty = createPhysicalApplicant({
        isThirdPartyRegistration: true,
        thirdPartyBirthDate: '12-03-1990',
        thirdPartyDocNumber: '1-2222-3333',
        thirdPartyDocType: 'national_id',
        thirdPartyEmail: 'ghost@correo.cr',
        thirdPartyFullName: 'Ghost Beneficiary',
        thirdPartyNationality: 'CR',
        thirdPartyPhone: '+506 8888-0000',
        thirdPartyRelationship: 'Amigo',
        vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
      });
      const input = createPhysicalAggregatorInput({
        applicant: applicantWithResidualThirdParty,
      });

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.applicant.vehicleBeneficiary).toBe(
        VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
      );
      expect(payload.applicant.isThirdPartyRegistration).toBeUndefined();
      expect(payload.applicant.thirdPartyFullName).toBeUndefined();
      expect(payload.applicant.thirdPartyEmail).toBeUndefined();
      expect(payload.applicant.thirdPartyDocNumber).toBeUndefined();
      expect(applicantWithResidualThirdParty.thirdPartyFullName).toBe(
        'Ghost Beneficiary',
      );
    });

    it('strips residual third-party beneficiary fields when vehicleBeneficiary is same_holder (Legal)', () => {
      const legalApplicantWithResidual = createLegalApplicant({
        isThirdPartyRegistration: true,
        thirdPartyFullName: 'Ghost Legal Beneficiary',
        vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
      });
      const input = createLegalAggregatorInput({
        applicant: legalApplicantWithResidual,
      });

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.applicant.isThirdPartyRegistration).toBeUndefined();
      expect(payload.applicant.thirdPartyFullName).toBeUndefined();
    });

    it('preserves third-party beneficiary fields when vehicleBeneficiary is third_party', () => {
      const thirdPartyApplicant = createPhysicalApplicant({
        isThirdPartyRegistration: true,
        thirdPartyBirthDate: '20-04-1992',
        thirdPartyDocNumber: '1-9876-5432',
        thirdPartyDocType: 'national_id',
        thirdPartyEmail: 'tercero@correo.cr',
        thirdPartyFullName: 'María López Vargas',
        thirdPartyNationality: 'CR',
        thirdPartyPhone: '+506 8777-6655',
        thirdPartyRelationship: 'Cónyuge',
        vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
      });
      const input = createPhysicalAggregatorInput({
        applicant: thirdPartyApplicant,
      });

      const payload = buildMasterSubmissionPayload(input);

      expect(payload.applicant.vehicleBeneficiary).toBe(
        VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
      );
      expect(payload.applicant.isThirdPartyRegistration).toBe(true);
      expect(payload.applicant.thirdPartyFullName).toBe('María López Vargas');
    });

    it('clears residual nationalityOther when a standard nationality is selected', () => {
      const baseApplicant = createPhysicalApplicant();
      const input = createPhysicalAggregatorInput({
        applicant: {
          ...baseApplicant,
          values: {
            ...baseApplicant.values,
            nationality: 'CR',
            nationalityOther: 'Guatemalteca',
          },
        },
      });

      const payload = buildMasterSubmissionPayload(input);

      if (payload.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL) {
        expect(payload.applicant.values.nationality).toBe('CR');
        expect(payload.applicant.values.nationalityOther).toBe('');
      }
      expect(input.applicant.values.nationalityOther).toBe('Guatemalteca');
    });

    it('preserves nationalityOther when nationality is other', () => {
      const baseApplicant = createPhysicalApplicant();
      const input = createPhysicalAggregatorInput({
        applicant: {
          ...baseApplicant,
          values: {
            ...baseApplicant.values,
            nationality: NATIONALITY_OTHER_VALUE,
            nationalityOther: 'Panameña',
          },
        },
      });

      const payload = buildMasterSubmissionPayload(input);

      if (payload.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL) {
        expect(payload.applicant.values.nationalityOther).toBe('Panameña');
      }
    });

    it('clears residual economicSectorOther when a standard economic sector is selected', () => {
      const baseContact = createLegalContact();
      const input = createLegalAggregatorInput({
        contact: {
          ...baseContact,
          commercialActivity: {
            ...baseContact.commercialActivity,
            economicSector: 'Comercio',
            economicSectorOther: 'Minería Espacial',
          },
        },
      });

      const payload = buildMasterSubmissionPayload(input);

      if (payload.regime === LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL) {
        expect(payload.contact.commercialActivity.economicSector).toBe(
          'Comercio',
        );
        expect(payload.contact.commercialActivity.economicSectorOther).toBe('');
      }
      expect(input.contact.commercialActivity.economicSectorOther).toBe(
        'Minería Espacial',
      );
    });

    it('preserves economicSectorOther when economicSector is Otro', () => {
      const baseContact = createLegalContact();
      const sanitized = sanitizeLegalEntityContactData({
        ...baseContact,
        commercialActivity: {
          ...baseContact.commercialActivity,
          economicSector: ECONOMIC_SECTOR_OTHER_VALUE,
          economicSectorOther: 'Energías Renovables',
        },
      });

      expect(sanitized.commercialActivity.economicSectorOther).toBe(
        'Energías Renovables',
      );
    });

    it('dispatches sanitizeApplicantStepData cleanly for both regimes', () => {
      const physicalSanitized = sanitizeApplicantStepData(
        createPhysicalApplicant({
          thirdPartyFullName: 'Ghost',
          vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
        }),
      );
      const legalSanitized = sanitizeApplicantStepData(
        createLegalApplicant({
          thirdPartyFullName: 'Ghost',
          vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
        }),
      );

      expect(physicalSanitized.thirdPartyFullName).toBeUndefined();
      expect(legalSanitized.thirdPartyFullName).toBeUndefined();
    });
  });

  describe('Validation Rejection', () => {
    it('throws ZodError when userId is empty or whitespace-only', () => {
      const emptyUserInput = createPhysicalAggregatorInput({ userId: '' });
      const whitespaceUserInput = createPhysicalAggregatorInput({
        userId: '   ',
      });

      expect(() => buildMasterSubmissionPayload(emptyUserInput)).toThrow(
        ZodError,
      );
      expect(() => buildMasterSubmissionPayload(whitespaceUserInput)).toThrow(
        ZodError,
      );
    });

    it('throws ZodError when Step 1 is physical but Step 2 provides a legal contact payload', () => {
      const mismatchedInput = {
        ...createPhysicalAggregatorInput(),
        contact: createLegalContact(),
      } as unknown as MasterDraftAggregatorInput;

      expect(() => buildMasterSubmissionPayload(mismatchedInput)).toThrow(
        ZodError,
      );
    });

    it('throws ZodError when Step 1 is legal but Step 2 provides a physical contact payload', () => {
      const mismatchedInput = {
        ...createLegalAggregatorInput(),
        contact: createPhysicalContact(),
      } as unknown as MasterDraftAggregatorInput;

      expect(() => buildMasterSubmissionPayload(mismatchedInput)).toThrow(
        ZodError,
      );
    });

    it('throws ZodError when no banks are selected', () => {
      const input = createPhysicalAggregatorInput({
        bankAuthorizations: createBankAuthorizations({
          banco_bac: false,
        }),
      });

      expect(() => buildMasterSubmissionPayload(input)).toThrow(ZodError);
    });

    it('throws ZodError when mandatory SUGEF or Credit Bureau authorizations are false', () => {
      const sugefFalseInput = createPhysicalAggregatorInput({
        bankAuthorizations: createBankAuthorizations({
          autoriza_sugef_cic: false,
        }),
      });
      const bureauFalseInput = createPhysicalAggregatorInput({
        bankAuthorizations: createBankAuthorizations({
          autoriza_buros_credito: false,
        }),
      });

      expect(() => buildMasterSubmissionPayload(sugefFalseInput)).toThrow(
        ZodError,
      );
      expect(() => buildMasterSubmissionPayload(bureauFalseInput)).toThrow(
        ZodError,
      );
    });
  });
});
