import { LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY } from '../constants/LegalEntityContactStepView.constants';
import { LegalEntityContactStepViewPageObject } from './LegalEntityContactStepView.po';

describe('LegalEntityContactStepView Integration', () => {
  jest.setTimeout(20000);

  describe('Structural Layout & 4 Main Sections', () => {
    it('renders all structural wrappers, top bar, headers, and the 4 visual card sections', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Assert - Outer Layout Wrappers & Headers
      expect(page.container).toBeTruthy();
      expect(page.processTopBar).toBeTruthy();
      expect(page.closeButton).toBeTruthy();
      expect(page.scrollView).toBeTruthy();
      expect(page.wizardHeader).toBeTruthy();
      expect(page.title.props.children).toBe(
        LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.TITLE,
      );
      expect(page.description.props.children).toBe(
        LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.DESCRIPTION,
      );
      expect(page.form).toBeTruthy();
      expect(page.bottomBar).toBeTruthy();
      expect(page.backButton).toBeTruthy();
      expect(page.submitButton).toBeTruthy();

      // Assert - Section 1: INFORMACIÓN CORPORATIVA
      expect(page.section1Card).toBeTruthy();
      expect(page.section1Header).toBeTruthy();
      expect(page.corporateNameInput).toBeTruthy();
      expect(page.corporateIdInput).toBeTruthy();
      expect(page.constitutionDateInput).toBeTruthy();

      // Assert - Section 2: CONTACTO CORPORATIVO
      expect(page.section2Card).toBeTruthy();
      expect(page.section2Header).toBeTruthy();
      expect(page.phoneInput).toBeTruthy();
      expect(page.emailInput).toBeTruthy();

      // Assert - Section 3: REPRESENTANTE LEGAL
      expect(page.section3Card).toBeTruthy();
      expect(page.section3Header).toBeTruthy();
      expect(page.representativeNameInput).toBeTruthy();
      expect(page.representativeIdInput).toBeTruthy();

      // Assert - Section 4: CAPACIDAD FINANCIERA
      expect(page.section4Card).toBeTruthy();
      expect(page.section4Header).toBeTruthy();
      expect(page.grossIncomeInput).toBeTruthy();
      expect(page.netIncomeInput).toBeTruthy();
    });

    it('has submit button disabled initially when form is empty', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Assert
      expect(page.submitButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('Input Masks & Form Interactions', () => {
    it('formats Costa Rican corporate ID dynamically with hyphens', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.changeCorporateId('3101123456');

      // Assert
      expect(page.corporateIdInput.props.value).toBe('3-101-123456');
    });

    it('formats constitution date with slot-preserving mask', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.changeConstitutionDate('15052015');

      // Assert
      expect(page.constitutionDateInput.props.value).toBe('15-05-2015');
    });

    it('formats currency numbers with thousand separators in incomes', () => {
      // Arrange
      const page = LegalEntityContactStepViewPageObject.render();

      // Act
      page.changeGrossIncome('5000000');
      page.changeNetIncome('3500000');

      // Assert
      expect(page.grossIncomeInput.props.value).toBe('5.000.000');
      expect(page.netIncomeInput.props.value).toBe('3.500.000');
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
      page.fillValidForm();

      // Assert
      await page.waitFor(() => {
        expect(page.submitButton.props.accessibilityState?.disabled).toBe(false);
      });

      page.pressSubmit();

      await page.waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            constitutionDate: '15-05-2015',
            corporateId: '3-101-123456',
            corporateName: 'Distribuidora del Este S.A.',
            email: 'contacto@distribuidora.cr',
            grossIncome: 5000000,
            netIncome: 3500000,
            phone: '+506 2200-0000',
            representativeId: '1-1150-0222',
            representativeName: 'Juan Alberto Perez Rojas',
          }),
        );
      });
    });

    it('calls onClose when back button is pressed', () => {
      // Arrange
      const handleClose = jest.fn();
      const page = LegalEntityContactStepViewPageObject.render({
        onClose: handleClose,
      });

      // Act
      page.pressBack();

      // Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
