import { useBankAuthorizationsViewModel } from '../../hooks/useBankAuthorizationsViewModel';
import type { UseBankAuthorizationsViewModelReturn } from '../../hooks/useBankAuthorizationsViewModel';
import { BankAuthorizationsStepPOM } from './BankAuthorizationsStep.pom';

const mockHandleNext = jest.fn();
const mockToggleAllBanks = jest.fn();

jest.mock('../../hooks/useBankAuthorizationsViewModel', () => ({
  useBankAuthorizationsViewModel: jest.fn(),
}));

describe('BankAuthorizationsStepView Component Tests', () => {
  let defaultControl: UseBankAuthorizationsViewModelReturn['control'];

  const createMockViewModel = (
    overrides?: Partial<UseBankAuthorizationsViewModelReturn>,
  ): UseBankAuthorizationsViewModelReturn => ({
    control: defaultControl,
    errors: {},
    form: {} as never,
    handleNext: mockHandleNext,
    handleSubmit: mockHandleNext,
    isAllBanksSelected: false,
    isSubmitting: false,
    isValid: true,
    toggleAllBanks: mockToggleAllBanks,
    ...overrides,
  });

  beforeAll(() => {
    defaultControl = BankAuthorizationsStepPOM.createMockControl();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useBankAuthorizationsViewModel as jest.Mock).mockReturnValue(
      createMockViewModel(),
    );
  });

  it('renders both sections, 5 banks, and 2 legal checkboxes correctly', () => {
    // Arrange & Act
    const pom = BankAuthorizationsStepPOM.render();

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
    const pom = BankAuthorizationsStepPOM.render();

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
    const pom = BankAuthorizationsStepPOM.render();

    // Act & Assert - Toggle legal checkboxes without throwing
    expect(() => {
      pom.toggleAutorizaSugefCic().toggleAutorizaBurosCredito();
    }).not.toThrow();

    expect(pom.autorizaSugefCicCheckbox).toBeTruthy();
    expect(pom.autorizaBurosCreditoCheckbox).toBeTruthy();
  });

  it('submits the form successfully when the submit button is pressed', () => {
    // Arrange
    const pom = BankAuthorizationsStepPOM.render();

    // Act
    pom.pressSubmit();

    // Assert
    expect(mockHandleNext).toHaveBeenCalledTimes(1);
  });
});
