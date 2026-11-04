export const formatCapitalizeWords = (text: string): string => {
  if (!text) {
    return '';
  }
  const cleaned = text.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
  return cleaned
    .split(' ')
    .map((word) =>
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : '',
    )
    .join(' ');
};

export const formatYear = (text: string): string => {
  if (!text) {
    return '';
  }
  return text.replace(/\D/g, '').slice(0, 4);
};

export const parseCurrencyToNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  if (!value || typeof value !== 'string') {
    return 0;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  if (trimmed.includes(',')) {
    const clean = trimmed.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  const dotCount = (trimmed.match(/\./g) || []).length;
  if (dotCount === 1) {
    const parts = trimmed.split('.');
    const isRawFloat =
      parts[0].length > 3 && (parts[1].length === 1 || parts[1].length === 2);
    if (isRawFloat) {
      const parsed = parseFloat(trimmed);
      return isNaN(parsed) ? 0 : parsed;
    }
  }

  const clean = trimmed.replace(/\./g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrencyDisplay = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const valStr = String(value).trim();
  if (!valStr) {
    return '';
  }

  let intDigits = '';
  let decDigits = '';
  let hasTrailingComma = false;

  if (valStr.includes(',')) {
    const [rawInt, ...decParts] = valStr.split(',');
    intDigits = rawInt.replace(/\D/g, '');
    const combinedDec = decParts.join('').replace(/\D/g, '');
    decDigits = combinedDec.slice(0, 2);
    hasTrailingComma =
      valStr.endsWith(',') || valStr.endsWith('.') || decParts.length > 0;
  } else if (valStr.endsWith('.')) {
    intDigits = valStr.slice(0, -1).replace(/\D/g, '');
    decDigits = '';
    hasTrailingComma = true;
  } else {
    const dotCount = (valStr.match(/\./g) || []).length;
    const isRawFloat =
      typeof value === 'number' ||
      (dotCount === 1 && /^\d{4,}\.\d{1,2}$/.test(valStr));

    if (isRawFloat) {
      const [rawInt, rawDec] = valStr.split('.');
      intDigits = rawInt.replace(/\D/g, '');
      decDigits = (rawDec || '').replace(/\D/g, '').slice(0, 2);
      hasTrailingComma = false;
    } else {
      intDigits = valStr.replace(/\D/g, '');
      decDigits = '';
      hasTrailingComma = false;
    }
  }

  if (!intDigits) {
    return hasTrailingComma ? '0,' : '';
  }

  const normalizedInt = intDigits.replace(/^0+(?=\d)/, '');
  const formattedInt = normalizedInt.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decDigits.length > 0) {
    return `${formattedInt},${decDigits}`;
  }
  if (hasTrailingComma) {
    return `${formattedInt},`;
  }
  return formattedInt;
};
