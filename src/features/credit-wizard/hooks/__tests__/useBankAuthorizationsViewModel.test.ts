import { BankAuthorizationsViewModelPageObject } from './useBankAuthorizationsViewModel.po';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';

const validFormData: BankAuthorizationsFormValues = {
  autoriza_buros_credito: true,
  autoriza_sugef_cic: true,
  banco_bac: true,
  banco_bncr: false,
  banco_carro_facil: false,
  banco_promerica: false,
  banco_scotiabank: false,
};

describe('useBankAuthorizationsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with expected default form values and state', () => {
    // Arrange & Act
    const page = BankAuthorizationsViewModelPageObject.render();

    // Assert
    expect(page.isValid).toBe(false);
    expect(page.isAllBanksSelected).toBe(false);
    expect(page.isSubmitting).toBe(false);

    expect(page.getValues()).toEqual({
      autoriza_buros_credito: false,
      autoriza_sugef_cic: false,
      banco_bac: false,
      banco_bncr: false,
      banco_carro_facil: false,
      banco_promerica: false,
      banco_scotiabank: false,
    });
  });

  it('selects all 5 banks when toggleAllBanks is called and banks are currently unselected', () => {
    // Arrange
    const page = BankAuthorizationsViewModelPageObject.render();
    expect(page.isAllBanksSelected).toBe(false);

    // Act
    page.toggleAllBanks();

    // Assert
    const values = page.getValues();
    expect(values.banco_bac).toBe(true);
    expect(values.banco_bncr).toBe(true);
    expect(values.banco_carro_facil).toBe(true);
    expect(values.banco_promerica).toBe(true);
    expect(values.banco_scotiabank).toBe(true);
    expect(page.isAllBanksSelected).toBe(true);
  });

  it('deselects all 5 banks when toggleAllBanks is called and all banks are currently selected', () => {
    // Arrange
    const page = BankAuthorizationsViewModelPageObject.render({
      defaultValues: {
        banco_bac: true,
        banco_bncr: true,
        banco_carro_facil: true,
        banco_promerica: true,
        banco_scotiabank: true,
      },
    });
    expect(page.isAllBanksSelected).toBe(true);

    // Act
    page.toggleAllBanks();

    // Assert
    const values = page.getValues();
    expect(values.banco_bac).toBe(false);
    expect(values.banco_bncr).toBe(false);
    expect(values.banco_carro_facil).toBe(false);
    expect(values.banco_promerica).toBe(false);
    expect(values.banco_scotiabank).toBe(false);
    expect(page.isAllBanksSelected).toBe(false);
  });

  it('selects all 5 banks when toggleAllBanks is called and only some banks are selected', () => {
    // Arrange - Only one bank selected
    const page = BankAuthorizationsViewModelPageObject.render({
      defaultValues: {
        banco_bac: true,
        banco_bncr: false,
        banco_carro_facil: false,
        banco_promerica: false,
        banco_scotiabank: false,
      },
    });
    expect(page.isAllBanksSelected).toBe(false);

    // Act
    page.toggleAllBanks();

    // Assert
    const values = page.getValues();
    expect(values.banco_bac).toBe(true);
    expect(values.banco_bncr).toBe(true);
    expect(values.banco_carro_facil).toBe(true);
    expect(values.banco_promerica).toBe(true);
    expect(values.banco_scotiabank).toBe(true);
    expect(page.isAllBanksSelected).toBe(true);
  });

  it('toggles all 5 banks on first call and deselects all on second call sequentially', () => {
    // Arrange
    const page = BankAuthorizationsViewModelPageObject.render();
    expect(page.isAllBanksSelected).toBe(false);

    // Act 1 - Select all
    page.toggleAllBanks();

    // Assert 1
    let values = page.getValues();
    expect(values.banco_bac).toBe(true);
    expect(values.banco_bncr).toBe(true);
    expect(values.banco_carro_facil).toBe(true);
    expect(values.banco_promerica).toBe(true);
    expect(values.banco_scotiabank).toBe(true);
    expect(page.isAllBanksSelected).toBe(true);

    // Act 2 - Deselect all
    page.toggleAllBanks();

    // Assert 2
    values = page.getValues();
    expect(values.banco_bac).toBe(false);
    expect(values.banco_bncr).toBe(false);
    expect(values.banco_carro_facil).toBe(false);
    expect(values.banco_promerica).toBe(false);
    expect(values.banco_scotiabank).toBe(false);
    expect(page.isAllBanksSelected).toBe(false);
  });

  it('invokes onSuccess callback with valid form data when handleNext is executed', async () => {
    // Arrange
    const onSuccessMock = jest.fn();
    const page = BankAuthorizationsViewModelPageObject.render({
      defaultValues: validFormData,
      onSuccess: onSuccessMock,
    });

    await page.waitForValid(true);

    // Act
    await page.handleNext();

    // Assert
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledWith(validFormData);
    expect(page.isSubmitting).toBe(false);
  });
});
