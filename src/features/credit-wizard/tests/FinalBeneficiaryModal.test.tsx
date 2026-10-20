import { z } from 'zod';
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
} from '../constants/ApplicantStepView.constants';
import {
  normalizeThirdPartyBirthDate,
  StrictThirdPartyBeneficiarySchema,
  ThirdPartyBeneficiaryFieldsSchema,
} from '../types/ApplicantStepView.schema';
import { FinalBeneficiaryModalPageObject } from './FinalBeneficiaryModal.po';

describe('FinalBeneficiaryModal Component', () => {
  it('renders all structural elements and form inputs when isOpen is true', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Assert
    expect(page.modalContainer).toBeTruthy();
    expect(page.backdrop).toBeTruthy();
    expect(page.title).toBeTruthy();
    expect(page.subtitle).toBeTruthy();
    expect(page.closeButton).toBeTruthy();
    expect(page.section1Header).toBeTruthy();
    expect(page.section2Header).toBeTruthy();
    expect(page.section3Header).toBeTruthy();
    expect(page.section4Header).toBeTruthy();
    expect(page.identificationLabel).toBeTruthy();
    expect(page.docTypeInput).toBeTruthy();
    expect(page.docNumberInput).toBeTruthy();
    expect(page.fullNameInput).toBeTruthy();
    expect(page.phoneInput).toBeTruthy();
    expect(page.emailInput).toBeTruthy();
    expect(page.relationshipInput).toBeTruthy();
    expect(page.birthDateInput).toBeTruthy();
    expect(page.nationalityInput).toBeTruthy();
    expect(page.saveButton).toBeTruthy();
  });

  it('triggers onClose when close button is pressed', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Act
    page.pressClose();

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when backdrop is pressed', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Act
    page.pressBackdrop();

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Guardar Datos button is pressed and onSave is not provided', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Act
    page.pressSave();

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onSave when Guardar Datos button is pressed and onSave is provided', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleSave = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      onSave: handleSave,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Act
    page.pressSave();

    // Assert
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('triggers onFieldChange when user edits text inputs', () => {
    // Arrange
    const handleClose = jest.fn();
    const handleFieldChange = jest.fn();

    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: handleClose,
      onFieldChange: handleFieldChange,
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Act
    page
      .fillFullName('Juan Pérez')
      .fillDocNumber('1-2345-6789')
      .fillPhone('8888-8888')
      .fillEmail('juan@example.com')
      .fillBirthDate('1990-05-15');

    // Assert
    expect(handleFieldChange).toHaveBeenCalledWith(
      'thirdPartyFullName',
      'Juan Pérez',
    );
    expect(handleFieldChange).toHaveBeenCalledWith(
      'thirdPartyDocNumber',
      '1-2345-6789',
    );
    expect(handleFieldChange).toHaveBeenCalledWith(
      'thirdPartyPhone',
      '8888-8888',
    );
    expect(handleFieldChange).toHaveBeenCalledWith(
      'thirdPartyEmail',
      'juan@example.com',
    );
    expect(handleFieldChange).toHaveBeenCalledWith(
      'thirdPartyBirthDate',
      '1990-05-15',
    );
  });

  it('renders the provided per-field error messages', () => {
    // Arrange & Act
    const page = FinalBeneficiaryModalPageObject.render({
      errors: {
        thirdPartyDocType: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE,
        thirdPartyFullName: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
        thirdPartyNationality:
          APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY,
      },
      isOpen: true,
      onClose: jest.fn(),
      onFieldChange: jest.fn(),
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Assert
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE),
    ).toBeTruthy();
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME),
    ).toBeTruthy();
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY),
    ).toBeTruthy();
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_NUMBER),
    ).toBeNull();
  });

  it('renders no error messages when errors are not provided', () => {
    // Arrange & Act
    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: jest.fn(),
      onFieldChange: jest.fn(),
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Assert
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME),
    ).toBeNull();
  });

  it('renders phone and email error messages when provided', () => {
    // Arrange & Act
    const page = FinalBeneficiaryModalPageObject.render({
      errors: {
        thirdPartyEmail: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
        thirdPartyPhone: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
      },
      isOpen: true,
      onClose: jest.fn(),
      onFieldChange: jest.fn(),
      values: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
    });

    // Assert
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE),
    ).toBeTruthy();
    expect(
      page.queryErrorText(APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL),
    ).toBeTruthy();
  });

  it('shows a Date birth date as YYYY-MM-DD', () => {
    // Arrange & Act
    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: jest.fn(),
      onFieldChange: jest.fn(),
      values: {
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
        thirdPartyBirthDate: new Date('1990-05-15T00:00:00.000Z'),
      },
    });

    // Assert
    expect(page.birthDateValue).toBe('1990-05-15');
  });

  describe('Zod Validation for Phone and Email (ThirdPartyBeneficiaryFieldsSchema)', () => {
    it('validates correct email and phone formats', () => {
      const result = z.object(ThirdPartyBeneficiaryFieldsSchema).safeParse({
        thirdPartyEmail: 'valid.email@example.com',
        thirdPartyPhone: '8888-8888',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email formats', () => {
      const result = z.object(ThirdPartyBeneficiaryFieldsSchema).safeParse({
        thirdPartyEmail: 'invalid-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
        );
      }
    });

    it('rejects invalid phone formats', () => {
      const result = z.object(ThirdPartyBeneficiaryFieldsSchema).safeParse({
        thirdPartyPhone: 'short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
        );
      }
    });
  });

  describe('Zod Validation for Phone and Email (StrictThirdPartyBeneficiarySchema)', () => {
    const validThirdPartyData = {
      isThirdPartyRegistration: true as const,
      thirdPartyBirthDate: '1990-05-15',
      thirdPartyDocNumber: '2-0345-0678',
      thirdPartyDocType: 'national_id',
      thirdPartyEmail: 'valid.email@example.com',
      thirdPartyFullName: 'Elena Castro Morales',
      thirdPartyNationality: 'CR',
      thirdPartyPhone: '8888-8888',
      thirdPartyRelationship: 'spouse',
    };

    it('validates complete and correct strict third-party beneficiary data', () => {
      const result =
        StrictThirdPartyBeneficiarySchema.safeParse(validThirdPartyData);
      expect(result.success).toBe(true);
    });

    it('requires thirdPartyPhone in strict validation schema', () => {
      const { thirdPartyPhone, ...withoutPhone } = validThirdPartyData;
      const result = StrictThirdPartyBeneficiarySchema.safeParse(withoutPhone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path.includes('thirdPartyPhone') &&
              issue.message === APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
          ),
        ).toBe(true);
      }
    });

    it('requires thirdPartyEmail in strict validation schema', () => {
      const { thirdPartyEmail, ...withoutEmail } = validThirdPartyData;
      const result = StrictThirdPartyBeneficiarySchema.safeParse(withoutEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path.includes('thirdPartyEmail') &&
              issue.message === APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
          ),
        ).toBe(true);
      }
    });

    it('validates thirdPartyBirthDate in strict validation schema with valid formats', () => {
      const withSlashDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: '10 / 05 / 1990',
      };
      expect(
        StrictThirdPartyBeneficiarySchema.safeParse(withSlashDate).success,
      ).toBe(true);

      const withIsoDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: '1990-05-15',
      };
      expect(
        StrictThirdPartyBeneficiarySchema.safeParse(withIsoDate).success,
      ).toBe(true);
    });

    it('rejects invalid thirdPartyBirthDate in strict validation schema', () => {
      const withInvalidDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: 'not-a-date',
      };
      const result =
        StrictThirdPartyBeneficiarySchema.safeParse(withInvalidDate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path.includes('thirdPartyBirthDate') &&
              issue.message ===
                APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
          ),
        ).toBe(true);
      }
    });
  });

  describe('normalizeThirdPartyBirthDate (Timezone-Agnostic Normalization)', () => {
    it('normalizes standard ISO YYYY-MM-DD date string', () => {
      expect(normalizeThirdPartyBirthDate('1990-05-15')).toBe('1990-05-15');
    });

    it('normalizes localized DD/MM/YYYY date strings with or without spaces', () => {
      expect(normalizeThirdPartyBirthDate('10/05/1990')).toBe('1990-05-10');
      expect(normalizeThirdPartyBirthDate('10 / 05 / 1990')).toBe('1990-05-10');
      expect(normalizeThirdPartyBirthDate('15 / 08 / 1988')).toBe('1988-08-15');
    });

    it('normalizes localized dash date strings DD-MM-YYYY', () => {
      expect(normalizeThirdPartyBirthDate('10-05-1990')).toBe('1990-05-10');
      expect(normalizeThirdPartyBirthDate('10 - 05 - 1990')).toBe('1990-05-10');
    });

    it('normalizes ISO datetime string without timezone mutation', () => {
      expect(normalizeThirdPartyBirthDate('1990-05-15T00:00:00.000Z')).toBe(
        '1990-05-15',
      );
    });

    it('normalizes JavaScript Date instance without timezone shifting', () => {
      const date = new Date('1990-05-15T00:00:00.000Z');
      expect(normalizeThirdPartyBirthDate(date)).toBe('1990-05-15');
    });

    it('returns empty string for invalid Date instances', () => {
      expect(normalizeThirdPartyBirthDate(new Date('not-a-date'))).toBe('');
    });

    it('returns empty string for missing, empty, or whitespace-only values', () => {
      expect(normalizeThirdPartyBirthDate(undefined)).toBe('');
      expect(normalizeThirdPartyBirthDate(null)).toBe('');
      expect(normalizeThirdPartyBirthDate('')).toBe('');
      expect(normalizeThirdPartyBirthDate('   ')).toBe('');
    });

    it('returns empty string for non-date string gibberish', () => {
      expect(normalizeThirdPartyBirthDate('not-a-date')).toBe('');
      expect(normalizeThirdPartyBirthDate('invalid-string')).toBe('');
    });

    it('validates leap years accurately without timezone dependency', () => {
      // 2000 is a leap year (divisible by 400)
      expect(normalizeThirdPartyBirthDate('29/02/2000')).toBe('2000-02-29');
      // 2024 is a leap year (divisible by 4)
      expect(normalizeThirdPartyBirthDate('29/02/2024')).toBe('2024-02-29');
      // 1900 is NOT a leap year (divisible by 100 but not 400)
      expect(normalizeThirdPartyBirthDate('29/02/1900')).toBe('');
      // 2023 is NOT a leap year
      expect(normalizeThirdPartyBirthDate('29/02/2023')).toBe('');
    });

    it('rejects impossible calendar dates', () => {
      expect(normalizeThirdPartyBirthDate('31/02/1990')).toBe('');
      expect(normalizeThirdPartyBirthDate('31/04/1990')).toBe('');
      expect(normalizeThirdPartyBirthDate('32/01/1990')).toBe('');
      expect(normalizeThirdPartyBirthDate('15/13/1990')).toBe('');
    });
  });
});
