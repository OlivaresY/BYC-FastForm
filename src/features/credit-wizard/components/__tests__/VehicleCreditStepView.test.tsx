import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
  VEHICLE_COLORS_YEARS,
} from '../../constants/VehicleCredit.constants';
import { useVehicleCreditViewModel } from '../../hooks/useVehicleCreditViewModel';
import type { UseVehicleCreditViewModelReturn } from '../../hooks/useVehicleCreditViewModel';
import { VehicleCreditStepPOM } from './VehicleCreditStep.pom';

const mockHandleFinancialChange = jest.fn();
const mockHandleNext = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../hooks/useVehicleCreditViewModel', () => ({
  useVehicleCreditViewModel: jest.fn(),
}));

describe('VehicleCreditStepView Component Tests', () => {
  let defaultControl: UseVehicleCreditViewModelReturn['control'];

  const createBaseViewModelMock = (
    overrides?: Partial<UseVehicleCreditViewModelReturn>,
  ): UseVehicleCreditViewModelReturn => ({
    availableColorsYears: VEHICLE_COLORS_YEARS,
    availableModels: [],
    brands: VEHICLE_BRANDS,
    colorsYears: VEHICLE_COLORS_YEARS,
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
    vehicleColorsYears: VEHICLE_COLORS_YEARS,
    ...overrides,
  });

  beforeAll(() => {
    defaultControl = VehicleCreditStepPOM.createMockControl();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    (useVehicleCreditViewModel as jest.Mock).mockReturnValue(
      createBaseViewModelMock(),
    );
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
    pom.fillValorVehiculo('30000');

    // Assert - Triggered handleFinancialChange with numeric value
    expect(mockHandleFinancialChange).toHaveBeenCalledWith(
      'valor_vehiculo',
      30000,
    );

    // Act - Change monto_prima
    pom.fillMontoPrima('6000');

    // Assert - Triggered handleFinancialChange with numeric value
    expect(mockHandleFinancialChange).toHaveBeenCalledWith('monto_prima', 6000);
  });

  it('renders validation error messages when the mock ViewModel provides them in the errors object', () => {
    // Arrange
    const ruleAErrorMessage =
      'La prima debe ser al menos el 20% del valor del vehículo.';

    (useVehicleCreditViewModel as jest.Mock).mockReturnValue(
      createBaseViewModelMock({
        derivedMontoFinanciar: 15000,
        errors: {
          monto_prima: {
            message: ruleAErrorMessage,
            type: 'custom',
          },
        },
        isValid: false,
      }),
    );

    // Act
    const pom = VehicleCreditStepPOM.render();

    // Assert - Error message rendered in the UI
    expect(pom.montoPrimaError).toBeTruthy();
    expect(pom.montoPrimaError?.props.children).toBe(ruleAErrorMessage);
  });
});
