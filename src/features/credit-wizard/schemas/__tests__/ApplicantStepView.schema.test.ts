import {
  NATIONALITY_OTHER_VALUE,
  PHYSICAL_IDENTIFICATION_TYPES,
} from '../../constants';
import { WIZARD_COPY } from '../../constants/WizardCopy.constants';
import {
  ApplicantStepSubmissionSchema,
  PhysicalApplicantSchema,
} from '../ApplicantStepView.schema';

const createValidPhysicalInput = () => ({
  birthDate: '15-08-1988',
  firstLastName: 'Rodríguez',
  firstName: 'Carlos',
  gender: 'male' as const,
  identificationNumber: '1-1234-0567',
  identificationType: PHYSICAL_IDENTIFICATION_TYPES.NATIONAL_ID,
  maritalStatus: 'single' as const,
  middleName: 'Alberto',
  nationality: 'CR',
  nationalityOther: '',
  secondLastName: 'Castro',
});

describe('ApplicantStepView.schema — Strict Contracts & Ghost Data Eradication', () => {
  describe('secondLastName strict string coercion', () => {
    it('coerces omitted secondLastName to an empty string for DIMEX applicants', () => {
      const { secondLastName: _, ...withoutSecondLastName } =
        createValidPhysicalInput();
      const parsed = PhysicalApplicantSchema.parse({
        ...withoutSecondLastName,
        identificationNumber: '155800001234',
        identificationType: PHYSICAL_IDENTIFICATION_TYPES.DIMEX,
      });

      expect(parsed.secondLastName).toBe('');
      expect(typeof parsed.secondLastName).toBe('string');
    });

    it('coerces undefined and whitespace secondLastName to an empty string for Passport applicants', () => {
      const parsedUndefined = PhysicalApplicantSchema.parse({
        ...createValidPhysicalInput(),
        identificationNumber: 'AB123456789',
        identificationType: PHYSICAL_IDENTIFICATION_TYPES.PASSPORT,
        secondLastName: undefined,
      });
      const parsedWhitespace = PhysicalApplicantSchema.parse({
        ...createValidPhysicalInput(),
        identificationNumber: 'AB123456789',
        identificationType: PHYSICAL_IDENTIFICATION_TYPES.PASSPORT,
        secondLastName: '   ',
      });

      expect(parsedUndefined.secondLastName).toBe('');
      expect(parsedWhitespace.secondLastName).toBe('');
    });

    it('rejects omitted or empty secondLastName for Costa Rican national_id applicants', () => {
      const result = PhysicalApplicantSchema.safeParse({
        ...createValidPhysicalInput(),
        identificationType: PHYSICAL_IDENTIFICATION_TYPES.NATIONAL_ID,
        secondLastName: undefined,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('secondLastName'),
        );
        expect(issue?.message).toBe(
          WIZARD_COPY.STEP_1_APPLICANT.ERRORS.PHYSICAL.SECOND_LAST_NAME,
        );
      }
    });
  });

  describe('nationalityOther ghost data eradication', () => {
    it('wipes residual nationalityOther ghost data when nationality is not other', () => {
      const parsed = PhysicalApplicantSchema.parse({
        ...createValidPhysicalInput(),
        nationality: 'CR',
        nationalityOther: 'GhostNationality',
      });

      expect(parsed.nationality).toBe('CR');
      expect(parsed.nationalityOther).toBe('');
    });

    it('wipes residual nationalityOther ghost data through ApplicantStepSubmissionSchema', () => {
      const parsed = ApplicantStepSubmissionSchema.parse({
        regime: 'physical',
        values: {
          ...createValidPhysicalInput(),
          identificationNumber: 'AB123456789',
          identificationType: PHYSICAL_IDENTIFICATION_TYPES.PASSPORT,
          nationality: 'US',
          nationalityOther: 'GhostNationality',
          secondLastName: undefined,
        },
        vehicleBeneficiary: 'same_holder',
      });

      expect(parsed.regime).toBe('physical');
      if (parsed.regime === 'physical') {
        expect(parsed.values.nationalityOther).toBe('');
        expect(parsed.values.secondLastName).toBe('');
      }
    });

    it('preserves trimmed nationalityOther when nationality is other', () => {
      const parsed = PhysicalApplicantSchema.parse({
        ...createValidPhysicalInput(),
        nationality: NATIONALITY_OTHER_VALUE,
        nationalityOther: '  Mexicana  ',
      });

      expect(parsed.nationality).toBe(NATIONALITY_OTHER_VALUE);
      expect(parsed.nationalityOther).toBe('Mexicana');
    });

    it('rejects empty nationalityOther when nationality is other', () => {
      const result = PhysicalApplicantSchema.safeParse({
        ...createValidPhysicalInput(),
        nationality: NATIONALITY_OTHER_VALUE,
        nationalityOther: '   ',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((err) =>
          err.path.includes('nationalityOther'),
        );
        expect(issue?.message).toBe(
          WIZARD_COPY.STEP_1_APPLICANT.ERRORS.PHYSICAL.NATIONALITY_OTHER,
        );
      }
    });
  });
});
