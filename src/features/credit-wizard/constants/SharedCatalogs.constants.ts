import type { CustomSelectOption } from '@/shared/ui';

export const FINANCIAL_CURRENCIES = {
  CRC: 'CRC',
  USD: 'USD',
} as const;

export const CURRENCY_OPTIONS = [
  {
    label: 'CRC - Colones Costarricenses (₡)',
    value: FINANCIAL_CURRENCIES.CRC,
  },
  {
    label: 'USD - Dólares Estadounidenses ($)',
    value: FINANCIAL_CURRENCIES.USD,
  },
] as const satisfies readonly CustomSelectOption[];
