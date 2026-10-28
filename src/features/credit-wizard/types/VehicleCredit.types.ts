export type VehicleCreditCurrency = 'USD' | 'CRC';

export interface VehicleCreditFormValues {
  marca: string;
  modelo: string;
  color_ano: string;
  moneda: VehicleCreditCurrency;
  valor_vehiculo: number;
  monto_prima: number;
  monto_financiar: number;
  plazo_meses: number;
}
