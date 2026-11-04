import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
  VEHICLE_COLORS_YEARS,
  VEHICLE_MODELS,
  vehicleCreditSchema,
} from './VehicleCredit.schema';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';

const getMessages = (
  result: ReturnType<typeof vehicleCreditSchema.safeParse>,
  path: (number | string)[],
): string[] => {
  if (result.success) {
    return [];
  }
  return result.error.issues
    .filter((issue) => issue.path.join('.') === path.join('.'))
    .map((issue) => issue.message);
};

const createValidVehicleCredit = (
  overrides?: Partial<VehicleCreditFormValues>,
): VehicleCreditFormValues => ({
  color_ano: 'Blanco 2024',
  marca: 'Toyota',
  modelo: 'Corolla',
  moneda: 'USD',
  monto_financiar: 16000,
  monto_prima: 4000,
  plazo_meses: 60,
  valor_vehiculo: 20000,
  ...overrides,
});

describe('VehicleCredit Schema Validation', () => {
  describe('catalogs and constants export', () => {
    it('exports the required vehicle brands catalog', () => {
      expect(VEHICLE_BRANDS).toEqual([
        'BYD',
        'Foton',
        'Baic',
        'Kaiyi',
        'Wuling',
      ]);
    });

    it('exports the required vehicle models mapping with correct models', () => {
      expect(VEHICLE_MODELS.BYD).toEqual(['S1 Pro', 'Yuan Plus EV (Atto 3)']);
      expect(VEHICLE_MODELS.Foton).toEqual(['Tunland G7']);
      expect(VEHICLE_MODELS.Baic).toEqual(['BJ30']);
      expect(VEHICLE_MODELS.Kaiyi).toEqual([]);
      expect(VEHICLE_MODELS.Wuling).toEqual([]);
    });

    it('exports the required colors and years catalog', () => {
      expect(VEHICLE_COLORS_YEARS).toEqual([
        'Gris Metálico (2024)',
        'Blanco (2024)',
        'Negro (2025)',
        'Rojo (2024)',
        'Azul (2024)',
      ]);
    });

    it('exports the required financing terms catalog', () => {
      expect(FINANCING_TERMS).toEqual([
        '12 Meses (1 Año)',
        '24 Meses (2 Años)',
        '36 Meses (3 Años)',
        '48 Meses (4 Años)',
        '60 Meses (5 Años)',
        '72 Meses (6 Años)',
        '84 Meses (7 Años)',
      ]);
    });
  });

  describe('valid payloads', () => {
    it('passes validation when all fields are valid, monto_prima is exactly 20%, and monto_financiar math is exact', () => {
      const validPayload = createValidVehicleCredit();
      const result = vehicleCreditSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('passes validation when monto_prima is > 20% (e.g., 50%) and monto_financiar is correctly derived', () => {
      const validPayload = createValidVehicleCredit({
        monto_financiar: 15000,
        monto_prima: 15000,
        valor_vehiculo: 30000,
      });
      const result = vehicleCreditSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('accepts CRC currency as valid', () => {
      const validPayload = createValidVehicleCredit({
        moneda: 'CRC',
        monto_financiar: 8000000,
        monto_prima: 2000000,
        valor_vehiculo: 10000000,
      });
      const result = vehicleCreditSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('accepts every string term from FINANCING_TERMS as a valid plazo_meses', () => {
      FINANCING_TERMS.forEach((term) => {
        const validPayload = createValidVehicleCredit({
          plazo_meses: term,
        });
        const result = vehicleCreditSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('financial rules enforcement', () => {
    describe('Rule A: Minimum 20% Downpayment (monto_prima)', () => {
      it('fails validation when monto_prima is strictly less than 20% of valor_vehiculo', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 16001,
          monto_prima: 3999,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        const primaErrors = getMessages(result, ['monto_prima']);
        expect(primaErrors).toContain(
          'La prima debe ser al menos el 20% del valor del vehículo.',
        );
      });

      it('fails validation when monto_prima is 0 while valor_vehiculo > 0', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 20000,
          monto_prima: 0,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        const primaErrors = getMessages(result, ['monto_prima']);
        expect(primaErrors).toContain(
          'La prima debe ser al menos el 20% del valor del vehículo.',
        );
      });
    });

    describe('Rule B: Exact Financing Balance (monto_financiar)', () => {
      it('fails validation when monto_financiar does not match valor_vehiculo - monto_prima', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 15000,
          monto_prima: 4000,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        const financiarErrors = getMessages(result, ['monto_financiar']);
        expect(financiarErrors).toContain(
          'El monto a financiar debe ser exactamente igual al valor del vehículo menos la prima.',
        );
      });

      it('fails validation when both Rule A and Rule B are violated simultaneously', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 15000,
          monto_prima: 2000,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['monto_prima'])).toContain(
          'La prima debe ser al menos el 20% del valor del vehículo.',
        );
        expect(getMessages(result, ['monto_financiar'])).toContain(
          'El monto a financiar debe ser exactamente igual al valor del vehículo menos la prima.',
        );
      });
    });
  });

  describe('field-level validations', () => {
    describe('currency (moneda)', () => {
      it('fails when moneda is not USD or CRC (e.g. EUR)', () => {
        const invalidPayload = {
          ...createValidVehicleCredit(),
          moneda: 'EUR' as unknown as 'USD',
        };
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['moneda'])).toContain(
          'Seleccione una moneda válida (USD o CRC).',
        );
      });
    });

    describe('mandatory strings (marca, modelo, color_ano)', () => {
      it('fails when marca is empty or only whitespace', () => {
        const invalidPayload = createValidVehicleCredit({ marca: '   ' });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['marca'])).toContain(
          'La marca es obligatoria.',
        );
      });

      it('fails when modelo is empty or only whitespace', () => {
        const invalidPayload = createValidVehicleCredit({ modelo: '' });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['modelo'])).toContain(
          'El modelo es obligatorio.',
        );
      });

      it('fails when color_ano is empty or only whitespace', () => {
        const invalidPayload = createValidVehicleCredit({ color_ano: '  ' });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['color_ano'])).toContain(
          'El color y año son obligatorios.',
        );
      });
    });

    describe('numeric constraints and plazo_meses', () => {
      it('fails when valor_vehiculo is 0 or negative', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 0,
          monto_prima: 0,
          valor_vehiculo: 0,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['valor_vehiculo'])).toContain(
          'El valor del vehículo debe ser mayor a 0.',
        );
      });

      it('fails when monto_prima is negative', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 20100,
          monto_prima: -100,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['monto_prima'])).toContain(
          'El monto de la prima debe ser mayor o igual a 0.',
        );
      });

      it('fails when plazo_meses is 0 or negative', () => {
        const invalidPayload = createValidVehicleCredit({ plazo_meses: 0 });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['plazo_meses'])).toContain(
          'El plazo en meses debe ser mayor a 0.',
        );
      });

      it('fails when plazo_meses is an empty string or whitespace', () => {
        const invalidPayload = createValidVehicleCredit({ plazo_meses: '   ' });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['plazo_meses'])).toContain(
          'El plazo en meses es obligatorio.',
        );
      });
    });
  });
});
