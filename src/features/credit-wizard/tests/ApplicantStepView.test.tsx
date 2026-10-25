import {
  APPLICANT_STEP_VIEW_COPY,
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
} from '../constants/ApplicantStepView.constants';
import { ApplicantStepViewPageObject } from './ApplicantStepView.po';

describe('ApplicantStepView Integration', () => {
  describe('Default Render State', () => {
    it('renders all structural elements with Physical regime active and submit disabled by default', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();

      // Assert - Structural elements
      expect(page.container).toBeTruthy();
      expect(page.processTopBar).toBeTruthy();
      expect(page.scrollView).toBeTruthy();
      expect(page.wizardHeader).toBeTruthy();
      expect(page.title.props.children).toBe(APPLICANT_STEP_VIEW_COPY.TITLE);
      expect(page.description.props.children).toBe(
        APPLICANT_STEP_VIEW_COPY.DESCRIPTION,
      );
      expect(page.legalSelector).toBeTruthy();
      expect(page.taupeContainer).toBeTruthy();
      expect(page.divider).toBeTruthy();
      expect(page.vehicleBeneficiary).toBeTruthy();
      expect(page.bottomBar).toBeTruthy();

      // Assert - Initial regime and form visibility
      expect(page.isPhysicalFormVisible()).toBe(true);
      expect(page.isLegalFormVisible()).toBe(false);

      // Assert - Submit button initially disabled
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });

  describe('State Isolation Protocol (Regime Switching)', () => {
    it('preserves physical and legal form data independently when switching regimes back and forth', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();

      // Act 1: Fill physical form
      page.fillPhysicalField('firstName', 'Carlos');
      page.fillPhysicalField('firstLastName', 'Rodríguez');
      expect(page.getPhysicalInputValue('firstName')).toBe('Carlos');
      expect(page.getPhysicalInputValue('firstLastName')).toBe('Rodríguez');

      // Act 2: Switch to Legal regime
      page.selectLegalRegime();

      // Assert 2: Legal form is visible, physical form is unmounted
      expect(page.isLegalFormVisible()).toBe(true);
      expect(page.isPhysicalFormVisible()).toBe(false);

      // Act 3: Fill legal form
      page.fillLegalField('legalName', 'Inversiones Tecnológicas S.A.');
      page.fillLegalField('representativeName', 'Juan Alberto Pérez');
      expect(page.getLegalInputValue('legalName')).toBe(
        'Inversiones Tecnológicas S.A.',
      );
      expect(page.getLegalInputValue('representativeName')).toBe(
        'Juan Alberto Pérez',
      );

      // Act 4: Switch back to Physical regime
      page.selectPhysicalRegime();

      // Assert 4: Physical form is visible, previously filled values are preserved!
      expect(page.isPhysicalFormVisible()).toBe(true);
      expect(page.isLegalFormVisible()).toBe(false);
      expect(page.getPhysicalInputValue('firstName')).toBe('Carlos');
      expect(page.getPhysicalInputValue('firstLastName')).toBe('Rodríguez');

      // Act 5: Switch back to Legal regime
      page.selectLegalRegime();

      // Assert 5: Legal form is visible, previously filled values are preserved!
      expect(page.isLegalFormVisible()).toBe(true);
      expect(page.isPhysicalFormVisible()).toBe(false);
      expect(page.getLegalInputValue('legalName')).toBe(
        'Inversiones Tecnológicas S.A.',
      );
      expect(page.getLegalInputValue('representativeName')).toBe(
        'Juan Alberto Pérez',
      );
    });
  });

  describe('Vehicle Beneficiary Selection', () => {
    it('allows toggling between same_holder and third_party beneficiary', () => {
      // Arrange
      const handleSubmit = jest.fn();
      const page = ApplicantStepViewPageObject.render({
        initialThirdPartyValues: {
          thirdPartyBirthDate: '01-01-1990',
          thirdPartyDocNumber: '1-2345-6789',
          thirdPartyDocType: 'national_id',
          thirdPartyEmail: 'juan@example.com',
          thirdPartyFullName: 'Juan Pérez',
          thirdPartyNationality: 'CR',
          thirdPartyPhone: '8888-8888',
          thirdPartyRelationship: 'spouse',
        },
        onSubmit: handleSubmit,
      });

      // Fill physical form to make it valid
      page.fillAllPhysicalFieldsValid();
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act - Select third party
      page.selectVehicleBeneficiaryThirdParty();
      page.pressSubmit();

      // Assert - Submitted with third_party
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          regime: 'physical',
          vehicleBeneficiary: 'third_party',
        }),
      );

      // Act - Select same holder
      page.selectVehicleBeneficiarySameHolder();
      page.pressSubmit();

      // Assert - Submitted with same_holder
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          regime: 'physical',
          vehicleBeneficiary: 'same_holder',
        }),
      );
    });
  });

  describe('Validation & Dynamic Submit Button (Physical Regime)', () => {
    it('enables Siguiente button only when all 9 mandatory physical fields are valid', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Fill partially
      page.fillPhysicalField('firstName', 'Carlos');
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Fill all 9 mandatory fields
      page.fillAllPhysicalFieldsValid();
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Clear a mandatory field
      page.fillPhysicalField('firstName', '');
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Restore mandatory field
      page.fillPhysicalField('firstName', 'Carlos');
      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    it('submits correct PhysicalApplicantStepData discriminated union payload', () => {
      // Arrange
      const handleSubmit = jest.fn();
      const page = ApplicantStepViewPageObject.render({
        onSubmit: handleSubmit,
      });

      // Act
      page.fillAllPhysicalFieldsValid();
      page.pressSubmit();

      // Assert
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        regime: 'physical',
        values: expect.objectContaining({
          birthDate: '15-08-1988',
          firstLastName: 'Rodríguez',
          firstName: 'Carlos',
          gender: 'male',
          identificationNumber: '1-1234-0567',
          identificationType: 'national_id',
          maritalStatus: 'married',
          nationality: 'CR',
          secondLastName: 'Castro',
        }),
        vehicleBeneficiary: 'same_holder',
      });
    });

    it('enables submit button when physical identification contains hyphens or spaces with 9 digits', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();
      page.fillAllPhysicalFieldsValid();
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - space-separated
      page.fillPhysicalField('identificationNumber', '1 1234 0567');
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - hyphen-separated
      page.fillPhysicalField('identificationNumber', '1-1234-0567');
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - too few digits despite formatting
      page.fillPhysicalField('identificationNumber', '1-1234-056');
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });

  describe('Validation & Dynamic Submit Button (Legal Regime)', () => {
    it('enables Siguiente button only when all 5 mandatory legal fields are valid', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();
      page.selectLegalRegime();
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Fill partially
      page.fillLegalField('legalName', 'Inversiones Tecnológicas S.A.');
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Fill all 5 mandatory fields
      page.fillAllLegalFieldsValid();
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Clear a mandatory field
      page.fillLegalField('legalName', '');
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Restore mandatory field
      page.fillLegalField('legalName', 'Inversiones Tecnológicas S.A.');
      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    it('submits correct LegalApplicantStepData discriminated union payload', () => {
      // Arrange
      const handleSubmit = jest.fn();
      const page = ApplicantStepViewPageObject.render({
        onSubmit: handleSubmit,
      });

      // Act
      page.selectLegalRegime();
      page.fillAllLegalFieldsValid();
      page.pressSubmit();

      // Assert
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        regime: 'legal',
        values: expect.objectContaining({
          identificationNumber: '3-101-123456',
          identificationType: 'legal_id',
          legalName: 'Inversiones Tecnológicas S.A.',
          representativeIdentification: '1-1150-0222',
          representativeName: 'Juan Alberto Pérez Rojas',
        }),
        vehicleBeneficiary: 'same_holder',
      });
    });

    it('enables submit button when legal identification contains hyphens or spaces with 10 digits', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render();
      page.selectLegalRegime();
      page.fillAllLegalFieldsValid();
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - space-separated
      page.fillLegalField('identificationNumber', '3 101 123456');
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - hyphen-separated
      page.fillLegalField('identificationNumber', '3-101-123456');
      expect(page.isSubmitButtonDisabled()).toBe(false);

      // Act & Assert - too few digits despite formatting
      page.fillLegalField('identificationNumber', '3-101-12345');
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });

  describe('Disabled Prop & Custom testID Overrides', () => {
    it('disables submit button and renders custom testID when provided', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.renderDirect({
        disabled: true,
        testID: 'custom-applicant-step-view',
        viewModel: {
          closeBeneficiaryModal: jest.fn(),
          handleSaveThirdPartyData: jest.fn().mockReturnValue(true),
          isBeneficiaryModalOpen: false,
          isIdentificationValid: true,
          isValid: true,
          legalErrors: {},
          legalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
          onLegalFieldChange: jest.fn(),
          onPhysicalFieldChange: jest.fn(),
          onRegimeChange: jest.fn(),
          onSubmit: jest.fn(),
          onThirdPartyFieldChange: jest.fn(),
          onVehicleBeneficiaryChange: jest.fn(),
          openBeneficiaryModal: jest.fn(),
          physicalErrors: {},
          physicalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
          regime: 'physical',
          thirdPartyErrors: {},
          thirdPartyValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
          vehicleBeneficiary: 'same_holder',
        },
      });

      // Assert
      expect(page.container.props.testID).toBe('custom-applicant-step-view');
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });

    it('uses default values for isIdentificationValid, isValid, and disabled when omitted', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.renderDirect({});

      // Assert - isSubmitButtonDisabled is true because isValid defaults to false
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });

    it('renders with initial props passed to ViewModel', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.render({
        initialLegalValues: {
          legalName: 'Alpha S.A.',
        },
        initialPhysicalValues: {
          firstName: 'Elena',
        },
        initialRegime: 'legal',
        initialVehicleBeneficiary: 'third_party',
      });

      // Assert
      expect(page.isLegalFormVisible()).toBe(true);
      expect(page.getLegalInputValue('legalName')).toBe('Alpha S.A.');

      // Switch to physical to verify initialPhysicalValues
      page.selectPhysicalRegime();
      expect(page.getPhysicalInputValue('firstName')).toBe('Elena');
    });
  });

  describe('Process Top Bar Actions', () => {
    it('invokes onClose when close button in ProcessTopBar is pressed', () => {
      // Arrange
      const onClose = jest.fn();
      const page = ApplicantStepViewPageObject.render({
        onClose,
      });

      // Act
      page.pressCloseButton();

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Async Execution & Loading Lifecycle (CRIT-02)', () => {
    it('renders ErrorBanner when submitError exists', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.renderDirect({
        legalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
        onLegalFieldChange: jest.fn(),
        onPhysicalFieldChange: jest.fn(),
        onRegimeChange: jest.fn(),
        onSubmit: jest.fn(),
        onVehicleBeneficiaryChange: jest.fn(),
        physicalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
        regime: 'physical',
        submitError: 'Error al enviar la solicitud',
        vehicleBeneficiary: 'same_holder',
      });

      // Assert
      expect(page.errorBanner).toBeTruthy();
    });

    it('sets submit button loading prop when isSubmitting is true', () => {
      // Arrange
      const page = ApplicantStepViewPageObject.renderDirect({
        isSubmitting: true,
        isValid: true,
        legalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
        onLegalFieldChange: jest.fn(),
        onPhysicalFieldChange: jest.fn(),
        onRegimeChange: jest.fn(),
        onSubmit: jest.fn(),
        onVehicleBeneficiaryChange: jest.fn(),
        physicalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
        regime: 'physical',
        vehicleBeneficiary: 'same_holder',
      });

      // Assert
      expect(page.isSubmitButtonLoading()).toBe(true);
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });
});
