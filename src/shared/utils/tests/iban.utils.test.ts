import {
  CR_IBAN_LENGTH,
  CR_IBAN_REGEX,
  MAX_LENGTH_IBAN_INPUT,
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

    it('validates an IBAN with hyphen separators', () => {
      expect(isValidCostaRicaIban('CR05-0152-0200-1026-2840-66')).toBe(true);
    });

    it('validates hybrid clipboard input with tabs, newlines, hyphens, and spaces', () => {
      expect(
        isValidCostaRicaIban('  \tcr05-0152 0200\n1026-2840\r\n 66  '),
      ).toBe(true);
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

  describe('CR_IBAN_REGEX and clipboard buffer constants', () => {
    it('matches valid format pattern', () => {
      expect(CR_IBAN_REGEX.test('CR05015202001026284066')).toBe(true);
    });

    it('rejects non-CR prefix', () => {
      expect(CR_IBAN_REGEX.test('US05015202001026284066')).toBe(false);
    });

    it('configures MAX_LENGTH_IBAN_INPUT large enough for hyphenated and spaced banking pastes', () => {
      expect(CR_IBAN_LENGTH).toBe(22);
      expect(MAX_LENGTH_IBAN_INPUT).toBeGreaterThanOrEqual(
        'CR05-0152-0200-1026-2840-66'.length,
      );
    });
  });
});

describe('sanitizeIbanInput', () => {
  it('strips spaces and transforms to uppercase', () => {
    expect(sanitizeIbanInput('CR05 0152 0200 1026 2840 66')).toBe(
      'CR05015202001026284066',
    );
    expect(sanitizeIbanInput('cr05 0152 0200 1026 2840 66')).toBe(
      'CR05015202001026284066',
    );
  });

  it('strips hyphens and transforms to uppercase', () => {
    expect(sanitizeIbanInput('CR05-0152-0200-1026-2840-66')).toBe(
      'CR05015202001026284066',
    );
    expect(sanitizeIbanInput('cr05-0152-0200-1026-2840-66')).toBe(
      'CR05015202001026284066',
    );
  });

  it('strips hybrid clipboard separators including tabs, newlines, and leading/trailing spaces', () => {
    expect(sanitizeIbanInput('  \tcr05-0152 0200\n1026-2840\r\n 66  ')).toBe(
      'CR05015202001026284066',
    );
  });

  it('enforces the exact 22-character sanitized output ceiling even when input exceeds MAX_LENGTH_IBAN_INPUT', () => {
    const oversizedClipboardInput =
      '   CR05-0152-0200-1026-2840-66-9999-8888-7777   ';
    expect(oversizedClipboardInput.length).toBeGreaterThan(
      MAX_LENGTH_IBAN_INPUT,
    );

    const sanitized = sanitizeIbanInput(oversizedClipboardInput);

    expect(sanitized).toBe('CR05015202001026284066');
    expect(sanitized).toHaveLength(CR_IBAN_LENGTH);
  });

  it('handles empty, whitespace-only, and separator-only strings', () => {
    expect(sanitizeIbanInput('   ')).toBe('');
    expect(sanitizeIbanInput('--- \t\n ---')).toBe('');
    expect(sanitizeIbanInput('')).toBe('');
  });

  it('handles non-string values gracefully', () => {
    expect(sanitizeIbanInput(null as never)).toBe('');
    expect(sanitizeIbanInput(undefined as never)).toBe('');
  });
});
