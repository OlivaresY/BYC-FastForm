import {
  FINANCIAL_CURRENCIES,
  LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
  LEGAL_ENTITY_CONTACT_ERRORS,
} from '../constants/LegalEntityContact.constants';
import { LegalEntityContactViewModelPageObject } from './useLegalEntityContactViewModel.po';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';

const validData: LegalEntityContact = {
  commercialActivity: {
    accountingPhone: '+506 2200-1111',
    constitutionDate: '15-05-2015',
    economicSector: 'Automotriz y Repuestos',
    employeesCount: 25,
    mainActivity: 'Venta de repuestos y mantenimiento vehicular',
  },
  commercialAddress: {
    canton: 'San José',
    district: 'Uruca',
    exactAddress: '200 metros norte del puente Juan Pablo II',
    province: 'San José',
  },
  commercialReference: {
    companyReference: 'CoriMotors S.A.',
    ibanAccount: 'CR05015202001026284066',
    referencePhone: '+506 2200-2222',
  },
  contactInfo: {
    cellPhone: '+506 8888-9999',
    email: 'contacto@distribuidora.cr',
    officePhone: '+506 2200-0000',
  },
  financialStatements: {
    currency: FINANCIAL_CURRENCIES.CRC,
    grossSales: 50000000,
    netProfit: 15000000,
    otherIncomes: 2000000,
  },
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
    expect(page.current.control._defaultValues.commercialActivity).toEqual(
      LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialActivity,
    );
    expect(page.current.control._defaultValues.commercialAddress).toEqual(
      LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialAddress,
    );
    expect(page.current.control._defaultValues.commercialReference).toEqual(
      LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialReference,
    );
    expect(page.current.control._defaultValues.contactInfo).toEqual(
      LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.contactInfo,
    );
    expect(page.current.control._defaultValues.financialStatements).toEqual(
      LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.financialStatements,
    );

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
      LEGAL_ENTITY_CONTACT_ERRORS.SUBMIT_FAILED,
    );
    expect(page.current.isSubmitting).toBe(false);
  });

  it('executes onSubmit when programmatic submission passes validation with 5 sections', async () => {
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

  it('normalizes legacy flat draft with san_jose canton and flat income fields', async () => {
    // Arrange & Act
    const legacyDraft = {
      accountingPhone: '+506 2200-1111',
      canton: 'san_jose',
      cellPhone: '+506 8888-9999',
      constitutionDate: '15-05-2015',
      district: 'Central',
      economicSector: 'Automotriz',
      email: 'corp@byc.com',
      employeesCount: 20,
      exactAddress: 'Avenida 1',
      grossIncome: 45000000,
      mainActivity: 'Comercio',
      netIncome: 12000000,
      officePhone: '+506 2200-0000',
      province: 'San José',
    };

    const page = LegalEntityContactViewModelPageObject.render({
      defaultValues: legacyDraft,
    });

    // Assert - Canton was normalized to central
    expect(page.current.control._defaultValues.commercialAddress?.canton).toBe(
      'central',
    );
    expect(page.current.control._defaultValues.commercialAddress?.province).toBe(
      'San José',
    );

    // Assert - Flat income fields mapped to financialStatements
    expect(
      page.current.control._defaultValues.financialStatements?.grossSales,
    ).toBe(45000000);
    expect(
      page.current.control._defaultValues.financialStatements?.netProfit,
    ).toBe(12000000);

    // Assert - Missing commercialReference fields safely defaulted to empty strings
    expect(
      page.current.control._defaultValues.commercialReference?.companyReference,
    ).toBe('');
    expect(
      page.current.control._defaultValues.commercialReference?.ibanAccount,
    ).toBe('');
  });
});
