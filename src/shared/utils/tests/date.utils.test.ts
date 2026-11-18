import {
  formatDateDisplay,
  isNotFutureDateDDMMYYYY,
  isValidCalendarDate,
  isValidDateDDMMYYYY,
} from '../date.utils';

describe('formatDateDisplay', () => {
  describe('sequential typing and digit capping', () => {
    it('formats contiguous digit streams into DD-MM-YYYY progressively', () => {
      expect(formatDateDisplay('1')).toBe('1');
      expect(formatDateDisplay('15')).toBe('15');
      expect(formatDateDisplay('150')).toBe('15-0');
      expect(formatDateDisplay('1508')).toBe('15-08');
      expect(formatDateDisplay('15081')).toBe('15-08-1');
      expect(formatDateDisplay('15081988')).toBe('15-08-1988');
    });

    it('caps excess digits at 8 (DD-MM-YYYY)', () => {
      expect(formatDateDisplay('150819889999')).toBe('15-08-1988');
    });

    it('spills typing past a complete month slot into the year slot', () => {
      expect(formatDateDisplay('15-081')).toBe('15-08-1');
      expect(formatDateDisplay('15-081988')).toBe('15-08-1988');
    });
  });

  describe('clipboard paste normalization and zero-padding', () => {
    it('normalizes slash-separated dates from calendar or clipboard', () => {
      expect(formatDateDisplay('15/08/1988')).toBe('15-08-1988');
      expect(formatDateDisplay(' 15/08/1988 ')).toBe('15-08-1988');
    });

    it('normalizes dot-separated and hyphen-separated dates', () => {
      expect(formatDateDisplay('15.08.1988')).toBe('15-08-1988');
      expect(formatDateDisplay('15-08-1988')).toBe('15-08-1988');
    });

    it('zero-pads single-digit day and month segments when pasting D/M/YYYY, D-M-YYYY, and DD/M/YYYY', () => {
      expect(formatDateDisplay('5/8/1988')).toBe('05-08-1988');
      expect(formatDateDisplay('5-8-1988')).toBe('05-08-1988');
      expect(formatDateDisplay('15/8/1988')).toBe('15-08-1988');
      expect(formatDateDisplay('15.8.1988')).toBe('15-08-1988');
    });

    it('keeps single-digit input unpadded until a separator is introduced', () => {
      expect(formatDateDisplay('5')).toBe('5');
      expect(formatDateDisplay('5-')).toBe('05-');
      expect(formatDateDisplay('05-8')).toBe('05-8');
      expect(formatDateDisplay('05-8-')).toBe('05-08-');
      expect(formatDateDisplay('05-08-1988')).toBe('05-08-1988');
    });
  });

  describe('partial deletion across segment boundaries', () => {
    it('steps back cleanly from DD-MM-YYYY through segment boundaries', () => {
      expect(formatDateDisplay('15-08-1988')).toBe('15-08-1988');
      expect(formatDateDisplay('15-08-198')).toBe('15-08-198');
      expect(formatDateDisplay('15-08-19')).toBe('15-08-19');
      expect(formatDateDisplay('15-08-1')).toBe('15-08-1');
      expect(formatDateDisplay('15-08-')).toBe('15-08');
      expect(formatDateDisplay('15-08')).toBe('15-08');
      expect(formatDateDisplay('15-0')).toBe('15-0');
      expect(formatDateDisplay('15-')).toBe('15');
      expect(formatDateDisplay('15')).toBe('15');
      expect(formatDateDisplay('1')).toBe('1');
    });
  });

  describe('in-place segment editing without corrupting neighboring segments', () => {
    it('preserves month and year when editing the first (day) segment', () => {
      expect(formatDateDisplay('-08-1988')).toBe('-08-1988');
      expect(formatDateDisplay('1-08-1988')).toBe('01-08-1988');
      expect(formatDateDisplay('24-08-1988')).toBe('24-08-1988');
    });

    it('preserves day and year when editing the month segment', () => {
      expect(formatDateDisplay('15-9-1988')).toBe('15-09-1988');
      expect(formatDateDisplay('15-09-1988')).toBe('15-09-1988');
    });

    it('preserves day and month when editing the year segment', () => {
      expect(formatDateDisplay('15-08-198')).toBe('15-08-198');
      expect(formatDateDisplay('15-08-1995')).toBe('15-08-1995');
    });

    it('recovers cleanly if the separator between day and month is deleted', () => {
      expect(formatDateDisplay('1508-1988')).toBe('15-08-1988');
    });
  });

  describe('empty and malformed inputs', () => {
    it('handles empty, separator-only, and non-string values safely', () => {
      expect(formatDateDisplay('')).toBe('');
      expect(formatDateDisplay('-')).toBe('');
      expect(formatDateDisplay('--')).toBe('');
      expect(formatDateDisplay('abc')).toBe('');
      expect(formatDateDisplay(null as never)).toBe('');
      expect(formatDateDisplay(undefined as never)).toBe('');
    });
  });
});

describe('isValidDateDDMMYYYY and isValidCalendarDate', () => {
  it('accepts valid calendar dates including leap years', () => {
    expect(isValidDateDDMMYYYY('15-08-1988')).toBe(true);
    expect(isValidDateDDMMYYYY('29-02-2024')).toBe(true);
    expect(isValidDateDDMMYYYY('29-02-2000')).toBe(true);
    expect(isValidDateDDMMYYYY('31-12-2025')).toBe(true);
    expect(isValidCalendarDate(2024, 2, 29)).toBe(true);
  });

  it('rejects impossible calendar dates even when formatted as DD-MM-YYYY', () => {
    expect(isValidDateDDMMYYYY('99-99-9999')).toBe(false);
    expect(isValidDateDDMMYYYY('32-01-2020')).toBe(false);
    expect(isValidDateDDMMYYYY('29-02-2023')).toBe(false);
    expect(isValidDateDDMMYYYY('31-02-2020')).toBe(false);
    expect(isValidDateDDMMYYYY('31-04-2022')).toBe(false);
    expect(isValidDateDDMMYYYY('00-00-0000')).toBe(false);
    expect(isValidDateDDMMYYYY('00-12-2000')).toBe(false);
    expect(isValidDateDDMMYYYY('15-00-2000')).toBe(false);
    expect(isValidDateDDMMYYYY('15-13-2000')).toBe(false);
  });

  it('rejects out-of-range years and non-DD-MM-YYYY formats', () => {
    expect(isValidDateDDMMYYYY('15-08-1899')).toBe(false);
    expect(isValidDateDDMMYYYY('15-08-2101')).toBe(false);
    expect(isValidDateDDMMYYYY('1988-08-15')).toBe(false);
    expect(isValidDateDDMMYYYY('15/08/1988')).toBe(false);
    expect(isValidDateDDMMYYYY('')).toBe(false);
    expect(isValidDateDDMMYYYY(null)).toBe(false);
    expect(isValidDateDDMMYYYY(undefined)).toBe(false);
  });
});

describe('isNotFutureDateDDMMYYYY', () => {
  it('accepts past dates and rejects future dates', () => {
    expect(isNotFutureDateDDMMYYYY('15-08-1988')).toBe(true);
    expect(isNotFutureDateDDMMYYYY('31-12-2099')).toBe(false);
  });
});
