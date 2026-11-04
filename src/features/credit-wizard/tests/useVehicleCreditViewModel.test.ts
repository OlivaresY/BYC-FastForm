import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
} from '../constants/VehicleCredit.constants';
import {
  formatCapitalizeWords,
  formatCurrencyDisplay,
  formatYear,
  parseCurrencyToNumber,
} from '../hooks/useVehicleCreditViewModel';
import { VehicleCreditViewModelPageObject } from './useVehicleCreditViewModel.po';

describe('useVehicleCreditViewModel Unit Tests', () => {
  describe('catalog constants exposure', () => {
    it('exposes the required brands and financing terms', () => {
      const page = VehicleCreditViewModelPageObject.render();

      expect(page.current.brands).toEqual(VEHICLE_BRANDS);
      expect(page.current.vehicleBrands).toEqual(VEHICLE_BRANDS);
      expect(page.current.financingTerms).toEqual(FINANCING_TERMS);
    });

    it('sets default plazo_meses to 96 Meses (8 Años)', () => {
      const page = VehicleCreditViewModelPageObject.render();
      expect(page.getFieldValue('plazo_meses')).toBe('96 Meses (8 Años)');
    });
  });

  describe('formatting utility functions', () => {
    describe('formatCapitalizeWords', () => {
      it('capitalizes the first letter of each word and allows numbers', () => {
        expect(formatCapitalizeWords('s1 pro')).toBe('S1 Pro');
        expect(formatCapitalizeWords('toyota corolla cross')).toBe(
          'Toyota Corolla Cross',
        );
        expect(formatCapitalizeWords('bj30')).toBe('Bj30');
      });

      it('removes leading spaces and collapses multiple spaces into one', () => {
        expect(formatCapitalizeWords('   s1    pro')).toBe('S1 Pro');
      });

      it('preserves single trailing space while typing', () => {
        expect(formatCapitalizeWords('S1 ')).toBe('S1 ');
      });

      it('handles empty strings safely', () => {
        expect(formatCapitalizeWords('')).toBe('');
      });
    });

    describe('formatYear', () => {
      it('strips non-numeric characters and limits length to 4 digits', () => {
        expect(formatYear('2024abc')).toBe('2024');
        expect(formatYear('abcd')).toBe('');
        expect(formatYear('202456')).toBe('2024');
      });

      it('handles partial year typing', () => {
        expect(formatYear('20')).toBe('20');
        expect(formatYear('202')).toBe('202');
      });

      it('handles empty strings safely', () => {
        expect(formatYear('')).toBe('');
      });
    });

    describe('formatCurrencyDisplay', () => {
      it('formats raw number strings into Costa Rican / European format (dots for thousands, comma for decimals)', () => {
        expect(formatCurrencyDisplay('5305000.25')).toBe('5.305.000,25');
        expect(formatCurrencyDisplay(5305000.25)).toBe('5.305.000,25');
        expect(formatCurrencyDisplay('5305000')).toBe('5.305.000');
        expect(formatCurrencyDisplay(5305000)).toBe('5.305.000');
      });

      it('handles dynamic typing by preserving trailing commas and dots while typing decimals', () => {
        expect(formatCurrencyDisplay('500,')).toBe('500,');
        expect(formatCurrencyDisplay('500.')).toBe('500,');
        expect(formatCurrencyDisplay('10.000.')).toBe('10.000,');
        expect(formatCurrencyDisplay('500,2')).toBe('500,2');
        expect(formatCurrencyDisplay('500,25')).toBe('500,25');
      });

      it('treats single-dot thousands and backspaced groups as integers', () => {
        expect(formatCurrencyDisplay('20.000')).toBe('20.000');
        expect(formatCurrencyDisplay('10.00')).toBe('1.000');
        expect(formatCurrencyDisplay('2.00')).toBe('200');
        expect(parseCurrencyToNumber('20.000')).toBe(20000);
        expect(parseCurrencyToNumber('10.000')).toBe(10000);
      });

      it('handles empty, zero, and boundary inputs gracefully', () => {
        expect(formatCurrencyDisplay('')).toBe('');
        expect(formatCurrencyDisplay(0)).toBe('0');
        expect(formatCurrencyDisplay('0,')).toBe('0,');
      });
    });

    describe('parseCurrencyToNumber', () => {
      it('converts formatted Costa Rican currency strings back to JS numbers', () => {
        expect(parseCurrencyToNumber('5.305.000,25')).toBe(5305000.25);
        expect(parseCurrencyToNumber('5.305.000')).toBe(5305000);
        expect(parseCurrencyToNumber('500,')).toBe(500);
      });

      it('handles raw numbers and empty inputs safely', () => {
        expect(parseCurrencyToNumber(20000)).toBe(20000);
        expect(parseCurrencyToNumber(5305000.25)).toBe(5305000.25);
        expect(parseCurrencyToNumber('')).toBe(0);
      });
    });
  });

  describe('dependency logic (marca -> modelo auto-reset)', () => {
    it('does not reset initial valid model on initial hook mount', () => {
      const page = VehicleCreditViewModelPageObject.render({
        defaultValues: {
          marca: 'BYD',
          modelo: 'S1 Pro',
        },
      });

      expect(page.getFieldValue('modelo')).toBe('S1 Pro');
    });

    it('automatically resets modelo to empty string when marca changes', async () => {
      const page = VehicleCreditViewModelPageObject.render({
        defaultValues: {
          marca: 'BYD',
          modelo: 'S1 Pro',
        },
      });

      expect(page.getFieldValue('modelo')).toBe('S1 Pro');

      await page.setFieldValue('marca', 'Foton');

      expect(page.getFieldValue('modelo')).toBe('');
    });
  });

  describe('financial calculations', () => {
    it('calculates derivedMontoFinanciar and updates monto_financiar when handleFinancialChange is called', async () => {
      const page = VehicleCreditViewModelPageObject.render();

      await page.handleFinancialChange('valor_vehiculo', 30000);
      expect(page.current.derivedMontoFinanciar).toBe(30000);

      await page.handleFinancialChange('monto_prima', 6000);
      expect(page.current.derivedMontoFinanciar).toBe(24000);
    });

    it('automatically calculates monto_financiar via useEffect when inputs change', async () => {
      const page = VehicleCreditViewModelPageObject.render();

      await page.setFieldValue('valor_vehiculo', 25000);
      await page.setFieldValue('monto_prima', 5000);

      expect(page.getFieldValue('monto_financiar')).toBe('20.000');
      expect(parseCurrencyToNumber(page.getFieldValue('monto_financiar'))).toBe(
        20000,
      );
    });

    it('clamps monto_financiar to 0 if monto_prima exceeds valor_vehiculo', async () => {
      const page = VehicleCreditViewModelPageObject.render();

      await page.setFieldValue('valor_vehiculo', 10000);
      await page.setFieldValue('monto_prima', 15000);

      expect(page.getFieldValue('monto_financiar')).toBe('0');
      expect(parseCurrencyToNumber(page.getFieldValue('monto_financiar'))).toBe(
        0,
      );
      expect(page.current.derivedMontoFinanciar).toBe(0);
    });
  });

  describe('form submission', () => {
    it('calls onSuccess with valid form data upon handleNext', async () => {
      const onSuccessMock = jest.fn();
      const validData = {
        anio: '2024',
        color: 'Blanco',
        marca: 'BYD',
        modelo: 'S1 Pro',
        moneda: 'USD' as const,
        monto_financiar: 16000,
        monto_prima: 4000,
        plazo_meses: '60 Meses (5 Años)',
        valor_vehiculo: 20000,
      };

      const page = VehicleCreditViewModelPageObject.render({
        defaultValues: validData,
        onSuccess: onSuccessMock,
      });

      await page.handleNext();

      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({
          anio: '2024',
          color: 'Blanco',
          marca: 'BYD',
          modelo: 'S1 Pro',
          moneda: 'USD',
          monto_financiar: 16000,
          monto_prima: 4000,
          plazo_meses: '60 Meses (5 Años)',
          valor_vehiculo: 20000,
        }),
      );
    });
  });
});
