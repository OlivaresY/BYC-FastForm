export const FORMATTERS_PATTERNS = {
  DATE_SEPARATOR: /[-/]/,
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

export const formatDateDisplay = (text: string): string => {
  const {
    DATE_DAY_LENGTH,
    DATE_MAX_SLOTS,
    DATE_MONTH_END,
    DATE_YEAR_END,
    DATE_YEAR_LENGTH,
  } = FORMATTERS_NUMERICAL;
  const { DATE_SEPARATOR, EMPTY, PAD_ZERO } = FORMATTERS_SYMBOLS;

  // If no separators, do standard digit slicing
  if (!text.includes('-') && !text.includes('/')) {
    const digits = text.replace(FORMATTERS_PATTERNS.NON_DIGITS, EMPTY);
    if (digits.length <= DATE_DAY_LENGTH) {
      return digits;
    }
    if (digits.length <= DATE_MONTH_END) {
      return `${digits.slice(0, DATE_DAY_LENGTH)}${DATE_SEPARATOR}${digits.slice(DATE_DAY_LENGTH)}`;
    }
    return `${digits.slice(0, DATE_DAY_LENGTH)}${DATE_SEPARATOR}${digits.slice(DATE_DAY_LENGTH, DATE_MONTH_END)}${DATE_SEPARATOR}${digits.slice(DATE_MONTH_END, DATE_YEAR_END)}`;
  }

  // Preserve slots if separators exist
  const parts = text.split(FORMATTERS_PATTERNS.DATE_SEPARATOR);
  let day = (parts[0] || EMPTY).replace(FORMATTERS_PATTERNS.NON_DIGITS, EMPTY);
  let month = (parts[1] || EMPTY).replace(
    FORMATTERS_PATTERNS.NON_DIGITS,
    EMPTY,
  );
  let year = (parts[2] || EMPTY).replace(FORMATTERS_PATTERNS.NON_DIGITS, EMPTY);
  let slots = Math.min(parts.length, DATE_MAX_SLOTS);

  // Digits typed past a full slot spill into the next slot only when it is
  // empty, so sequential typing keeps working after a separator is inserted
  if (day.length > DATE_DAY_LENGTH && month === EMPTY) {
    month = day.slice(DATE_DAY_LENGTH);
    slots = Math.max(slots, 2);
  }
  if (month.length > DATE_DAY_LENGTH && year === EMPTY) {
    year = month.slice(DATE_DAY_LENGTH);
    slots = DATE_MAX_SLOTS;
  }

  day = day.slice(0, DATE_DAY_LENGTH);
  month = month.slice(0, DATE_DAY_LENGTH);
  year = year.slice(0, DATE_YEAR_LENGTH);

  // Pad single digits if the user has moved to the next segment
  if (slots > 1 && day.length === 1) {
    day = `${PAD_ZERO}${day}`;
  }
  if (slots > 2 && month.length === 1) {
    month = `${PAD_ZERO}${month}`;
  }

  let result = day;
  if (slots > 1) {
    result += `${DATE_SEPARATOR}${month}`;
  }
  if (slots > 2) {
    result += `${DATE_SEPARATOR}${year}`;
  }
  return result;
};
