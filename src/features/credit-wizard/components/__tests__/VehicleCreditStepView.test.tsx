import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
} from '../../constants/VehicleCredit.constants';
import { useVehicleCreditViewModel } from '../../hooks/useVehicleCreditViewModel';
import type { UseVehicleCreditViewModelReturn } from '../../hooks/useVehicleCreditViewModel';
import { VehicleCreditStepPOM } from './VehicleCreditStep.pom';

const mockHandleFinancialChange = jest.fn();
const mockHandleNext = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../hooks/useVehicleCreditViewModel', () => ({
  ...jest.requireActual('../../hooks/useVehicleCreditViewModel'),
  useVehicleCreditViewModel: jest.fn(),
}));

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

    (useVehicleCreditViewModel as jest.Mock).mockReturnValue(
      createBaseViewModelMock(),
    );
  });

  it('renders all form fields, section headers, and layout containers correctly', () => {
    // Arrange & Act
    const pom = VehicleCreditStepPOM.render();

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
    const pom = VehicleCreditStepPOM.render();

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
