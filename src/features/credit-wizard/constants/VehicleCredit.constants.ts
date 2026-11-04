export const VEHICLE_BRANDS = [
  'BYD',
  'Foton',
  'Baic',
  'Kaiyi',
  'Wuling',
] as const;

export type VehicleBrand = (typeof VEHICLE_BRANDS)[number];

export const FINANCING_TERMS = [
  '12 Meses (1 Año)',
  '24 Meses (2 Años)',
  '36 Meses (3 Años)',
  '48 Meses (4 Años)',
  '60 Meses (5 Años)',
  '72 Meses (6 Años)',
  '84 Meses (7 Años)',
  '96 Meses (8 Años)',
] as const;

export type FinancingTerm = (typeof FINANCING_TERMS)[number];

export const VEHICLE_CREDIT_SUBMIT_DELAY_MS = 500;
