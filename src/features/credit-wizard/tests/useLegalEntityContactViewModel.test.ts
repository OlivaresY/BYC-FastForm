import { LEGAL_ENTITY_CONTACT_ERRORS } from '../constants/LegalEntityContact.constants';
import { LegalEntityContactViewModelPageObject } from './useLegalEntityContactViewModel.po';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';

const validData: LegalEntityContact = {
  constitutionDate: '15-05-2015',
  corporateId: '3-101-123456',
  corporateName: 'Distribuidora del Este S.A.',
  email: 'contacto@distribuidora.cr',
  grossIncome: 5000000,
  netIncome: 3500000,
  phone: '+506 2200-0000',
  representativeId: '1-1150-0222',
  representativeName: 'Juan Alberto Perez Rojas',
};

describe('useLegalEntityContactViewModel', () => {
  it('initializes with default values and isValid false', async () => {
    // Arrange & Act
    const page = LegalEntityContactViewModelPageObject.render();

    // Assert
    expect(page.isValid).toBe(false);
    expect(page.current.control).toBeDefined();
    expect(page.current.handleSubmit).toBeDefined();
    expect(page.current.handleNextStep).toBeDefined();

    await page.waitForValid(false);
  });

  it('initializes with custom defaultValues and sets isValid accordingly', async () => {
    // Arrange & Act
    const page = LegalEntityContactViewModelPageObject.render({
      defaultValues: validData,
    });

    // Assert
    await page.waitForValid(true);
    expect(page.isValid).toBe(true);
  });

  it('sets submitError when onSubmitProp fails asynchronously', async () => {
    // Arrange
    const expectedError = new Error('Async network rejection');
    const onSubmitMock = jest.fn().mockRejectedValue(expectedError);
    const page = LegalEntityContactViewModelPageObject.render({
      defaultValues: validData,
      onSubmit: onSubmitMock,
    });

    // Act
    await page.handleNextStep(validData);

    // Assert
    expect(onSubmitMock).toHaveBeenCalledWith(validData);
    expect(page.current.submitError).toBe(
      LEGAL_ENTITY_CONTACT_ERRORS.SUBMIT_FAILED,
    );
    expect(page.current.isSubmitting).toBe(false);
  });

  it('sets submitError when programmatic submission fails validation', async () => {
    // Arrange
    const onSubmitMock = jest.fn();
    const page = LegalEntityContactViewModelPageObject.render({
      onSubmit: onSubmitMock,
    });

    const invalidData = {
      corporateId: 'invalid-id',
      corporateName: '',
    };

    // Act
    await page.handleNextStep(invalidData);

    // Assert
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(page.current.submitError).toBe(
      LEGAL_ENTITY_CONTACT_ERRORS.SUBMIT_FAILED,
    );
    expect(page.current.isSubmitting).toBe(false);
  });

  it('executes onSubmit when programmatic submission passes validation', async () => {
    // Arrange
    const onSubmitMock = jest.fn().mockResolvedValue(undefined);
    const page = LegalEntityContactViewModelPageObject.render({
      onSubmit: onSubmitMock,
    });

    // Act
    await page.handleNextStep(validData);

    // Assert
    expect(onSubmitMock).toHaveBeenCalledWith(validData);
  });
});
