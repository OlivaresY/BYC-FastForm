import { esCR } from '@/shared/i18n';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APPLICATION_STATUS_VALUES,
  HISTORY_ERROR_CODES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_PAGINATION_MODES,
  HISTORY_QUERY_LIMITS,
  HISTORY_STATUS_FILTERS,
} from '../constants';
import {
  fetchAdvisorCreditApplications,
  isHistoryServiceError,
  mapCreditApplicationRowToDossierItem,
  mapDossiersToNotifications,
} from '../services';
import type {
  DossierNotificationItem,
  FetchAdvisorCreditApplicationsPage,
  HistoryDossierItem,
  HistoryErrorCode,
  HistoryStatusFilter,
  UseHistoryViewModelResult,
} from '../types';

export interface UseHistoryViewModelOptions {
  client?: SupabaseClient;
  onQuickPrint?: (dossier: HistoryDossierItem) => Promise<void>;
}

type HistoryPaginationMode =
  (typeof HISTORY_PAGINATION_MODES)[keyof typeof HISTORY_PAGINATION_MODES];

const ERROR_MESSAGES_BY_CODE: Readonly<Record<HistoryErrorCode, string>> = {
  [HISTORY_ERROR_CODES.AUTH_REQUIRED]: esCR.history.errors.authRequired,
  [HISTORY_ERROR_CODES.LOAD_FAILED]: esCR.history.errors.loadFailed,
  [HISTORY_ERROR_CODES.NETWORK_ERROR]: esCR.history.errors.networkError,
  [HISTORY_ERROR_CODES.TIMEOUT]: esCR.history.errors.timeoutError,
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error &&
  error.name === HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME;

const mergeUniqueDossiers = (
  existingDossiers: readonly HistoryDossierItem[],
  incomingDossiers: readonly HistoryDossierItem[],
): HistoryDossierItem[] => {
  const existingIds = new Set(existingDossiers.map((item) => item.id));
  const uniqueAdditions = incomingDossiers.filter(
    (item) => !existingIds.has(item.id),
  );
  return [...existingDossiers, ...uniqueAdditions];
};

export const useHistoryViewModel = (
  options?: UseHistoryViewModelOptions,
): UseHistoryViewModelResult => {
  const client = options?.client;
  const onQuickPrint = options?.onQuickPrint;

  const [loadedForClient, setLoadedForClient] = useState<
    SupabaseClient | undefined
  >(client);
  const [allDossiers, setAllDossiers] = useState<HistoryDossierItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quickPrintError, setQuickPrintError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(
    HISTORY_INTERNAL_STRINGS.EMPTY,
  );
  const [selectedFilter, setSelectedFilter] = useState<HistoryStatusFilter>(
    HISTORY_STATUS_FILTERS.ALL,
  );
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [readNotificationIds, setReadNotificationIds] = useState<
    ReadonlySet<string>
  >(() => new Set<string>());
  const [printingDossierId, setPrintingDossierId] = useState<string | null>(
    null,
  );

  const isSyncedToClient = loadedForClient === client;
  const effectiveAllDossiers = useMemo<HistoryDossierItem[]>(
    () => (isSyncedToClient ? allDossiers : []),
    [allDossiers, isSyncedToClient],
  );
  const effectiveIsLoading = isSyncedToClient ? isLoading : true;
  const effectiveIsLoadingMore = isSyncedToClient ? isLoadingMore : false;
  const effectiveHasMore = isSyncedToClient ? hasMore : false;
  const effectiveError = isSyncedToClient ? error : null;
  const effectiveQuickPrintError = isSyncedToClient ? quickPrintError : null;

  const isMountedRef = useRef<boolean>(true);
  const settledClientRef = useRef<SupabaseClient | undefined>(client);
  const requestSequenceRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const printingDossierIdRef = useRef<string | null>(null);
  const isPrimaryLoadActiveRef = useRef<boolean>(true);
  const isLoadingMoreRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(false);
  const nextOffsetRef = useRef<number>(HISTORY_QUERY_LIMITS.DEFAULT_OFFSET);

  const applyPageSuccess = useCallback(
    (
      page: FetchAdvisorCreditApplicationsPage,
      mode: HistoryPaginationMode,
      controller: AbortController,
      requestId: number,
    ): void => {
      if (
        !isMountedRef.current ||
        controller.signal.aborted ||
        requestId !== requestSequenceRef.current
      ) {
        return;
      }

      const mappedDossiers = page.rows.map((row) =>
        mapCreditApplicationRowToDossierItem(row, esCR.history),
      );

      nextOffsetRef.current = page.nextOffset;
      hasMoreRef.current = page.hasMore;
      settledClientRef.current = client;
      setLoadedForClient(client);
      setHasMore(page.hasMore);

      if (mode === HISTORY_PAGINATION_MODES.APPEND) {
        setAllDossiers((previousDossiers) =>
          mergeUniqueDossiers(previousDossiers, mappedDossiers),
        );
      } else {
        setAllDossiers(mappedDossiers);
      }

      setError(null);
    },
    [client],
  );

  const applyFetchError = useCallback(
    (
      caughtError: unknown,
      mode: HistoryPaginationMode,
      controller: AbortController,
      requestId: number,
    ): void => {
      if (
        !isMountedRef.current ||
        controller.signal.aborted ||
        isAbortError(caughtError) ||
        requestId !== requestSequenceRef.current
      ) {
        return;
      }

      const resolvedError = isHistoryServiceError(caughtError)
        ? ERROR_MESSAGES_BY_CODE[caughtError.code]
        : esCR.history.errors.loadFailed;

      if (
        mode === HISTORY_PAGINATION_MODES.REPLACE &&
        settledClientRef.current !== client
      ) {
        setAllDossiers([]);
        setHasMore(false);
        hasMoreRef.current = false;
        nextOffsetRef.current = HISTORY_QUERY_LIMITS.DEFAULT_OFFSET;
      }

      settledClientRef.current = client;
      setLoadedForClient(client);
      setError(resolvedError);
    },
    [client],
  );

  const finalizeFetch = useCallback(
    (controller: AbortController, requestId: number): void => {
      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null;
      }

      if (isMountedRef.current && requestId === requestSequenceRef.current) {
        isPrimaryLoadActiveRef.current = false;
        isLoadingMoreRef.current = false;
        settledClientRef.current = client;
        setLoadedForClient(client);
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [client],
  );

  const executePrimaryFetch = useCallback(async (): Promise<void> => {
    activeAbortControllerRef.current?.abort();

    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    requestSequenceRef.current += 1;
    const currentRequestId = requestSequenceRef.current;

    isPrimaryLoadActiveRef.current = true;
    isLoadingMoreRef.current = false;
    hasMoreRef.current = false;
    nextOffsetRef.current = HISTORY_QUERY_LIMITS.DEFAULT_OFFSET;

    try {
      const page = await fetchAdvisorCreditApplications(client, {
        offset: HISTORY_QUERY_LIMITS.DEFAULT_OFFSET,
        pageSize: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
        signal: controller.signal,
      });
      applyPageSuccess(
        page,
        HISTORY_PAGINATION_MODES.REPLACE,
        controller,
        currentRequestId,
      );
    } catch (caughtError) {
      applyFetchError(
        caughtError,
        HISTORY_PAGINATION_MODES.REPLACE,
        controller,
        currentRequestId,
      );
    } finally {
      finalizeFetch(controller, currentRequestId);
    }
  }, [applyFetchError, applyPageSuccess, client, finalizeFetch]);

  useEffect(() => {
    isMountedRef.current = true;

    return (): void => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    void executePrimaryFetch();

    return (): void => {
      requestSequenceRef.current += 1;
      activeAbortControllerRef.current?.abort();
      activeAbortControllerRef.current = null;
      isPrimaryLoadActiveRef.current = false;
      isLoadingMoreRef.current = false;
      hasMoreRef.current = false;
      nextOffsetRef.current = HISTORY_QUERY_LIMITS.DEFAULT_OFFSET;
    };
  }, [executePrimaryFetch]);

  const clearQuickPrintError = useCallback((): void => {
    if (!isMountedRef.current) {
      return;
    }
    setQuickPrintError(null);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setIsRefreshing(true);
    setIsLoadingMore(false);
    setHasMore(false);
    setError(null);
    setQuickPrintError(null);
    await executePrimaryFetch();
  }, [executePrimaryFetch]);

  const retry = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setAllDossiers([]);
    setIsLoading(true);
    setIsLoadingMore(false);
    setHasMore(false);
    setError(null);
    setQuickPrintError(null);
    await executePrimaryFetch();
  }, [executePrimaryFetch]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (
      !isMountedRef.current ||
      !isSyncedToClient ||
      effectiveIsLoading ||
      isRefreshing ||
      !effectiveHasMore ||
      settledClientRef.current !== client ||
      isPrimaryLoadActiveRef.current ||
      isLoadingMoreRef.current ||
      !hasMoreRef.current
    ) {
      return;
    }

    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    requestSequenceRef.current += 1;
    const currentRequestId = requestSequenceRef.current;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setError(null);
    setQuickPrintError(null);

    try {
      const page = await fetchAdvisorCreditApplications(client, {
        offset: nextOffsetRef.current,
        pageSize: HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE,
        signal: controller.signal,
      });
      applyPageSuccess(
        page,
        HISTORY_PAGINATION_MODES.APPEND,
        controller,
        currentRequestId,
      );
    } catch (caughtError) {
      applyFetchError(
        caughtError,
        HISTORY_PAGINATION_MODES.APPEND,
        controller,
        currentRequestId,
      );
    } finally {
      finalizeFetch(controller, currentRequestId);
    }
  }, [
    applyFetchError,
    applyPageSuccess,
    client,
    effectiveHasMore,
    effectiveIsLoading,
    finalizeFetch,
    isRefreshing,
    isSyncedToClient,
  ]);

  const clearSearch = useCallback((): void => {
    if (!isMountedRef.current) {
      return;
    }
    setQuickPrintError(null);
    setSearchQuery(HISTORY_INTERNAL_STRINGS.EMPTY);
  }, []);

  const handleSetSearchQuery = useCallback((query: string): void => {
    if (!isMountedRef.current) {
      return;
    }
    setQuickPrintError(null);
    setSearchQuery(query);
  }, []);

  const handleSetSelectedFilter = useCallback(
    (filter: HistoryStatusFilter): void => {
      if (!isMountedRef.current) {
        return;
      }
      setQuickPrintError(null);
      setSelectedFilter(filter);
    },
    [],
  );

  const openNotifications = useCallback((): void => {
    if (!isMountedRef.current) {
      return;
    }
    setQuickPrintError(null);
    setIsNotificationsOpen(true);
  }, []);

  const closeNotifications = useCallback((): void => {
    if (!isMountedRef.current) {
      return;
    }
    setQuickPrintError(null);
    setIsNotificationsOpen(false);
  }, []);

  const baseNotifications = useMemo<DossierNotificationItem[]>(
    () => mapDossiersToNotifications(effectiveAllDossiers, esCR.history),
    [effectiveAllDossiers],
  );

  const notifications = useMemo<DossierNotificationItem[]>(
    () =>
      baseNotifications.map((notification) => ({
        ...notification,
        isRead: readNotificationIds.has(notification.id),
      })),
    [baseNotifications, readNotificationIds],
  );

  const unreadCount = useMemo<number>(
    () =>
      notifications.reduce(
        (count, notification) => (notification.isRead ? count : count + 1),
        0,
      ),
    [notifications],
  );

  const markAsRead = useCallback((notificationId: string): void => {
    if (!isMountedRef.current) {
      return;
    }

    setQuickPrintError(null);
    setReadNotificationIds((previousIds) => {
      if (previousIds.has(notificationId)) {
        return previousIds;
      }

      const nextIds = new Set(previousIds);
      nextIds.add(notificationId);
      return nextIds;
    });
  }, []);

  const markAllAsRead = useCallback((): void => {
    if (!isMountedRef.current) {
      return;
    }

    setQuickPrintError(null);
    setReadNotificationIds((previousIds) => {
      const nextIds = new Set(previousIds);
      let hasChanges = false;

      baseNotifications.forEach((notification) => {
        if (!nextIds.has(notification.id)) {
          nextIds.add(notification.id);
          hasChanges = true;
        }
      });

      return hasChanges ? nextIds : previousIds;
    });
  }, [baseNotifications]);

  const dossiers = useMemo<HistoryDossierItem[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return effectiveAllDossiers.filter((dossier) => {
      const matchesStatus =
        selectedFilter === HISTORY_STATUS_FILTERS.ALL ||
        dossier.status === selectedFilter;

      if (!matchesStatus) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      return (
        dossier.applicantName.toLowerCase().includes(normalizedQuery) ||
        dossier.identificationNumber.toLowerCase().includes(normalizedQuery) ||
        dossier.vehicleSummary.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [effectiveAllDossiers, searchQuery, selectedFilter]);

  const requestQuickPrint = useCallback(
    async (dossier: HistoryDossierItem): Promise<void> => {
      if (!isMountedRef.current) {
        return;
      }

      if (
        dossier.status !== APPLICATION_STATUS_VALUES.APPROVED ||
        !dossier.canQuickPrint
      ) {
        return;
      }

      if (printingDossierIdRef.current !== null) {
        return;
      }

      printingDossierIdRef.current = dossier.id;
      setPrintingDossierId(dossier.id);

      try {
        setQuickPrintError(null);
        await onQuickPrint?.(dossier);
      } catch (caughtQuickPrintError) {
        console.error(
          HISTORY_INTERNAL_STRINGS.LOG_QUICK_PRINT_FAILED,
          caughtQuickPrintError,
        );
        if (isMountedRef.current) {
          setQuickPrintError(esCR.history.errors.quickPrintFailed);
        }
      } finally {
        printingDossierIdRef.current = null;
        if (isMountedRef.current) {
          setPrintingDossierId(null);
        }
      }
    },
    [onQuickPrint],
  );

  return {
    clearQuickPrintError,
    clearSearch,
    closeNotifications,
    dossiers,
    error: effectiveError,
    hasMore: effectiveHasMore,
    isLoading: effectiveIsLoading,
    isLoadingMore: effectiveIsLoadingMore,
    isNotificationsOpen,
    isRefreshing,
    loadMore,
    markAllAsRead,
    markAsRead,
    notifications,
    openNotifications,
    printingDossierId,
    quickPrintError: effectiveQuickPrintError,
    refresh,
    requestQuickPrint,
    retry,
    searchQuery,
    selectedFilter,
    setSearchQuery: handleSetSearchQuery,
    setSelectedFilter: handleSetSelectedFilter,
    totalCount: effectiveAllDossiers.length,
    unreadCount,
  };
};
