import type { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { esCR } from '@/shared/i18n';
import {
  APPLICATION_STATUS_VALUES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_STATUS_FILTERS,
} from '../constants';
import {
  fetchAdvisorCreditApplications,
  mapCreditApplicationRowToDossierItem,
  mapDossiersToNotifications,
} from '../services';
import type {
  CreditApplicationRow,
  DossierNotificationItem,
  HistoryDossierItem,
  HistoryStatusFilter,
  UseHistoryViewModelResult,
} from '../types';

export interface UseHistoryViewModelOptions {
  client?: SupabaseClient;
  onQuickPrint?: (dossier: HistoryDossierItem) => Promise<void>;
}

const isAbortError = (error: unknown): boolean =>
  error instanceof Error &&
  error.name === HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME;

export const useHistoryViewModel = (
  options?: UseHistoryViewModelOptions,
): UseHistoryViewModelResult => {
  const client = options?.client;
  const onQuickPrint = options?.onQuickPrint;

  const [allDossiers, setAllDossiers] = useState<HistoryDossierItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
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

  const isMountedRef = useRef<boolean>(true);
  const requestSequenceRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const printingDossierIdRef = useRef<string | null>(null);

  const applyFetchSuccess = useCallback(
    (
      rows: CreditApplicationRow[],
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

      const mappedDossiers = rows.map((row) =>
        mapCreditApplicationRowToDossierItem(row, esCR.history),
      );

      setAllDossiers(mappedDossiers);
      setError(null);
    },
    [],
  );

  const applyFetchError = useCallback(
    (
      caughtError: unknown,
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

      const resolvedError =
        caughtError instanceof Error &&
        caughtError.message === esCR.history.errors.timeoutError
          ? esCR.history.errors.timeoutError
          : esCR.history.errors.loadFailed;

      setError(resolvedError);
    },
    [],
  );

  const finalizeFetch = useCallback(
    (controller: AbortController, requestId: number): void => {
      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null;
      }

      if (isMountedRef.current && requestId === requestSequenceRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  const executeFetch = useCallback(async (): Promise<void> => {
    activeAbortControllerRef.current?.abort();

    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    requestSequenceRef.current += 1;
    const currentRequestId = requestSequenceRef.current;

    try {
      const rows = await fetchAdvisorCreditApplications(client, {
        signal: controller.signal,
      });
      applyFetchSuccess(rows, controller, currentRequestId);
    } catch (caughtError) {
      applyFetchError(caughtError, controller, currentRequestId);
    } finally {
      finalizeFetch(controller, currentRequestId);
    }
  }, [applyFetchError, applyFetchSuccess, client, finalizeFetch]);

  useEffect(() => {
    isMountedRef.current = true;
    activeAbortControllerRef.current?.abort();

    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    requestSequenceRef.current += 1;
    const currentRequestId = requestSequenceRef.current;

    void fetchAdvisorCreditApplications(client, { signal: controller.signal })
      .then(
        (rows) => applyFetchSuccess(rows, controller, currentRequestId),
        (caughtError) =>
          applyFetchError(caughtError, controller, currentRequestId),
      )
      .finally(() => finalizeFetch(controller, currentRequestId));

    return () => {
      isMountedRef.current = false;
      controller.abort();
      activeAbortControllerRef.current?.abort();
      activeAbortControllerRef.current = null;
    };
  }, [applyFetchError, applyFetchSuccess, client, finalizeFetch]);

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
    setError(null);
    setQuickPrintError(null);
    await executeFetch();
  }, [executeFetch]);

  const retry = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuickPrintError(null);
    await executeFetch();
  }, [executeFetch]);

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
    () => mapDossiersToNotifications(allDossiers, esCR.history),
    [allDossiers],
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

    return allDossiers.filter((dossier) => {
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
  }, [allDossiers, searchQuery, selectedFilter]);

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
    error,
    isLoading,
    isNotificationsOpen,
    isRefreshing,
    markAllAsRead,
    markAsRead,
    notifications,
    openNotifications,
    printingDossierId,
    quickPrintError,
    refresh,
    requestQuickPrint,
    retry,
    searchQuery,
    selectedFilter,
    setSearchQuery: handleSetSearchQuery,
    setSelectedFilter: handleSetSelectedFilter,
    totalCount: allDossiers.length,
    unreadCount,
  };
};
