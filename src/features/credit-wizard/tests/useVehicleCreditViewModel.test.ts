import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
  VEHICLE_COLORS_YEARS,
  VEHICLE_MODELS,
} from '../constants/VehicleCredit.constants';
import { VehicleCreditViewModelPageObject } from './useVehicleCreditViewModel.po';

describe('useVehicleCreditViewModel Unit Tests', () => {
  describe('catalog constants exposure', () => {
    it('exposes the required brands, colors/years, and financing terms', () => {
      const page = VehicleCreditViewModelPageObject.render();

      expect(page.current.brands).toEqual(VEHICLE_BRANDS);
      expect(page.current.vehicleBrands).toEqual(VEHICLE_BRANDS);
      expect(page.current.colorsYears).toEqual(VEHICLE_COLORS_YEARS);
      expect(page.current.vehicleColorsYears).toEqual(VEHICLE_COLORS_YEARS);
      expect(page.current.availableColorsYears).toEqual(VEHICLE_COLORS_YEARS);
      expect(page.current.financingTerms).toEqual(FINANCING_TERMS);
    });

    it('derives empty availableModels when marca is not selected or empty', () => {
      const page = VehicleCreditViewModelPageObject.render();

      expect(page.current.availableModels).toEqual([]);
    });

    it('derives correct models for each supported brand', () => {
      const bydPage = VehicleCreditViewModelPageObject.render({
        defaultValues: { marca: 'BYD' },
      });
      expect(bydPage.current.availableModels).toEqual(VEHICLE_MODELS.BYD);

      const fotonPage = VehicleCreditViewModelPageObject.render({
        defaultValues: { marca: 'Foton' },
      });
      expect(fotonPage.current.availableModels).toEqual(VEHICLE_MODELS.Foton);

      const baicPage = VehicleCreditViewModelPageObject.render({
        defaultValues: { marca: 'Baic' },
      });
      expect(baicPage.current.availableModels).toEqual(VEHICLE_MODELS.Baic);

      const kaiyiPage = VehicleCreditViewModelPageObject.render({
        defaultValues: { marca: 'Kaiyi' },
      });
      expect(kaiyiPage.current.availableModels).toEqual([]);

      const wulingPage = VehicleCreditViewModelPageObject.render({
        defaultValues: { marca: 'Wuling' },
      });
      expect(wulingPage.current.availableModels).toEqual([]);
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

      expect(page.current.availableModels).toEqual(VEHICLE_MODELS.BYD);
    });

    it('automatically resets modelo to empty string when marca changes', async () => {
      const page = VehicleCreditViewModelPageObject.render({
        defaultValues: {
          marca: 'BYD',
          modelo: 'S1 Pro',
        },
      });

      expect(page.current.availableModels).toEqual(VEHICLE_MODELS.BYD);

      await page.setFieldValue('marca', 'Foton');

      expect(page.current.availableModels).toEqual(VEHICLE_MODELS.Foton);
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
  });

  describe('form submission', () => {
    it('calls onSuccess with valid form data upon handleNext', async () => {
      const onSuccessMock = jest.fn();
      const validData = {
        color_ano: 'Blanco (2024)',
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
          color_ano: 'Blanco (2024)',
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
