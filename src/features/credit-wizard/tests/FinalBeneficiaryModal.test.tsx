import { z } from 'zod';
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
} from '../constants/ApplicantStepView.constants';
import { ThirdPartyBeneficiaryFieldsSchema } from '../types/ApplicantStepView.schema';
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

  it('triggers onClose when Guardar Datos button is pressed', () => {
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
});
