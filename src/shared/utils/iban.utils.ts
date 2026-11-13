export const CR_IBAN_REGEX = /^CR\d{20}$/;

/**
 * Validates a Costa Rican IBAN using the ISO 7064 Mod 97-10 algorithm.
 *
 * Algorithm requirements:
 * 1. Must match regex ^CR\d{20}$ (22 characters).
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

  const normalized = iban.trim();
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
