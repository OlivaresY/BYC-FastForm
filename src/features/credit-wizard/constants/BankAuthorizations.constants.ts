import type React from 'react';
import { BanknoteIcon, BuildingIcon, CarIcon } from '@/shared/ui';
import type { IconProps } from '@/shared/ui/Icons/Icons.types';

export const BANK_AUTHORIZATIONS_STEP_COLORS = {
  CHECKBOX_ACTIVE: '#10B981',
  CHECKBOX_BORDER: '#A8A29E',
  CHECKBOX_ICON: '#FFFFFF',
  HEADER_ICON: '#111111',
  ICON_COLOR: '#111111',
  TOGGLE_ALL_ICON_ACTIVE: '#FFFFFF',
  TOGGLE_ALL_ICON_INACTIVE: '#44403C',
} as const;

export const BANK_AUTHORIZATIONS_STEP_COPY = {
  BANK_BAC_LABEL: 'BAC Credomatic',
  BANK_BNCR_LABEL: 'Banco Nacional (BNCR)',
  BANK_CARRO_FACIL_LABEL: 'Carro Fácil',
  BANK_PROMERICA_LABEL: 'Banco Promerica',
  BANK_SCOTIABANK_LABEL: 'Scotiabank',
  DESCRIPTION:
    'Selecciona las entidades financieras para la cotización simultánea y valida los consentimientos regulatorios corporativos requeridos.',
  LEGAL_DESC_1:
    'Conforme a la normativa de la Superintendencia General de Entidades Financieras de Costa Rica para verificar récord crediticio y endeudamiento global.',
  LEGAL_DESC_2:
    'Habilita la verificación de referencias comerciales, historial de pagos y expedición del reporte integral a las bancas seleccionadas.',
  LEGAL_TITLE_1:
    'El Representante Legal autoriza consulta al Centro de Información Crediticia (SUGEF - CIC)',
  LEGAL_TITLE_2:
    'El Representante Legal autoriza el análisis en Burós de Crédito y firmas protectoras',
  SECTION_1_HELPER: 'Entidades con pre-calificación activa',
  SECTION_1_TITLE: '1. BANCOS A COTIZAR',
  SECTION_2_HELPER: 'Requisito mandatorio para consulta interbancaria',
  SECTION_2_TITLE: '2. AUTORIZACIONES LEGALES (SUGEF / CIC)',
  SUBMIT_BUTTON_LABEL: 'Generar Documentos',
  TITLE: 'BANCOS Y AUTORIZACIONES',
  TOGGLE_ALL_BANKS: 'Todos',
} as const;

export const BANK_AUTHORIZATIONS_STEP_NUMERICAL = {
  CHECKBOX_HIT_AREA: 48,
  CHECKBOX_ICON_SIZE: 14,
  CHECKBOX_STROKE_WIDTH: 2.5,
  CURRENT_STEP: 4,
  HEADER_ICON_SIZE: 18,
  HEADER_ICON_STROKE_WIDTH: 2,
  ICON_SIZE: 20,
  ICON_STROKE_WIDTH: 2,
  SUBMIT_ICON_SIZE: 16,
  SUBMIT_ICON_STROKE_WIDTH: 2,
  TOGGLE_ALL_ICON_SIZE: 14,
  TOGGLE_ALL_ICON_STROKE_WIDTH: 2,
  TOTAL_STEPS: 4,
} as const;

export const BANK_AUTHORIZATIONS_STEP_STYLES = {
  CARD_CONTAINER: 'w-full rounded-2xl bg-stone-200 p-4 gap-4',
  CHECKBOX_BOX: 'h-6 w-6 rounded-md border items-center justify-center',
  CHECKBOX_BOX_ACTIVE: 'bg-emerald-600 border-emerald-600',
  CHECKBOX_BOX_INACTIVE: 'bg-white border-stone-400',
  CONTAINER: 'w-full gap-4',
  HEADER_ICON_BOX:
    'w-9 h-9 rounded-lg bg-white border border-stone-200 items-center justify-center',
  TOGGLE_ALL_BUTTON:
    'flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg border',
  TOGGLE_ALL_BUTTON_ACTIVE: 'bg-emerald-600 border-emerald-600',
  TOGGLE_ALL_BUTTON_INACTIVE: 'bg-white border-stone-300',
  TOGGLE_ALL_TEXT_ACTIVE: 'text-xs font-semibold text-white',
  TOGGLE_ALL_TEXT_INACTIVE: 'text-xs font-semibold text-stone-700',
} as const;

export const BANK_AUTHORIZATIONS_STEP_TEST_IDS = {
  AUTORIZA_BUROS_CREDITO_CHECKBOX:
    'bank-authorizations-autoriza-buros-credito-checkbox',
  AUTORIZA_BUROS_CREDITO_ERROR:
    'bank-authorizations-autoriza-buros-credito-error',
  AUTORIZA_SUGEF_CIC_CHECKBOX:
    'bank-authorizations-autoriza-sugef-cic-checkbox',
  AUTORIZA_SUGEF_CIC_ERROR: 'bank-authorizations-autoriza-sugef-cic-error',
  BANCO_BAC_CHECKBOX: 'bank-authorizations-banco-bac-checkbox',
  BANCO_BNCR_CHECKBOX: 'bank-authorizations-banco-bncr-checkbox',
  BANCO_CARRO_FACIL_CHECKBOX: 'bank-authorizations-banco-carro-facil-checkbox',
  BANCO_ERROR: 'bank-authorizations-banco-error',
  BANCO_PROMERICA_CHECKBOX: 'bank-authorizations-banco-promerica-checkbox',
  BANCO_SCOTIABANK_CHECKBOX: 'bank-authorizations-banco-scotiabank-checkbox',
  CONTAINER: 'bank-authorizations-step-view',
  SECTION_1_CONTAINER: 'bank-authorizations-section-1-container',
  SECTION_2_CONTAINER: 'bank-authorizations-section-2-container',
  TOGGLE_ALL_BUTTON: 'bank-authorizations-toggle-all-button',
} as const;

export const AVAILABLE_BANKS = [
  'banco_bac',
  'banco_bncr',
  'banco_scotiabank',
  'banco_promerica',
  'banco_carro_facil',
] as const;

export type BankKey = (typeof AVAILABLE_BANKS)[number];
export type BankFormKey = BankKey;

export interface BankOptionConfig {
  formKey: BankKey;
  id: string;
  label: string;
  LogoComponent: React.ComponentType<IconProps>;
  testID: string;
}

export const BANKS_CONFIG: BankOptionConfig[] = [
  {
    formKey: 'banco_bac',
    id: 'bac',
    label: BANK_AUTHORIZATIONS_STEP_COPY.BANK_BAC_LABEL,
    LogoComponent: BuildingIcon,
    testID: BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_BAC_CHECKBOX,
  },
  {
    formKey: 'banco_bncr',
    id: 'bncr',
    label: BANK_AUTHORIZATIONS_STEP_COPY.BANK_BNCR_LABEL,
    LogoComponent: BanknoteIcon,
    testID: BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_BNCR_CHECKBOX,
  },
  {
    formKey: 'banco_scotiabank',
    id: 'scotiabank',
    label: BANK_AUTHORIZATIONS_STEP_COPY.BANK_SCOTIABANK_LABEL,
    LogoComponent: BuildingIcon,
    testID: BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_SCOTIABANK_CHECKBOX,
  },
  {
    formKey: 'banco_promerica',
    id: 'promerica',
    label: BANK_AUTHORIZATIONS_STEP_COPY.BANK_PROMERICA_LABEL,
    LogoComponent: BanknoteIcon,
    testID: BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_PROMERICA_CHECKBOX,
  },
  {
    formKey: 'banco_carro_facil',
    id: 'carro_facil',
    label: BANK_AUTHORIZATIONS_STEP_COPY.BANK_CARRO_FACIL_LABEL,
    LogoComponent: CarIcon,
    testID: BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_CARRO_FACIL_CHECKBOX,
  },
];
