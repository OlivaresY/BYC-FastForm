import { esCR, useTranslation } from '../index';

describe('useTranslation', () => {
  it('returns t and i18n referencing esCR dictionary', () => {
    const { i18n, t } = useTranslation();

    expect(t).toBe(esCR);
    expect(i18n).toBe(esCR);
  });

  it('contains centralized Step 2 Physical Person copy and errors', () => {
    const { t } = useTranslation();
    const physical = t.creditWizard.step2PhysicalContact;

    expect(physical.title).toBe('Contacto y Laboral');
    expect(physical.form.labels.canton).toBe('CANTÓN');
    expect(physical.form.placeholders.ibanAccount).toBe(
      'CR05015202001026284066',
    );
    expect(physical.errors.commercialReference.ibanAccountRequired).toBe(
      'La cuenta IBAN es obligatoria.',
    );
    expect(physical.errors.commercialReference.ibanAccountInvalid).toContain(
      'CR05015202001026284066',
    );
  });

  it('contains centralized Step 2 Legal Entity copy and errors', () => {
    const { t } = useTranslation();
    const legal = t.creditWizard.step2LegalContact;

    expect(legal.title).toBe('Contacto y Comercial');
    expect(legal.headerTitle).toBe('Persona Jurídica');
    expect(legal.form.labels.grossSales).toBe('VENTAS BRUTAS');
    expect(legal.errors.commercialActivity.economicSectorRequired).toBe(
      'El sector económico es obligatorio.',
    );
  });
});
