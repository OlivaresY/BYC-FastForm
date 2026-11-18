export const CR_IBAN_LENGTH = 22 as const;

export const MAX_LENGTH_IBAN_INPUT = 30 as const;

export const CR_IBAN_REGEX = /^CR\d{20}$/;

const IBAN_STRIPPABLE_SEPARATORS_REGEX = /[\s-]+/g;

const normalizeIbanString = (value: string): string =>
  value.replace(IBAN_STRIPPABLE_SEPARATORS_REGEX, '').toUpperCase();

/**
 * Sanitizes raw IBAN user input by removing all whitespace (spaces, tabs,
 * newlines) and hyphen separators, converting to uppercase, and capping at
 * 22 contiguous characters.
 *
 * @param value - The raw string value entered or pasted by the user.
 * @returns Clean, uppercase IBAN string capped at 22 characters.
 */
export const sanitizeIbanInput = (value: string): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return normalizeIbanString(value).slice(0, CR_IBAN_LENGTH);
};

/**
 * Validates a Costa Rican IBAN using the ISO 7064 Mod 97-10 algorithm.
 *
 * Algorithm requirements:
 * 1. Must match regex ^CR\d{20}$ (22 characters) after stripping whitespace,
 *    hyphens, and uppercasing.
 * 2. Move the first 4 characters to the end.
 * 3. Replace letters with numbers (C=12, R=27).
 * 4. Modulo 97 of the resulting numeric string must equal 1n (BigInt % 97n === 1n).
 *
 * @param iban - The IBAN string to validate.
 * @returns true if the IBAN is structurally and mathematically valid; false otherwise.
 */
export const isValidCostaRicaIban = (iban: string): boolean => {
  if (typeof iban !== 'string') {
    return false;
  }

  const normalized = normalizeIbanString(iban);
  if (!CR_IBAN_REGEX.test(normalized)) {
    return false;
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  const numericString = rearranged.replace(/C/g, '12').replace(/R/g, '27');

  try {
    return BigInt(numericString) % 97n === 1n;
  } catch {
    return false;
  }
};
