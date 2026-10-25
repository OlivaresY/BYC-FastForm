export const DATE_DD_MM_YYYY_REGEX =
  /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;

export const DATE_DD_MM_YYYY = DATE_DD_MM_YYYY_REGEX;

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
