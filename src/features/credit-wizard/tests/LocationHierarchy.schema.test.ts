import { CommercialAddressSchema } from '../schemas/LegalEntityContact.schema';
import { ResidentialAddressSchema } from '../schemas/PhysicalPersonContact.schema';

const base = { exactAddress: 'Frente al parque', province: 'San José' };

describe.each([
  ['ResidentialAddressSchema', ResidentialAddressSchema],
  ['CommercialAddressSchema', CommercialAddressSchema],
])('%s location hierarchy', (_name, schema) => {
  it('accepts a coherent province > canton > district', () => {
    expect(
      schema.safeParse({ ...base, canton: 'Escazú', district: 'San Rafael' })
        .success,
    ).toBe(true);
  });

  it('accepts the legacy "San José" canton alias', () => {
    expect(
      schema.safeParse({ ...base, canton: 'San José', district: 'Uruca' })
        .success,
    ).toBe(true);
  });

  it('rejects a canton outside the province', () => {
    const result = schema.safeParse({
      ...base,
      canton: 'Pococí',
      district: 'Otro',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['canton']);
  });

  it('rejects a district outside the canton', () => {
    const result = schema.safeParse({
      ...base,
      canton: 'Escazú',
      district: 'Carmen',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['district']);
  });
});
