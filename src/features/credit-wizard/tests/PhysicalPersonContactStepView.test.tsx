import { PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY } from '../constants/PhysicalPersonContactStepView.constants';
import { PhysicalPersonContactStepViewPageObject } from './PhysicalPersonContactStepView.po';

describe('PhysicalPersonContactStepView Integration', () => {
  jest.setTimeout(20000);

  describe('Structural Layout & 4 Main Sections', () => {
    it('renders all structural wrappers, top bars, headers, and the 4 visual sections', () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Assert - Outer Layout Wrappers & Headers
      expect(page.container).toBeTruthy();
      expect(page.processTopBar).toBeTruthy();
      expect(page.closeButton).toBeTruthy();
      expect(page.scrollView).toBeTruthy();
      expect(page.wizardHeader).toBeTruthy();
      expect(page.title.props.children).toBe(
        PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.TITLE,
      );
      expect(page.description.props.children).toBe(
        PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.DESCRIPTION,
      );
      expect(page.form).toBeTruthy();
      expect(page.bottomBar).toBeTruthy();
      expect(page.backButton).toBeTruthy();
      expect(page.submitButton).toBeTruthy();

      // Assert - Section 1: INFORMACIÓN DE CONTACTO
      expect(page.section1Card).toBeTruthy();
      expect(page.section1Header).toBeTruthy();
      expect(page.emailInput).toBeTruthy();
      expect(page.cellPhoneInput).toBeTruthy();
      expect(page.homePhoneInput).toBeTruthy();

      // Assert - Section 2: DOMICILIO RESIDENCIAL
      expect(page.section2Card).toBeTruthy();
      expect(page.section2Header).toBeTruthy();
      expect(page.provinceTrigger).toBeTruthy();
      expect(page.cantonTrigger).toBeTruthy();
      expect(page.districtTrigger).toBeTruthy();
      expect(page.exactAddressInput).toBeTruthy();

      // Assert - Section 3: DATOS LABORALES
      expect(page.section3Card).toBeTruthy();
      expect(page.section3Header).toBeTruthy();
      expect(page.employmentStatusTrigger).toBeTruthy();
      expect(page.professionInput).toBeTruthy();
      expect(page.employerInput).toBeTruthy();
      expect(page.entryDateInput).toBeTruthy();
      expect(page.officePhoneInput).toBeTruthy();

      // Assert - Section 4: CAPACIDAD FINANCIERA
      expect(page.section4Card).toBeTruthy();
      expect(page.section4Header).toBeTruthy();
      expect(page.currencyTrigger).toBeTruthy();
      expect(page.grossIncomeInput).toBeTruthy();
      expect(page.netIncomeInput).toBeTruthy();
      expect(page.otherIncomesInput).toBeTruthy();

      // Assert - Initially submit button is disabled
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });

    it('triggers onClose callback when user presses close button in ProcessTopBar', () => {
      // Arrange
      const handleClose = jest.fn();
      const page = PhysicalPersonContactStepViewPageObject.render({
        onClose: handleClose,
      });

      // Act
      page.clickClose();

      // Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('triggers onClose callback when user presses back button in bottom bar', () => {
      // Arrange
      const handleClose = jest.fn();
      const page = PhysicalPersonContactStepViewPageObject.render({
        onClose: handleClose,
      });

      // Act
      page.clickBack();

      // Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('renders with custom dynamic currentStep and totalSteps props', () => {
      // Arrange & Act
      const page = PhysicalPersonContactStepViewPageObject.render({
        currentStep: 3,
        totalSteps: 5,
      });

      // Assert
      expect(page.wizardHeader).toBeTruthy();
    });
  });

  describe('Zod Validation: International Phones & Strict Dates', () => {
    it('triggers validation error on invalid international cell phone input and clears on valid phone with parentheses', async () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Act - Enter invalid phone number
      page.setCellPhone('1234');

      // Assert - Error should appear
      await page.waitFor(() => {
        expect(page.cellPhoneError).toBeTruthy();
      });

      // Act - Enter valid international phone number with parentheses
      page.setCellPhone('+1 (555) 123-4567');

      // Assert - Error should clear
      await page.waitFor(() => {
        expect(page.cellPhoneError).toBeNull();
      });
    });

    it('triggers validation error on invalid international office phone input and clears on valid phone', async () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Act - Enter invalid office phone
      page.setOfficePhone('invalid-phone');

      // Assert - Error should appear
      await page.waitFor(() => {
        expect(page.officePhoneError).toBeTruthy();
      });

      // Act - Enter valid international office phone
      page.setOfficePhone('+506 2200-0000');

      // Assert - Error should clear
      await page.waitFor(() => {
        expect(page.officePhoneError).toBeNull();
      });
    });

    it('enforces strict DD-MM-YYYY date format and rejects future dates on entryDate', async () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Act - Enter invalid calendar date
      page.setEntryDate('32-05-2019');

      // Assert - Error should appear
      await page.waitFor(() => {
        expect(page.entryDateError).toBeTruthy();
      });

      // Act - Enter future date
      page.setEntryDate('15-05-2099');

      // Assert - Error should still appear
      await page.waitFor(() => {
        expect(page.entryDateError).toBeTruthy();
      });

      // Act - Enter strict valid past DD-MM-YYYY date
      page.setEntryDate('15-05-2019');

      // Assert - Error should clear
      await page.waitFor(() => {
        expect(page.entryDateError).toBeNull();
      });
    });
  });

  describe('Form Submission & Payload Accuracy', () => {
    it('enables submit button and dispatches valid payload via onSubmit after fillAllValidData()', async () => {
      // Arrange
      const handleSubmit = jest.fn();
      const page = PhysicalPersonContactStepViewPageObject.render({
        onSubmit: handleSubmit,
      });

      // Initially disabled
      expect(page.isSubmitButtonDisabled()).toBe(true);

      // Act - Fill all valid information
      page.fillAllValidData({
        cellPhone: '+506 8888-8888',
        currency: 'CRC',
        district: 'Carmen',
        email: 'carlos.rodriguez@byc.cr',
        employer: 'CoriMotors S.A.',
        employmentStatus: 'salaried_private',
        entryDate: '15-05-2019',
        exactAddress: '100 metros norte del Parque Central, Casa #123',
        grossIncome: 2500000,
        homePhone: '+506 2222-2222',
        netIncome: 2000000,
        officePhone: '+506 2200-0000',
        otherIncomes: 500000,
        profession: 'Ingeniero de Software',
        province: 'San José',
        canton: 'Central',
      });

      // Assert - Submit button becomes enabled
      await page.waitFor(() => {
        expect(page.isSubmitButtonDisabled()).toBe(false);
      });

      // Act - Submit form
      page.clickSubmit();

      // Assert - onSubmit was called with exact nested payload
      await page.waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith({
          contactInfo: {
            cellPhone: '+506 8888-8888',
            email: 'carlos.rodriguez@byc.cr',
            homePhone: '+506 2222-2222',
          },
          employmentData: {
            employer: 'CoriMotors S.A.',
            employmentStatus: 'salaried_private',
            entryDate: '15-05-2019',
            officePhone: '+506 2200-0000',
            profession: 'Ingeniero de Software',
          },
          financialCapacity: {
            currency: 'CRC',
            grossIncome: 2500000,
            netIncome: 2000000,
            otherIncomes: 500000,
          },
          residentialAddress: {
            canton: 'Central',
            district: 'Carmen',
            exactAddress: '100 metros norte del Parque Central, Casa #123',
            province: 'San José',
          },
        });
      });
    });
  });

  describe('Keyboard Auto-Scroll Integration', () => {
    it('adjusts bottom padding when keyboardDidShow is emitted', () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Act
      page.emitKeyboardDidShow(320);

      // Assert - ScrollView contentContainerStyle paddingBottom expands to avoid keyboard
      const contentContainerStyle = page.scrollView.props.contentContainerStyle;
      expect(contentContainerStyle.paddingBottom).toBeGreaterThanOrEqual(320);
    });

    it('triggers scroll logic when a lower input like exactAddress or netIncome is focused', () => {
      // Arrange
      const page = PhysicalPersonContactStepViewPageObject.render();

      // Open keyboard
      page.emitKeyboardDidShow(320);

      // Focus netIncome input
      page.focusInputWithMockNode(page.netIncomeInput, {
        height: 50,
        left: 0,
        top: 1100,
        width: 180,
      });

      // Assert - ScrollView's paddingBottom accommodates keyboard and view is reactive
      expect(page.scrollView.props.contentContainerStyle.paddingBottom).toBeGreaterThanOrEqual(320);
      expect(page.netIncomeInput).toBeTruthy();
    });
  });
});
