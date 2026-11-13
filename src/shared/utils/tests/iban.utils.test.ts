import { CR_IBAN_REGEX, isValidCostaRicaIban } from '../iban.utils';

describe('isValidCostaRicaIban', () => {
  describe('valid Costa Rica IBANs', () => {
    it('validates a known real Costa Rica IBAN', () => {
      expect(isValidCostaRicaIban('CR05015202001026284066')).toBe(true);
    });

    it('validates a mathematically valid zero-padded IBAN', () => {
      expect(isValidCostaRicaIban('CR06000000000000000000')).toBe(true);
    });

    it('trims leading and trailing whitespace', () => {
      expect(isValidCostaRicaIban('  CR05015202001026284066  ')).toBe(true);
    });
  });

  describe('invalid Costa Rica IBANs', () => {
    it('rejects foreign country code', () => {
      expect(isValidCostaRicaIban('ES05015202001026284066')).toBe(false);
    });

    it('rejects IBAN shorter than 22 characters', () => {
      expect(isValidCostaRicaIban('CR0501520200102628406')).toBe(false);
    });

    it('rejects IBAN longer than 22 characters', () => {
      expect(isValidCostaRicaIban('CR050152020010262840660')).toBe(false);
    });

    it('rejects non-digit characters in numeric portion', () => {
      expect(isValidCostaRicaIban('CR0501520200102628406A')).toBe(false);
    });

    it('rejects checksum failure when check digits are altered', () => {
      expect(isValidCostaRicaIban('CR06015202001026284066')).toBe(false);
      expect(isValidCostaRicaIban('CR00000000000000000000')).toBe(false);
    });

    it('rejects checksum failure when account digits are altered', () => {
      expect(isValidCostaRicaIban('CR05015202001026284067')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidCostaRicaIban('')).toBe(false);
    });

    it('rejects non-string values gracefully', () => {
      expect(isValidCostaRicaIban(null as never)).toBe(false);
      expect(isValidCostaRicaIban(undefined as never)).toBe(false);
      expect(isValidCostaRicaIban(123456789 as never)).toBe(false);
    });
  });

  describe('CR_IBAN_REGEX', () => {
    it('matches valid format pattern', () => {
      expect(CR_IBAN_REGEX.test('CR05015202001026284066')).toBe(true);
    });

    it('rejects non-CR prefix', () => {
      expect(CR_IBAN_REGEX.test('US05015202001026284066')).toBe(false);
    });
  });
});
