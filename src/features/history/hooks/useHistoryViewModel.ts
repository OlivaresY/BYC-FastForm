import type { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  APPLICATION_STATUS_VALUES,
  HISTORY_STATUS_FILTERS,
} from '../constants';
import {
  fetchAdvisorCreditApplications,
  mapCreditApplicationRowToDossierItem,
  mapDossiersToNotifications,
} from '../services';
import type {
  CreditApplicationRow,
  HistoryDossierItem,
  HistoryStatusFilter,
  UseHistoryViewModelResult,
} from '../types';

export interface UseHistoryViewModelOptions {
  client?: SupabaseClient;
  onQuickPrint?: (dossier: HistoryDossierItem) => Promise<void>;
}

const ABORT_ERROR_NAME = 'AbortError' as const;
const EMPTY_QUERY = '' as const;

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === ABORT_ERROR_NAME;

export const useHistoryViewModel = (
  options?: UseHistoryViewModelOptions,
): UseHistoryViewModelResult => {
  const client = options?.client ?? supabase;
  const onQuickPrint = options?.onQuickPrint;

  const [allDossiers, setAllDossiers] = useState<HistoryDossierItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(EMPTY_QUERY);
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

      setError(esCR.history.errors.loadFailed);
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
      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null;
      }
    };
  }, [applyFetchError, applyFetchSuccess, client, finalizeFetch]);

  const refresh = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setIsRefreshing(true);
    setError(null);
    await executeFetch();
  }, [executeFetch]);

  const retry = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);
    await executeFetch();
  }, [executeFetch]);

  const clearSearch = useCallback((): void => {
    setSearchQuery(EMPTY_QUERY);
  }, []);

  const openNotifications = useCallback((): void => {
    setIsNotificationsOpen(true);
  }, []);

  const closeNotifications = useCallback((): void => {
    setIsNotificationsOpen(false);
  }, []);

  const baseNotifications = useMemo(
    () => mapDossiersToNotifications(allDossiers, esCR.history),
    [allDossiers],
  );

  const notifications = useMemo(
    () =>
      baseNotifications.map((notification) => ({
        ...notification,
        isRead: readNotificationIds.has(notification.id),
      })),
    [baseNotifications, readNotificationIds],
  );

  const unreadCount = useMemo(
    () =>
      notifications.reduce(
        (count, notification) => (notification.isRead ? count : count + 1),
        0,
      ),
    [notifications],
  );

  const markAsRead = useCallback((notificationId: string): void => {
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

  const dossiers = useMemo(() => {
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
        setError(null);
        await onQuickPrint?.(dossier);
      } catch (quickPrintError) {
        console.error(
          '[useHistoryViewModel] Quick print failed:',
          quickPrintError,
        );
        if (isMountedRef.current) {
          setError(esCR.history.errors.quickPrintFailed);
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
    refresh,
    requestQuickPrint,
    retry,
    searchQuery,
    selectedFilter,
    setSearchQuery,
    setSelectedFilter,
    totalCount: allDossiers.length,
    unreadCount,
  };
};
