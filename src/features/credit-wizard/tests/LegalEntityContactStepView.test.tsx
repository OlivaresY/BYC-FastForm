import { WIZARD_COPY } from '../constants/WizardCopy.constants';
import { LegalEntityContactStepViewPageObject } from './LegalEntityContactStepView.po';

describe('LegalEntityContactStepView Integration', () => {
  jest.setTimeout(25000);

  describe('Structural Layout & 5 Main Sections', () => {
    it('renders all structural wrappers, top bar, headers, and the 5 visual card sections', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Assert - Outer Layout Wrappers & Headers
      expect(page.container).toBeTruthy();
      expect(page.processTopBar).toBeTruthy();
      expect(page.closeButton).toBeTruthy();
      expect(page.scrollView).toBeTruthy();
      expect(page.wizardHeader).toBeTruthy();
      expect(page.title.props.children).toBe(
        WIZARD_COPY.STEP_2_LEGAL_CONTACT.TITLE,
      );
      expect(page.description.props.children).toBe(
        WIZARD_COPY.STEP_2_LEGAL_CONTACT.DESCRIPTION,
      );
      expect(page.form).toBeTruthy();
      expect(page.bottomBar).toBeTruthy();
      expect(page.backButton).toBeTruthy();
      expect(page.submitButton).toBeTruthy();

      // Assert - Section 1: CONTACTO CORPORATIVO
      expect(page.section1Card).toBeTruthy();
      expect(page.section1Header).toBeTruthy();
      expect(page.section1Icon).toBeTruthy();
      expect(page.emailInput).toBeTruthy();
      expect(page.cellPhoneInput).toBeTruthy();
      expect(page.officePhoneInput).toBeTruthy();

      // Assert - Section 2: DOMICILIO COMERCIAL
      expect(page.section2Card).toBeTruthy();
      expect(page.section2Header).toBeTruthy();
      expect(page.section2Icon).toBeTruthy();
      expect(page.provinceTrigger).toBeTruthy();
      expect(page.cantonTrigger).toBeTruthy();
      expect(page.districtTrigger).toBeTruthy();
      expect(page.exactAddressInput).toBeTruthy();

      // Assert - Section 3: ACTIVIDAD COMERCIAL
      expect(page.section3Card).toBeTruthy();
      expect(page.section3Header).toBeTruthy();
      expect(page.section3Icon).toBeTruthy();
      expect(page.economicSectorTrigger).toBeTruthy();
      expect(page.mainActivityInput).toBeTruthy();
      expect(page.constitutionDateInput).toBeTruthy();
      expect(page.employeesCountInput).toBeTruthy();
      expect(page.accountingPhoneInput).toBeTruthy();

      // Assert - Section 4: ESTADOS FINANCIEROS
      expect(page.section4Card).toBeTruthy();
      expect(page.section4Header).toBeTruthy();
      expect(page.section4Icon).toBeTruthy();
      expect(page.currencyTrigger).toBeTruthy();
      expect(page.grossSalesInput).toBeTruthy();
      expect(page.netProfitInput).toBeTruthy();
      expect(page.otherIncomesInput).toBeTruthy();

      // Assert - Section 5: REFERENCIA COMERCIAL Y CUENTA
      expect(page.section5Card).toBeTruthy();
      expect(page.section5Header).toBeTruthy();
      expect(page.section5Icon).toBeTruthy();
      expect(page.companyReferenceInput).toBeTruthy();
      expect(page.referencePhoneInput).toBeTruthy();
      expect(page.ibanAccountInput).toBeTruthy();
    });

    it('has submit button disabled initially when form is empty', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Assert
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });

  describe('Input Masks & Form Interactions', () => {
    it('formats constitution date with slot-preserving mask', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.setConstitutionDate('15052015');

      // Assert
      expect(page.constitutionDateInput.props.value).toBe('15-05-2015');
    });

    it('formats currency numbers with thousand separators in financials', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.setGrossSales('50000000');
      page.setNetProfit('15000000');
      page.setOtherIncomes('2500000');

      // Assert
      expect(page.grossSalesInput.props.value).toBe('50.000.000');
      expect(page.netProfitInput.props.value).toBe('15.000.000');
      expect(page.otherIncomesInput.props.value).toBe('2.500.000');
    });

    it('transforms IBAN account characters to uppercase', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.fillIbanAccount('cr05015202001026284066');

      // Assert
      expect(page.ibanAccountInput.props.value).toBe('CR05015202001026284066');
    });

    it('updates text inputs correctly across all sections', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.setEmail('contacto@empresa.cr');
      page.setCellPhone('+506 8888-8888');
      page.setOfficePhone('+506 2200-0000');
      page.setExactAddress('Avenida Central, Edificio 1');
      page.setMainActivity('Distribución');
      page.setEmployeesCount('30');
      page.setAccountingPhone('+506 2200-1111');
      page.fillCompanyReference('Corporación CoriMotors');
      page.fillReferencePhone('+506 2200-2222');

      // Assert
      expect(page.emailInput.props.value).toBe('contacto@empresa.cr');
      expect(page.cellPhoneInput.props.value).toBe('+506 8888-8888');
      expect(page.officePhoneInput.props.value).toBe('+506 2200-0000');
      expect(page.exactAddressInput.props.value).toBe(
        'Avenida Central, Edificio 1',
      );
      expect(page.mainActivityInput.props.value).toBe('Distribución');
      expect(page.employeesCountInput.props.value).toBe('30');
      expect(page.accountingPhoneInput.props.value).toBe('+506 2200-1111');
      expect(page.companyReferenceInput.props.value).toBe(
        'Corporación CoriMotors',
      );
      expect(page.referencePhoneInput.props.value).toBe('+506 2200-2222');
    });
  });

  describe('Cross-Field Validation & Error Handling', () => {
    it('keeps submit button disabled and flags error when net profit exceeds gross sales', async () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act - netProfit (30.000.000) > grossSales (10.000.000)
      page.fillAllValidData({
        grossSales: '10000000',
        netProfit: '30000000',
      });

      // Assert
      await page.waitFor(() => {
        expect(page.isSubmitButtonDisabled()).toBe(true);
      });
    });
  });

  describe('Form Submission & Navigation', () => {
    it('enables submit button and calls onSubmit with valid data', async () => {
      // Arrange
      const handleSubmit = jest.fn();
      const page = LegalEntityContactStepViewPageObject.render({
        onSubmit: handleSubmit,
      });

      // Act
      page.fillAllValidData();

      // Assert
      await page.waitFor(() => {
        expect(page.isSubmitButtonDisabled()).toBe(false);
      });

      page.clickSubmit();

      await page.waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith({
          commercialActivity: {
            accountingPhone: '+506 2200-1111',
            constitutionDate: '15-05-2015',
            economicSector: 'Comercio',
            employeesCount: 25,
            mainActivity: 'Venta de repuestos y mantenimiento vehicular',
          },
          commercialAddress: {
            canton: 'Central',
            district: 'Carmen',
            exactAddress:
              'De la rotonda de la Bandera 300m este, Edificio Corporativo Los Laureles, Piso 3.',
            province: 'San José',
          },
          commercialReference: {
            companyReference: 'Corporación CoriMotors S.A.',
            ibanAccount: 'CR05015202001026284066',
            referencePhone: '+506 2200-2222',
          },
          contactInfo: {
            cellPhone: '+506 8888-9999',
            email: 'contacto@distribuidoradeleste.cr',
            officePhone: '+506 2200-0000',
          },
          financialStatements: {
            currency: 'CRC',
            grossSales: 50000000,
            netProfit: 15000000,
            otherIncomes: 2500000,
          },
        });
      });
    });

    it('calls onClose when back button is pressed', () => {
      // Arrange
      const handleClose = jest.fn();
      const page = LegalEntityContactStepViewPageObject.render({
        onClose: handleClose,
      });

      // Act
      page.clickBack();

      // Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when top bar close button is pressed', () => {
      // Arrange
      const handleClose = jest.fn();
      const page = LegalEntityContactStepViewPageObject.render({
        onClose: handleClose,
      });

      // Act
      page.clickClose();

      // Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Async Execution & Error State Handling', () => {
    it('renders ErrorBanner inside layout children when submit fails', async () => {
      // Arrange
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error('Submission error'));
      const page = LegalEntityContactStepViewPageObject.render({
        onSubmit: handleSubmit,
      });

      // Act
      page.fillAllValidData();

      await page.waitFor(() => {
        expect(page.isSubmitButtonDisabled()).toBe(false);
      });

      page.clickSubmit();

      // Assert
      await page.waitFor(() => {
        expect(page.errorBanner).toBeTruthy();
      });
    });
  });
});
