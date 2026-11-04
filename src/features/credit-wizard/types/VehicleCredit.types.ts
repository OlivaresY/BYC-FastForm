export type VehicleCreditCurrency = 'USD' | 'CRC';

export interface VehicleCreditFormValues {
  anio: string;
  color: string;
  marca: string;
  modelo: string;
  moneda: VehicleCreditCurrency;
  monto_financiar: number | string;
  monto_prima: number | string;
  plazo_meses: number | string;
  valor_vehiculo: number | string;
}
