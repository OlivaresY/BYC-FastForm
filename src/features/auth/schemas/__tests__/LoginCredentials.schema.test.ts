import type { LoginCredentials } from '../../types/Auth.types';
import {
  LOGIN_CREDENTIALS_ERRORS,
  LoginCredentialsSchema,
} from '../LoginCredentials.schema';

describe('LoginCredentialsSchema Validation Suite', () => {
  describe('Valid Credentials', () => {
    it('passes validation for a standard email and non-empty password', () => {
      const credentials: LoginCredentials = {
        email: 'asesor@corimotors.cr',
        password: 'SecurePassword123!',
      };

      const result = LoginCredentialsSchema.safeParse(credentials);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(credentials);
      }
    });

    it('trims surrounding whitespace and lowercases valid email while preserving password case', () => {
      const credentials: LoginCredentials = {
        email: '  Ventas.CR@CoriMotors.COM  ',
        password: ' MySecretPass ',
      };

      const result = LoginCredentialsSchema.safeParse(credentials);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('ventas.cr@corimotors.com');
        expect(result.data.password).toBe(' MySecretPass ');
      }
    });
  });

  describe('Email Validation', () => {
    it('fails validation when email is empty or whitespace-only', () => {
      const emptyResult = LoginCredentialsSchema.safeParse({
        email: '',
        password: 'Password123',
      });
      const whitespaceResult = LoginCredentialsSchema.safeParse({
        email: '   ',
        password: 'Password123',
      });

      expect(emptyResult.success).toBe(false);
      if (!emptyResult.success) {
        expect(emptyResult.error.issues[0]?.message).toBe(
          LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED,
        );
      }

      expect(whitespaceResult.success).toBe(false);
      if (!whitespaceResult.success) {
        expect(whitespaceResult.error.issues[0]?.message).toBe(
          LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED,
        );
      }
    });

    it('fails validation for malformed email formats', () => {
      const invalidEmails = [
        'plainaddress',
        'missing-domain@',
        '@missing-user.com',
        'asesor@corimotors',
        'asesor name@corimotors.cr',
      ];

      invalidEmails.forEach((email) => {
        const result = LoginCredentialsSchema.safeParse({
          email,
          password: 'Password123',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const emailIssue = result.error.issues.find((issue) =>
            issue.path.includes('email'),
          );
          expect(emailIssue?.message).toBe(
            LOGIN_CREDENTIALS_ERRORS.EMAIL_INVALID,
          );
        }
      });
    });
  });

  describe('Password Validation', () => {
    it('fails validation when password is empty', () => {
      const result = LoginCredentialsSchema.safeParse({
        email: 'asesor@corimotors.cr',
        password: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordIssue = result.error.issues.find((issue) =>
          issue.path.includes('password'),
        );
        expect(passwordIssue?.message).toBe(
          LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED,
        );
      }
    });

    it('fails validation when password contains only whitespace', () => {
      const result = LoginCredentialsSchema.safeParse({
        email: 'asesor@corimotors.cr',
        password: '    ',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordIssue = result.error.issues.find((issue) =>
          issue.path.includes('password'),
        );
        expect(passwordIssue?.message).toBe(
          LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED,
        );
      }
    });
  });
});
