import { esCR } from '@/shared/i18n';
import type { UseBankAuthorizationsViewModelReturn } from '../../hooks/useBankAuthorizationsViewModel';
import { BankAuthorizationsStepPOM } from './BankAuthorizationsStep.pom';

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    AlertCircle: () =>
      MockReact.createElement(MockView, { testID: 'mock-alert-circle' }),
  };
});

const mockHandleNext = jest.fn();
const mockToggleAllBanks = jest.fn();

describe('BankAuthorizationsStepView Component Tests', () => {
  const createMockViewModel = (
    overrides?: Partial<UseBankAuthorizationsViewModelReturn>,
  ): UseBankAuthorizationsViewModelReturn => {
    const control = BankAuthorizationsStepPOM.createMockControl();
    return {
      control,
      errors: {},
      form: {} as never,
      handleNext: mockHandleNext,
      handleSubmit: mockHandleNext,
      isAllBanksSelected: false,
      isSubmitting: false,
      isValid: true,
      toggleAllBanks: mockToggleAllBanks,
      ...overrides,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Isolated Component Tests (ViewModel Injected via Props)', () => {
    it('renders both sections, 5 banks, and 2 legal checkboxes correctly', () => {
      // Arrange & Act
      const pom = BankAuthorizationsStepPOM.render({
        viewModel: createMockViewModel(),
      });

      // Assert - Sections
      expect(pom.container).toBeTruthy();
      expect(pom.section1Container).toBeTruthy();
      expect(pom.section2Container).toBeTruthy();

      // Assert - Section 1 Banks & Toggle
      expect(pom.toggleAllButton).toBeTruthy();
      expect(pom.bancoBacCheckbox).toBeTruthy();
      expect(pom.bancoBncrCheckbox).toBeTruthy();
      expect(pom.bancoScotiabankCheckbox).toBeTruthy();
      expect(pom.bancoPromericaCheckbox).toBeTruthy();
      expect(pom.bancoCarroFacilCheckbox).toBeTruthy();

      // Assert - Section 2 Legal Checkboxes
      expect(pom.autorizaSugefCicCheckbox).toBeTruthy();
      expect(pom.autorizaBurosCreditoCheckbox).toBeTruthy();

      // Assert - Submit Button
      expect(pom.submitButton).toBeTruthy();
    });

    it('toggles individual banks and the "Todos" button successfully', () => {
      // Arrange
      const pom = BankAuthorizationsStepPOM.render({
        viewModel: createMockViewModel(),
      });

      // Act & Assert - Toggle individual banks without throwing
      expect(() => {
        pom
          .toggleBancoBac()
          .toggleBancoBncr()
          .toggleBancoScotiabank()
          .toggleBancoPromerica()
          .toggleBancoCarroFacil();
      }).not.toThrow();

      // Act - Press Toggle All
      pom.pressToggleAll();

      // Assert - toggleAllBanks called
      expect(mockToggleAllBanks).toHaveBeenCalledTimes(1);
    });

    it('toggles the 2 legal checkboxes successfully', () => {
      // Arrange
      const pom = BankAuthorizationsStepPOM.render({
        viewModel: createMockViewModel(),
      });

      // Act & Assert - Toggle legal checkboxes without throwing
      expect(() => {
        pom.toggleAutorizaSugefCic().toggleAutorizaBurosCredito();
      }).not.toThrow();

      expect(pom.autorizaSugefCicCheckbox).toBeTruthy();
      expect(pom.autorizaBurosCreditoCheckbox).toBeTruthy();
    });

    it('submits the form successfully when the submit button is pressed', () => {
      // Arrange
      const pom = BankAuthorizationsStepPOM.render({
        viewModel: createMockViewModel({
          handleNext: mockHandleNext,
          isValid: true,
        }),
      });

      // Act
      pom.pressSubmit();

      // Assert
      expect(mockHandleNext).toHaveBeenCalledTimes(1);
    });

    it('renders accessible inline Spanish error banner and keeps submit button enabled when not submitting', () => {
      // Arrange & Act
      const pom = BankAuthorizationsStepPOM.render({
        isSubmitting: false,
        submitError: esCR.creditWizard.masterDraftSubmission.errorMessage,
        viewModel: createMockViewModel({ isValid: true }),
      });

      // Assert
      expect(pom.submitErrorBanner).toBeTruthy();
      expect(pom.submitErrorAlert).toBeTruthy();
      expect(pom.submitErrorMessage?.props.children).toBe(
        esCR.creditWizard.masterDraftSubmission.errorMessage,
      );
      expect(pom.isSubmitButtonDisabled()).toBe(false);
    });

    it('disables all checkboxes, toggle all button, back button, and submit button when isSubmitted is true', () => {
      // Arrange
      const onBack = jest.fn();
      const pom = BankAuthorizationsStepPOM.render({
        isSubmitted: true,
        onBack,
        viewModel: createMockViewModel({
          handleNext: mockHandleNext,
          isValid: true,
        }),
      });

      // Assert controls disabled
      expect(pom.areAllCheckboxesDisabled()).toBe(true);
      expect(pom.isBackButtonDisabled()).toBe(true);
      expect(pom.isSubmitButtonDisabled()).toBe(true);

      // Act - Attempt interactions while locked
      pom.pressSubmit();
      pom.pressToggleAll();

      // Assert no actions fired
      expect(mockHandleNext).not.toHaveBeenCalled();
      expect(mockToggleAllBanks).not.toHaveBeenCalled();
    });
  });

  describe('E2E Integration Tests (Real ViewModel - No Mocking)', () => {
    it('initializes with submit button disabled when no banks or legal consents are checked', () => {
      // Arrange & Act
      const pom = BankAuthorizationsStepPOM.render();

      // Assert
      expect(pom.isSubmitButtonDisabled()).toBe(true);
    });

    it('blocks submission when banks are selected but legal consents are missing', async () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      const pom = BankAuthorizationsStepPOM.render({ onSubmit: mockOnSubmit });

      // Act 1: Select a bank
      pom.toggleBancoBac();

      // Assert 1: Still disabled because legal consents are missing
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(true);
      });

      // Act 2: Select first legal consent (SUGEF CIC)
      pom.toggleAutorizaSugefCic();

      // Assert 2: Still disabled because second consent (Burós de Crédito) is missing
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(true);
      });

      // Act 3: Select second legal consent
      pom.toggleAutorizaBurosCredito();

      // Assert 3: Becomes valid and enabled
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });
    });

    it('blocks submission when legal consents are checked but no bank is selected', async () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      const pom = BankAuthorizationsStepPOM.render({ onSubmit: mockOnSubmit });

      // Act 1: Check both legal consents
      pom.toggleAutorizaSugefCic().toggleAutorizaBurosCredito();

      // Assert 1: Disabled because at least one bank is required
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(true);
      });

      // Act 2: Select a bank
      pom.toggleBancoPromerica();

      // Assert 2: Enabled
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });
    });

    it('submits valid form payload through real ViewModel pipeline', async () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      const pom = BankAuthorizationsStepPOM.render({ onSubmit: mockOnSubmit });

      // Act: Fill all valid data (BAC + SUGEF + Burós)
      pom.fillAllValidData({
        autoriza_buros_credito: true,
        autoriza_sugef_cic: true,
        banco_bac: true,
      });

      // Wait until valid
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });

      // Submit
      pom.pressSubmit();

      // Assert
      await pom.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            autoriza_buros_credito: true,
            autoriza_sugef_cic: true,
            banco_bac: true,
            banco_bncr: false,
            banco_carro_facil: false,
            banco_promerica: false,
            banco_scotiabank: false,
          }),
        );
      });
    });

    it('renders Spanish error banner when submission fails, allows retrying, and clears banner when an authorization checkbox is toggled', async () => {
      // Arrange
      const mockOnAuthorizationChange = jest.fn();
      const mockOnSubmit = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockResolvedValueOnce(undefined);

      const pom = BankAuthorizationsStepPOM.render({
        onAuthorizationChange: mockOnAuthorizationChange,
        onSubmit: mockOnSubmit,
      });

      pom.fillAllValidData({
        autoriza_buros_credito: true,
        autoriza_sugef_cic: true,
        banco_bac: true,
      });

      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });

      // Act 1: Submit fails -> error banner renders and submit button re-enables
      pom.pressSubmit();

      await pom.waitFor(() => {
        expect(pom.submitErrorBanner).toBeTruthy();
        expect(pom.submitErrorMessage?.props.children).toBe(
          esCR.creditWizard.masterDraftSubmission.errorMessage,
        );
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });

      // Act 2: Toggling any authorization checkbox clears the error banner and notifies parent
      mockOnAuthorizationChange.mockClear();
      pom.toggleBancoBncr();

      await pom.waitFor(() => {
        expect(pom.submitErrorBanner).toBeNull();
        expect(mockOnAuthorizationChange).toHaveBeenCalledTimes(1);
      });

      // Act 3: Retry submission succeeds cleanly with preserved form state
      pom.pressSubmit();

      await pom.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(2);
        expect(pom.submitErrorBanner).toBeNull();
      });
    });
  });
});
