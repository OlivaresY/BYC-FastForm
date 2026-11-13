import { FINANCIAL_CURRENCIES } from '../constants/SharedCatalogs.constants';
import {
  normalizeCantonValue,
  normalizeLegalEntityContactPayload,
  normalizePhysicalPersonContactPayload,
} from '../utils/contactPayloadNormalizer';

describe('contactPayloadNormalizer', () => {
  describe('normalizeCantonValue', () => {
    it('returns empty string when given undefined, null, or non-string values', () => {
      expect(normalizeCantonValue(undefined)).toBe('');
      expect(normalizeCantonValue(null)).toBe('');
      expect(normalizeCantonValue(123)).toBe('');
      expect(normalizeCantonValue({})).toBe('');
    });

    it("maps legacy 'san_jose' to canonical 'central' (case-insensitive and trimmed)", () => {
      expect(normalizeCantonValue('san_jose')).toBe('central');
      expect(normalizeCantonValue('SAN_JOSE')).toBe('central');
      expect(normalizeCantonValue('  San_Jose  ')).toBe('central');
    });

    it('preserves valid canonical cantons without modification', () => {
      expect(normalizeCantonValue('central')).toBe('central');
      expect(normalizeCantonValue('escazu')).toBe('escazu');
      expect(normalizeCantonValue('desamparados')).toBe('desamparados');
      expect(normalizeCantonValue('alajuela')).toBe('alajuela');
    });
  });

  describe('normalizePhysicalPersonContactPayload', () => {
    it('returns standard default values when given undefined, null, or empty object', () => {
      const fromUndefined = normalizePhysicalPersonContactPayload(undefined);
      expect(fromUndefined.contactInfo.email).toBe('');
      expect(fromUndefined.contactInfo.cellPhone).toBe('');
      expect(fromUndefined.residentialAddress.canton).toBe('');
      expect(fromUndefined.commercialReference.companyReference).toBe('');
      expect(fromUndefined.commercialReference.ibanAccount).toBe('');
      expect(fromUndefined.financialCapacity.currency).toBe(
        FINANCIAL_CURRENCIES.CRC,
      );

      const fromNull = normalizePhysicalPersonContactPayload(null);
      expect(fromNull.residentialAddress.province).toBe('');

      const fromEmpty = normalizePhysicalPersonContactPayload({});
      expect(fromEmpty.employmentData.employer).toBe('');
    });

    it('maps legacy flat payload fields to canonical nested structure', () => {
      const legacyFlatPayload = {
        canton: 'san_jose',
        cellPhone: '+506 8888-9999',
        companyReference: 'CoriMotors Test',
        district: 'carmen',
        email: 'legacy.user@example.com',
        employer: 'Acme Corp',
        employmentStatus: 'salaried_private',
        entryDate: '01/01/2020',
        exactAddress: '100m norte del parque',
        grossIncome: 1500000,
        homePhone: '+506 2222-3333',
        ibanAccount: 'CR05015202001026284066',
        netIncome: 1200000,
        officePhone: '+506 2200-1111',
        profession: 'Software Engineer',
        province: 'san_jose',
        referencePhone: '+506 2200-2222',
      };

      const result = normalizePhysicalPersonContactPayload(legacyFlatPayload);

      // Verify contactInfo
      expect(result.contactInfo.email).toBe('legacy.user@example.com');
      expect(result.contactInfo.cellPhone).toBe('+506 8888-9999');
      expect(result.contactInfo.homePhone).toBe('+506 2222-3333');

      // Verify residentialAddress and canton mutation
      expect(result.residentialAddress.province).toBe('san_jose');
      expect(result.residentialAddress.canton).toBe('central');
      expect(result.residentialAddress.district).toBe('carmen');
      expect(result.residentialAddress.exactAddress).toBe('100m norte del parque');

      // Verify employmentData
      expect(result.employmentData.employer).toBe('Acme Corp');
      expect(result.employmentData.profession).toBe('Software Engineer');
      expect(result.employmentData.entryDate).toBe('01/01/2020');
      expect(result.employmentData.officePhone).toBe('+506 2200-1111');
      expect(result.employmentData.employmentStatus).toBe('salaried_private');

      // Verify financialCapacity
      expect(result.financialCapacity.grossIncome).toBe(1500000);
      expect(result.financialCapacity.netIncome).toBe(1200000);

      // Verify commercialReference
      expect(result.commercialReference.companyReference).toBe('CoriMotors Test');
      expect(result.commercialReference.referencePhone).toBe('+506 2200-2222');
      expect(result.commercialReference.ibanAccount).toBe(
        'CR05015202001026284066',
      );
    });

    it("supports legacy 'phone' key as fallback for 'cellPhone'", () => {
      const result = normalizePhysicalPersonContactPayload({
        phone: '+506 7777-8888',
      });
      expect(result.contactInfo.cellPhone).toBe('+506 7777-8888');
    });

    it("normalizes nested residentialAddress.canton 'san_jose' to 'central'", () => {
      const result = normalizePhysicalPersonContactPayload({
        residentialAddress: {
          canton: 'san_jose',
          district: 'carmen',
          exactAddress: 'Calle Central',
          province: 'san_jose',
        },
      });

      expect(result.residentialAddress.canton).toBe('central');
      expect(result.residentialAddress.district).toBe('carmen');
    });

    it('provides empty default fallbacks for commercialReference if draft omits it', () => {
      const partialDraft = {
        contactInfo: {
          cellPhone: '+506 8888-0000',
          email: 'draft@byc.com',
          homePhone: '',
        },
      };

      const result = normalizePhysicalPersonContactPayload(partialDraft);

      expect(result.commercialReference).toEqual({
        companyReference: '',
        ibanAccount: '',
        referencePhone: '',
      });
    });
  });

  describe('normalizeLegalEntityContactPayload', () => {
    it('returns standard default values when given undefined, null, or empty object', () => {
      const result = normalizeLegalEntityContactPayload(undefined);
      expect(result.contactInfo.email).toBe('');
      expect(result.contactInfo.cellPhone).toBe('');
      expect(result.commercialAddress.canton).toBe('');
      expect(result.commercialActivity.mainActivity).toBe('');
      expect(result.financialStatements.currency).toBe(FINANCIAL_CURRENCIES.CRC);
      expect(result.commercialReference.companyReference).toBe('');
      expect(result.commercialReference.ibanAccount).toBe('');
    });

    it('migrates a legacy flat legal entity payload into the 5 canonical nested objects', () => {
      const legacyFlatPayload = {
        accountingPhone: '+506 2200-3333',
        canton: 'san_jose',
        cellPhone: '+506 8888-1111',
        companyReference: 'Distribuidores Unidos',
        constitutionDate: '15/05/2018',
        currency: 'USD',
        district: 'carmen',
        economicSector: 'Automotriz',
        email: 'info@empresa.cr',
        employeesCount: 45,
        exactAddress: 'Edificio Torre Las Américas, piso 5',
        grossIncome: 12000000,
        ibanAccount: 'CR05015202001026284066',
        mainActivity: 'Venta de repuestos automotrices',
        netIncome: 3500000,
        officePhone: '+506 2200-4444',
        otherIncomes: 500000,
        province: 'san_jose',
        referencePhone: '+506 2200-5555',
      };

      const result = normalizeLegalEntityContactPayload(legacyFlatPayload);

      // 1. contactInfo
      expect(result.contactInfo.email).toBe('info@empresa.cr');
      expect(result.contactInfo.cellPhone).toBe('+506 8888-1111');
      expect(result.contactInfo.officePhone).toBe('+506 2200-4444');

      // 2. commercialAddress (with canton normalized to 'central')
      expect(result.commercialAddress.province).toBe('san_jose');
      expect(result.commercialAddress.canton).toBe('central');
      expect(result.commercialAddress.district).toBe('carmen');
      expect(result.commercialAddress.exactAddress).toBe(
        'Edificio Torre Las Américas, piso 5',
      );

      // 3. commercialActivity
      expect(result.commercialActivity.mainActivity).toBe(
        'Venta de repuestos automotrices',
      );
      expect(result.commercialActivity.constitutionDate).toBe('15/05/2018');
      expect(result.commercialActivity.economicSector).toBe('Automotriz');
      expect(result.commercialActivity.employeesCount).toBe(45);
      expect(result.commercialActivity.accountingPhone).toBe('+506 2200-3333');

      // 4. financialStatements (with grossIncome -> grossSales and netIncome -> netProfit mapping)
      expect(result.financialStatements.currency).toBe('USD');
      expect(result.financialStatements.grossSales).toBe(12000000);
      expect(result.financialStatements.netProfit).toBe(3500000);
      expect(result.financialStatements.otherIncomes).toBe(500000);

      // 5. commercialReference
      expect(result.commercialReference.companyReference).toBe(
        'Distribuidores Unidos',
      );
      expect(result.commercialReference.referencePhone).toBe('+506 2200-5555');
      expect(result.commercialReference.ibanAccount).toBe(
        'CR05015202001026284066',
      );
    });

    it("normalizes nested commercialAddress.canton 'san_jose' to 'central'", () => {
      const result = normalizeLegalEntityContactPayload({
        commercialAddress: {
          canton: 'san_jose',
          district: 'carmen',
          exactAddress: 'Avenida 2da',
          province: 'san_jose',
        },
      });

      expect(result.commercialAddress.canton).toBe('central');
    });

    it('preserves grossSales and netProfit when provided directly in nested financialStatements', () => {
      const result = normalizeLegalEntityContactPayload({
        financialStatements: {
          currency: 'CRC',
          grossSales: 50000000,
          netProfit: 15000000,
          otherIncomes: undefined,
        },
      });

      expect(result.financialStatements.grossSales).toBe(50000000);
      expect(result.financialStatements.netProfit).toBe(15000000);
    });
  });
});

