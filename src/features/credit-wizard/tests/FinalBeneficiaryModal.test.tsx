import { z } from 'zod';
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
} from '../constants/ApplicantStepView.constants';
import {
  isValidDateDDMMYYYY,
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
      .fillBirthDate('15-05-1990');

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
      '15-05-1990',
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

  it('shows string birth date value in DD-MM-YYYY format', () => {
    // Arrange & Act
    const page = FinalBeneficiaryModalPageObject.render({
      isOpen: true,
      onClose: jest.fn(),
      onFieldChange: jest.fn(),
      values: {
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
        thirdPartyBirthDate: '15-05-1990',
      },
    });

    // Assert
    expect(page.birthDateValue).toBe('15-05-1990');
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
      thirdPartyBirthDate: '15-05-1990',
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

    it('accepts strictly formatted DD-MM-YYYY date in thirdPartyBirthDate', () => {
      const withValidDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: '10-05-1990',
      };
      expect(
        StrictThirdPartyBeneficiarySchema.safeParse(withValidDate).success,
      ).toBe(true);
    });

    it('rejects slash formats and ISO formats in thirdPartyBirthDate', () => {
      const withSlashDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: '10/05/1990',
      };
      expect(
        StrictThirdPartyBeneficiarySchema.safeParse(withSlashDate).success,
      ).toBe(false);

      const withIsoDate = {
        ...validThirdPartyData,
        thirdPartyBirthDate: '1990-05-15',
      };
      expect(
        StrictThirdPartyBeneficiarySchema.safeParse(withIsoDate).success,
      ).toBe(false);
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

  describe('isValidDateDDMMYYYY (Strict DD-MM-YYYY Date Validation)', () => {
    it('accepts valid DD-MM-YYYY date strings', () => {
      expect(isValidDateDDMMYYYY('15-05-1990')).toBe(true);
      expect(isValidDateDDMMYYYY('10-05-1990')).toBe(true);
      expect(isValidDateDDMMYYYY('01-01-2000')).toBe(true);
    });

    it('rejects slash and ISO formats', () => {
      expect(isValidDateDDMMYYYY('10/05/1990')).toBe(false);
      expect(isValidDateDDMMYYYY('10 / 05 / 1990')).toBe(false);
      expect(isValidDateDDMMYYYY('1990-05-15')).toBe(false);
    });

    it('rejects non-string and empty values', () => {
      expect(isValidDateDDMMYYYY(undefined)).toBe(false);
      expect(isValidDateDDMMYYYY(null)).toBe(false);
      expect(isValidDateDDMMYYYY('')).toBe(false);
      expect(isValidDateDDMMYYYY('   ')).toBe(false);
      expect(isValidDateDDMMYYYY('not-a-date')).toBe(false);
    });

    it('validates leap years accurately in DD-MM-YYYY format', () => {
      // 2000 is a leap year (divisible by 400)
      expect(isValidDateDDMMYYYY('29-02-2000')).toBe(true);
      // 2024 is a leap year (divisible by 4)
      expect(isValidDateDDMMYYYY('29-02-2024')).toBe(true);
      // 1900 is NOT a leap year (divisible by 100 but not 400)
      expect(isValidDateDDMMYYYY('29-02-1900')).toBe(false);
      // 2023 is NOT a leap year
      expect(isValidDateDDMMYYYY('29-02-2023')).toBe(false);
    });

    it('rejects impossible calendar dates', () => {
      expect(isValidDateDDMMYYYY('31-02-1990')).toBe(false);
      expect(isValidDateDDMMYYYY('31-04-1990')).toBe(false);
      expect(isValidDateDDMMYYYY('32-01-1990')).toBe(false);
      expect(isValidDateDDMMYYYY('15-13-1990')).toBe(false);
    });
  });
});
