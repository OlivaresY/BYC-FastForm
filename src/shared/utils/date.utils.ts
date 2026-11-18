export const DATE_DD_MM_YYYY_REGEX =
  /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;

export const DATE_DD_MM_YYYY = DATE_DD_MM_YYYY_REGEX;

const DATE_DISPLAY_LIMITS = {
  DAY_LENGTH: 2,
  MAX_DIGITS: 8,
  MONTH_END: 4,
  MONTH_LENGTH: 2,
  YEAR_LENGTH: 4,
} as const;

const DATE_SEPARATORS_REGEX = /[-/.]/;
const NON_DIGITS_REGEX = /\D/g;
const DATE_SEPARATOR_CHAR = '-' as const;
const EMPTY_STRING = '' as const;
const PAD_ZERO_CHAR = '0' as const;

const padSingleDigitSegment = (segment: string): string =>
  segment.length === 1
    ? segment.padStart(DATE_DISPLAY_LIMITS.DAY_LENGTH, PAD_ZERO_CHAR)
    : segment;

const formatContiguousDateDigits = (digits: string): string => {
  const capped = digits.slice(0, DATE_DISPLAY_LIMITS.MAX_DIGITS);
  if (capped.length <= DATE_DISPLAY_LIMITS.DAY_LENGTH) {
    return capped;
  }
  if (capped.length <= DATE_DISPLAY_LIMITS.MONTH_END) {
    return `${capped.slice(0, DATE_DISPLAY_LIMITS.DAY_LENGTH)}${DATE_SEPARATOR_CHAR}${capped.slice(DATE_DISPLAY_LIMITS.DAY_LENGTH)}`;
  }
  return `${capped.slice(0, DATE_DISPLAY_LIMITS.DAY_LENGTH)}${DATE_SEPARATOR_CHAR}${capped.slice(DATE_DISPLAY_LIMITS.DAY_LENGTH, DATE_DISPLAY_LIMITS.MONTH_END)}${DATE_SEPARATOR_CHAR}${capped.slice(DATE_DISPLAY_LIMITS.MONTH_END)}`;
};

/**
 * Deterministically formats user-typed or pasted date text into `DD-MM-YYYY`:
 * - Normalizes `/`, `.`, and `-` separators into `-`.
 * - Zero-pads single-digit day/month segments once a separator follows them
 *   (e.g. `5-` -> `05-`, `5/8/1988` -> `05-08-1988`, `15/8/1988` -> `15-08-1988`).
 * - Handles partial deletion cleanly at full-segment boundaries (`15-` -> `15`,
 *   `15-08-` -> `15-08`) without shifting or corrupting remaining segments.
 */
export const formatDateDisplay = (text: string): string => {
  if (typeof text !== 'string' || text.length === 0) {
    return EMPTY_STRING;
  }

  if (!DATE_SEPARATORS_REGEX.test(text)) {
    return formatContiguousDateDigits(
      text.replace(NON_DIGITS_REGEX, EMPTY_STRING),
    );
  }

  const rawParts = text.split(DATE_SEPARATORS_REGEX);
  const rawDay = (rawParts[0] ?? EMPTY_STRING).replace(
    NON_DIGITS_REGEX,
    EMPTY_STRING,
  );
  const rawMonth = (rawParts[1] ?? EMPTY_STRING).replace(
    NON_DIGITS_REGEX,
    EMPTY_STRING,
  );
  const rawYear = (rawParts[2] ?? EMPTY_STRING).replace(
    NON_DIGITS_REGEX,
    EMPTY_STRING,
  );

  if (rawParts.length === 2) {
    if (rawDay === EMPTY_STRING && rawMonth === EMPTY_STRING) {
      return EMPTY_STRING;
    }
    if (rawMonth === EMPTY_STRING) {
      if (rawDay.length === 1) {
        return `${padSingleDigitSegment(rawDay)}${DATE_SEPARATOR_CHAR}`;
      }
      return formatContiguousDateDigits(rawDay);
    }
    if (
      rawDay.length > DATE_DISPLAY_LIMITS.DAY_LENGTH &&
      rawMonth.length > DATE_DISPLAY_LIMITS.MONTH_LENGTH
    ) {
      return formatContiguousDateDigits(`${rawDay}${rawMonth}`);
    }
    if (rawMonth.length > DATE_DISPLAY_LIMITS.MONTH_LENGTH) {
      const day = padSingleDigitSegment(
        rawDay.slice(0, DATE_DISPLAY_LIMITS.DAY_LENGTH),
      );
      const month = rawMonth.slice(0, DATE_DISPLAY_LIMITS.MONTH_LENGTH);
      const year = rawMonth.slice(
        DATE_DISPLAY_LIMITS.MONTH_LENGTH,
        DATE_DISPLAY_LIMITS.MONTH_LENGTH + DATE_DISPLAY_LIMITS.YEAR_LENGTH,
      );
      return `${day}${DATE_SEPARATOR_CHAR}${month}${DATE_SEPARATOR_CHAR}${year}`;
    }
    const day = padSingleDigitSegment(
      rawDay.slice(0, DATE_DISPLAY_LIMITS.DAY_LENGTH),
    );
    return `${day}${DATE_SEPARATOR_CHAR}${rawMonth}`;
  }

  const day = padSingleDigitSegment(
    rawDay.slice(0, DATE_DISPLAY_LIMITS.DAY_LENGTH),
  );
  const month = rawMonth.slice(0, DATE_DISPLAY_LIMITS.MONTH_LENGTH);
  const year = rawYear.slice(0, DATE_DISPLAY_LIMITS.YEAR_LENGTH);

  if (year === EMPTY_STRING) {
    if (month === EMPTY_STRING) {
      return day;
    }
    if (month.length === 1) {
      return `${day}${DATE_SEPARATOR_CHAR}${padSingleDigitSegment(month)}${DATE_SEPARATOR_CHAR}`;
    }
    return `${day}${DATE_SEPARATOR_CHAR}${month}`;
  }

  return `${day}${DATE_SEPARATOR_CHAR}${padSingleDigitSegment(month)}${DATE_SEPARATOR_CHAR}${year}`;
};

export const isValidCalendarDate = (
  year: number,
  month: number,
  day: number,
): boolean => {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  const maxDays = daysInMonth[month - 1] ?? 31;
  return day <= maxDays;
};

export const isValidDateDDMMYYYY = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  const match = DATE_DD_MM_YYYY_REGEX.exec(value.trim());
  if (!match) {
    return false;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  return isValidCalendarDate(year, month, day);
};

export const isNotFutureDateDDMMYYYY = (value: unknown): boolean => {
  if (typeof value !== 'string' || !isValidDateDDMMYYYY(value)) {
    return true;
  }
  const match = DATE_DD_MM_YYYY_REGEX.exec(value.trim());
  if (!match) {
    return true;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const inputDate = new Date(year, month - 1, day);
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return inputDate <= endOfToday;
};
