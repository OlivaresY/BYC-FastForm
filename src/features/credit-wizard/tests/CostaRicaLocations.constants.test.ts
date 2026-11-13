import {
  COSTA_RICA_LOCATIONS,
  getCantonOptions,
  getDistrictOptions,
  getProvinceOptions,
  isValidCantonForProvince,
  isValidLocationHierarchy,
  LOCATION_OTHER_OPTION,
} from '../constants/CostaRicaLocations.constants';
import { CURRENCY_OPTIONS } from '../constants/SharedCatalogs.constants';

const values = (options: readonly { value: string }[]): string[] =>
  options.map((option) => option.value);

describe('CostaRicaLocations catalog', () => {
  it('exposes the 7 provinces', () => {
    expect(getProvinceOptions()).toHaveLength(7);
    expect(Object.keys(COSTA_RICA_LOCATIONS)).toHaveLength(7);
  });

  it('exposes shared currency options', () => {
    expect(values(CURRENCY_OPTIONS)).toEqual(['CRC', 'USD']);
  });

  it('filters cantons by province', () => {
    expect(values(getCantonOptions('San José'))).toEqual(
      expect.arrayContaining(['Central', 'Escazú', 'Curridabat', 'Santa Ana']),
    );
    expect(values(getCantonOptions('Limón'))).not.toContain('Escazú');
    expect(getCantonOptions(undefined)).toEqual([]);
    expect(getCantonOptions('Unknown')).toEqual([]);
  });

  it('filters districts by province and canton and appends "Otro"', () => {
    const districts = values(getDistrictOptions('San José', 'Escazú'));
    expect(districts).toEqual(['Escazú', 'San Antonio', 'San Rafael', 'Otro']);
    expect(districts).toContain(LOCATION_OTHER_OPTION);
    expect(getDistrictOptions('San José', undefined)).toEqual([]);
    expect(values(getDistrictOptions('Limón', 'Pococí'))).toEqual(['Otro']);
  });

  it.each([
    ['San José', 'Central', 'Carmen'],
    ['San José', 'San José', 'Uruca'],
    ['San José', 'Escazú', 'San Rafael'],
    ['San José', 'Central', 'Otro'],
  ])('accepts %s > %s > %s', (province, canton, district) => {
    expect(isValidLocationHierarchy(province, canton, district)).toBe(true);
  });

  it.each([
    ['Limón', 'Escazú', 'Escazú'],
    ['San José', 'Escazú', 'Carmen'],
    ['Nowhere', 'Central', 'Carmen'],
  ])('rejects %s > %s > %s', (province, canton, district) => {
    expect(isValidLocationHierarchy(province, canton, district)).toBe(false);
  });

  it('validates canton membership alone', () => {
    expect(isValidCantonForProvince('Cartago', 'Paraíso')).toBe(true);
    expect(isValidCantonForProvince('Cartago', 'Escazú')).toBe(false);
  });
});
