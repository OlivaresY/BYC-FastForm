import {
  EMPLOYMENT_STATUSES,
  FINANCIAL_CURRENCIES,
  PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
} from '../constants/PhysicalPersonContact.constants';
import { PhysicalPersonContactViewModelPageObject } from './usePhysicalPersonContactViewModel.po';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';

const validData: PhysicalPersonContact = {
  commercialReference: {
    companyReference: 'CoriMotors S.A.',
    ibanAccount: 'CR05015202001026284066',
    referencePhone: '+506 2200-0000',
  },
  contactInfo: {
    cellPhone: '+506 8888-8888',
    email: 'juan.perez@corimotors.com',
    homePhone: '+506 2222-1111',
  },
  employmentData: {
    employer: 'CoriMotors S.A.',
    employmentStatus: EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
    entryDate: '01-01-2020',
    officePhone: '+506 2200-0000',
    profession: 'Asesor Comercial',
  },
  financialCapacity: {
    currency: FINANCIAL_CURRENCIES.CRC,
    grossIncome: 1500000,
    netIncome: 1200000,
    otherIncomes: 0,
  },
  residentialAddress: {
    canton: 'Central',
    district: 'Carmen',
    exactAddress: 'Costado norte del Parque Central',
    province: 'San José',
  },
};

describe('usePhysicalPersonContactViewModel', () => {
  it('initializes with default values and isValid false', async () => {
    // Arrange & Act
    const page = PhysicalPersonContactViewModelPageObject.render();

    // Assert
    expect(page.isValid).toBe(false);
    expect(page.current.control).toBeDefined();
    expect(page.current.handleSubmit).toBeDefined();
    expect(page.current.handleNextStep).toBeDefined();
    expect(page.current.control._defaultValues.commercialReference).toEqual(
      PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.commercialReference,
    );

    await page.waitForValid(false);
  });

  it('initializes with custom defaultValues and sets isValid accordingly', async () => {
    // Arrange & Act
    const page = PhysicalPersonContactViewModelPageObject.render({
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
    const page = PhysicalPersonContactViewModelPageObject.render({
      defaultValues: validData,
      onSubmit: onSubmitMock,
    });

    // Act
    await page.handleNextStep(validData);

    // Assert
    expect(onSubmitMock).toHaveBeenCalledWith(validData);
    expect(page.current.submitError).toBe(
      PHYSICAL_PERSON_CONTACT_ERRORS.SUBMIT_FAILED,
    );
    expect(page.current.isSubmitting).toBe(false);
  });

  it('sets submitError when programmatic submission fails validation', async () => {
    // Arrange
    const onSubmitMock = jest.fn();
    const page = PhysicalPersonContactViewModelPageObject.render({
      onSubmit: onSubmitMock,
    });

    const invalidData = {
      commercialReference: {
        companyReference: 'A',
      },
      contactInfo: {
        cellPhone: 'invalid-phone',
      },
    };

    // Act
    await page.handleNextStep(invalidData);

    // Assert
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(page.current.submitError).toBe(
      PHYSICAL_PERSON_CONTACT_ERRORS.SUBMIT_FAILED,
    );
    expect(page.current.isSubmitting).toBe(false);
  });

  it('executes onSubmit when programmatic submission passes validation with 5 sections', async () => {
    // Arrange
    const onSubmitMock = jest.fn().mockResolvedValue(undefined);
    const page = PhysicalPersonContactViewModelPageObject.render({
      onSubmit: onSubmitMock,
    });

    // Act
    await page.handleNextStep(validData);

    // Assert
    expect(onSubmitMock).toHaveBeenCalledWith(validData);
  });

  it('normalizes legacy flat draft with san_jose canton and missing commercialReference', async () => {
    // Arrange & Act
    const legacyDraft = {
      canton: 'san_jose',
      cellPhone: '+506 8888-8888',
      district: 'Carmen',
      email: 'legacy@byc.com',
      exactAddress: 'Calle 1',
      province: 'San José',
    };

    const page = PhysicalPersonContactViewModelPageObject.render({
      defaultValues: legacyDraft,
    });

    // Assert - Canton was normalized from san_jose to central
    expect(page.current.control._defaultValues.residentialAddress?.canton).toBe(
      'central',
    );
    expect(
      page.current.control._defaultValues.residentialAddress?.province,
    ).toBe('San José');

    // Assert - Missing commercialReference fields safely defaulted to empty strings
    expect(
      page.current.control._defaultValues.commercialReference?.companyReference,
    ).toBe('');
    expect(
      page.current.control._defaultValues.commercialReference?.ibanAccount,
    ).toBe('');
    expect(
      page.current.control._defaultValues.commercialReference?.referencePhone,
    ).toBe('');
  });
});

