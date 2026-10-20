import { APPLICANT_STEP_VIEW_ERRORS } from '../constants/ApplicantStepView.constants';
import { ApplicantStepViewModelPageObject } from './useApplicantStepViewModel.po';

describe('useApplicantStepViewModel - Identification Normalization', () => {
  describe('Physical Person ID Normalization', () => {
    it('validates physical identification containing hyphens when digit count meets minimum', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });

      // '1-1234-0567' has 9 digits
      page.setPhysicalField('identificationNumber', '1-1234-0567');

      expect(page.isIdentificationValid).toBe(true);
    });

    it('validates physical identification containing spaces when digit count meets minimum', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });

      // '1 1234 0567' has 9 digits
      page.setPhysicalField('identificationNumber', '1 1234 0567');

      expect(page.isIdentificationValid).toBe(true);
    });

    it('validates physical identification containing mixed formatting (hyphens and spaces)', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });

      // ' 1 - 1234 - 0567 ' has 9 digits
      page.setPhysicalField('identificationNumber', ' 1 - 1234 - 0567 ');

      expect(page.isIdentificationValid).toBe(true);
    });

    it('invalidates physical identification when stripped digit count is less than 9', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });

      // '1-1234-056' has 8 digits
      page.setPhysicalField('identificationNumber', '1-1234-056');

      expect(page.isIdentificationValid).toBe(false);
    });

    it('invalidates physical identification with non-digit characters only having few digits', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });

      // '1-2-3-4-5-6-7-8' has only 8 digits
      page.setPhysicalField('identificationNumber', '1-2-3-4-5-6-7-8');

      expect(page.isIdentificationValid).toBe(false);
    });
  });

  describe('Legal Entity ID Normalization', () => {
    it('validates legal entity identification containing hyphens when digit count meets minimum (10 digits)', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'legal',
      });

      // '3-101-123456' has 10 digits
      page.setLegalField('identificationNumber', '3-101-123456');

      expect(page.isIdentificationValid).toBe(true);
    });

    it('validates legal entity identification containing spaces when digit count meets minimum', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'legal',
      });

      // '3 101 123456' has 10 digits
      page.setLegalField('identificationNumber', '3 101 123456');

      expect(page.isIdentificationValid).toBe(true);
    });

    it('invalidates legal entity identification when stripped digit count is less than 10', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'legal',
      });

      // '3-101-12345' has 9 digits
      page.setLegalField('identificationNumber', '3-101-12345');

      expect(page.isIdentificationValid).toBe(false);
    });
  });

  describe('Final Beneficiary (Third-Party) & Modal Orchestration', () => {
    it('initializes with modal closed and default third-party values', () => {
      const page = ApplicantStepViewModelPageObject.render();

      expect(page.isBeneficiaryModalOpen).toBe(false);
      expect(page.thirdPartyValues).toEqual({
        isThirdPartyRegistration: false,
        thirdPartyBirthDate: '',
        thirdPartyDocNumber: '',
        thirdPartyDocType: '',
        thirdPartyEmail: '',
        thirdPartyFullName: '',
        thirdPartyNationality: '',
        thirdPartyPhone: '',
        thirdPartyRelationship: '',
      });
    });

    it('opens and closes the beneficiary modal via explicit handlers', () => {
      const page = ApplicantStepViewModelPageObject.render();

      page.openBeneficiaryModal();
      expect(page.isBeneficiaryModalOpen).toBe(true);

      page.closeBeneficiaryModal();
      expect(page.isBeneficiaryModalOpen).toBe(false);
    });

    it('updates third-party fields immutably via onThirdPartyFieldChange', () => {
      const page = ApplicantStepViewModelPageObject.render();

      page
        .setThirdPartyField('thirdPartyFullName', 'María González')
        .setThirdPartyField('thirdPartyDocNumber', '2-0345-0678')
        .setThirdPartyField('thirdPartyDocType', 'national_id')
        .setThirdPartyField('thirdPartyRelationship', 'Spouse')
        .setThirdPartyField('thirdPartyBirthDate', '1990-05-15')
        .setThirdPartyField('thirdPartyNationality', 'Costa Rican');

      expect(page.thirdPartyValues).toEqual({
        isThirdPartyRegistration: false,
        thirdPartyBirthDate: '1990-05-15',
        thirdPartyDocNumber: '2-0345-0678',
        thirdPartyDocType: 'national_id',
        thirdPartyEmail: '',
        thirdPartyFullName: 'María González',
        thirdPartyNationality: 'Costa Rican',
        thirdPartyPhone: '',
        thirdPartyRelationship: 'Spouse',
      });
    });

    it('automatically opens modal and marks registration when selecting third_party', () => {
      const page = ApplicantStepViewModelPageObject.render();

      page.setVehicleBeneficiary('third_party');

      expect(page.vehicleBeneficiary).toBe('third_party');
      expect(page.isBeneficiaryModalOpen).toBe(true);
      expect(page.thirdPartyValues.isThirdPartyRegistration).toBe(true);
    });

    it('clears/resets thirdPartyValues and closes modal when switching back to same_holder', () => {
      const page = ApplicantStepViewModelPageObject.render();

      // Select third_party and fill values
      page
        .setVehicleBeneficiary('third_party')
        .setThirdPartyField('thirdPartyFullName', 'Juan Pérez')
        .setThirdPartyField('thirdPartyDocNumber', '1-2345-6789');

      expect(page.thirdPartyValues.thirdPartyFullName).toBe('Juan Pérez');

      // Switch back to same_holder
      page.setVehicleBeneficiary('same_holder');

      expect(page.vehicleBeneficiary).toBe('same_holder');
      expect(page.isBeneficiaryModalOpen).toBe(false);
      expect(page.thirdPartyValues).toEqual({
        isThirdPartyRegistration: false,
        thirdPartyBirthDate: '',
        thirdPartyDocNumber: '',
        thirdPartyDocType: '',
        thirdPartyEmail: '',
        thirdPartyFullName: '',
        thirdPartyNationality: '',
        thirdPartyPhone: '',
        thirdPartyRelationship: '',
      });
    });

    it('includes third-party values in onSubmit payload when third_party is selected and all fields valid', () => {
      const onSubmitMock = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: {
          birthDate: '1985-01-01',
          firstLastName: 'Ramírez',
          firstName: 'Ana',
          gender: 'female',
          identificationNumber: '1-1234-0567',
          identificationType: 'national_id',
          maritalStatus: 'single',
          nationality: 'Costa Rican',
          secondLastName: 'Mora',
        },
        initialRegime: 'physical',
        onSubmit: onSubmitMock,
      });

      page
        .setVehicleBeneficiary('third_party')
        .setThirdPartyField('thirdPartyDocType', 'national_id')
        .setThirdPartyField('thirdPartyDocNumber', '2-0345-0678')
        .setThirdPartyField('thirdPartyFullName', 'Carlos Mora')
        .setThirdPartyField('thirdPartyRelationship', 'Spouse')
        .setThirdPartyField('thirdPartyBirthDate', '1990-05-15')
        .setThirdPartyField('thirdPartyNationality', 'Costa Rican')
        .setThirdPartyField('thirdPartyPhone', '8888-8888')
        .setThirdPartyField('thirdPartyEmail', 'carlos@example.com')
        .submit();

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isThirdPartyRegistration: true,
          regime: 'physical',
          thirdPartyBirthDate: '1990-05-15',
          thirdPartyDocNumber: '2-0345-0678',
          thirdPartyDocType: 'national_id',
          thirdPartyEmail: 'carlos@example.com',
          thirdPartyFullName: 'Carlos Mora',
          thirdPartyNationality: 'Costa Rican',
          thirdPartyPhone: '8888-8888',
          thirdPartyRelationship: 'Spouse',
          vehicleBeneficiary: 'third_party',
        }),
      );
    });

    it('populates thirdPartyErrors and prevents submission when third-party fields are missing', () => {
      const onSubmitMock = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: {
          birthDate: '1985-01-01',
          firstLastName: 'Ramírez',
          firstName: 'Ana',
          gender: 'female',
          identificationNumber: '1-1234-0567',
          identificationType: 'national_id',
          maritalStatus: 'single',
          nationality: 'Costa Rican',
          secondLastName: 'Mora',
        },
        initialRegime: 'physical',
        onSubmit: onSubmitMock,
      });

      page.setVehicleBeneficiary('third_party').submit();

      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(page.thirdPartyErrors.thirdPartyDocType).toBeTruthy();
      expect(page.thirdPartyErrors.thirdPartyDocNumber).toBeTruthy();
      expect(page.thirdPartyErrors.thirdPartyFullName).toBeTruthy();
      expect(page.thirdPartyErrors.thirdPartyRelationship).toBeTruthy();
      expect(page.thirdPartyErrors.thirdPartyBirthDate).toBeTruthy();
      expect(page.thirdPartyErrors.thirdPartyNationality).toBeTruthy();
    });

    it('clears specific thirdPartyErrors field when user enters a value', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: {
          birthDate: '1985-01-01',
          firstLastName: 'Ramírez',
          firstName: 'Ana',
          gender: 'female',
          identificationNumber: '1-1234-0567',
          identificationType: 'national_id',
          maritalStatus: 'single',
          nationality: 'Costa Rican',
          secondLastName: 'Mora',
        },
        initialRegime: 'physical',
      });

      page.setVehicleBeneficiary('third_party').submit();

      expect(page.thirdPartyErrors.thirdPartyFullName).toBeTruthy();

      page.setThirdPartyField('thirdPartyFullName', 'Elena Castro');

      expect(page.thirdPartyErrors.thirdPartyFullName).toBeUndefined();
    });

    it('sets isValid to false when vehicleBeneficiary is third_party and third-party values are incomplete', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: {
          birthDate: '1985-01-01',
          firstLastName: 'Ramírez',
          firstName: 'Ana',
          gender: 'female',
          identificationNumber: '1-1234-0567',
          identificationType: 'national_id',
          maritalStatus: 'single',
          nationality: 'CR',
          secondLastName: 'Mora',
        },
        initialRegime: 'physical',
      });

      // Initially same_holder and valid applicant
      expect(page.isValid).toBe(true);

      // Select third_party
      page.setVehicleBeneficiary('third_party');

      // isValid must become false because third-party data is incomplete
      expect(page.isValid).toBe(false);

      // Fill valid third party data
      page
        .setThirdPartyField('thirdPartyDocType', 'national_id')
        .setThirdPartyField('thirdPartyDocNumber', '2-0345-0678')
        .setThirdPartyField('thirdPartyFullName', 'Carlos Mora')
        .setThirdPartyField('thirdPartyRelationship', 'spouse')
        .setThirdPartyField('thirdPartyBirthDate', '1990-05-15')
        .setThirdPartyField('thirdPartyNationality', 'CR')
        .setThirdPartyField('thirdPartyPhone', '8888-8888')
        .setThirdPartyField('thirdPartyEmail', 'carlos@example.com');

      // Now isValid must be true
      expect(page.isValid).toBe(true);

      // If an invalid email is provided, isValid becomes false
      page.setThirdPartyField('thirdPartyEmail', 'not-an-email');
      expect(page.isValid).toBe(false);

      // Switching back to same_holder restores isValid to true
      page.setVehicleBeneficiary('same_holder');
      expect(page.isValid).toBe(true);
    });

    it('handleSaveThirdPartyData fails validation, sets errors, and keeps modal open when fields are invalid', () => {
      const page = ApplicantStepViewModelPageObject.render();

      page.setVehicleBeneficiary('third_party');
      expect(page.isBeneficiaryModalOpen).toBe(true);

      // Attempt to save empty data
      const success = page.handleSaveThirdPartyData();

      expect(success).toBe(false);
      expect(page.isBeneficiaryModalOpen).toBe(true);
      expect(page.thirdPartyErrors.thirdPartyDocType).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE,
      );
      expect(page.thirdPartyErrors.thirdPartyDocNumber).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_NUMBER,
      );
      expect(page.thirdPartyErrors.thirdPartyFullName).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
      );
      expect(page.thirdPartyErrors.thirdPartyRelationship).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.RELATIONSHIP,
      );
      expect(page.thirdPartyErrors.thirdPartyBirthDate).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
      );
      expect(page.thirdPartyErrors.thirdPartyNationality).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY,
      );
      expect(page.thirdPartyErrors.thirdPartyPhone).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
      );
      expect(page.thirdPartyErrors.thirdPartyEmail).toBe(
        APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
      );
    });

    it('handleSaveThirdPartyData succeeds, clears errors, and closes modal when all fields are valid', () => {
      const page = ApplicantStepViewModelPageObject.render();

      page.setVehicleBeneficiary('third_party');
      expect(page.isBeneficiaryModalOpen).toBe(true);

      // Fill valid fields
      page
        .setThirdPartyField('thirdPartyDocType', 'national_id')
        .setThirdPartyField('thirdPartyDocNumber', '2-0345-0678')
        .setThirdPartyField('thirdPartyFullName', 'Carlos Mora')
        .setThirdPartyField('thirdPartyRelationship', 'spouse')
        .setThirdPartyField('thirdPartyBirthDate', '1990-05-15')
        .setThirdPartyField('thirdPartyNationality', 'CR')
        .setThirdPartyField('thirdPartyPhone', '8888-8888')
        .setThirdPartyField('thirdPartyEmail', 'carlos@example.com');

      const success = page.handleSaveThirdPartyData();

      expect(success).toBe(true);
      expect(page.thirdPartyErrors).toEqual({});
      expect(page.isBeneficiaryModalOpen).toBe(false);
    });
  });
});

describe('useApplicantStepViewModel - Submission Characterization (BYC-25)', () => {
  const VALID_PHYSICAL = {
    birthDate: '1985-01-01',
    firstLastName: 'Ramírez',
    firstName: 'Ana',
    gender: 'female',
    identificationNumber: '1-1234-0567',
    identificationType: 'national_id',
    maritalStatus: 'single',
    nationality: 'CR',
    secondLastName: 'Mora',
  };

  const VALID_LEGAL = {
    identificationNumber: '3-101-123456',
    identificationType: 'legal_id',
    legalName: 'Inversiones Tecnológicas S.A.',
    representativeIdentification: '1-1150-0222',
    representativeName: 'Juan Alberto Pérez Rojas',
  };

  const fillValidThirdParty = (
    page: ApplicantStepViewModelPageObject,
  ): void => {
    page
      .setVehicleBeneficiary('third_party')
      .setThirdPartyField('thirdPartyDocType', 'national_id')
      .setThirdPartyField('thirdPartyDocNumber', '2-0345-0678')
      .setThirdPartyField('thirdPartyFullName', 'Carlos Mora')
      .setThirdPartyField('thirdPartyRelationship', 'spouse')
      .setThirdPartyField('thirdPartyBirthDate', '1990-05-15')
      .setThirdPartyField('thirdPartyNationality', 'CR')
      .setThirdPartyField('thirdPartyPhone', '8888-8888')
      .setThirdPartyField('thirdPartyEmail', 'carlos@example.com');
  };

  describe('Submission payload shape', () => {
    it('submits the raw physical values untouched for same_holder', () => {
      const onSubmit = jest.fn();
      const rawValues = {
        ...VALID_PHYSICAL,
        firstName: '  Ana ',
        middleName: '',
      };
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: rawValues,
        initialRegime: 'physical',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        regime: 'physical',
        values: rawValues,
        vehicleBeneficiary: 'same_holder',
      });
    });

    it('submits the raw legal values untouched for same_holder', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialLegalValues: VALID_LEGAL,
        initialRegime: 'legal',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).toHaveBeenCalledWith({
        regime: 'legal',
        values: VALID_LEGAL,
        vehicleBeneficiary: 'same_holder',
      });
    });

    it('does not require the optional middle name', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: { ...VALID_PHYSICAL, middleName: '' },
        initialRegime: 'physical',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(page.physicalErrors).toEqual({});
    });
  });

  describe('Blocking validation', () => {
    it('blocks a physical submission with a short ID and reports the Spanish message', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: {
          ...VALID_PHYSICAL,
          identificationNumber: '1-1234-056',
        },
        initialRegime: 'physical',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).not.toHaveBeenCalled();
      expect(page.physicalErrors).toEqual({
        identificationNumber:
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.IDENTIFICATION_NUMBER,
      });
    });

    it('treats whitespace-only names as empty', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: { ...VALID_PHYSICAL, firstName: '   ' },
        initialRegime: 'physical',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).not.toHaveBeenCalled();
      expect(page.physicalErrors.firstName).toBe(
        APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_NAME,
      );
    });

    it('reports every missing legal field with its own message', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'legal',
        onSubmit,
      });

      page.submit();

      expect(onSubmit).not.toHaveBeenCalled();
      expect(page.legalErrors).toEqual({
        identificationNumber:
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_NUMBER,
        identificationType:
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_TYPE,
        legalName: APPLICANT_STEP_VIEW_ERRORS.LEGAL.LEGAL_NAME,
        representativeIdentification:
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_IDENTIFICATION,
        representativeName:
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_NAME,
      });
    });

    it('reports applicant and third-party errors in the same submission', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: { ...VALID_PHYSICAL, gender: '' },
        initialRegime: 'physical',
        onSubmit,
      });

      page.setVehicleBeneficiary('third_party').submit();

      expect(onSubmit).not.toHaveBeenCalled();
      expect(page.physicalErrors.gender).toBe(
        APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.GENDER,
      );
      expect(page.thirdPartyErrors).toEqual({
        thirdPartyBirthDate: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
        thirdPartyDocNumber: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_NUMBER,
        thirdPartyDocType: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.DOC_TYPE,
        thirdPartyEmail: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.EMAIL,
        thirdPartyFullName: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
        thirdPartyNationality:
          APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.NATIONALITY,
        thirdPartyPhone: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.PHONE,
        thirdPartyRelationship:
          APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.RELATIONSHIP,
      });
    });

    it('submits third-party data when every field is valid', () => {
      const onSubmit = jest.fn();
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: VALID_PHYSICAL,
        initialRegime: 'physical',
        onSubmit,
      });

      fillValidThirdParty(page);
      page.submit();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(page.thirdPartyErrors).toEqual({});
    });
  });

  describe('Live validity (isValid)', () => {
    it('is false for an untouched form and true once the physical form is complete', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialRegime: 'physical',
      });
      expect(page.isValid).toBe(false);

      const filled = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: VALID_PHYSICAL,
        initialRegime: 'physical',
      });
      expect(filled.isValid).toBe(true);
    });

    it('is false when a required physical name is whitespace-only', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: { ...VALID_PHYSICAL, firstLastName: '  ' },
        initialRegime: 'physical',
      });

      expect(page.isValid).toBe(false);
    });

    it('is true for a complete legal form and false when the ID is short', () => {
      const complete = ApplicantStepViewModelPageObject.render({
        initialLegalValues: VALID_LEGAL,
        initialRegime: 'legal',
      });
      expect(complete.isValid).toBe(true);

      const short = ApplicantStepViewModelPageObject.render({
        initialLegalValues: {
          ...VALID_LEGAL,
          identificationNumber: '3-101-12345',
        },
        initialRegime: 'legal',
      });
      expect(short.isValid).toBe(false);
    });

    it('does not require a physical middle name for validity', () => {
      const page = ApplicantStepViewModelPageObject.render({
        initialPhysicalValues: { ...VALID_PHYSICAL, middleName: '' },
        initialRegime: 'physical',
      });

      expect(page.isValid).toBe(true);
    });
  });
});

describe('useApplicantStepViewModel - Third-Party Submission UX (BYC-25)', () => {
  const VALID_PHYSICAL = {
    birthDate: '1985-01-01',
    firstLastName: 'Ramírez',
    firstName: 'Ana',
    gender: 'female',
    identificationNumber: '1-1234-0567',
    identificationType: 'national_id',
    maritalStatus: 'single',
    nationality: 'CR',
    secondLastName: 'Mora',
  };

  const THIRD_PARTY_FIELDS = {
    thirdPartyDocNumber: '2-0345-0678',
    thirdPartyDocType: 'national_id',
    thirdPartyEmail: 'carlos@example.com',
    thirdPartyFullName: 'Carlos Mora',
    thirdPartyNationality: 'CR',
    thirdPartyPhone: '8888-8888',
    thirdPartyRelationship: 'spouse',
  } as const;

  it('reopens the beneficiary modal when third-party errors block submission', () => {
    const onSubmit = jest.fn();
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: VALID_PHYSICAL,
      initialRegime: 'physical',
      onSubmit,
    });

    page.setVehicleBeneficiary('third_party').closeBeneficiaryModal();
    expect(page.isBeneficiaryModalOpen).toBe(false);

    page.submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(page.isBeneficiaryModalOpen).toBe(true);
    expect(page.thirdPartyErrors.thirdPartyFullName).toBe(
      APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.FULL_NAME,
    );
  });

  it('keeps the modal closed when only applicant fields are invalid', () => {
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: { ...VALID_PHYSICAL, firstName: '' },
      initialRegime: 'physical',
    });

    page.submit();

    expect(page.isBeneficiaryModalOpen).toBe(false);
    expect(page.physicalErrors.firstName).toBe(
      APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_NAME,
    );
  });

  it('accepts a Date birth date and forwards the original Date untouched', () => {
    const onSubmit = jest.fn();
    const birthDate = new Date('1990-05-15T00:00:00.000Z');
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: VALID_PHYSICAL,
      initialRegime: 'physical',
      initialThirdPartyValues: {
        ...THIRD_PARTY_FIELDS,
        thirdPartyBirthDate: birthDate,
      },
      initialVehicleBeneficiary: 'third_party',
      onSubmit,
    });

    page.submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ thirdPartyBirthDate: birthDate }),
    );
  });

  it('reports an error instead of throwing for an invalid Date birth date', () => {
    const onSubmit = jest.fn();
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: VALID_PHYSICAL,
      initialRegime: 'physical',
      initialThirdPartyValues: {
        ...THIRD_PARTY_FIELDS,
        thirdPartyBirthDate: new Date('not-a-date'),
      },
      initialVehicleBeneficiary: 'third_party',
      onSubmit,
    });

    page.submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(page.thirdPartyErrors).toEqual({
      thirdPartyBirthDate: APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
    });
  });

  it('accepts localized string birth date (DD/MM/YYYY) and validates successfully', () => {
    const onSubmit = jest.fn();
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: VALID_PHYSICAL,
      initialRegime: 'physical',
      initialThirdPartyValues: {
        ...THIRD_PARTY_FIELDS,
        thirdPartyBirthDate: '10 / 05 / 1990',
      },
      initialVehicleBeneficiary: 'third_party',
      onSubmit,
    });

    page.submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(page.isValid).toBe(true);
  });

  it('rejects invalid string birth date and populates thirdPartyErrors', () => {
    const onSubmit = jest.fn();
    const page = ApplicantStepViewModelPageObject.render({
      initialPhysicalValues: VALID_PHYSICAL,
      initialRegime: 'physical',
      initialThirdPartyValues: {
        ...THIRD_PARTY_FIELDS,
        thirdPartyBirthDate: '31/02/1990',
      },
      initialVehicleBeneficiary: 'third_party',
      onSubmit,
    });

    page.submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(page.thirdPartyErrors.thirdPartyBirthDate).toBe(
      APPLICANT_STEP_VIEW_ERRORS.THIRD_PARTY.BIRTH_DATE,
    );
    expect(page.isValid).toBe(false);
  });
});
