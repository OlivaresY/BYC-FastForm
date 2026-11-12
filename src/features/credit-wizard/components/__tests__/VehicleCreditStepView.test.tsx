import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
} from '../../constants/VehicleCredit.constants';
import type { UseVehicleCreditViewModelReturn } from '../../hooks/useVehicleCreditViewModel';
import { VehicleCreditStepPOM } from './VehicleCreditStep.pom';

const mockHandleFinancialChange = jest.fn();
const mockHandleNext = jest.fn();
const mockSetValue = jest.fn();

describe('VehicleCreditStepView Component Tests', () => {
  let defaultControl: UseVehicleCreditViewModelReturn['control'];

  const createBaseViewModelMock = (
    overrides?: Partial<UseVehicleCreditViewModelReturn>,
  ): UseVehicleCreditViewModelReturn => ({
    brands: VEHICLE_BRANDS,
    control: defaultControl,
    derivedMontoFinanciar: 0,
    errors: {},
    financingTerms: FINANCING_TERMS,
    handleFinancialChange: mockHandleFinancialChange,
    handleNext: mockHandleNext,
    handleSubmit: mockHandleNext,
    isSubmitting: false,
    isValid: true,
    setValue: mockSetValue as never,
    vehicleBrands: VEHICLE_BRANDS,
    ...overrides,
  });

  beforeAll(() => {
    defaultControl = VehicleCreditStepPOM.createMockControl();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Isolated Component Tests (ViewModel Injected via Props)', () => {
    it('renders all form fields, section headers, and layout containers correctly', () => {
      // Arrange & Act
      const pom = VehicleCreditStepPOM.render({
        viewModel: createBaseViewModelMock(),
      });

      // Assert - Containers & Section Headers
      expect(pom.container).toBeTruthy();
      expect(pom.unitSpecificationsContainer).toBeTruthy();
      expect(pom.unitSpecificationsHeader).toBeTruthy();
      expect(pom.financingPlanContainer).toBeTruthy();
      expect(pom.financingPlanHeader).toBeTruthy();

      // Assert - Unit Specification fields
      expect(pom.marcaSelect).toBeTruthy();
      expect(pom.modeloInput).toBeTruthy();
      expect(pom.colorInput).toBeTruthy();
      expect(pom.anioInput).toBeTruthy();

      // Assert - Financing Plan fields
      expect(pom.monedaSelect).toBeTruthy();
      expect(pom.valorVehiculoInput).toBeTruthy();
      expect(pom.montoPrimaInput).toBeTruthy();
      expect(pom.montoPrimaHelperText).toBeTruthy();
      expect(pom.derivedMontoFinanciar).toBeTruthy();
      expect(pom.plazoMesesSelect).toBeTruthy();
    });

    it('formats numeric inputs with currency mask when text changes', () => {
      // Arrange
      const pom = VehicleCreditStepPOM.render({
        viewModel: createBaseViewModelMock(),
      });

      // Act - Change valor_vehiculo
      pom.fillValorVehiculo('30000');

      // Assert - Input displays masked value
      expect(pom.valorVehiculoInput.props.value).toBe('30.000');

      // Act - Change monto_prima
      pom.fillMontoPrima('6000');

      // Assert - Input displays masked value
      expect(pom.montoPrimaInput.props.value).toBe('6.000');
    });

    it('renders validation error messages when the mock ViewModel provides them in the errors object', () => {
      // Arrange
      const ruleAErrorMessage = '10% de prima mínima permitida';

      const pom = VehicleCreditStepPOM.render({
        viewModel: createBaseViewModelMock({
          derivedMontoFinanciar: 15000,
          errors: {
            monto_prima: {
              message: ruleAErrorMessage,
              type: 'custom',
            },
          },
          isValid: false,
        }),
      });

      // Assert - Error message rendered in the UI
      expect(pom.montoPrimaError).toBeTruthy();
      expect(pom.montoPrimaError?.props.children).toBe(ruleAErrorMessage);
    });

    it('invokes handleNext when submit continue button is pressed', () => {
      // Arrange
      const pom = VehicleCreditStepPOM.render({
        viewModel: createBaseViewModelMock({
          handleNext: mockHandleNext,
          isValid: true,
        }),
      });

      // Act
      pom.pressSubmit();

      // Assert
      expect(mockHandleNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('E2E Integration Tests (Real ViewModel - No Mocking)', () => {
    it('defaults "Plazo en Meses" to 96 months and renders in disabled state', () => {
      // Arrange & Act - Renders with real default ViewModel
      const pom = VehicleCreditStepPOM.render();

      // Assert - Fixed 96-month default value
      expect(pom.plazoMesesTriggerText).toBe('96 Meses (8 Años)');

      // Assert - Disabled visual cue & accessibility state
      expect(pom.isPlazoMesesDisabled()).toBe(true);
      expect(pom.plazoMesesTrigger.props.className).toContain('opacity-40');
    });

    it('blocks submission and shows 10% minimum error when downpayment is insufficient, then clears when valid', async () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      const pom = VehicleCreditStepPOM.render({ onSubmit: mockOnSubmit });

      // Act 1: Enter vehicle value of 20000
      pom.fillValorVehiculo('20000');

      // Act 2: Enter downpayment below 10% (1000 < 2000)
      pom.fillMontoPrima('1000');

      // Assert - Error appears and submit button is blocked
      await pom.waitFor(() => {
        expect(pom.montoPrimaError).toBeTruthy();
        expect(pom.montoPrimaError?.props.children).toBe(
          '10% de prima mínima permitida',
        );
        expect(pom.isSubmitButtonDisabled()).toBe(true);
      });

      // Act 3: Increase downpayment to exactly 10% or more (2000)
      pom.fillMontoPrima('2000');
      await pom.act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Assert - Error disappears and derived amount to finance is calculated (20000 - 2000 = 18000)
      await pom.waitFor(() => {
        expect(pom.montoPrimaError).toBeNull();
        expect(pom.derivedMontoFinanciar.props.value).toBe('18.000');
      });
    });

    it('submits form payload with valid data through real ViewModel pipeline', async () => {
      // Arrange
      const mockOnSubmit = jest.fn();
      const pom = VehicleCreditStepPOM.render({ onSubmit: mockOnSubmit });

      // Act - Fill all fields with valid data
      pom.fillAllValidData({
        anio: '2024',
        color: 'Negro',
        marca: 'BYD',
        modelo: 'Tang',
        monto_prima: '2000',
        valor_vehiculo: '20000',
      });

      // Wait until valid
      await pom.waitFor(() => {
        expect(pom.isSubmitButtonDisabled()).toBe(false);
      });

      // Submit
      pom.pressSubmit();

      // Assert - onSubmit dispatched
      await pom.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            anio: '2024',
            color: 'Negro',
            marca: 'BYD',
            modelo: 'Tang',
            moneda: 'USD',
            monto_financiar: 18000,
            monto_prima: 2000,
            plazo_meses: '96 Meses (8 Años)',
            valor_vehiculo: 20000,
          }),
        );
      });
    });
  });
});
