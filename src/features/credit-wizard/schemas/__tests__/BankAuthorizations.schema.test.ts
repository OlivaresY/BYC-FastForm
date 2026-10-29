import {
  BANK_AUTHORIZATIONS_ERROR_MESSAGES,
  bankAuthorizationsSchema,
} from '../BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

const createValidBankAuthorizations = (): BankAuthorizationsFormValues => ({
  acepta_terminos: true,
  autoriza_buro: true,
  autoriza_sugef: true,
  banco_destino: 'BAC Credomatic',
});

describe('bankAuthorizationsSchema Validation Suite', () => {
  describe('Valid Payloads', () => {
    it('passes validation when all consents are true and a valid bank is provided', () => {
      // Arrange
      const payload = createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          acepta_terminos: true,
          autoriza_buro: true,
          autoriza_sugef: true,
          banco_destino: 'BAC Credomatic',
        });
      }
    });

    it('passes validation and trims leading and trailing whitespace from banco_destino', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        banco_destino: '   Banco Davivienda   ',
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.banco_destino).toBe('Banco Davivienda');
      }
    });
  });

  describe('banco_destino Validations', () => {
    it('fails validation when banco_destino is an empty string', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        banco_destino: '',
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'banco_destino',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
        );
      }
    });

    it('fails validation when banco_destino contains only whitespace', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        banco_destino: '     ',
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'banco_destino',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
        );
      }
    });

    it('fails validation when banco_destino is missing or undefined', () => {
      // Arrange
      const { banco_destino: _, ...payload } = createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'banco_destino',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
        );
      }
    });
  });

  describe('autoriza_buro Validations', () => {
    it('fails validation when autoriza_buro is false', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        autoriza_buro: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_buro',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BURO_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_buro is missing or undefined', () => {
      // Arrange
      const { autoriza_buro: _, ...payload } = createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_buro',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BURO_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_buro is not a strict boolean', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        autoriza_buro: 'true',
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_buro',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_BURO_REQUIRED,
        );
      }
    });
  });

  describe('autoriza_sugef Validations', () => {
    it('fails validation when autoriza_sugef is false', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        autoriza_sugef: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_sugef',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_sugef is missing or undefined', () => {
      // Arrange
      const { autoriza_sugef: _, ...payload } = createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_sugef',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
        );
      }
    });

    it('fails validation when autoriza_sugef is not a strict boolean', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        autoriza_sugef: 1,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'autoriza_sugef',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
        );
      }
    });
  });

  describe('acepta_terminos Validations', () => {
    it('fails validation when acepta_terminos is false', () => {
      // Arrange
      const payload: BankAuthorizationsFormValues = {
        ...createValidBankAuthorizations(),
        acepta_terminos: false,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'acepta_terminos',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.ACEPTA_TERMINOS_REQUIRED,
        );
      }
    });

    it('fails validation when acepta_terminos is missing or undefined', () => {
      // Arrange
      const { acepta_terminos: _, ...payload } =
        createValidBankAuthorizations();

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'acepta_terminos',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.ACEPTA_TERMINOS_REQUIRED,
        );
      }
    });

    it('fails validation when acepta_terminos is not a strict boolean', () => {
      // Arrange
      const payload = {
        ...createValidBankAuthorizations(),
        acepta_terminos: null,
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(payload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (err) => err.path.join('.') === 'acepta_terminos',
        );
        expect(issue).toBeDefined();
        expect(issue?.message).toBe(
          BANK_AUTHORIZATIONS_ERROR_MESSAGES.ACEPTA_TERMINOS_REQUIRED,
        );
      }
    });
  });

  describe('Multiple Validation Failures', () => {
    it('accumulates errors for all fields when all consents are false and banco_destino is empty', () => {
      // Arrange
      const invalidPayload = {
        acepta_terminos: false,
        autoriza_buro: false,
        autoriza_sugef: false,
        banco_destino: '',
      };

      // Act
      const result = bankAuthorizationsSchema.safeParse(invalidPayload);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(4);

        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('banco_destino');
        expect(paths).toContain('autoriza_buro');
        expect(paths).toContain('autoriza_sugef');
        expect(paths).toContain('acepta_terminos');
      }
    });
  });
});
