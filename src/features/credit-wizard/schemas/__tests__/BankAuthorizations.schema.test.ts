import {
  BANK_AUTHORIZATIONS_ERROR_MESSAGES,
  bankAuthorizationsSchema,
} from '../BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

const createValidBankAuthorizations = (): BankAuthorizationsFormValues => ({
  autoriza_buros_credito: true,
  autoriza_sugef_cic: true,
  banco_bac: true,
  banco_bncr: false,
  banco_carro_facil: false,
  banco_promerica: false,
  banco_scotiabank: false,
});

describe('bankAuthorizationsSchema Validation Suite', () => {
  describe('Valid Payloads', () => {
    it('passes validation when at least one bank is selected and all required fields are valid', () => {
      // Arrange
      const payload = createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    it('passes validation when multiple banks are selected', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        banco_bac: true,
        banco_bncr: true,
        banco_carro_facil: true,
        banco_promerica: true,
        banco_scotiabank: true,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(true);
    });

    it('passes validation for each individual bank selected in isolation', () => {
      const bankKeys: (
        | 'banco_bac'
        | 'banco_bncr'
        | 'banco_carro_facil'
        | 'banco_promerica'
        | 'banco_scotiabank'
      )[] = [
        'banco_bac',
        'banco_bncr',
        'banco_carro_facil',
        'banco_promerica',
        'banco_scotiabank',
      ];

      bankKeys.forEach((key) => {
        const payload: BankAuthorizationsFormValues = {
          ...createValidBankAuthorizations(),
          banco_bac: false,
          banco_bncr: false,
          banco_carro_facil: false,
          banco_promerica: false,
          banco_scotiabank: false,
          [key]: true,
        };

        const result = bankAuthorizationsSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Bank Multi-Select Validations', () => {
    it('fails validation when no bank is selected (all banks false)', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        banco_bac: false,
        banco_bncr: false,
        banco_carro_facil: false,
        banco_promerica: false,
        banco_scotiabank: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) =>
            err.message ===
            BANK_AUTHORIZATIONS_ERROR_MESSAGES.AT_LEAST_ONE_BANK_REQUIRED,
        );
        expect(issue).toBeDefined();
        expect(issue?.path).toContain('banco_bac');
      }
    });
  });

  describe('autoriza_sugef_cic Validations', () => {
    it('fails validation when autoriza_sugef_cic is false', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        autoriza_sugef_cic: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('autoriza_sugef_cic'),
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_CIC_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_sugef_cic is missing or undefined', () => {
      // Arrange
      const { autoriza_sugef_cic: _, ...payload } =
        createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('autoriza_sugef_cic'),
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_CIC_REQUIRED,
        );
      }
    });
  });

  describe('autoriza_buros_credito Validations', () => {
    it('fails validation when autoriza_buros_credito is false', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        autoriza_buros_credito: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('autoriza_buros_credito'),
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BUROS_CREDITO_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_buros_credito is missing or undefined', () => {
      // Arrange
      const { autoriza_buros_credito: _, ...payload } =
        createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('autoriza_buros_credito'),
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BUROS_CREDITO_REQUIRED,
        );
      }
    });
  });
});
