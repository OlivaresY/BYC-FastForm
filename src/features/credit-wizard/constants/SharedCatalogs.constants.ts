import { esCR } from '@/shared/i18n';
import type { CustomSelectOption } from '@/shared/ui';

export const FINANCIAL_CURRENCIES = {
  CRC: 'CRC',
  USD: 'USD',
} as const;

export type FinancialCurrencyKey = keyof typeof FINANCIAL_CURRENCIES;

export interface RawCurrencyOption {
  value: FinancialCurrencyKey;
}

export const RAW_CURRENCY_OPTIONS: readonly RawCurrencyOption[] = [
  { value: FINANCIAL_CURRENCIES.CRC },
  { value: FINANCIAL_CURRENCIES.USD },
] as const;

export const CURRENCY_OPTIONS: readonly CustomSelectOption[] = [
  {
    label: esCR.common.catalogs.currencies.CRC,
    value: FINANCIAL_CURRENCIES.CRC,
  },
  {
    label: esCR.common.catalogs.currencies.USD,
    value: FINANCIAL_CURRENCIES.USD,
  },
] as const;
