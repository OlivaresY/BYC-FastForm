import { SELECTED_BANK_CODES } from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  CREDIT_APPLICATION_REGIMES,
  HISTORY_DATE_LIMITS,
  HISTORY_DB_COLUMNS,
  HISTORY_DB_TABLES,
  HISTORY_ERROR_CODES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_QUERY_LIMITS,
  HISTORY_SELECT_COLUMNS,
  HISTORY_TEMPLATE_TOKENS,
  HISTORY_TIME_UNITS_MS,
} from '../../constants';
import type {
  CreditApplicationRow,
  MasterCreditApplicationPayload,
  SelectedBankCode,
} from '../../types';
import {
  fetchAdvisorCreditApplications,
  formatDossierDate,
  formatNotificationRelativeTime,
  HistoryServiceError,
  mapCreditApplicationRowToDossierItem,
  mapDossiersToNotifications,
} from '../history.service';

const FIXTURE_USER_ID = '550e8400-e29b-41d4-a716-446655440000' as const;
const MIDDAY_AUGUST_ISO = '2026-08-15T18:00:00.000Z' as const;
const REFERENCE_NOW_MS = Date.parse('2026-11-24T18:00:00.000Z');
const ONE_DAY_IN_MS = HISTORY_TIME_UNITS_MS.DAY_MS;
const TWO_HOURS_IN_MS = HISTORY_TIME_UNITS_MS.HOUR_MS * 2;
const FIVE_MINUTES_IN_MS = HISTORY_TIME_UNITS_MS.MINUTE_MS * 5;
const TWO_MINUTES_IN_MS = HISTORY_TIME_UNITS_MS.MINUTE_MS * 2;
const EIGHT_DAYS_IN_MS = (HISTORY_DATE_LIMITS.MAX_RELATIVE_DAYS + 1) * ONE_DAY_IN_MS;
const TEN_SECONDS_IN_MS = 10000 as const;
const OVER_LIMIT_DOSSIERS_COUNT =
  HISTORY_QUERY_LIMITS.MAX_NOTIFICATIONS_COUNT + 5;

const buildPhysicalPayload = (
  overrides?: Partial<
    Extract<MasterCreditApplicationPayload, { regime: 'physical' }>
  >,
): Extract<MasterCreditApplicationPayload, { regime: 'physical' }> => ({
  applicant: {
    regime: 'physical',
    values: {
      birthDate: '15-08-1988',
      firstLastName: 'Rodríguez',
      firstName: 'Carlos',
      gender: 'male',
      identificationNumber: '1-1234-0567',
      identificationType: 'national_id',
      maritalStatus: 'single',
      middleName: 'Alberto',
      nationality: 'CR',
      nationalityOther: '',
      secondLastName: 'Castro',
    },
    vehicleBeneficiary: 'same_holder',
  },
  bankAuthorizations: {
    autoriza_buros_credito: true,
    autoriza_sugef_cic: true,
    banco_bac: true,
    banco_bncr: false,
    banco_carro_facil: false,
    banco_promerica: false,
    banco_scotiabank: false,
  },
  contact: {
    commercialReference: {
      companyReference: 'Corporación CoriMotors S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2200-0000',
    },
    contactInfo: {
      cellPhone: '+506 8888-8888',
      email: 'carlos.rodriguez@correo.cr',
      homePhone: '+506 2222-2222',
    },
    employmentData: {
      employer: 'Tech Solutions CR',
      employmentStatus: 'salaried_private',
      entryDate: '01-03-2020',
      officePhone: '+506 2210-1010',
      profession: 'Ingeniero de Sistemas',
    },
    financialCapacity: {
      currency: 'CRC',
      grossIncome: 2500000,
      netIncome: 2100000,
      otherIncomes: 0,
    },
    residentialAddress: {
      canton: 'Alajuela',
      district: 'Alajuela',
      exactAddress: '200m norte del parque central',
      province: 'Alajuela',
    },
  },
  regime: 'physical',
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  templateVersion: 'v1',
  userId: FIXTURE_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Blanco',
    marca: 'BYD',
    modelo: 'Song Plus',
    moneda: 'USD',
    monto_financiar: 32000,
    monto_prima: 8000,
    plazo_meses: 60,
    valor_vehiculo: 40000,
  },
  ...overrides,
});

const buildLegalPayload = (
  overrides?: Partial<
    Extract<MasterCreditApplicationPayload, { regime: 'legal' }>
  >,
): Extract<MasterCreditApplicationPayload, { regime: 'legal' }> => ({
  applicant: {
    regime: 'legal',
    values: {
      identificationNumber: '3-101-123456',
      identificationType: 'legal_id',
      legalName: 'Transportes del Valle S.A.',
      representativeIdentification: '1-1234-0567',
      representativeName: 'Carlos Rodríguez Castro',
    },
    vehicleBeneficiary: 'same_holder',
  },
  bankAuthorizations: {
    autoriza_buros_credito: true,
    autoriza_sugef_cic: true,
    banco_bac: true,
    banco_bncr: true,
    banco_carro_facil: true,
    banco_promerica: false,
    banco_scotiabank: false,
  },
  contact: {
    commercialActivity: {
      accountingPhone: '+506 2200-1111',
      constitutionDate: '10-05-2015',
      economicSector: 'Comercio',
      economicSectorOther: '',
      employeesCount: 25,
      mainActivity: 'Transporte comercial',
    },
    commercialAddress: {
      canton: 'San José',
      district: 'Carmen',
      exactAddress: 'Paseo Colón, Edificio Centro',
      province: 'San José',
    },
    commercialReference: {
      companyReference: 'Distribuidora Automotriz S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2299-9999',
    },
    contactInfo: {
      cellPhone: '+506 8888-1234',
      email: 'finanzas@valle.cr',
      officePhone: '+506 2200-2222',
    },
    financialStatements: {
      currency: 'USD',
      grossSales: 500000,
      netProfit: 120000,
      otherIncomes: 0,
    },
  },
  regime: 'legal',
  selectedBanks: [
    SELECTED_BANK_CODES.BAC,
    SELECTED_BANK_CODES.BNCR,
    SELECTED_BANK_CODES.CARRO_FACIL,
  ],
  status: APPLICATION_STATUS_VALUES.PENDING,
  templateVersion: 'v1',
  userId: FIXTURE_USER_ID,
  vehicleCredit: {
    anio: '2025',
    color: 'Gris',
    marca: 'BYD',
    modelo: 'Yuan Pro',
    moneda: 'USD',
    monto_financiar: 25000,
    monto_prima: 7000,
    plazo_meses: 60,
    valor_vehiculo: 32000,
  },
  ...overrides,
});

const buildRow = (
  overrides?: Partial<CreditApplicationRow>,
): CreditApplicationRow => ({
  created_at: MIDDAY_AUGUST_ISO,
  id: 'dossier-001',
  payload: buildPhysicalPayload(),
  regime: 'physical',
  selected_banks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  template_version: 'v1',
  user_id: FIXTURE_USER_ID,
  ...overrides,
});

interface MockSupabaseHistoryHarness {
  abortSignalMock: jest.Mock;
  client: SupabaseClient;
  fromMock: jest.Mock;
  orderMock: jest.Mock;
  rangeMock: jest.Mock;
  selectMock: jest.Mock;
}

const createMockSupabaseClient = (
  result: { data: unknown; error: unknown } = { data: [], error: null },
): MockSupabaseHistoryHarness => {
  const abortSignalMock = jest.fn().mockResolvedValue(result);
  const rangeResultPromise = Object.assign(Promise.resolve(result), {
    abortSignal: abortSignalMock,
  });
  const rangeMock = jest.fn().mockReturnValue(rangeResultPromise);
  const orderMock = jest.fn().mockReturnValue({ range: rangeMock });
  const selectMock = jest.fn().mockReturnValue({ order: orderMock });
  const fromMock = jest.fn().mockReturnValue({ select: selectMock });

  const client = {
    from: fromMock,
  } as unknown as SupabaseClient;

  return {
    abortSignalMock,
    client,
    fromMock,
    orderMock,
    rangeMock,
    selectMock,
  };
};

describe('history.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('mapCreditApplicationRowToDossierItem', () => {
    it('maps physical person payload using centralized esCR bank labels and enables canQuickPrint only when Approved', () => {
      // Arrange
      const row = buildRow();
      const expectedMonth = esCR.history.dates.monthsShort[7];
      const expectedDate = `${String(15).padStart(
        HISTORY_DATE_LIMITS.PAD_WIDTH_CHARS,
        HISTORY_DATE_LIMITS.PAD_ZERO_CHAR,
      )}${HISTORY_INTERNAL_STRINGS.SPACE}${expectedMonth}${HISTORY_INTERNAL_STRINGS.SPACE}2026`;

      // Act
      const item = mapCreditApplicationRowToDossierItem(row, esCR.history);

      // Assert
      expect(BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BAC]).toBe(
        esCR.history.banks.bac,
      );
      expect(BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BNCR]).toBe(
        esCR.history.banks.bncr,
      );
      expect(BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.CARRO_FACIL]).toBe(
        esCR.history.banks.carroFacil,
      );
      expect(BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.PROMERICA]).toBe(
        esCR.history.banks.promerica,
      );
      expect(BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.SCOTIABANK]).toBe(
        esCR.history.banks.scotiabank,
      );

      expect(item.id).toBe('dossier-001');
      expect(item.regime).toBe('physical');
      expect(item.applicantName).toBe('Carlos Alberto Rodríguez Castro');
      expect(item.identificationNumber).toBe('1-1234-0567');
      expect(item.vehicleSummary).toBe('BYD Song Plus 2026');
      expect(item.primaryBankLabel).toBe(esCR.history.banks.bac);
      expect(item.formattedDate).toBe(expectedDate);
      expect(item.canQuickPrint).toBe(true);
      expect(item.rawPayload).toBe(row.payload);
    });

    it('omits blank middleName for physical applicants without extra spaces', () => {
      // Arrange
      const physicalPayload = buildPhysicalPayload();
      const row = buildRow({
        payload: {
          ...physicalPayload,
          applicant: {
            ...physicalPayload.applicant,
            values: {
              ...physicalPayload.applicant.values,
              middleName: '  ',
            },
          },
        },
      });

      // Act
      const item = mapCreditApplicationRowToDossierItem(row, esCR.history);

      // Assert
      expect(item.applicantName).toBe('Carlos Rodríguez Castro');
    });

    it('maps legal entity payload with multi-bank suffix and blocks canQuickPrint for Pending, Rejected, and Draft', () => {
      // Arrange
      const legalPayload = buildLegalPayload();
      const pendingRow = buildRow({
        id: 'dossier-pending',
        payload: legalPayload,
        regime: 'legal',
        selected_banks: legalPayload.selectedBanks,
        status: APPLICATION_STATUS_VALUES.PENDING,
      });
      const rejectedRow = buildRow({
        id: 'dossier-rejected',
        payload: { ...legalPayload, status: APPLICATION_STATUS_VALUES.REJECTED },
        regime: 'legal',
        selected_banks: legalPayload.selectedBanks,
        status: APPLICATION_STATUS_VALUES.REJECTED,
      });
      const draftRow = buildRow({
        id: 'dossier-draft',
        payload: { ...legalPayload, status: APPLICATION_STATUS_VALUES.DRAFT },
        regime: 'legal',
        selected_banks: legalPayload.selectedBanks,
        status: APPLICATION_STATUS_VALUES.DRAFT,
      });

      const expectedExtraSuffix =
        esCR.history.cards.additionalBanksTemplate.replace(
          HISTORY_TEMPLATE_TOKENS.COUNT,
          '2',
        );

      // Act
      const pendingItem = mapCreditApplicationRowToDossierItem(
        pendingRow,
        esCR.history,
      );
      const rejectedItem = mapCreditApplicationRowToDossierItem(
        rejectedRow,
        esCR.history,
      );
      const draftItem = mapCreditApplicationRowToDossierItem(
        draftRow,
        esCR.history,
      );

      // Assert
      expect(pendingItem.applicantName).toBe('Transportes del Valle S.A.');
      expect(pendingItem.identificationNumber).toBe('3-101-123456');
      expect(pendingItem.vehicleSummary).toBe('BYD Yuan Pro 2025');
      expect(pendingItem.primaryBankLabel).toBe(
        `${esCR.history.banks.bac} ${expectedExtraSuffix}`,
      );
      expect(pendingItem.canQuickPrint).toBe(false);
      expect(rejectedItem.canQuickPrint).toBe(false);
      expect(draftItem.canQuickPrint).toBe(false);
    });

    it('applies localized esCR.history fallbacks when date, bank, applicant, ID, or vehicle fields are missing or invalid', () => {
      // Arrange
      const basePayload = buildLegalPayload();
      const row = buildRow({
        created_at: 'not-an-iso-date',
        payload: {
          ...basePayload,
          applicant: {
            ...basePayload.applicant,
            values: {
              ...basePayload.applicant.values,
              identificationNumber: '  ',
              legalName: '',
            },
          },
          selectedBanks: [],
          vehicleCredit: {
            ...basePayload.vehicleCredit,
            anio: '',
            marca: ' ',
            modelo: '',
          },
        },
        regime: 'legal',
        selected_banks: [],
        status: APPLICATION_STATUS_VALUES.DRAFT,
      });

      // Act
      const item = mapCreditApplicationRowToDossierItem(row, esCR.history);

      // Assert
      expect(item.applicantName).toBe(esCR.history.cards.applicantFallback);
      expect(item.identificationNumber).toBe(
        esCR.history.cards.identificationFallback,
      );
      expect(item.vehicleSummary).toBe(esCR.history.cards.vehicleFallback);
      expect(item.primaryBankLabel).toBe(esCR.history.cards.bankFallback);
      expect(item.formattedDate).toBe(esCR.history.cards.dateFallback);
      expect(item.canQuickPrint).toBe(false);
    });

    it('handles null payloads, partial payloads without inner regime, and unexpected/prototype/duplicate bank codes safely', () => {
      // Arrange
      const nullPayloadRow = buildRow({
        id: 'dossier-null-payload',
        payload: null as unknown as MasterCreditApplicationPayload,
        selected_banks: ['unknown_bank' as SelectedBankCode],
      });

      const partialLegalPayloadRow = buildRow({
        id: 'dossier-partial-legal',
        payload: {
          applicant: {
            values: {
              identificationNumber: '3-102-654321',
              legalName: 'Grupo Motor CR S.A.',
            },
          },
        } as unknown as MasterCreditApplicationPayload,
        regime: CREDIT_APPLICATION_REGIMES.LEGAL,
        selected_banks: [
          'toString' as SelectedBankCode,
          'unknown_bank' as SelectedBankCode,
          SELECTED_BANK_CODES.BAC,
          SELECTED_BANK_CODES.BAC,
        ],
      });

      // Act
      const nullMapped = mapCreditApplicationRowToDossierItem(
        nullPayloadRow,
        esCR.history,
      );
      const partialMapped = mapCreditApplicationRowToDossierItem(
        partialLegalPayloadRow,
        esCR.history,
      );

      // Assert
      expect(nullMapped.applicantName).toBe(esCR.history.cards.applicantFallback);
      expect(nullMapped.identificationNumber).toBe(
        esCR.history.cards.identificationFallback,
      );
      expect(nullMapped.vehicleSummary).toBe(esCR.history.cards.vehicleFallback);
      expect(nullMapped.primaryBankLabel).toBe(esCR.history.cards.bankFallback);

      expect(partialMapped.applicantName).toBe('Grupo Motor CR S.A.');
      expect(partialMapped.identificationNumber).toBe('3-102-654321');
      expect(partialMapped.primaryBankLabel).toBe(esCR.history.banks.bac);
    });
  });

  describe('date and clock-skew formatters', () => {
    it('formats midnight UTC boundaries strictly in America/Costa_Rica and preserves YYYY-MM-DD calendar dates without shifting days', () => {
      // Arrange: Guard against device timezone leakage
      jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => {
        throw new Error('Unexpected local getDate() usage');
      });
      jest.spyOn(Date.prototype, 'getMonth').mockImplementation(() => {
        throw new Error('Unexpected local getMonth() usage');
      });
      jest.spyOn(Date.prototype, 'getFullYear').mockImplementation(() => {
        throw new Error('Unexpected local getFullYear() usage');
      });

      // Act & Assert: Full ISO timestamps shift cleanly to UTC-6 (Costa Rica)
      expect(formatDossierDate('2026-11-25T05:59:59.000Z', esCR.history)).toBe(
        `24 ${esCR.history.dates.monthsShort[10]} 2026`,
      );
      expect(formatDossierDate('2026-11-25T06:00:00.000Z', esCR.history)).toBe(
        `25 ${esCR.history.dates.monthsShort[10]} 2026`,
      );
      expect(formatDossierDate('2026-01-01T02:00:00.000Z', esCR.history)).toBe(
        `31 ${esCR.history.dates.monthsShort[11]} 2025`,
      );

      // Date-only YYYY-MM-DD strings preserve exact calendar day without -6h shift
      expect(formatDossierDate('2026-11-25', esCR.history)).toBe(
        `25 ${esCR.history.dates.monthsShort[10]} 2026`,
      );
      expect(formatDossierDate('  2026-01-01  ', esCR.history)).toBe(
        `01 ${esCR.history.dates.monthsShort[0]} 2026`,
      );

      // Invalid calendar or malformed dates fall back cleanly
      expect(formatDossierDate('2026-02-30', esCR.history)).toBe(
        esCR.history.cards.dateFallback,
      );
      expect(
        formatDossierDate(null as unknown as string, esCR.history),
      ).toBe(esCR.history.cards.dateFallback);
    });

    it('clamps future timestamps (device clock skew) to justNow and falls back safely on invalid/old dates', () => {
      // Arrange
      const skewedFutureIso = new Date(
        REFERENCE_NOW_MS + TWO_MINUTES_IN_MS,
      ).toISOString();
      const oldIso = new Date(REFERENCE_NOW_MS - EIGHT_DAYS_IN_MS).toISOString();

      // Act & Assert
      expect(
        formatNotificationRelativeTime(
          skewedFutureIso,
          esCR.history,
          REFERENCE_NOW_MS,
        ),
      ).toBe(esCR.history.relativeTime.justNow);
      expect(
        formatNotificationRelativeTime(oldIso, esCR.history, REFERENCE_NOW_MS),
      ).toBe(formatDossierDate(oldIso, esCR.history));
      expect(formatDossierDate('   ', esCR.history)).toBe(
        esCR.history.cards.dateFallback,
      );
      expect(
        formatNotificationRelativeTime(
          'invalid-iso',
          esCR.history,
          REFERENCE_NOW_MS,
        ),
      ).toBe(esCR.history.cards.dateFallback);
    });
  });

  describe('mapDossiersToNotifications', () => {
    it('filters to Approved and Rejected dossiers only, sorts newest-first, caps at MAX_NOTIFICATIONS_COUNT, and localizes content', () => {
      // Arrange
      const pendingItem = mapCreditApplicationRowToDossierItem(
        buildRow({
          created_at: new Date(
            REFERENCE_NOW_MS - TEN_SECONDS_IN_MS,
          ).toISOString(),
          id: 'pending-ignored',
          status: APPLICATION_STATUS_VALUES.PENDING,
        }),
        esCR.history,
      );
      const draftItem = mapCreditApplicationRowToDossierItem(
        buildRow({
          created_at: new Date(
            REFERENCE_NOW_MS - TEN_SECONDS_IN_MS,
          ).toISOString(),
          id: 'draft-ignored',
          status: APPLICATION_STATUS_VALUES.DRAFT,
        }),
        esCR.history,
      );

      const olderRejected = mapCreditApplicationRowToDossierItem(
        buildRow({
          created_at: new Date(REFERENCE_NOW_MS - ONE_DAY_IN_MS).toISOString(),
          id: 'rejected-older',
          status: APPLICATION_STATUS_VALUES.REJECTED,
        }),
        esCR.history,
      );
      const middleApproved = mapCreditApplicationRowToDossierItem(
        buildRow({
          created_at: new Date(
            REFERENCE_NOW_MS - TWO_HOURS_IN_MS,
          ).toISOString(),
          id: 'approved-middle',
          status: APPLICATION_STATUS_VALUES.APPROVED,
        }),
        esCR.history,
      );
      const recentApproved = mapCreditApplicationRowToDossierItem(
        buildRow({
          created_at: new Date(
            REFERENCE_NOW_MS - FIVE_MINUTES_IN_MS,
          ).toISOString(),
          id: 'approved-recent',
          status: APPLICATION_STATUS_VALUES.APPROVED,
        }),
        esCR.history,
      );

      const extraApprovedItems = Array.from(
        { length: OVER_LIMIT_DOSSIERS_COUNT },
        (_, index) =>
          mapCreditApplicationRowToDossierItem(
            buildRow({
              created_at: new Date(
                REFERENCE_NOW_MS - (index + 2) * ONE_DAY_IN_MS,
              ).toISOString(),
              id: `extra-${index}`,
              status: APPLICATION_STATUS_VALUES.APPROVED,
            }),
            esCR.history,
          ),
      );

      // Act
      const notifications = mapDossiersToNotifications(
        [
          pendingItem,
          olderRejected,
          draftItem,
          recentApproved,
          middleApproved,
          ...extraApprovedItems,
        ],
        esCR.history,
        REFERENCE_NOW_MS,
      );

      // Assert
      expect(notifications).toHaveLength(
        HISTORY_QUERY_LIMITS.MAX_NOTIFICATIONS_COUNT,
      );
      expect(notifications[0]?.dossierId).toBe('approved-recent');
      expect(notifications[0]?.title).toBe(
        esCR.history.notifications.approvedTitle,
      );
      expect(notifications[0]?.description).toBe(
        esCR.history.notifications.approvedDescription
          .replace(
            HISTORY_TEMPLATE_TOKENS.APPLICANT,
            recentApproved.applicantName,
          )
          .replace(
            HISTORY_TEMPLATE_TOKENS.VEHICLE,
            recentApproved.vehicleSummary,
          ),
      );
      expect(notifications[0]?.relativeTime).toBe(
        esCR.history.relativeTime.minutesAgo.replace(
          HISTORY_TEMPLATE_TOKENS.COUNT,
          '5',
        ),
      );
      expect(notifications[0]?.isRead).toBe(false);

      expect(notifications[1]?.dossierId).toBe('approved-middle');
      expect(notifications[1]?.relativeTime).toBe(
        esCR.history.relativeTime.hoursAgo.replace(
          HISTORY_TEMPLATE_TOKENS.COUNT,
          '2',
        ),
      );

      expect(notifications[2]?.dossierId).toBe('rejected-older');
      expect(notifications[2]?.title).toBe(
        esCR.history.notifications.rejectedTitle,
      );
      expect(notifications[2]?.relativeTime).toBe(
        esCR.history.relativeTime.daysAgo.replace(
          HISTORY_TEMPLATE_TOKENS.COUNT,
          '1',
        ),
      );
      expect(
        notifications.some(
          (item) =>
            item.dossierId === 'pending-ignored' ||
            item.dossierId === 'draft-ignored',
        ),
      ).toBe(false);
    });
  });

  describe('fetchAdvisorCreditApplications', () => {
    it('queries with .range(0, pageSize) lookahead, detects hasMore when pageSize + 1 rows arrive, and computes nextOffset', async () => {
      // Arrange
      const row1 = buildRow({ id: 'page-row-1' });
      const row2 = buildRow({ id: 'page-row-2' });
      const lookaheadRow3 = buildRow({ id: 'page-row-3' });
      const { client, fromMock, orderMock, rangeMock, selectMock } =
        createMockSupabaseClient({
          data: [row1, row2, lookaheadRow3],
          error: null,
        });

      // Act
      const page = await fetchAdvisorCreditApplications(client, {
        offset: 0,
        pageSize: 2,
      });

      // Assert
      expect(fromMock).toHaveBeenCalledWith(
        HISTORY_DB_TABLES.CREDIT_APPLICATIONS,
      );
      expect(selectMock).toHaveBeenCalledWith(HISTORY_SELECT_COLUMNS);
      expect(orderMock).toHaveBeenCalledWith(HISTORY_DB_COLUMNS.CREATED_AT, {
        ascending: false,
      });
      expect(rangeMock).toHaveBeenCalledWith(0, 2);
      expect(page).toEqual({
        hasMore: true,
        nextOffset: 2,
        rows: [row1, row2],
      });
    });

    it('returns hasMore=false and offset+pageSize nextOffset on exact/partial trailing boundaries and sanitizes invalid inputs', async () => {
      // Arrange
      const page2Rows = [buildRow({ id: 'row-3' }), buildRow({ id: 'row-4' })];
      const exactHarness = createMockSupabaseClient({
        data: page2Rows,
        error: null,
      });

      const exactPage = await fetchAdvisorCreditApplications(
        exactHarness.client,
        {
          offset: 2,
          pageSize: 2,
        },
      );

      expect(exactHarness.rangeMock).toHaveBeenCalledWith(2, 4);
      expect(exactPage).toEqual({
        hasMore: false,
        nextOffset: 4,
        rows: page2Rows,
      });

      const partialTrailingRows = [buildRow({ id: 'row-5' })];
      const partialHarness = createMockSupabaseClient({
        data: partialTrailingRows,
        error: null,
      });

      const partialPage = await fetchAdvisorCreditApplications(
        partialHarness.client,
        {
          offset: 2,
          pageSize: 2,
        },
      );

      expect(partialHarness.rangeMock).toHaveBeenCalledWith(2, 4);
      expect(partialPage).toEqual({
        hasMore: false,
        nextOffset: 4,
        rows: partialTrailingRows,
      });

      const defaultHarness = createMockSupabaseClient({
        data: [],
        error: null,
      });

      await fetchAdvisorCreditApplications(defaultHarness.client, {
        offset: -10,
        pageSize: -5,
      });

      expect(defaultHarness.rangeMock).toHaveBeenCalledWith(
        HISTORY_QUERY_LIMITS.DEFAULT_OFFSET,
        HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
      );
    });

    it('classifies JWT / HTTP 401 / 403 / session errors as AUTH_REQUIRED without exposing raw details', async () => {
      // Arrange
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
      const { client } = createMockSupabaseClient({
        data: null,
        error: {
          code: 'PGRST301',
          message: 'JWT expired: internal row security violation',
          status: 401,
        },
      });

      // Act & Assert
      let caughtError: unknown;
      try {
        await fetchAdvisorCreditApplications(client);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(HistoryServiceError);
      expect((caughtError as HistoryServiceError).code).toBe(
        HISTORY_ERROR_CODES.AUTH_REQUIRED,
      );
      expect((caughtError as Error).message).toBe(
        esCR.history.errors.authRequired,
      );
      expect((caughtError as Error).message).not.toContain('JWT');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('classifies fetch / offline / socket rejections as NETWORK_ERROR without leaking host details', async () => {
      // Arrange
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
      const networkClient = {
        from: jest.fn(() => {
          throw new TypeError('Network request failed (10.0.0.1:5432)');
        }),
      } as unknown as SupabaseClient;

      // Act & Assert
      let caughtError: unknown;
      try {
        await fetchAdvisorCreditApplications(networkClient);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(HistoryServiceError);
      expect((caughtError as HistoryServiceError).code).toBe(
        HISTORY_ERROR_CODES.NETWORK_ERROR,
      );
      expect((caughtError as Error).message).toBe(
        esCR.history.errors.networkError,
      );
      expect((caughtError as Error).message).not.toContain('10.0.0.1');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('classifies generic PostgREST errors as LOAD_FAILED without leaking schema details', async () => {
      // Arrange
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());
      const { client } = createMockSupabaseClient({
        data: null,
        error: { message: 'relation credit_applications permission denied' },
      });

      let caughtError: unknown;
      try {
        await fetchAdvisorCreditApplications(client);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(HistoryServiceError);
      expect((caughtError as HistoryServiceError).code).toBe(
        HISTORY_ERROR_CODES.LOAD_FAILED,
      );
      expect((caughtError as Error).message).toBe(
        esCR.history.errors.loadFailed,
      );
      expect((caughtError as Error).message).not.toContain('permission denied');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('fires AbortController.abort() into Supabase .abortSignal() and rejects with TIMEOUT when exceeding REQUEST_TIMEOUT_MS', async () => {
      // Arrange
      jest.useFakeTimers();
      let capturedSignal: AbortSignal | undefined;
      const abortSignalMock = jest.fn((signal: AbortSignal) => {
        capturedSignal = signal;
        return new Promise(() => undefined);
      });
      const stalledClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockReturnValue({
                abortSignal: abortSignalMock,
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient;

      // Act
      const pendingRequest = fetchAdvisorCreditApplications(stalledClient);
      let caughtError: unknown;
      const settledPromise = pendingRequest.catch((error: unknown) => {
        caughtError = error;
      });

      expect(abortSignalMock).toHaveBeenCalledTimes(1);
      expect(capturedSignal?.aborted).toBe(false);

      await jest.advanceTimersByTimeAsync(
        HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS,
      );
      await settledPromise;

      // Assert
      expect(capturedSignal?.aborted).toBe(true);
      expect(caughtError).toBeInstanceOf(HistoryServiceError);
      expect((caughtError as HistoryServiceError).code).toBe(
        HISTORY_ERROR_CODES.TIMEOUT,
      );
      expect((caughtError as Error).message).toBe(
        esCR.history.errors.timeoutError,
      );
    });

    it('propagates caller AbortSignal cancellation to internal signal and throws AbortError cleanly', async () => {
      // Arrange
      let capturedSignal: AbortSignal | undefined;
      const callerController = new AbortController();
      const client = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockReturnValue({
                abortSignal: jest.fn((signal: AbortSignal) => {
                  capturedSignal = signal;
                  return new Promise(() => undefined);
                }),
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient;

      // Act
      const pendingRequest = fetchAdvisorCreditApplications(client, {
        signal: callerController.signal,
      });
      callerController.abort();

      // Assert
      await expect(pendingRequest).rejects.toMatchObject({
        name: HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME,
      });
      expect(capturedSignal?.aborted).toBe(true);
    });

    it('sanitizes decimal pageSize (< 1 -> default) and floors fractional offset values cleanly', async () => {
      // Arrange
      const fractionalHarness = createMockSupabaseClient({
        data: [buildRow({ id: 'fraction-1' })],
        error: null,
      });

      // Act
      await fetchAdvisorCreditApplications(fractionalHarness.client, {
        offset: 1.9,
        pageSize: 0.5,
      });

      // Assert: pageSize 0.5 avoids zero-row infinite loop and falls back to DEFAULT_DOSSIERS_PAGE_SIZE
      expect(fractionalHarness.rangeMock).toHaveBeenCalledWith(
        1,
        1 + HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
      );

      const nanHarness = createMockSupabaseClient({ data: [], error: null });
      await fetchAdvisorCreditApplications(nanHarness.client, {
        offset: Number.NaN,
        pageSize: Number.POSITIVE_INFINITY,
      });

      expect(nanHarness.rangeMock).toHaveBeenCalledWith(
        HISTORY_QUERY_LIMITS.DEFAULT_OFFSET,
        HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
      );
    });

    it('short-circuits pre-aborted caller signals before calling Supabase and classifies timeout AbortError responses as TIMEOUT', async () => {
      // Arrange 1: Pre-aborted signal must not touch client.from
      const preAbortedController = new AbortController();
      preAbortedController.abort();
      const untouchedHarness = createMockSupabaseClient();

      await expect(
        fetchAdvisorCreditApplications(untouchedHarness.client, {
          signal: preAbortedController.signal,
        }),
      ).rejects.toMatchObject({
        name: HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME,
      });
      expect(untouchedHarness.fromMock).not.toHaveBeenCalled();

      // Arrange 2: Supabase resolves { error: { name: 'AbortError' } } synchronously upon abort
      jest.useFakeTimers();
      const resolvingAbortClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockReturnValue({
                abortSignal: jest.fn(
                  (signal: AbortSignal) =>
                    new Promise((resolve) => {
                      signal.addEventListener(
                        'abort',
                        () => {
                          resolve({
                            data: null,
                            error: {
                              message: 'AbortError: signal aborted',
                              name: HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME,
                            },
                          });
                        },
                        { once: true },
                      );
                    }),
                ),
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient;

      let caughtTimeout: unknown;
      const request = fetchAdvisorCreditApplications(resolvingAbortClient).catch(
        (error: unknown) => {
          caughtTimeout = error;
        },
      );

      await jest.advanceTimersByTimeAsync(
        HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS,
      );
      await request;

      expect(caughtTimeout).toBeInstanceOf(HistoryServiceError);
      expect((caughtTimeout as HistoryServiceError).code).toBe(
        HISTORY_ERROR_CODES.TIMEOUT,
      );
    });
  });
});
