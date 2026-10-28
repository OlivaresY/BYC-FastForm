import { z } from 'zod';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';

export const vehicleCreditSchema: z.ZodType<VehicleCreditFormValues> = z
  .object({
    color_ano: z
      .string({
        error: 'El color y año son obligatorios.',
      })
      .trim()
      .min(1, {
        message: 'El color y año son obligatorios.',
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
    monto_financiar: z.number({
      error: 'El monto a financiar es obligatorio.',
    }),
    monto_prima: z
      .number({
        error: 'El monto de la prima es obligatorio.',
      })
      .min(0, {
        message: 'El monto de la prima debe ser mayor o igual a 0.',
      }),
    plazo_meses: z
      .number({
        error: 'El plazo en meses es obligatorio.',
      })
      .gt(0, {
        message: 'El plazo en meses debe ser mayor a 0.',
      }),
    valor_vehiculo: z
      .number({
        error: 'El valor del vehículo es obligatorio.',
      })
      .gt(0, {
        message: 'El valor del vehículo debe ser mayor a 0.',
      }),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data.valor_vehiculo === 'number' &&
      typeof data.monto_prima === 'number'
    ) {
      const minPrima = data.valor_vehiculo * 0.2;
      if (data.monto_prima < minPrima) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La prima debe ser al menos el 20% del valor del vehículo.',
          path: ['monto_prima'],
        });
      }
    }

    if (
      typeof data.valor_vehiculo === 'number' &&
      typeof data.monto_prima === 'number' &&
      typeof data.monto_financiar === 'number'
    ) {
      const expectedMontoFinanciar = data.valor_vehiculo - data.monto_prima;
      const isExactMatch =
        data.monto_financiar === expectedMontoFinanciar ||
        Math.abs(data.monto_financiar - expectedMontoFinanciar) <
          Number.EPSILON;

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
