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
  constitutionDate: '15-05-2015',
  corporateId: '3-101-123456',
  corporateName: 'Distribuidora Automotriz del Este S.A.',
  email: 'contacto@distribuidoraeste.cr',
  grossIncome: 5000000,
  netIncome: 3500000,
  phone: '+506 2200-0000',
  representativeId: '1-1150-0222',
  representativeName: 'Juan Alberto Perez Rojas',
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

    it('accepts an unformatted 10-digit Costa Rican corporate ID', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        corporateId: '3101123456',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts net income equal to gross income', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        grossIncome: 2500000,
        netIncome: 2500000,
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts alternative valid phone formats', () => {
      // Arrange
      const dataWithLocalPhone = {
        ...createValidLegalEntity(),
        phone: '2222-3333',
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
      expect(getMessages(result, ['constitutionDate'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_REQUIRED,
      ]);
      expect(getMessages(result, ['corporateId'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_REQUIRED,
      ]);
      expect(getMessages(result, ['corporateName'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_NAME_REQUIRED,
      ]);
      expect(getMessages(result, ['email'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.EMAIL_REQUIRED,
      ]);
      expect(getMessages(result, ['phone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.PHONE_REQUIRED,
      ]);
      expect(getMessages(result, ['representativeId'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_ID_REQUIRED,
      ]);
      expect(getMessages(result, ['representativeName'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_NAME_REQUIRED,
      ]);
      expect(getMessages(result, ['grossIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_REQUIRED,
      ]);
      expect(getMessages(result, ['netIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_REQUIRED,
      ]);
    });

    it('returns exact Spanish required messages when incomes are undefined', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        grossIncome: undefined,
        netIncome: undefined,
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['grossIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_REQUIRED,
      ]);
      expect(getMessages(result, ['netIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_REQUIRED,
      ]);
    });

    it('rejects whitespace-only strings with required errors', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        corporateName: '   ',
        representativeId: '   ',
        representativeName: '   ',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['corporateName'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_NAME_REQUIRED,
      ]);
      expect(getMessages(result, ['representativeId'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_ID_REQUIRED,
      ]);
      expect(getMessages(result, ['representativeName'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.REPRESENTATIVE_NAME_REQUIRED,
      ]);
    });
  });

  describe('format validations', () => {
    it('returns CORPORATE_ID_INVALID when corporate ID does not start with 3', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        corporateId: '1-101-123456',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['corporateId'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_INVALID,
      ]);
    });

    it('returns CORPORATE_ID_INVALID when corporate ID has incorrect length or format', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        corporateId: '3-10-12345',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['corporateId'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CORPORATE_ID_INVALID,
      ]);
    });

    it('returns CONSTITUTION_DATE_INVALID when date is syntactically or calendar invalid', () => {
      // Arrange
      const invalidCalendarDate = {
        ...createValidLegalEntity(),
        constitutionDate: '32-01-2020',
      };
      const invalidLeapDate = {
        ...createValidLegalEntity(),
        constitutionDate: '29-02-2023',
      };

      // Act & Assert
      const resultCalendar =
        LegalEntityContactSchema.safeParse(invalidCalendarDate);
      expect(resultCalendar.success).toBe(false);
      expect(getMessages(resultCalendar, ['constitutionDate'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_INVALID,
      ]);

      const resultLeap = LegalEntityContactSchema.safeParse(invalidLeapDate);
      expect(resultLeap.success).toBe(false);
      expect(getMessages(resultLeap, ['constitutionDate'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_INVALID,
      ]);
    });

    it('returns CONSTITUTION_DATE_FUTURE when date is in the future', () => {
      // Arrange
      const futureData = {
        ...createValidLegalEntity(),
        constitutionDate: '01-01-2099',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(futureData);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['constitutionDate'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.CONSTITUTION_DATE_FUTURE,
      ]);
    });

    it('returns EMAIL_INVALID when email format is invalid', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        email: 'invalid-email-address',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['email'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.EMAIL_INVALID,
      ]);
    });

    it('returns PHONE_INVALID when phone format is invalid', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        phone: '123',
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['phone'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.PHONE_INVALID,
      ]);
    });
  });

  describe('income constraints and cross-field refinement', () => {
    it('returns GROSS_INCOME_POSITIVE when gross income is negative or zero', () => {
      // Arrange
      const zeroData = {
        ...createValidLegalEntity(),
        grossIncome: 0,
      };
      const negativeData = {
        ...createValidLegalEntity(),
        grossIncome: -1000,
      };

      // Act & Assert
      const zeroResult = LegalEntityContactSchema.safeParse(zeroData);
      expect(zeroResult.success).toBe(false);
      expect(getMessages(zeroResult, ['grossIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_POSITIVE,
      ]);

      const negativeResult = LegalEntityContactSchema.safeParse(negativeData);
      expect(negativeResult.success).toBe(false);
      expect(getMessages(negativeResult, ['grossIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.GROSS_INCOME_POSITIVE,
      ]);
    });

    it('returns NET_INCOME_POSITIVE when net income is negative or zero', () => {
      // Arrange
      const zeroData = {
        ...createValidLegalEntity(),
        netIncome: 0,
      };
      const negativeData = {
        ...createValidLegalEntity(),
        netIncome: -500,
      };

      // Act & Assert
      const zeroResult = LegalEntityContactSchema.safeParse(zeroData);
      expect(zeroResult.success).toBe(false);
      expect(getMessages(zeroResult, ['netIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_POSITIVE,
      ]);

      const negativeResult = LegalEntityContactSchema.safeParse(negativeData);
      expect(negativeResult.success).toBe(false);
      expect(getMessages(negativeResult, ['netIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_POSITIVE,
      ]);
    });

    it('triggers NET_INCOME_EXCEEDS_GROSS error on netIncome when netIncome > grossIncome', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        grossIncome: 3000000,
        netIncome: 3000001,
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['netIncome'])).toEqual([
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_EXCEEDS_GROSS,
      ]);
    });

    it('does not trigger NET_INCOME_EXCEEDS_GROSS if incomes are invalid types', () => {
      // Arrange
      const data = {
        ...createValidLegalEntity(),
        grossIncome: undefined,
        netIncome: 1000,
      };

      // Act
      const result = LegalEntityContactSchema.safeParse(data);

      // Assert
      expect(result.success).toBe(false);
      expect(getMessages(result, ['netIncome'])).not.toContain(
        LEGAL_ENTITY_CONTACT_ERRORS.NET_INCOME_EXCEEDS_GROSS,
      );
    });
  });
});
