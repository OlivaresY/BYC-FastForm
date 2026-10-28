import { useVehicleCreditViewModel } from '../../hooks/useVehicleCreditViewModel';
import type { UseVehicleCreditViewModelReturn } from '../../hooks/useVehicleCreditViewModel';
import { VehicleCreditStepPOM } from './VehicleCreditStep.pom';

const mockHandleFinancialChange = jest.fn();
const mockHandleNext = jest.fn();

jest.mock('../../hooks/useVehicleCreditViewModel', () => ({
  useVehicleCreditViewModel: jest.fn(),
}));

describe('VehicleCreditStepView Component Tests', () => {
  let defaultControl: UseVehicleCreditViewModelReturn['control'];

  beforeAll(() => {
    defaultControl = VehicleCreditStepPOM.createMockControl();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    (useVehicleCreditViewModel as jest.Mock).mockReturnValue({
      control: defaultControl,
      derivedMontoFinanciar: 0,
      errors: {},
      handleFinancialChange: mockHandleFinancialChange,
      handleNext: mockHandleNext,
      handleSubmit: mockHandleNext,
      isSubmitting: false,
      isValid: true,
    } satisfies UseVehicleCreditViewModelReturn);
  });

  it('renders all form fields and the layout containers correctly', () => {
    // Arrange & Act
    const pom = VehicleCreditStepPOM.render();

    // Assert - Containers
    expect(pom.container).toBeTruthy();
    expect(pom.unitSpecificationsContainer).toBeTruthy();
    expect(pom.financingPlanContainer).toBeTruthy();

    // Assert - Unit Specification fields
    expect(pom.marcaInput).toBeTruthy();
    expect(pom.modeloInput).toBeTruthy();
    expect(pom.colorAnoInput).toBeTruthy();

    // Assert - Financing Plan fields
    expect(pom.monedaSelect).toBeTruthy();
    expect(pom.valorVehiculoInput).toBeTruthy();
    expect(pom.montoPrimaInput).toBeTruthy();
    expect(pom.derivedMontoFinanciar).toBeTruthy();
    expect(pom.plazoMesesInput).toBeTruthy();
  });

  it('calls the ViewModel mock when numeric inputs change, verifying handleFinancialChange trigger logic', () => {
    // Arrange
    const pom = VehicleCreditStepPOM.render();

    // Act - Change valor_vehiculo
    pom.fillValorVehiculo('25000');

    // Assert - valor_vehiculo triggered handleFinancialChange with numeric value
    expect(mockHandleFinancialChange).toHaveBeenCalledTimes(1);
    expect(mockHandleFinancialChange).toHaveBeenCalledWith(
      'valor_vehiculo',
      25000,
    );

    // Act - Change monto_prima
    pom.fillMontoPrima('5000');

    // Assert - monto_prima triggered handleFinancialChange with numeric value
    expect(mockHandleFinancialChange).toHaveBeenCalledTimes(2);
    expect(mockHandleFinancialChange).toHaveBeenCalledWith('monto_prima', 5000);
  });

  it('renders validation error messages when the mock ViewModel provides them in the errors object', () => {
    // Arrange - Simulate Rule A violation from ViewModel
    const ruleAErrorMessage =
      'La prima debe ser al menos el 20% del valor del vehículo.';

    (useVehicleCreditViewModel as jest.Mock).mockReturnValue({
      control: defaultControl,
      derivedMontoFinanciar: 15000,
      errors: {
        monto_prima: {
          message: ruleAErrorMessage,
          type: 'custom',
        },
      },
      handleFinancialChange: mockHandleFinancialChange,
      handleNext: mockHandleNext,
      handleSubmit: mockHandleNext,
      isSubmitting: false,
      isValid: false,
    } satisfies UseVehicleCreditViewModelReturn);

    // Act
    const pom = VehicleCreditStepPOM.render();

    // Assert - Error message rendered in the UI
    expect(pom.montoPrimaError).toBeTruthy();
    expect(pom.montoPrimaError?.props.children).toBe(ruleAErrorMessage);
  });
});
