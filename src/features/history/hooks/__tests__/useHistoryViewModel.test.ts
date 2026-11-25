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
): { client: SupabaseClient; limitMock: jest.Mock } => {
  let callIndex = 0;

  const limitMock = jest.fn(() => {
    const response =
      responses[Math.min(callIndex, responses.length - 1)] ?? {
        data: [],
        error: null,
      };
    callIndex += 1;
    return Promise.resolve(response);
  });

  const orderMock = jest.fn().mockReturnValue({ limit: limitMock });
  const selectMock = jest.fn().mockReturnValue({ order: orderMock });
  const fromMock = jest.fn().mockReturnValue({ select: selectMock });

  const client = {
    from: fromMock,
  } as unknown as SupabaseClient;

  return { client, limitMock };
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
    const { client } = createMockSupabaseClient([
      {
        data: [APPROVED_ROW, PENDING_ROW, REJECTED_ROW, DRAFT_ROW],
        error: null,
      },
    ]);

    // Act
    const page = HistoryViewModelPageObject.render({ client });

    // Assert initial loading state
    expect(page.current.isLoading).toBe(true);

    await page.waitForState(() => {
      expect(page.current.isLoading).toBe(false);
    });

    expect(page.current.error).toBeNull();
    expect(page.current.quickPrintError).toBeNull();
    expect(page.current.totalCount).toBe(4);
    expect(page.current.dossiers).toHaveLength(4);
    expect(page.current.notifications).toHaveLength(2);
    expect(page.current.unreadCount).toBe(2);
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
            limit: jest.fn().mockReturnValue(delayedFetchPromise),
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

  it('surfaces esCR.history.errors.timeoutError when initial fetch times out', async () => {
    // Arrange
    jest.useFakeTimers();
    const stalledClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue(new Promise(() => undefined)),
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const page = HistoryViewModelPageObject.render({ client: stalledClient });

    // Act
    await page.settle(async () => {
      await jest.advanceTimersByTimeAsync(
        HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS,
      );
    });

    // Assert
    expect(page.current.isLoading).toBe(false);
    expect(page.current.error).toBe(esCR.history.errors.timeoutError);
    expect(page.current.dossiers).toHaveLength(0);
  });

  it('cancels superseded refresh requests and aborts active refresh signal on unmount', async () => {
    // Arrange
    const capturedSignals: AbortSignal[] = [];
    const resolvers: ((value: MockQueryResponse) => void)[] = [];

    const concurrentClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              abortSignal: jest.fn((signal: AbortSignal) => {
                capturedSignals.push(signal);
                return new Promise<MockQueryResponse>((resolve) => {
                  resolvers.push(resolve);
                });
              }),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const page = HistoryViewModelPageObject.render({
      client: concurrentClient,
    });

    // Resolve initial mount request
    await page.settle(async () => {
      resolvers[0]?.({ data: [APPROVED_ROW], error: null });
      await Promise.resolve();
    });
    expect(page.current.totalCount).toBe(1);

    // Trigger two rapid overlapping refreshes
    const firstRefresh = page.startRefresh();
    const firstRefreshSignal = capturedSignals[1];
    const secondRefresh = page.startRefresh();
    const secondRefreshSignal = capturedSignals[2];

    expect(firstRefreshSignal?.aborted).toBe(true);
    expect(secondRefreshSignal?.aborted).toBe(false);

    // Resolve newer refresh with fresher list, then settle superseded request
    await page.settle(async () => {
      resolvers[2]?.({ data: [APPROVED_ROW, PENDING_ROW], error: null });
      resolvers[1]?.({ data: [DRAFT_ROW], error: null });
      await Promise.all([firstRefresh, secondRefresh]);
    });

    expect(page.current.dossiers.map((item) => item.id)).toEqual([
      APPROVED_ROW.id,
      PENDING_ROW.id,
    ]);

    // Trigger another refresh and unmount before completion
    const inflightRefresh = page.startRefresh();
    const unmountRefreshSignal = capturedSignals[3];
    expect(unmountRefreshSignal?.aborted).toBe(false);

    page.unmount();
    expect(unmountRefreshSignal?.aborted).toBe(true);

    await page.settle(async () => {
      await inflightRefresh;
    });
  });
});
