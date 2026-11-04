export type VehicleCreditCurrency = 'USD' | 'CRC';

export interface VehicleCreditFormValues {
  color_ano: string;
  marca: string;
  modelo: string;
  moneda: VehicleCreditCurrency;
  monto_financiar: number;
  monto_prima: number;
  plazo_meses: number | string;
  valor_vehiculo: number;
}
