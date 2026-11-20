export { formatDateDisplay } from './date.utils';

export const INTERNATIONAL_PHONE_REGEX =
  /^(\+?[1-9]\d{0,3}|\([1-9]\d{0,3}\))?\s?[\d\-\s()]{6,16}$/;

export const FORMATTERS_PATTERNS = {
  DATE_SEPARATOR: /[-/.]/,
  INTERNATIONAL_PHONE: INTERNATIONAL_PHONE_REGEX,
  NON_DIGITS: /[^0-9]/g,
  THOUSANDS_SEPARATOR: /\B(?=(\d{3})+(?!\d))/g,
} as const;

export const FORMATTERS_NUMERICAL = {
  DATE_DAY_LENGTH: 2,
  DATE_MAX_SLOTS: 3,
  DATE_MONTH_END: 4,
  DATE_YEAR_END: 8,
  DATE_YEAR_LENGTH: 4,
} as const;

export const FORMATTERS_SYMBOLS = {
  DATE_SEPARATOR: '-',
  EMPTY: '',
  PAD_ZERO: '0',
  THOUSANDS_SEPARATOR: '.',
} as const;

export const formatCurrencyDisplay = (
  value: number | undefined | null,
): string => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'number' && Number.isNaN(value))
  ) {
    return FORMATTERS_SYMBOLS.EMPTY;
  }
  return String(value).replace(
    FORMATTERS_PATTERNS.THOUSANDS_SEPARATOR,
    FORMATTERS_SYMBOLS.THOUSANDS_SEPARATOR,
  );
};

export const sanitizeNumericDigits = (text: string): string =>
  text.replace(/\D/g, '');

export const formatCorporateIdDisplay = (text: string): string => {
  const digits = sanitizeNumericDigits(text).slice(0, 10);
  if (digits.length <= 1) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 1)}-${digits.slice(1)}`;
  }
  return `${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 10)}`;
};
