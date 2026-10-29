import { useBankAuthorizationsViewModel } from '../../hooks/useBankAuthorizationsViewModel';
import type { UseBankAuthorizationsViewModelReturn } from '../../hooks/useBankAuthorizationsViewModel';
import { BankAuthorizationsStepPOM } from './BankAuthorizationsStep.pom';

const mockHandleNext = jest.fn();

jest.mock('../../hooks/useBankAuthorizationsViewModel', () => ({
  useBankAuthorizationsViewModel: jest.fn(),
}));

describe('BankAuthorizationsStepView Component Tests', () => {
  let defaultControl: UseBankAuthorizationsViewModelReturn['control'];

  beforeAll(() => {
    defaultControl = BankAuthorizationsStepPOM.createMockControl();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    (useBankAuthorizationsViewModel as jest.Mock).mockReturnValue({
      control: defaultControl,
      errors: {},
      handleNext: mockHandleNext,
      handleSubmit: mockHandleNext,
      isSubmitting: false,
      isValid: true,
    } satisfies UseBankAuthorizationsViewModelReturn);
  });

  it('renders the bank selector, the three consent switches, and the layout correctly', () => {
    // Arrange & Act
    const pom = BankAuthorizationsStepPOM.render();

    // Assert - Containers
    expect(pom.container).toBeTruthy();
    expect(pom.bankContainer).toBeTruthy();
    expect(pom.consentsContainer).toBeTruthy();

    // Assert - Bank select
    expect(pom.bancoDestinoSelect).toBeTruthy();

    // Assert - Switches
    expect(pom.autorizaBuroSwitch).toBeTruthy();
    expect(pom.autorizaSugefSwitch).toBeTruthy();
    expect(pom.aceptaTerminosSwitch).toBeTruthy();
  });

  it('renders validation error messages when the mock ViewModel provides them in the errors object', () => {
    // Arrange - Simulate SUGEF consent violation
    const sugefErrorMessage = 'Debe aceptar esta condición para continuar';
    const bancoErrorMessage = 'El banco de destino es obligatorio';

    (useBankAuthorizationsViewModel as jest.Mock).mockReturnValue({
      control: defaultControl,
      errors: {
        autoriza_sugef: {
          message: sugefErrorMessage,
          type: 'custom',
        },
        banco_destino: {
          message: bancoErrorMessage,
          type: 'custom',
        },
      },
      handleNext: mockHandleNext,
      handleSubmit: mockHandleNext,
      isSubmitting: false,
      isValid: false,
    } satisfies UseBankAuthorizationsViewModelReturn);

    // Act
    const pom = BankAuthorizationsStepPOM.render();

    // Assert - Error message rendered for SUGEF
    expect(pom.autorizaSugefError).toBeTruthy();
    expect(pom.autorizaSugefError?.props.children).toBe(sugefErrorMessage);

    // Assert - Error message rendered for Banco Destino
    expect(pom.bancoDestinoError).toBeTruthy();
    expect(pom.bancoDestinoError?.props.children).toBe(bancoErrorMessage);
  });

  it('simulates user interaction with the switches to ensure the UI responds without crashing', () => {
    // Arrange
    const pom = BankAuthorizationsStepPOM.render();

    // Act & Assert - Toggle each switch
    expect(() => {
      pom
        .toggleAutorizaBuro(true)
        .toggleAutorizaSugef(true)
        .toggleAceptaTerminos(true);
    }).not.toThrow();

    expect(pom.autorizaBuroSwitch).toBeTruthy();
    expect(pom.autorizaSugefSwitch).toBeTruthy();
    expect(pom.aceptaTerminosSwitch).toBeTruthy();
  });
});
