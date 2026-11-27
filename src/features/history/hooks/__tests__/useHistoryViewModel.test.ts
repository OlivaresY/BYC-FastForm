import type { SupabaseClient } from '@supabase/supabase-js';
import { SELECTED_BANK_CODES } from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';
import {
  APPLICATION_STATUS_VALUES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_QUERY_LIMITS,
  HISTORY_STATUS_FILTERS,
} from '../../constants';
import type {
  ApplicationStatus,
  CreditApplicationRow,
  MasterCreditApplicationPayload,
} from '../../types';
import { HistoryViewModelPageObject } from './useHistoryViewModel.po';

const FIXTURE_USER_ID = '550e8400-e29b-41d4-a716-446655440000' as const;

const createPhysicalRow = (options: {
  createdAt: string;
  firstLastName: string;
  firstName: string;
  id: string;
  identificationNumber: string;
  marca: string;
  modelo: string;
  status: ApplicationStatus;
}): CreditApplicationRow => {
  const payload: Extract<MasterCreditApplicationPayload, { regime: 'physical' }> =
    {
      applicant: {
        regime: 'physical',
        values: {
          birthDate: '15-08-1988',
          firstLastName: options.firstLastName,
          firstName: options.firstName,
          gender: 'male',
          identificationNumber: options.identificationNumber,
          identificationType: 'national_id',
          maritalStatus: 'single',
          middleName: '',
          nationality: 'CR',
          nationalityOther: '',
          secondLastName: 'Mora',
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
          companyReference: 'CoriMotors S.A.',
          ibanAccount: 'CR05015202001026284066',
          referencePhone: '+506 2200-0000',
        },
        contactInfo: {
          cellPhone: '+506 8888-8888',
          email: 'cliente@correo.cr',
          homePhone: '+506 2222-2222',
        },
        employmentData: {
          employer: 'Tech CR',
          employmentStatus: 'salaried_private',
          entryDate: '01-03-2020',
          officePhone: '+506 2210-1010',
          profession: 'Arquitecto',
        },
        financialCapacity: {
          currency: 'CRC',
          grossIncome: 2000000,
          netIncome: 1700000,
          otherIncomes: 0,
        },
        residentialAddress: {
          canton: 'San José',
          district: 'Carmen',
          exactAddress: 'Calle 5',
          province: 'San José',
        },
      },
      regime: 'physical',
      selectedBanks: [SELECTED_BANK_CODES.BAC],
      status: options.status,
      templateVersion: 'v1',
      userId: FIXTURE_USER_ID,
      vehicleCredit: {
        anio: '2026',
        color: 'Negro',
        marca: options.marca,
        modelo: options.modelo,
        moneda: 'USD',
        monto_financiar: 30000,
        monto_prima: 7000,
        plazo_meses: 60,
        valor_vehiculo: 37000,
      },
    };

  return {
    created_at: options.createdAt,
    id: options.id,
    payload,
    regime: 'physical',
    selected_banks: [SELECTED_BANK_CODES.BAC],
    status: options.status,
    template_version: 'v1',
    user_id: FIXTURE_USER_ID,
  };
};

const APPROVED_ROW = createPhysicalRow({
  createdAt: '2026-11-24T17:00:00.000Z',
  firstLastName: 'Salazar',
  firstName: 'María',
  id: 'app-approved-1',
  identificationNumber: '1-1111-2222',
  marca: 'BYD',
  modelo: 'Seal',
  status: APPLICATION_STATUS_VALUES.APPROVED,
});

const PENDING_ROW = createPhysicalRow({
  createdAt: '2026-11-23T17:00:00.000Z',
  firstLastName: 'Vargas',
  firstName: 'Jorge',
  id: 'app-pending-2',
  identificationNumber: '2-3333-4444',
  marca: 'Hyundai',
  modelo: 'Tucson',
  status: APPLICATION_STATUS_VALUES.PENDING,
});

const REJECTED_ROW = createPhysicalRow({
  createdAt: '2026-11-22T17:00:00.000Z',
  firstLastName: 'Jiménez',
  firstName: 'Lucía',
  id: 'app-rejected-3',
  identificationNumber: '3-5555-6666',
  marca: 'Kia',
  modelo: 'Sportage',
  status: APPLICATION_STATUS_VALUES.REJECTED,
});

const DRAFT_ROW = createPhysicalRow({
  createdAt: '2026-11-21T17:00:00.000Z',
  firstLastName: 'Arias',
  firstName: 'Diego',
  id: 'app-draft-4',
  identificationNumber: '4-7777-8888',
  marca: 'BYD',
  modelo: 'Dolphin',
  status: APPLICATION_STATUS_VALUES.DRAFT,
});

interface MockQueryResponse {
  data: CreditApplicationRow[] | null;
  error: unknown;
}

const createMockSupabaseClient = (
  responses: MockQueryResponse[],
): {
  capturedSignals: AbortSignal[];
  client: SupabaseClient;
  rangeMock: jest.Mock;
} => {
  let callIndex = 0;
  const capturedSignals: AbortSignal[] = [];

  const rangeMock = jest.fn(() => {
    const response =
      responses[Math.min(callIndex, responses.length - 1)] ?? {
        data: [],
        error: null,
      };
    callIndex += 1;

    return {
      abortSignal: jest.fn((signal: AbortSignal) => {
        capturedSignals.push(signal);
        return Promise.resolve(response);
      }),
    };
  });

  const orderMock = jest.fn().mockReturnValue({ range: rangeMock });
  const selectMock = jest.fn().mockReturnValue({ order: orderMock });
  const fromMock = jest.fn().mockReturnValue({ select: selectMock });

  const client = {
    from: fromMock,
  } as unknown as SupabaseClient;

  return { capturedSignals, client, rangeMock };
};

const createDeferredSupabaseClient = (): {
  capturedSignals: AbortSignal[];
  client: SupabaseClient;
  rangeMock: jest.Mock;
  resolvers: ((value: MockQueryResponse) => void)[];
} => {
  const capturedSignals: AbortSignal[] = [];
  const resolvers: ((value: MockQueryResponse) => void)[] = [];

  const rangeMock = jest.fn(() => ({
    abortSignal: jest.fn((signal: AbortSignal) => {
      capturedSignals.push(signal);
      return new Promise<MockQueryResponse>((resolve) => {
        resolvers.push(resolve);
      });
    }),
  }));

  const client = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          range: rangeMock,
        }),
      }),
    }),
  } as unknown as SupabaseClient;

  return { capturedSignals, client, rangeMock, resolvers };
};

describe('useHistoryViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('loads dossiers on mount, transitions isLoading, and derives notifications', async () => {
    // Arrange
    const { client, rangeMock } = createMockSupabaseClient([
      {
        data: [APPROVED_ROW, PENDING_ROW, REJECTED_ROW, DRAFT_ROW],
        error: null,
      },
    ]);

    // Act
    const page = HistoryViewModelPageObject.render({ client });

    // Assert initial loading state
    expect(page.current.isLoading).toBe(true);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.isLoadingMore).toBe(false);

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    expect(rangeMock).toHaveBeenCalledWith(
      HISTORY_QUERY_LIMITS.DEFAULT_OFFSET,
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );
    expect(page.current.error).toBeNull();
    expect(page.current.quickPrintError).toBeNull();
    expect(page.current.hasMore).toBe(false);
    expect(page.current.totalCount).toBe(4);
    expect(page.current.dossiers).toHaveLength(4);
    expect(page.current.notifications).toHaveLength(2);
    expect(page.current.unreadCount).toBe(2);
  });

  it('supports incremental pagination via loadMore(), prevents concurrent loadMore calls, deduplicates rows, and resets on refresh()', async () => {
    // Arrange: Page 0 returns 50 rows + 1 lookahead (51 rows total)
    const page0WithLookahead = Array.from(
      { length: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 1 },
      (_, index) =>
        createPhysicalRow({
          createdAt: new Date(
            Date.parse('2026-11-24T17:00:00.000Z') - index * 60000,
          ).toISOString(),
          firstLastName: 'Mora',
          firstName: `Solicitante-${index}`,
          id: `row-${index}`,
          identificationNumber: `1-0000-${String(index).padStart(4, '0')}`,
          marca: 'BYD',
          modelo: 'Seal',
          status: APPLICATION_STATUS_VALUES.PENDING,
        }),
    );

    const overlappingRow = page0WithLookahead[49]!;
    const page1RowA = createPhysicalRow({
      createdAt: '2026-11-20T17:00:00.000Z',
      firstLastName: 'Solís',
      firstName: 'Sofía',
      id: 'row-page1-a',
      identificationNumber: '1-9999-0001',
      marca: 'BYD',
      modelo: 'Tang',
      status: APPLICATION_STATUS_VALUES.APPROVED,
    });
    const page1RowB = createPhysicalRow({
      createdAt: '2026-11-19T17:00:00.000Z',
      firstLastName: 'Castro',
      firstName: 'Luis',
      id: 'row-page1-b',
      identificationNumber: '1-9999-0002',
      marca: 'Kia',
      modelo: 'Niro',
      status: APPLICATION_STATUS_VALUES.REJECTED,
    });

    const deferred = createDeferredSupabaseClient();
    const page = HistoryViewModelPageObject.render({ client: deferred.client });

    // Resolve Page 0
    await page.settle(async () => {
      deferred.resolvers[0]?.({ data: page0WithLookahead, error: null });
      await Promise.resolve();
    });

    expect(page.current.hasMore).toBe(true);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );

    // Act 1: Trigger concurrent loadMore calls while Page 1 is pending
    const firstLoadMore = page.startLoadMore();
    const duplicateLoadMore = page.startLoadMore();

    expect(page.current.isLoadingMore).toBe(true);
    expect(deferred.rangeMock).toHaveBeenCalledTimes(2);
    expect(deferred.rangeMock).toHaveBeenNthCalledWith(
      2,
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE * 2,
    );

    await page.settle(async () => {
      deferred.resolvers[1]?.({
        data: [overlappingRow, page1RowA, page1RowB],
        error: null,
      });
      await Promise.all([firstLoadMore, duplicateLoadMore]);
    });

    // Assert Page 1 merged without duplicating overlappingRow
    expect(page.current.isLoadingMore).toBe(false);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 2,
    );

    // Act 2: Extra loadMore when hasMore is false must be ignored
    await page.loadMore();
    expect(deferred.rangeMock).toHaveBeenCalledTimes(2);

    // Act 3: refresh() preserves visible dossiers while refreshing, resets pagination to offset 0, and replaces on resolve
    const pendingRefresh = page.startRefresh();
    expect(page.current.isRefreshing).toBe(true);
    expect(page.current.isLoading).toBe(false);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 2,
    );
    expect(deferred.rangeMock).toHaveBeenNthCalledWith(
      3,
      HISTORY_QUERY_LIMITS.DEFAULT_OFFSET,
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );

    await page.settle(async () => {
      deferred.resolvers[2]?.({ data: [APPROVED_ROW], error: null });
      await pendingRefresh;
    });

    expect(page.current.isRefreshing).toBe(false);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.totalCount).toBe(1);
    expect(page.current.dossiers[0]?.id).toBe(APPROVED_ROW.id);
  });

  it('sets localized error without exposing raw error.message and recovers via retry()', async () => {
    // Arrange
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());
    const { client } = createMockSupabaseClient([
      {
        data: null,
        error: { message: 'relation credit_applications permission denied' },
      },
      { data: [APPROVED_ROW], error: null },
    ]);

    const page = HistoryViewModelPageObject.render({ client });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    // Assert error state
    expect(page.current.error).toBe(esCR.history.errors.loadFailed);
    expect(page.current.error).not.toContain('permission denied');
    expect(page.current.dossiers).toHaveLength(0);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // Act: Recover via retry()
    await page.retry();

    // Assert recovered state
    expect(page.current.error).toBeNull();
    expect(page.current.totalCount).toBe(1);
    expect(page.current.dossiers[0]?.id).toBe(APPROVED_ROW.id);
  });

  it('maps AUTH_REQUIRED and NETWORK_ERROR HistoryServiceError codes directly to esCR.history.errors', async () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const { client } = createMockSupabaseClient([
      {
        data: null,
        error: { code: 'PGRST301', message: 'JWT expired', status: 401 },
      },
      {
        data: null,
        error: { code: 'ERR_NETWORK', message: 'Network request failed' },
      },
    ]);

    const page = HistoryViewModelPageObject.render({ client });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    expect(page.current.error).toBe(esCR.history.errors.authRequired);

    // Act: Retry hits network failure
    await page.retry();

    expect(page.current.error).toBe(esCR.history.errors.networkError);
  });

  it('resets isLoading=true, clears stale error/pagination state, and reloads cleanly when client dependency changes', async () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const firstClientHarness = createMockSupabaseClient([
      {
        data: null,
        error: { status: 401, message: 'JWT expired' },
      },
    ]);
    const secondClientHarness = createDeferredSupabaseClient();

    const page = HistoryViewModelPageObject.render({
      client: firstClientHarness.client,
    });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });
    expect(page.current.error).toBe(esCR.history.errors.authRequired);

    // Act: Inject a new SupabaseClient instance
    page.rerender({ client: secondClientHarness.client });

    // Assert: isLoading resets synchronously to true and stale dossiers/error clear
    expect(page.current.isLoading).toBe(true);
    expect(page.current.isLoadingMore).toBe(false);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.error).toBeNull();
    expect(page.current.dossiers).toHaveLength(0);

    await page.settle(async () => {
      secondClientHarness.resolvers[0]?.({ data: [APPROVED_ROW], error: null });
      await Promise.resolve();
    });

    expect(page.current.isLoading).toBe(false);
    expect(page.current.error).toBeNull();
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      APPROVED_ROW.id,
    ]);
  });

  it('aborts in-flight slow loadMore() immediately on client swap, ignores late stale responses, and loads new client cleanly', async () => {
    // Arrange
    const clientAHarness = createDeferredSupabaseClient();
    const clientBHarness = createDeferredSupabaseClient();
    const page0WithLookahead = Array.from(
      { length: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 1 },
      (_, index) =>
        createPhysicalRow({
          createdAt: new Date(
            Date.parse('2026-11-24T17:00:00.000Z') - index * 60000,
          ).toISOString(),
          firstLastName: 'ClienteA',
          firstName: `Nombre-${index}`,
          id: `clientA-row-${index}`,
          identificationNumber: `1-0000-${String(index).padStart(4, '0')}`,
          marca: 'BYD',
          modelo: 'Seal',
          status: APPLICATION_STATUS_VALUES.APPROVED,
        }),
    );

    const page = HistoryViewModelPageObject.render({
      client: clientAHarness.client,
    });

    await page.settle(async () => {
      clientAHarness.resolvers[0]?.({ data: page0WithLookahead, error: null });
      await Promise.resolve();
    });
    expect(page.current.hasMore).toBe(true);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );

    // Act 1: Start slow loadMore() on Client A
    const slowLoadMorePromise = page.startLoadMore();
    const slowLoadMoreSignal = clientAHarness.capturedSignals[1];
    expect(slowLoadMoreSignal?.aborted).toBe(false);
    expect(page.current.isLoadingMore).toBe(true);

    // Act 2: Swap client to Client B while Client A loadMore() is still pending
    page.rerender({ client: clientBHarness.client });

    // Assert: Client A loadMore() is aborted immediately, Client B enters loading=true cleanly
    expect(slowLoadMoreSignal?.aborted).toBe(true);
    expect(page.current.isLoading).toBe(true);
    expect(page.current.isLoadingMore).toBe(false);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.dossiers).toHaveLength(0);

    // Act 3: Late resolution of slow Client A request must not pollute Client B
    await page.settle(async () => {
      clientAHarness.resolvers[1]?.({
        data: [REJECTED_ROW, DRAFT_ROW],
        error: null,
      });
      await slowLoadMorePromise;
    });

    expect(page.current.isLoading).toBe(true);
    expect(page.current.dossiers).toHaveLength(0);

    // Act 4: Resolve Client B page 0 cleanly
    await page.settle(async () => {
      clientBHarness.resolvers[0]?.({
        data: [PENDING_ROW],
        error: null,
      });
      await Promise.resolve();
    });

    expect(page.current.isLoading).toBe(false);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      PENDING_ROW.id,
    ]);
  });

  it('syncs loadedForClient on clientB swap error without locking isLoading=true or leaking clientA dossiers, and blocks loadMore() while out of sync', async () => {
    // Arrange: Client A loads 51 rows (hasMore = true, stale data present)
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const clientAHarness = createMockSupabaseClient([
      {
        data: Array.from(
          { length: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 1 },
          (_, index) =>
            createPhysicalRow({
              createdAt: new Date(
                Date.parse('2026-11-24T17:00:00.000Z') - index * 60000,
              ).toISOString(),
              firstLastName: 'Old',
              firstName: `ClientA-${index}`,
              id: `old-${index}`,
              identificationNumber: `1-0000-${String(index).padStart(4, '0')}`,
              marca: 'BYD',
              modelo: 'Seal',
              status: APPLICATION_STATUS_VALUES.APPROVED,
            }),
        ),
        error: null,
      },
    ]);
    const clientBHarness = createDeferredSupabaseClient();

    const page = HistoryViewModelPageObject.render({
      client: clientAHarness.client,
    });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });
    expect(page.current.hasMore).toBe(true);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );

    // Capture a reference to Client A's loadMore handler before Client B takes over
    const capturedLoadMoreBeforeSwap = page.current.loadMore;

    // Act 1: Swap to Client B -> verify single primary fetch & loadMore blocked during transition
    page.rerender({ client: clientBHarness.client });
    expect(clientBHarness.rangeMock).toHaveBeenCalledTimes(1);

    await page.settle(async () => {
      await capturedLoadMoreBeforeSwap();
    });
    await page.loadMore();
    expect(clientBHarness.rangeMock).toHaveBeenCalledTimes(1);

    // Act 2: Client B initial fetch fails with NETWORK_ERROR
    await page.settle(async () => {
      clientBHarness.resolvers[0]?.({
        data: null,
        error: { code: 'ERR_NETWORK', message: 'Network request failed' },
      });
      await Promise.resolve();
    });

    // Assert: isLoading resolves to false, Client B error surfaces, and Client A dossiers are NOT leaked
    expect(page.current.isLoading).toBe(false);
    expect(page.current.error).toBe(esCR.history.errors.networkError);
    expect(page.current.hasMore).toBe(false);
    expect(page.current.dossiers).toHaveLength(0);
    expect(page.current.totalCount).toBe(0);
  });

  it('filters dossiers reactively by status pill and case-insensitive searchQuery across name, ID, and vehicle', async () => {
    // Arrange
    const { client } = createMockSupabaseClient([
      {
        data: [APPROVED_ROW, PENDING_ROW, REJECTED_ROW, DRAFT_ROW],
        error: null,
      },
    ]);
    const page = HistoryViewModelPageObject.render({ client });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    // Act & Assert: Status filter
    page.setSelectedFilter(HISTORY_STATUS_FILTERS.PENDING);
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      PENDING_ROW.id,
    ]);

    page.setSelectedFilter(HISTORY_STATUS_FILTERS.REJECTED);
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      REJECTED_ROW.id,
    ]);

    page.setSelectedFilter(HISTORY_STATUS_FILTERS.ALL);
    expect(page.current.dossiers).toHaveLength(4);

    // Act & Assert: Search by applicantName (case-insensitive)
    page.setSearchQuery('maría');
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      APPROVED_ROW.id,
    ]);

    // Act & Assert: Search by identificationNumber
    page.setSearchQuery('3-5555');
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      REJECTED_ROW.id,
    ]);

    // Act & Assert: Search by vehicleSummary with surrounding whitespace
    page.setSearchQuery('  tucson  ');
    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      PENDING_ROW.id,
    ]);

    // Act & Assert: Whitespace-only query shows all filtered dossiers
    page.setSearchQuery('   ');
    expect(page.current.dossiers).toHaveLength(4);

    // Act & Assert: clearSearch()
    page.clearSearch();
    expect(page.current.searchQuery).toBe(HISTORY_INTERNAL_STRINGS.EMPTY);
    expect(page.current.dossiers).toHaveLength(4);
  });

  it('manages notification panel open/close, markAsRead, markAllAsRead, and preserves read IDs across refresh()', async () => {
    // Arrange
    const { client } = createMockSupabaseClient([
      { data: [APPROVED_ROW, REJECTED_ROW], error: null },
      { data: [APPROVED_ROW, REJECTED_ROW], error: null },
    ]);
    const page = HistoryViewModelPageObject.render({ client });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    // Act & Assert: Open / close panel
    expect(page.current.isNotificationsOpen).toBe(false);
    page.openNotifications();
    expect(page.current.isNotificationsOpen).toBe(true);
    page.closeNotifications();
    expect(page.current.isNotificationsOpen).toBe(false);

    // Act & Assert: Mark one read and refresh
    page.markAsRead(APPROVED_ROW.id);
    expect(page.current.unreadCount).toBe(1);

    await page.refresh();
    expect(page.current.isRefreshing).toBe(false);
    expect(page.current.unreadCount).toBe(1);
    expect(
      page.current.notifications.find((item) => item.id === APPROVED_ROW.id)
        ?.isRead,
    ).toBe(true);

    // Act & Assert: Mark all read
    page.markAllAsRead();
    expect(page.current.unreadCount).toBe(0);
    expect(page.current.notifications.every((item) => item.isRead)).toBe(true);
  });

  it('blocks quick print for non-Approved dossiers and prevents concurrent double-taps on Approved dossiers', async () => {
    // Arrange
    let resolveQuickPrint!: () => void;
    const quickPrintPromise = new Promise<void>((resolve) => {
      resolveQuickPrint = resolve;
    });
    const onQuickPrint = jest.fn().mockReturnValue(quickPrintPromise);
    const { client } = createMockSupabaseClient([
      {
        data: [APPROVED_ROW, PENDING_ROW, REJECTED_ROW, DRAFT_ROW],
        error: null,
      },
    ]);

    const page = HistoryViewModelPageObject.render({ client, onQuickPrint });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    const approvedDossier = page.current.dossiers[0]!;
    const pendingDossier = page.current.dossiers[1]!;
    const rejectedDossier = page.current.dossiers[2]!;
    const draftDossier = page.current.dossiers[3]!;

    // Act: Non-approved dossiers must be ignored
    await page.requestQuickPrint(pendingDossier);
    await page.requestQuickPrint(rejectedDossier);
    await page.requestQuickPrint(draftDossier);
    expect(onQuickPrint).not.toHaveBeenCalled();

    // Act: Double-tap Approved dossier while in-flight
    const firstPrintCall = page.startQuickPrint(approvedDossier);
    const secondPrintCall = page.startQuickPrint(approvedDossier);

    expect(page.current.printingDossierId).toBe(approvedDossier.id);
    expect(onQuickPrint).toHaveBeenCalledTimes(1);
    expect(onQuickPrint).toHaveBeenCalledWith(approvedDossier);

    await page.settle(async () => {
      resolveQuickPrint();
      await Promise.all([firstPrintCall, secondPrintCall]);
    });

    expect(page.current.printingDossierId).toBeNull();
    expect(page.current.error).toBeNull();
    expect(page.current.quickPrintError).toBeNull();
  });

  it('isolates onQuickPrint rejections in quickPrintError without hiding loaded dossiers and clears on the next valid action', async () => {
    // Arrange
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());
    const onQuickPrint = jest
      .fn()
      .mockRejectedValue(new Error('expo-print native spooler crashed'));
    const { client } = createMockSupabaseClient([
      { data: [APPROVED_ROW, PENDING_ROW], error: null },
    ]);

    const page = HistoryViewModelPageObject.render({ client, onQuickPrint });

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    const approvedDossier = page.current.dossiers[0]!;
    const pendingDossier = page.current.dossiers[1]!;

    // Act
    await expect(
      page.requestQuickPrint(approvedDossier),
    ).resolves.toBeUndefined();

    // Assert: quickPrintError set, list error stays null and dossiers remain visible
    expect(page.current.printingDossierId).toBeNull();
    expect(page.current.error).toBeNull();
    expect(page.current.dossiers).toHaveLength(2);
    expect(page.current.quickPrintError).toBe(
      esCR.history.errors.quickPrintFailed,
    );
    expect(page.current.quickPrintError).not.toContain('spooler');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // Blocked non-Approved tap must not wipe quickPrintError prematurely
    await page.requestQuickPrint(pendingDossier);
    expect(page.current.quickPrintError).toBe(
      esCR.history.errors.quickPrintFailed,
    );

    // Next valid user action clears quickPrintError cleanly
    page.setSelectedFilter(HISTORY_STATUS_FILTERS.APPROVED);
    expect(page.current.quickPrintError).toBeNull();

    // Also verify clearQuickPrintError() after another failure
    await page.requestQuickPrint(approvedDossier);
    expect(page.current.quickPrintError).toBe(
      esCR.history.errors.quickPrintFailed,
    );
    page.clearQuickPrintError();
    expect(page.current.quickPrintError).toBeNull();
  });

  it('releases printingDossierId safely when onQuickPrint is omitted and avoids post-unmount updates', async () => {
    // Arrange
    let resolveDelayedFetch!: (value: MockQueryResponse) => void;
    const delayedFetchPromise = new Promise<MockQueryResponse>((resolve) => {
      resolveDelayedFetch = resolve;
    });
    const delayedClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              abortSignal: jest.fn().mockReturnValue(delayedFetchPromise),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());

    const { client } = createMockSupabaseClient([
      { data: [APPROVED_ROW], error: null },
    ]);
    const pageWithoutPrintHandler = HistoryViewModelPageObject.render({
      client,
    });

    await pageWithoutPrintHandler.waitForState(() => {
      expect(pageWithoutPrintHandler.current.isLoading).toBe(false);
    });

    await pageWithoutPrintHandler.requestQuickPrint(
      pageWithoutPrintHandler.current.dossiers[0]!,
    );
    expect(pageWithoutPrintHandler.current.printingDossierId).toBeNull();
    pageWithoutPrintHandler.unmount();

    // Act: Unmount while delayed initial fetch is still pending
    const unmountingPage = HistoryViewModelPageObject.render({
      client: delayedClient,
    });
    unmountingPage.unmount();

    await unmountingPage.settle(async () => {
      resolveDelayedFetch({ data: [APPROVED_ROW], error: null });
      await Promise.resolve();
    });

    // Assert: Zero console.error calls for unmounted state updates
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('aborts request signal and surfaces esCR.history.errors.timeoutError when initial fetch times out', async () => {
    // Arrange
    jest.useFakeTimers();
    let capturedSignal: AbortSignal | undefined;
    const stalledClient = {
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

    const page = HistoryViewModelPageObject.render({ client: stalledClient });
    expect(capturedSignal?.aborted).toBe(false);

    // Act
    await page.settle(async () => {
      await jest.advanceTimersByTimeAsync(
        HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS,
      );
    });

    // Assert
    expect(capturedSignal?.aborted).toBe(true);
    expect(page.current.isLoading).toBe(false);
    expect(page.current.error).toBe(esCR.history.errors.timeoutError);
    expect(page.current.dossiers).toHaveLength(0);
  });

  it('cancels superseded refresh requests and aborts active refresh signal on unmount', async () => {
    // Arrange
    const deferred = createDeferredSupabaseClient();
    const page = HistoryViewModelPageObject.render({
      client: deferred.client,
    });

    // Resolve initial mount request
    await page.settle(async () => {
      deferred.resolvers[0]?.({ data: [APPROVED_ROW], error: null });
      await Promise.resolve();
    });
    expect(page.current.totalCount).toBe(1);

    // Trigger two rapid overlapping refreshes
    const firstRefresh = page.startRefresh();
    const firstRefreshSignal = deferred.capturedSignals[1];
    const secondRefresh = page.startRefresh();
    const secondRefreshSignal = deferred.capturedSignals[2];

    expect(firstRefreshSignal?.aborted).toBe(true);
    expect(secondRefreshSignal?.aborted).toBe(false);

    // Resolve newer refresh with fresher list, then settle superseded request
    await page.settle(async () => {
      deferred.resolvers[2]?.({
        data: [APPROVED_ROW, PENDING_ROW],
        error: null,
      });
      deferred.resolvers[1]?.({ data: [DRAFT_ROW], error: null });
      await Promise.all([firstRefresh, secondRefresh]);
    });

    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      APPROVED_ROW.id,
      PENDING_ROW.id,
    ]);

    // Trigger another refresh and unmount before completion
    const inflightRefresh = page.startRefresh();
    const unmountRefreshSignal = deferred.capturedSignals[3];
    expect(unmountRefreshSignal?.aborted).toBe(false);

    page.unmount();
    expect(unmountRefreshSignal?.aborted).toBe(true);

    await page.settle(async () => {
      await inflightRefresh;
    });
  });

  it('preserves already-loaded dossiers on loadMore() failure, allows retrying loadMore(), and aborts in-flight loadMore() on refresh() and unmount', async () => {
    // Arrange: Page 0 has 51 rows (50 items + lookahead)
    const fullPage0 = Array.from(
      { length: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 1 },
      (_, index) =>
        createPhysicalRow({
          createdAt: new Date(
            Date.parse('2026-11-24T17:00:00.000Z') - index * 60000,
          ).toISOString(),
          firstLastName: 'Gómez',
          firstName: `Cliente-${index}`,
          id: `pg0-${index}`,
          identificationNumber: `1-1000-${String(index).padStart(4, '0')}`,
          marca: 'BYD',
          modelo: 'Seal',
          status: APPLICATION_STATUS_VALUES.APPROVED,
        }),
    );

    const deferred = createDeferredSupabaseClient();
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const page = HistoryViewModelPageObject.render({ client: deferred.client });

    await page.settle(async () => {
      deferred.resolvers[0]?.({ data: fullPage0, error: null });
      await Promise.resolve();
    });

    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );
    expect(page.current.hasMore).toBe(true);

    // Act 1: Page 1 loadMore() fails -> keeps Page 0 dossiers and sets network error
    const failingLoadMore = page.startLoadMore();
    await page.settle(async () => {
      deferred.resolvers[1]?.({
        data: null,
        error: { code: 'ERR_NETWORK', message: 'Network request failed' },
      });
      await failingLoadMore;
    });

    expect(page.current.isLoadingMore).toBe(false);
    expect(page.current.error).toBe(esCR.history.errors.networkError);
    expect(page.current.hasMore).toBe(true);
    expect(page.current.totalCount).toBe(
      HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
    );

    // Act 2: Start another loadMore() and supersede it with refresh() before resolution
    const staleLoadMore = page.startLoadMore();
    const staleLoadMoreSignal = deferred.capturedSignals[2];
    expect(staleLoadMoreSignal?.aborted).toBe(false);

    const pendingRefresh = page.startRefresh();
    expect(staleLoadMoreSignal?.aborted).toBe(true);

    await page.settle(async () => {
      deferred.resolvers[3]?.({
        data: Array.from(
          { length: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE + 1 },
          (_, index) =>
            createPhysicalRow({
              createdAt: new Date(
                Date.parse('2026-11-24T17:00:00.000Z') - index * 60000,
              ).toISOString(),
              firstLastName: 'Solís',
              firstName: `Nuevo-${index}`,
              id: `fresh-${index}`,
              identificationNumber: `2-2000-${String(index).padStart(4, '0')}`,
              marca: 'BYD',
              modelo: 'Dolphin',
              status: APPLICATION_STATUS_VALUES.PENDING,
            }),
        ),
        error: null,
      });
      deferred.resolvers[2]?.({ data: [DRAFT_ROW], error: null });
      await Promise.all([staleLoadMore, pendingRefresh]);
    });

    // Assert: Stale page-1 row was discarded and refreshed rows stayed clean
    expect(page.current.error).toBeNull();
    expect(
      page.current.dossiers.some((item) => item.id === DRAFT_ROW.id),
    ).toBe(false);
    expect(page.current.dossiers[0]?.id).toBe('fresh-0');
    expect(page.current.hasMore).toBe(true);

    // Act 3: Unmount aborts an active loadMore() signal cleanly
    const unmountLoadMore = page.startLoadMore();
    const unmountLoadMoreSignal = deferred.capturedSignals[4];
    expect(unmountLoadMoreSignal?.aborted).toBe(false);

    page.unmount();
    expect(unmountLoadMoreSignal?.aborted).toBe(true);

    await page.settle(async () => {
      await unmountLoadMore;
    });
  });
});
