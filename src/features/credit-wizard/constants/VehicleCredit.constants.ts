import type { CustomSelectOption } from '@/shared/ui';

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

export const CURRENCY_OPTIONS: readonly CustomSelectOption[] = [
  { label: 'Dólares (USD)', value: 'USD' },
  { label: 'Colones (CRC)', value: 'CRC' },
] as const;

export const VEHICLE_CREDIT_SUBMIT_DELAY_MS = 500;

export const VEHICLE_CREDIT_STEP_COLORS = {
  ICON_COLOR: '#111111',
} as const;

export const VEHICLE_CREDIT_STEP_COPY = {
  ANIO_LABEL: 'Año',
  ANIO_PLACEHOLDER: '2024',
  COLOR_LABEL: 'Color',
  COLOR_PLACEHOLDER: 'Ej. Blanco',
  DERIVED_MONTO_FINANCIAR_HELPER: 'Calculado automáticamente',
  DERIVED_MONTO_FINANCIAR_LABEL: 'Monto a Financiar',
  DESCRIPTION:
    'Ingresa las especificaciones del vehículo y el plan de financiamiento requerido.',
  MARCA_LABEL: 'Marca',
  MARCA_MODAL_TITLE: 'Seleccione la Marca',
  MARCA_PLACEHOLDER: 'Seleccione la marca',
  MODELO_LABEL: 'Modelo',
  MODELO_PLACEHOLDER: 'Ej. S1 Pro, Denza, BJ41',
  MONEDA_LABEL: 'Moneda',
  MONEDA_MODAL_TITLE: 'Seleccione la Moneda',
  MONEDA_PLACEHOLDER: 'Seleccione la moneda',
  MONTO_PRIMA_HELPER: '10% de prima mínima permitida',
  MONTO_PRIMA_LABEL: 'Monto de Prima',
  MONTO_PRIMA_PLACEHOLDER: '0',
  PLAZO_MESES_LABEL: 'Plazo en Meses',
  PLAZO_MESES_MODAL_TITLE: 'Seleccione el Plazo',
  PLAZO_MESES_PLACEHOLDER: 'Seleccione el plazo',
  SECTION_1_TITLE: '1. ESPECIFICACIONES DE LA UNIDAD',
  SECTION_2_TITLE: '2. PLAN DE FINANCIAMIENTO',
  SUBMIT_BUTTON: 'Siguiente',
  TITLE: 'Vehículo y Crédito',
  VALOR_VEHICULO_LABEL: 'Valor del Vehículo',
  VALOR_VEHICULO_PLACEHOLDER: '0',
} as const;

export const VEHICLE_CREDIT_STEP_NUMERICAL = {
  CURRENT_STEP: 3,
  ICON_SIZE: 20,
  ICON_STROKE_WIDTH: 2,
  MAX_LENGTH_YEAR: 4,
  TOTAL_STEPS: 4,
} as const;

export const VEHICLE_CREDIT_STEP_STYLES = {
  CARD_CONTAINER: 'w-full rounded-2xl bg-stone-200 p-4 gap-4',
  CONTAINER: 'w-full gap-4',
} as const;
