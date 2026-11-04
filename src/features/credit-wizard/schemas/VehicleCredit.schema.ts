import { z } from 'zod';
import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
} from '../constants/VehicleCredit.constants';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { parseCurrencyToNumber } from '../utils/vehicleCreditFormatters';

export { FINANCING_TERMS, VEHICLE_BRANDS };

export const vehicleCreditSchema: z.ZodType<VehicleCreditFormValues> = z
  .object({
    anio: z
      .string({
        error: 'El año es obligatorio.',
      })
      .trim()
      .length(4, {
        message: 'Debe ser un año válido.',
      })
      .regex(/^\d+$/, {
        message: 'Debe ser un año válido.',
      }),
    color: z
      .string({
        error: 'El color es obligatorio.',
      })
      .trim()
      .min(1, {
        message: 'El color es obligatorio.',
      }),
    marca: z
      .string({
        error: 'La marca es obligatoria.',
      })
      .trim()
      .min(1, {
        message: 'La marca es obligatoria.',
      }),
    modelo: z
      .string({
        error: 'El modelo es obligatorio.',
      })
      .trim()
      .min(1, {
        message: 'El modelo es obligatorio.',
      }),
    moneda: z.enum(['USD', 'CRC'], {
      error: 'Seleccione una moneda válida (USD o CRC).',
    }),
    monto_financiar: z.preprocess(
      (val) => parseCurrencyToNumber(val),
      z.number({
        error: 'El monto a financiar es obligatorio.',
      }),
    ),
    monto_prima: z.preprocess(
      (val) => parseCurrencyToNumber(val),
      z
        .number({
          error: 'El monto de la prima es obligatorio.',
        })
        .min(0, {
          message: 'El monto de la prima debe ser mayor o igual a 0.',
        }),
    ),
    plazo_meses: z.preprocess(
      (val) => (typeof val === 'number' ? String(val) : val),
      z
        .string({
          error: 'El plazo en meses es obligatorio.',
        })
        .trim()
        .min(1, {
          message: 'El plazo en meses es obligatorio.',
        }),
    ),
    valor_vehiculo: z.preprocess(
      (val) => parseCurrencyToNumber(val),
      z
        .number({
          error: 'El valor del vehículo es obligatorio.',
        })
        .gt(0, {
          message: 'El valor del vehículo debe ser mayor a 0.',
        }),
    ),
  })
  .superRefine((data, ctx) => {
    const numValor = parseCurrencyToNumber(data.valor_vehiculo);
    const numPrima = parseCurrencyToNumber(data.monto_prima);
    const numFinanciar = parseCurrencyToNumber(data.monto_financiar);

    if (numValor > 0) {
      const minPrima = numValor * 0.1;
      if (numPrima < minPrima) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '10% de prima mínima permitida',
          path: ['monto_prima'],
        });
      }

      const expectedMontoFinanciar = Math.max(0, numValor - numPrima);
      const isExactMatch =
        numFinanciar === expectedMontoFinanciar ||
        Math.abs(numFinanciar - expectedMontoFinanciar) < Number.EPSILON;

      if (!isExactMatch) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'El monto a financiar debe ser exactamente igual al valor del vehículo menos la prima.',
          path: ['monto_financiar'],
        });
      }
    }
  });

export const VehicleCreditSchema = vehicleCreditSchema;
