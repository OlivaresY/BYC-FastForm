import { OTHER_ECONOMIC_SECTOR_VALUE } from '../../constants/LegalEntityContactForm.constants';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { OTHER_NATIONALITY_VALUE } from '../../constants/PhysicalPersonForm.constants';
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
  type LegalMasterCreditApplicationPayload,
  type PhysicalMasterCreditApplicationPayload,
} from '../../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../../types/PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';
import {
  MASTER_CREDIT_APPLICATION_ERRORS,
  MasterCreditApplicationSchema,
} from '../MasterCreditApplication.schema';

const VALID_CR_IBAN = 'CR05015202001026284066';

const createValidPhysicalApplicant = (
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

const createValidLegalApplicant = (
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

const createValidPhysicalContact = (): PhysicalPersonContact => ({
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

const createValidLegalContact = (): LegalEntityContact => ({
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
});

const createValidVehicleCredit = (): VehicleCreditFormValues => ({
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

const createValidBankAuthorizations = (
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

const createValidPhysicalMasterPayload =
  (): PhysicalMasterCreditApplicationPayload => ({
    applicant: createValidPhysicalApplicant(),
    bankAuthorizations: createValidBankAuthorizations(),
    contact: createValidPhysicalContact(),
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    selectedBanks: [SELECTED_BANK_CODES.BAC],
    status: APPLICATION_STATUS.PENDING,
    templateVersion: DEFAULT_TEMPLATE_VERSION,
    userId: 'advisor-uuid-001',
    vehicleCredit: createValidVehicleCredit(),
  });

const createValidLegalMasterPayload =
  (): LegalMasterCreditApplicationPayload => ({
    applicant: createValidLegalApplicant(),
    bankAuthorizations: createValidBankAuthorizations({
      banco_bac: true,
      banco_scotiabank: true,
    }),
    contact: createValidLegalContact(),
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    selectedBanks: [SELECTED_BANK_CODES.BAC, SELECTED_BANK_CODES.SCOTIABANK],
    status: APPLICATION_STATUS.PENDING,
    templateVersion: DEFAULT_TEMPLATE_VERSION,
    userId: 'advisor-uuid-002',
    vehicleCredit: createValidVehicleCredit(),
  });

describe('MasterCreditApplicationSchema Validation Suite', () => {
  describe('Valid Complete Payloads', () => {
    it('validates a complete Physical Person application with Pending status and v1 template', () => {
      const payload = createValidPhysicalMasterPayload();

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.regime).toBe(
          LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
        );
        expect(result.data.status).toBe(APPLICATION_STATUS.PENDING);
        expect(result.data.templateVersion).toBe(DEFAULT_TEMPLATE_VERSION);
        expect(result.data.selectedBanks).toEqual([SELECTED_BANK_CODES.BAC]);
      }
    });

    it('validates a Physical Person application with third-party beneficiary and custom nationality', () => {
      const payload: PhysicalMasterCreditApplicationPayload = {
        ...createValidPhysicalMasterPayload(),
        applicant: {
          isThirdPartyRegistration: true,
          regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
          thirdPartyBirthDate: '20-04-1992',
          thirdPartyDocNumber: '1-9876-5432',
          thirdPartyDocType: 'national_id',
          thirdPartyEmail: 'tercero@correo.cr',
          thirdPartyFullName: 'María López Vargas',
          thirdPartyNationality: 'CR',
          thirdPartyPhone: '+506 8777-6655',
          thirdPartyRelationship: 'Cónyuge',
          values: {
            ...createValidPhysicalApplicant().values,
            nationality: OTHER_NATIONALITY_VALUE,
            nationalityOther: 'Mexicana',
          },
          vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
        },
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it('validates a complete Legal Entity application with multiple selected banks', () => {
      const payload = createValidLegalMasterPayload();

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.regime).toBe(LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL);
        expect(result.data.selectedBanks).toEqual([
          SELECTED_BANK_CODES.BAC,
          SELECTED_BANK_CODES.SCOTIABANK,
        ]);
      }
    });

    it('validates a Legal Entity application with custom economic sector', () => {
      const base = createValidLegalMasterPayload();
      const payload: LegalMasterCreditApplicationPayload = {
        ...base,
        contact: {
          ...base.contact,
          commercialActivity: {
            ...base.contact.commercialActivity,
            economicSector: OTHER_ECONOMIC_SECTOR_VALUE,
            economicSectorOther: 'Energías Renovables',
          },
        },
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });
  });

  describe('Metadata & User Identification Validation', () => {
    it('rejects empty userId', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        userId: '',
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        const userIdIssue = result.error.issues.find((issue) =>
          issue.path.includes('userId'),
        );
        expect(userIdIssue?.message).toBe(
          MASTER_CREDIT_APPLICATION_ERRORS.USER_ID_REQUIRED,
        );
      }
    });

    it('rejects whitespace-only userId', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        userId: '   \t\n  ',
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes('userId')),
        ).toBe(true);
      }
    });

    it('rejects empty templateVersion and invalid application status', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        status: 'UnknownStatus',
        templateVersion: '   ',
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes('status')),
        ).toBe(true);
        expect(
          result.error.issues.some((issue) =>
            issue.path.includes('templateVersion'),
          ),
        ).toBe(true);
      }
    });
  });

  describe('Strict Regime Alignment Validation', () => {
    it('rejects when Step 1 is physical but Step 2 provides a legal contact payload', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        contact: createValidLegalContact(),
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'contact'),
        ).toBe(true);
      }
    });

    it('rejects when Step 1 is legal but Step 2 provides a physical contact payload', () => {
      const payload = {
        ...createValidLegalMasterPayload(),
        contact: createValidPhysicalContact(),
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'contact'),
        ).toBe(true);
      }
    });

    it('rejects when top-level regime is physical but applicant payload is legal', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        applicant: createValidLegalApplicant(),
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'applicant'),
        ).toBe(true);
      }
    });
  });

  describe('Bank Selection & Mandatory Authorizations Validation', () => {
    it('rejects when no banks are selected', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        bankAuthorizations: createValidBankAuthorizations({
          banco_bac: false,
        }),
        selectedBanks: [],
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) => issue.path[0] === 'bankAuthorizations',
          ),
        ).toBe(true);
        expect(
          result.error.issues.some(
            (issue) => issue.path[0] === 'selectedBanks',
          ),
        ).toBe(true);
      }
    });

    it('rejects when selectedBanks does not match bankAuthorizations boolean flags', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        bankAuthorizations: createValidBankAuthorizations({
          banco_bac: true,
          banco_bncr: true,
        }),
        selectedBanks: [SELECTED_BANK_CODES.BAC],
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        const mismatchIssue = result.error.issues.find((issue) =>
          issue.path.includes('selectedBanks'),
        );
        expect(mismatchIssue?.message).toBe(
          MASTER_CREDIT_APPLICATION_ERRORS.SELECTED_BANKS_MISMATCH,
        );
      }
    });

    it('rejects when selectedBanks contains duplicate bank codes', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        bankAuthorizations: createValidBankAuthorizations({
          banco_bac: true,
        }),
        selectedBanks: [SELECTED_BANK_CODES.BAC, SELECTED_BANK_CODES.BAC],
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        const mismatchIssue = result.error.issues.find((issue) =>
          issue.path.includes('selectedBanks'),
        );
        expect(mismatchIssue?.message).toBe(
          MASTER_CREDIT_APPLICATION_ERRORS.SELECTED_BANKS_MISMATCH,
        );
      }
    });

    it('rejects when autoriza_sugef_cic is false', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        bankAuthorizations: createValidBankAuthorizations({
          autoriza_sugef_cic: false,
        }),
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path[0] === 'bankAuthorizations' &&
              issue.path[1] === 'autoriza_sugef_cic',
          ),
        ).toBe(true);
      }
    });

    it('rejects when autoriza_buros_credito is false', () => {
      const payload = {
        ...createValidPhysicalMasterPayload(),
        bankAuthorizations: createValidBankAuthorizations({
          autoriza_buros_credito: false,
        }),
      };

      const result = MasterCreditApplicationSchema.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path[0] === 'bankAuthorizations' &&
              issue.path[1] === 'autoriza_buros_credito',
          ),
        ).toBe(true);
      }
    });
  });
});
