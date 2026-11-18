export const ECONOMIC_SECTOR_OTHER_VALUE = 'Otro' as const;

export const NATIONALITY_OTHER_VALUE = 'other' as const;

export const PHYSICAL_IDENTIFICATION_TYPES = {
  DIMEX: 'dimex',
  NATIONAL_ID: 'national_id',
  PASSPORT: 'passport',
} as const;

export type PhysicalIdentificationType =
  (typeof PHYSICAL_IDENTIFICATION_TYPES)[keyof typeof PHYSICAL_IDENTIFICATION_TYPES];

export const FOREIGN_IDENTIFICATION_TYPES = [
  PHYSICAL_IDENTIFICATION_TYPES.DIMEX,
  PHYSICAL_IDENTIFICATION_TYPES.PASSPORT,
] as const;

export type ForeignIdentificationType =
  (typeof FOREIGN_IDENTIFICATION_TYPES)[number];
