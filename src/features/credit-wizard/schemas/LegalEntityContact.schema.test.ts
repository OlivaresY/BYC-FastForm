import {
  LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
  LEGAL_ENTITY_CONTACT_ERRORS,
} from '../constants/LegalEntityContact.constants';
import { LegalEntityContactSchema } from './LegalEntityContact.schema';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';

const getMessages = (
  result: ReturnType<typeof LegalEntityContactSchema.safeParse>,
  path: (number | string)[],
): string[] => {
  if (result.success) {
    return [];
  }
  return result.error.issues
    .filter((issue) => issue.path.join('.') === path.join('.'))
    .map((issue) => issue.message);
};

const createValidLegalEntity = (): LegalEntityContact => ({
  commercialActivity: {
    accountingPhone: '+506 2200-1111',
    constitutionDate: '15-05-2015',
    economicSector: 'Automotriz y Repuestos',
    employeesCount: 25,
    mainActivity: 'Venta de repuestos y mantenimiento vehicular',
  },
  commercialAddress: {
    canton: 'San José',
    district: 'Uruca',
    exactAddress: '200 metros norte del puente Juan Pablo II',
    province: 'San José',
  },
  commercialReference: {
    companyReference: 'CoriMotors S.A.',
    ibanAccount: 'CR05015202001026284066',
    referencePhone: '+506 2200-2222',
  },
  contactInfo: {
    cellPhone: '+506 8888-9999',
    email: 'contacto@distribuidoraeste.cr',
    officePhone: '+506 2200-0000',
  },
  financialStatements: {
    currency: 'CRC',
    grossSales: 50000000,
    netProfit: 15000000,
    otherIncomes: 2000000,
  },
});

describe('LegalEntityContactSchema', () => {
  describe('valid payloads', () => {
    it('accepts a fully valid legal entity contact object', () => {
      // Arrange
      const validData = createValidLegalEntity();

      // Act
      const result = LegalEntityContactSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts USD as currency', () => {
      // Arrange
      const validData: LegalEntityContact = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          currency: 'USD',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts net profit equal to gross sales', () => {
      // Arrange
      const data: LegalEntityContact = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          grossSales: 25000000,
          netProfit: 25000000,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts nullish or omitted otherIncomes', () => {
      // Arrange
      const dataWithoutOtherIncomes = {
        ...createValidLegalEntity(),
        financialStatements: {
          currency: 'CRC' as const,
          grossSales: 30000000,
          netProfit: 10000000,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(
        dataWithoutOtherIncomes,
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts alternative valid local phone formats', () => {
      // Arrange
      const dataWithLocalPhone: LegalEntityContact = {
        ...createValidLegalEntity(),
        contactInfo: {
          ...createValidLegalEntity().contactInfo,
          cellPhone: '8888-9999',
          officePhone: '2222-3333',
        },
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          accountingPhone: '2200-4444',
        },
        commercialReference: {
          ...createValidLegalEntity().commercialReference,
          referencePhone: '2200-5555',
        },
      };

      // Act & Assert
      expect(
        LegalEntityContactSchema.safeParse(dataWithLocalPhone).success,
      ).toBe(true);
    });
  });

  describe('required fields and default values', () => {
    it('returns exact Spanish required messages when default values are parsed', () => {
      // Act
      const result = LegalEntityContactSchema.safeParse(
        LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
      );

      // Assert
      expect(result.success).toBe(false);

      // commercialActivity
      expect(
        getMessages(result, ['commercialActivity', 'accountingPhone']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ACCOUNTING_PHONE_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialActivity', 'constitutionDate']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialActivity', 'economicSector']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ECONOMIC_SECTOR_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialActivity', 'employeesCount']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .EMPLOYEES_COUNT_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialActivity', 'mainActivity']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY.MAIN_ACTIVITY_REQUIRED,
      ]);

      // commercialAddress
      expect(getMessages(result, ['commercialAddress', 'canton'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.CANTON_REQUIRED,
      ]);
      expect(getMessages(result, ['commercialAddress', 'district'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.DISTRICT_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialAddress', 'exactAddress']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.EXACT_ADDRESS_REQUIRED,
      ]);
      expect(getMessages(result, ['commercialAddress', 'province'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.PROVINCE_REQUIRED,
      ]);

      // commercialReference
      expect(
        getMessages(result, ['commercialReference', 'companyReference']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .COMPANY_REFERENCE_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialReference', 'ibanAccount']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE.IBAN_ACCOUNT_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialReference', 'referencePhone']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .REFERENCE_PHONE_REQUIRED,
      ]);

      // contactInfo
      expect(getMessages(result, ['contactInfo', 'cellPhone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
      ]);
      expect(getMessages(result, ['contactInfo', 'email'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
      ]);
      expect(getMessages(result, ['contactInfo', 'officePhone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.OFFICE_PHONE_REQUIRED,
      ]);

      // financialStatements
      expect(
        getMessages(result, ['financialStatements', 'grossSales']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.GROSS_SALES_REQUIRED,
      ]);
      expect(getMessages(result, ['financialStatements', 'netProfit'])).toEqual(
        [LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.NET_PROFIT_REQUIRED],
      );
    });

    it('rejects whitespace-only strings with required errors', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          economicSector: '   ',
          mainActivity: '   ',
        },
        commercialAddress: {
          ...createValidLegalEntity().commercialAddress,
          exactAddress: '   ',
        },
        commercialReference: {
          ...createValidLegalEntity().commercialReference,
          companyReference: '   ',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialActivity', 'economicSector']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ECONOMIC_SECTOR_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialActivity', 'mainActivity']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY.MAIN_ACTIVITY_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialAddress', 'exactAddress']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ADDRESS.EXACT_ADDRESS_REQUIRED,
      ]);
      expect(
        getMessages(result, ['commercialReference', 'companyReference']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .COMPANY_REFERENCE_REQUIRED,
      ]);
    });
  });

  describe('format validations', () => {
    it('returns CONSTITUTION_DATE_INVALID when date is syntactically or calendar invalid', () => {
      // Arrange
      const invalidCalendarDate = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          constitutionDate: '32-01-2020',
        },
      };
      const invalidLeapDate = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          constitutionDate: '29-02-2023',
        },
      };

      // Act & Assert
      const resultCalendar =
        LegalEntityContactSchema.safeParse(invalidCalendarDate);
      expect(resultCalendar.success).toBe(false);
      expect(
        getMessages(resultCalendar, [
          'commercialActivity',
          'constitutionDate',
        ]),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_INVALID,
      ]);

      const resultLeap = LegalEntityContactSchema.safeParse(invalidLeapDate);
      expect(resultLeap.success).toBe(false);
      expect(
        getMessages(resultLeap, ['commercialActivity', 'constitutionDate']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_INVALID,
      ]);
    });

    it('returns CONSTITUTION_DATE_FUTURE when date is in the future', () => {
      // Arrange
      const futureData = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          constitutionDate: '01-01-2099',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(futureData);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialActivity', 'constitutionDate']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .CONSTITUTION_DATE_FUTURE,
      ]);
    });

    it('returns EMAIL_INVALID when email format is invalid', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        contactInfo: {
          ...createValidLegalEntity().contactInfo,
          email: 'invalid-email-address',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['contactInfo', 'email'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.EMAIL_INVALID,
      ]);
    });

    it('returns phone invalid errors for malformed phones in all sections', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          accountingPhone: '123',
        },
        commercialReference: {
          ...createValidLegalEntity().commercialReference,
          referencePhone: '456',
        },
        contactInfo: {
          ...createValidLegalEntity().contactInfo,
          cellPhone: '789',
          officePhone: '000',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialActivity', 'accountingPhone']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .ACCOUNTING_PHONE_INVALID,
      ]);
      expect(
        getMessages(result, ['commercialReference', 'referencePhone']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE
          .REFERENCE_PHONE_INVALID,
      ]);
      expect(getMessages(result, ['contactInfo', 'cellPhone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_INVALID,
      ]);
      expect(getMessages(result, ['contactInfo', 'officePhone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONTACT_INFO.OFFICE_PHONE_INVALID,
      ]);
    });

    it('returns IBAN_ACCOUNT_INVALID when IBAN is malformed or invalid country', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        commercialReference: {
          ...createValidLegalEntity().commercialReference,
          ibanAccount: 'ES05015202001026284066',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialReference', 'ibanAccount']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE.IBAN_ACCOUNT_INVALID,
      ]);
    });

    it('returns COMPANY_REFERENCE_MIN when company reference is shorter than 2 chars', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        commercialReference: {
          ...createValidLegalEntity().commercialReference,
          companyReference: 'A',
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialReference', 'companyReference']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_REFERENCE.COMPANY_REFERENCE_MIN,
      ]);
    });
  });

  describe('financial statements & cross-field refinement', () => {
    it('returns GROSS_SALES_POSITIVE when gross sales is negative or zero', () => {
      // Arrange
      const zeroData = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          grossSales: 0,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(zeroData);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['financialStatements', 'grossSales']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.GROSS_SALES_POSITIVE,
      ]);
    });

    it('returns NET_PROFIT_POSITIVE when net profit is negative or zero', () => {
      // Arrange
      const zeroData = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          netProfit: 0,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(zeroData);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['financialStatements', 'netProfit']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.NET_PROFIT_POSITIVE,
      ]);
    });

    it('returns OTHER_INCOMES_MIN when other incomes is negative', () => {
      // Arrange
      const negativeData = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          otherIncomes: -500,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(negativeData);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['financialStatements', 'otherIncomes']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS.OTHER_INCOMES_MIN,
      ]);
    });

    it('returns EMPLOYEES_COUNT_POSITIVE when employee count is zero or negative', () => {
      // Arrange
      const zeroData = {
        ...createValidLegalEntity(),
        commercialActivity: {
          ...createValidLegalEntity().commercialActivity,
          employeesCount: 0,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(zeroData);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['commercialActivity', 'employeesCount']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.COMMERCIAL_ACTIVITY
          .EMPLOYEES_COUNT_POSITIVE,
      ]);
    });

    it('triggers NET_PROFIT_EXCEEDS_GROSS error when netProfit > grossSales', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        financialStatements: {
          ...createValidLegalEntity().financialStatements,
          grossSales: 30000000,
          netProfit: 30000001,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['financialStatements', 'netProfit']),
      ).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS
          .NET_PROFIT_EXCEEDS_GROSS,
      ]);
    });

    it('does not trigger NET_PROFIT_EXCEEDS_GROSS if incomes are invalid types', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        financialStatements: {
          currency: 'CRC' as const,
          grossSales: undefined as unknown as number,
          netProfit: 1000,
        },
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(
        getMessages(result, ['financialStatements', 'netProfit']),
      ).not.toContain(
        LEGAL_ENTITY_CONTACT_ERRORS.FINANCIAL_STATEMENTS
          .NET_PROFIT_EXCEEDS_GROSS,
      );
    });
  });
});
