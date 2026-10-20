import type { VehicleBeneficiaryType } from '../types/VehicleBeneficiarySection.types';

export const VEHICLE_BENEFICIARY_SECTION_COLORS = {
  ACTIVE_BORDER: '#B91C1C',
  ACTIVE_ICON_STROKE: '#B91C1C',
  ACTIVE_TEXT: '#111111',
  CAR_ICON_STROKE: '#111111',
  INACTIVE_BORDER: '#E5E7EB',
  INACTIVE_ICON_STROKE: '#5A6B80',
  INACTIVE_TEXT: '#5A6B80',
  PROMPT_COLOR: '#5A6B80',
  TITLE_COLOR: '#111111',
} as const;

export const VEHICLE_BENEFICIARY_SECTION_COPY = {
  HEADER_TITLE: 'INSCRIPCIÓN DEL VEHÍCULO (BENEFICIARIO FINAL)',
  PROMPT: '¿El vehículo se inscribirá a nombre del solicitante principal?',
  SAME_HOLDER_LABEL: 'Sí, mismo titular',
  THIRD_PARTY_LABEL: 'No, a nombre de un tercero',
} as const;

export const VEHICLE_BENEFICIARY_SECTION_ENTITIES = {
  SAME_HOLDER: 'same_holder',
  THIRD_PARTY: 'third_party',
} as const satisfies Record<string, VehicleBeneficiaryType>;

export const VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS = {
  CAR_ICON_SIZE_PX: 18,
  OPTION_ICON_SIZE_PX: 18,
  STROKE_WIDTH_PX: 2,
  VIEW_BOX: '0 0 24 24',
} as const;

export const VEHICLE_BENEFICIARY_SECTION_STYLES = {
  ACTIVE_BUTTON: 'border-brand-red',
  ACTIVE_LABEL: 'text-text-primary font-bold',
  BUTTON_BASE:
    'flex-1 min-h-[48px] min-w-[48px] flex-row items-center justify-center rounded-xl border bg-white px-3 py-2.5 gap-2',
  BUTTON_DISABLED: 'opacity-40',
  CONTAINER: 'w-full',
  HEADER_ROW: 'flex-row items-center gap-2 mb-1',
  HEADER_TITLE: 'text-xs font-bold tracking-wider text-text-primary',
  INACTIVE_BUTTON: 'border-gray-200',
  INACTIVE_LABEL: 'text-text-secondary font-medium',
  LABEL_BASE: 'flex-shrink text-center text-sm',
  PROMPT: 'mb-3 text-sm font-normal text-text-secondary',
  SELECTOR_ROW: 'flex-row gap-3',
} as const;

export const VEHICLE_BENEFICIARY_SECTION_SVG_ATTRIBUTES = {
  FILL_NONE: 'none',
  STROKE_LINE_CAP: 'round',
  STROKE_LINE_JOIN: 'round',
} as const;

export const VEHICLE_BENEFICIARY_SECTION_TEST_IDS = {
  CAR_ICON: 'vehicle-beneficiary-section-car-icon',
  CONTAINER: 'vehicle-beneficiary-section-container',
  HEADER_ROW: 'vehicle-beneficiary-section-header-row',
  HEADER_TITLE: 'vehicle-beneficiary-section-header-title',
  PROMPT: 'vehicle-beneficiary-section-prompt',
  SAME_HOLDER_BUTTON: 'vehicle-beneficiary-section-same-holder-button',
  SAME_HOLDER_ICON: 'vehicle-beneficiary-section-same-holder-icon',
  SAME_HOLDER_LABEL: 'vehicle-beneficiary-section-same-holder-label',
  THIRD_PARTY_BUTTON: 'vehicle-beneficiary-section-third-party-button',
  THIRD_PARTY_ICON: 'vehicle-beneficiary-section-third-party-icon',
  THIRD_PARTY_LABEL: 'vehicle-beneficiary-section-third-party-label',
} as const;
