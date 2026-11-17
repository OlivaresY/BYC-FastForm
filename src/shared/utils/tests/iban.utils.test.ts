import {
  CR_IBAN_REGEX,
  isValidCostaRicaIban,
  sanitizeIbanInput,
} from '../iban.utils';

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

    it('validates an IBAN with internal spaces', () => {
      expect(isValidCostaRicaIban('CR05 0152 0200 1026 2840 66')).toBe(true);
    });

    it('validates a lowercase IBAN', () => {
      expect(isValidCostaRicaIban('cr05015202001026284066')).toBe(true);
    });

    it('validates a lowercase IBAN with internal and surrounding spaces', () => {
      expect(isValidCostaRicaIban('  cr05 0152 0200 1026 2840 66  ')).toBe(
        true,
      );
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

describe('sanitizeIbanInput', () => {
  it('removes spaces and transforms to uppercase', () => {
    expect(sanitizeIbanInput('cr05 0152 0200 1026 2840 66')).toBe(
      'CR05015202001026284066',
    );
  });

  it('caps output at 22 characters', () => {
    expect(sanitizeIbanInput('CR0501520200102628406699999')).toBe(
      'CR05015202001026284066',
    );
  });

  it('handles empty and whitespace-only strings', () => {
    expect(sanitizeIbanInput('   ')).toBe('');
    expect(sanitizeIbanInput('')).toBe('');
  });

  it('handles non-string values gracefully', () => {
    expect(sanitizeIbanInput(null as never)).toBe('');
    expect(sanitizeIbanInput(undefined as never)).toBe('');
  });
});
