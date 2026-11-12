import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
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
  anio: '2024',
  color: 'Blanco',
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

    it('exports the required financing terms catalog', () => {
      expect(FINANCING_TERMS).toEqual([
        '12 Meses (1 Año)',
        '24 Meses (2 Años)',
        '36 Meses (3 Años)',
        '48 Meses (4 Años)',
        '60 Meses (5 Años)',
        '72 Meses (6 Años)',
        '84 Meses (7 Años)',
        '96 Meses (8 Años)',
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

    it('accepts masked currency strings and coerces them via parseCurrencyToNumber', () => {
      const validPayload = createValidVehicleCredit({
        monto_financiar: '18.000',
        monto_prima: '2.000',
        valor_vehiculo: '20.000',
      });
      const result = vehicleCreditSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('accepts masked currency strings with decimals', () => {
      const validPayload = createValidVehicleCredit({
        monto_financiar: '4.774.500,22',
        monto_prima: '530.500,03',
        valor_vehiculo: '5.305.000,25',
      });
      const result = vehicleCreditSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('accepts 96 Meses (8 Años) as a valid plazo_meses string', () => {
      const validPayload = createValidVehicleCredit({
        plazo_meses: '96 Meses (8 Años)',
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
    describe('Rule A: Minimum 10% Downpayment (monto_prima)', () => {
      it('fails validation when monto_prima is strictly less than 10% of valor_vehiculo', () => {
        const invalidPayload = createValidVehicleCredit({
          monto_financiar: 18001,
          monto_prima: 1999,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        const primaErrors = getMessages(result, ['monto_prima']);
        expect(primaErrors).toContain('10% de prima mínima permitida');
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
        expect(primaErrors).toContain('10% de prima mínima permitida');
      });

      it('passes validation when monto_prima is exactly 10% of valor_vehiculo', () => {
        const validPayload = createValidVehicleCredit({
          monto_financiar: 18000,
          monto_prima: 2000,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(validPayload);

        expect(result.success).toBe(true);
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
          monto_prima: 1000,
          valor_vehiculo: 20000,
        });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['monto_prima'])).toContain(
          '10% de prima mínima permitida',
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

    describe('mandatory strings (marca, modelo, color, anio)', () => {
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

      it('fails when color is empty or only whitespace', () => {
        const invalidPayload = createValidVehicleCredit({ color: '  ' });
        const result = vehicleCreditSchema.safeParse(invalidPayload);

        expect(result.success).toBe(false);
        expect(getMessages(result, ['color'])).toContain(
          'El color es obligatorio.',
        );
      });

      it('fails when anio is not a 4-digit number', () => {
        const invalidLengths = ['20', '202', '20245', 'abcd', '   '];
        invalidLengths.forEach((anioVal) => {
          const invalidPayload = createValidVehicleCredit({ anio: anioVal });
          const result = vehicleCreditSchema.safeParse(invalidPayload);

          expect(result.success).toBe(false);
          expect(getMessages(result, ['anio'])).toContain(
            'Debe ser un año válido.',
          );
        });
      });

      it('passes when anio is a valid 4-digit year string', () => {
        const validPayload = createValidVehicleCredit({ anio: '2025' });
        const result = vehicleCreditSchema.safeParse(validPayload);

        expect(result.success).toBe(true);
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
