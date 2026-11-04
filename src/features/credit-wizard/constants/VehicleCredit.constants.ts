export const VEHICLE_BRANDS = [
  'BYD',
  'Foton',
  'Baic',
  'Kaiyi',
  'Wuling',
] as const;

export type VehicleBrand = (typeof VEHICLE_BRANDS)[number];

export const VEHICLE_MODELS: Record<VehicleBrand, readonly string[]> = {
  Baic: ['BJ30'],
  BYD: ['S1 Pro', 'Yuan Plus EV (Atto 3)'],
  Foton: ['Tunland G7'],
  Kaiyi: [],
  Wuling: [],
} as const;

export const VEHICLE_COLORS_YEARS = [
  'Gris Metálico (2024)',
  'Blanco (2024)',
  'Negro (2025)',
  'Rojo (2024)',
  'Azul (2024)',
] as const;

export type VehicleColorYear = (typeof VEHICLE_COLORS_YEARS)[number];

export const FINANCING_TERMS = [
  '12 Meses (1 Año)',
  '24 Meses (2 Años)',
  '36 Meses (3 Años)',
  '48 Meses (4 Años)',
  '60 Meses (5 Años)',
  '72 Meses (6 Años)',
  '84 Meses (7 Años)',
] as const;

export type FinancingTerm = (typeof FINANCING_TERMS)[number];

export const VEHICLE_CREDIT_SUBMIT_DELAY_MS = 500;
