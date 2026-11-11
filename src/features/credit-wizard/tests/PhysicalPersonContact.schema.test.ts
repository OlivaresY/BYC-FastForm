import {
  EMPLOYMENT_STATUSES,
  PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
} from '../constants/PhysicalPersonContact.constants';
import {
  CommercialReferenceSchema,
  EmploymentDataSchema,
  FinancialCapacitySchema,
  PhysicalPersonContactSchema,
} from '../schemas/PhysicalPersonContact.schema';

const getMessages = (
  result: ReturnType<typeof PhysicalPersonContactSchema.safeParse>,
  path: (number | string)[],
): string[] => {
  if (result.success) {
    return [];
  }
  return result.error.issues
    .filter((issue) => issue.path.join('.') === path.join('.'))
    .map((issue) => issue.message);
};

describe('PhysicalPersonContactSchema custom error messages', () => {
  it('returns the Spanish required message when employmentStatus is left unselected (default state)', () => {
    // Act
    const result = PhysicalPersonContactSchema.safeParse(
      PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
    );

    // Assert
    expect(result.success).toBe(false);
    expect(getMessages(result, ['employmentData', 'employmentStatus'])).toEqual(
      [
        PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA
          .EMPLOYMENT_STATUS_REQUIRED,
      ],
    );
  });

  it('returns the Spanish message for an unknown employmentStatus value', () => {
    // Act
    const result = EmploymentDataSchema.safeParse({
      ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.employmentData,
      employmentStatus: 'not-a-status',
    });

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues
        .filter((issue) => issue.path[0] === 'employmentStatus')
        .map((issue) => issue.message);
      expect(messages.length).toBeGreaterThan(0);
      messages.forEach((message) => {
        expect(message).toMatch(/[áéíóúñ]|obligatori|selecc|válid/i);
      });
    }
  });

  it('returns the Spanish required messages for empty required string fields', () => {
    // Act
    const result = PhysicalPersonContactSchema.safeParse(
      PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
    );

    // Assert
    expect(
      getMessages(result, ['commercialReference', 'companyReference']),
    ).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
        .COMPANY_REFERENCE_REQUIRED,
    );
    expect(
      getMessages(result, ['commercialReference', 'referencePhone']),
    ).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
        .REFERENCE_PHONE_REQUIRED,
    );
    expect(
      getMessages(result, ['commercialReference', 'ibanAccount']),
    ).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE.IBAN_ACCOUNT_REQUIRED,
    );
    expect(getMessages(result, ['contactInfo', 'email'])).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.EMAIL_REQUIRED,
    );
    expect(getMessages(result, ['contactInfo', 'cellPhone'])).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.CONTACT_INFO.CELL_PHONE_REQUIRED,
    );
    expect(getMessages(result, ['employmentData', 'employer'])).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.EMPLOYMENT_DATA.EMPLOYER_REQUIRED,
    );
    expect(getMessages(result, ['residentialAddress', 'province'])).toContain(
      PHYSICAL_PERSON_CONTACT_ERRORS.RESIDENTIAL_ADDRESS.PROVINCE_REQUIRED,
    );
  });

  it('returns the Spanish required message when income fields are cleared to undefined', () => {
    // Act
    const result = FinancialCapacitySchema.safeParse({
      ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.financialCapacity,
      grossIncome: undefined,
      netIncome: undefined,
    });

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const byField = (field: string): string[] =>
        result.error.issues
          .filter((issue) => issue.path[0] === field)
          .map((issue) => issue.message);
      expect(byField('grossIncome')).toEqual([
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.GROSS_INCOME_REQUIRED,
      ]);
      expect(byField('netIncome')).toEqual([
        PHYSICAL_PERSON_CONTACT_ERRORS.FINANCIAL_CAPACITY.NET_INCOME_REQUIRED,
      ]);
    }
  });

  it('accepts a valid employmentStatus canonical id', () => {
    // Act
    const result = EmploymentDataSchema.safeParse({
      employer: 'Acme',
      employmentStatus: EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
      entryDate: '15-05-2019',
      officePhone: '+506 2200-0000',
      profession: 'Ingeniero',
    });

    // Assert
    expect(result.success).toBe(true);
  });

  describe('CommercialReferenceSchema validations', () => {
    const validCommercialReference = {
      companyReference: 'CoriMotors S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2200-0000',
    };

    it('validates a correct commercial reference successfully', () => {
      // Act
      const result = CommercialReferenceSchema.safeParse(
        validCommercialReference,
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it('rejects companyReference with fewer than 2 characters', () => {
      // Act
      const result = CommercialReferenceSchema.safeParse({
        ...validCommercialReference,
        companyReference: 'A',
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues
          .filter((issue) => issue.path[0] === 'companyReference')
          .map((issue) => issue.message);
        expect(errorMessages).toContain(
          PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .COMPANY_REFERENCE_MIN,
        );
      }
    });

    it('rejects invalid referencePhone formats', () => {
      // Act
      const result = CommercialReferenceSchema.safeParse({
        ...validCommercialReference,
        referencePhone: '123',
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues
          .filter((issue) => issue.path[0] === 'referencePhone')
          .map((issue) => issue.message);
        expect(errorMessages).toContain(
          PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .REFERENCE_PHONE_INVALID,
        );
      }
    });

    it('rejects ibanAccount with wrong country code or incorrect digit length', () => {
      // Act - Wrong prefix
      const wrongPrefixResult = CommercialReferenceSchema.safeParse({
        ...validCommercialReference,
        ibanAccount: 'ES05015202001026284066',
      });

      // Act - Wrong length (CR + 19 digits)
      const wrongLengthResult = CommercialReferenceSchema.safeParse({
        ...validCommercialReference,
        ibanAccount: 'CR0501520200102628406',
      });

      // Assert
      expect(wrongPrefixResult.success).toBe(false);
      if (!wrongPrefixResult.success) {
        const errorMessages = wrongPrefixResult.error.issues
          .filter((issue) => issue.path[0] === 'ibanAccount')
          .map((issue) => issue.message);
        expect(errorMessages).toContain(
          PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .IBAN_ACCOUNT_INVALID,
        );
      }

      expect(wrongLengthResult.success).toBe(false);
      if (!wrongLengthResult.success) {
        const errorMessages = wrongLengthResult.error.issues
          .filter((issue) => issue.path[0] === 'ibanAccount')
          .map((issue) => issue.message);
        expect(errorMessages).toContain(
          PHYSICAL_PERSON_CONTACT_ERRORS.COMMERCIAL_REFERENCE
            .IBAN_ACCOUNT_INVALID,
        );
      }
    });
  });

  it('accepts full valid 5-section PhysicalPersonContact payload', () => {
    // Act
    const result = PhysicalPersonContactSchema.safeParse({
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
        currency: 'CRC',
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
    });

    // Assert
    expect(result.success).toBe(true);
  });
});
