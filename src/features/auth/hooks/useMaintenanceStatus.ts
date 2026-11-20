import type { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';

export const MAINTENANCE_CHECK_TIMEOUT_MS = 3000 as const;
export const SYSTEM_SETTINGS_TABLE = 'system_settings' as const;
export const MAINTENANCE_SETTING_KEY = 'maintenance_mode' as const;

export interface UseMaintenanceStatusProps {
  client?: SupabaseClient;
  envFlag?: string;
  timeoutMs?: number;
}

export interface UseMaintenanceStatusReturn {
  isMaintenanceActive: boolean;
  maintenanceMessage?: string;
  recheckMaintenance: () => Promise<void>;
}

interface MaintenanceQueryResponse {
  data: unknown;
  error: unknown;
}

interface AbortableMaintenanceQuery extends PromiseLike<MaintenanceQueryResponse> {
  abortSignal?: (signal: AbortSignal) => PromiseLike<MaintenanceQueryResponse>;
}

interface ResolvedMaintenanceState {
  isActive: boolean;
  message?: string;
}

const isFlagEnabled = (rawFlag: string | undefined): boolean =>
  rawFlag?.trim().toLowerCase() === 'true';

const parseMaintenanceRow = (row: unknown): ResolvedMaintenanceState => {
  if (typeof row !== 'object' || row === null) {
    return { isActive: false };
  }

  const record = row as Record<string, unknown>;
  const nestedValue =
    typeof record.value === 'object' && record.value !== null
      ? (record.value as Record<string, unknown>)
      : undefined;

  const rawActive =
    record.is_active ??
    record.enabled ??
    record.is_maintenance_active ??
    record.maintenance_mode ??
    nestedValue?.enabled ??
    nestedValue?.is_active ??
    record.value;

  const isActive = rawActive === true || rawActive === 'true';
  const rawMessage =
    record.message ?? record.maintenance_message ?? nestedValue?.message;
  const trimmedMessage =
    typeof rawMessage === 'string' && rawMessage.trim().length > 0
      ? rawMessage.trim()
      : undefined;

  return {
    isActive,
    message: isActive ? trimmedMessage : undefined,
  };
};

const queryBackendMaintenanceStatus = async (
  client: SupabaseClient,
  timeoutMs: number,
  controller: AbortController,
): Promise<{
  aborted: boolean;
  cancelTimeout: () => void;
  state: ResolvedMaintenanceState;
}> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const cancelTimeout = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  if (typeof client?.from !== 'function') {
    return { aborted: false, cancelTimeout, state: { isActive: false } };
  }

  controller.signal.addEventListener('abort', cancelTimeout, { once: true });

  const timeoutPromise = new Promise<MaintenanceQueryResponse>((resolve) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      resolve({ data: null, error: null });
    }, timeoutMs);
  });

  try {
    const baseQuery = client
      .from(SYSTEM_SETTINGS_TABLE)
      .select('*')
      .eq('key', MAINTENANCE_SETTING_KEY)
      .maybeSingle();

    const abortableQuery = baseQuery as AbortableMaintenanceQuery;
    const executableQuery =
      typeof abortableQuery?.abortSignal === 'function'
        ? abortableQuery.abortSignal(controller.signal)
        : baseQuery;

    const { data, error } = await Promise.race([
      Promise.resolve(executableQuery),
      timeoutPromise,
    ]);

    if (controller.signal.aborted || error || !data) {
      return {
        aborted: controller.signal.aborted,
        cancelTimeout,
        state: { isActive: false },
      };
    }

    return {
      aborted: false,
      cancelTimeout,
      state: parseMaintenanceRow(data),
    };
  } catch {
    return {
      aborted: controller.signal.aborted,
      cancelTimeout,
      state: { isActive: false },
    };
  } finally {
    controller.signal.removeEventListener('abort', cancelTimeout);
    cancelTimeout();
  }
};

export const useMaintenanceStatus = (
  props?: UseMaintenanceStatusProps,
): UseMaintenanceStatusReturn => {
  const {
    client = supabase,
    envFlag,
    timeoutMs = MAINTENANCE_CHECK_TIMEOUT_MS,
  } = props ?? {};

  const initialEnvActive = isFlagEnabled(
    envFlag ?? process.env.EXPO_PUBLIC_MAINTENANCE_MODE,
  );

  const [isMaintenanceActive, setIsMaintenanceActive] =
    useState<boolean>(initialEnvActive);
  const [maintenanceMessage, setMaintenanceMessage] = useState<
    string | undefined
  >(() => (initialEnvActive ? esCR.auth.maintenance.body : undefined));

  const isMountedRef = useRef<boolean>(true);
  const isActiveRef = useRef<boolean>(initialEnvActive);
  const activeAbortRef = useRef<{
    cancelTimeout: () => void;
    controller: AbortController;
  } | null>(null);

  const applyMaintenanceState = useCallback(
    (nextActive: boolean, nextMessage?: string): void => {
      if (!isMountedRef.current) {
        return;
      }

      if (nextActive) {
        isActiveRef.current = true;
        setIsMaintenanceActive(true);
        setMaintenanceMessage(nextMessage);
        return;
      }

      if (isActiveRef.current) {
        isActiveRef.current = false;
        setIsMaintenanceActive(false);
        setMaintenanceMessage(undefined);
      }
    },
    [],
  );

  const runBackendCheck = useCallback(async (): Promise<void> => {
    activeAbortRef.current?.cancelTimeout();
    activeAbortRef.current?.controller.abort();

    const controller = new AbortController();
    let timeoutCleanup = (): void => undefined;
    activeAbortRef.current = {
      cancelTimeout: () => timeoutCleanup(),
      controller,
    };

    const result = await queryBackendMaintenanceStatus(
      client,
      timeoutMs,
      controller,
    );
    timeoutCleanup = result.cancelTimeout;

    if (activeAbortRef.current?.controller === controller) {
      activeAbortRef.current = null;
    }

    if (!result.aborted) {
      applyMaintenanceState(result.state.isActive, result.state.message);
    }
  }, [applyMaintenanceState, client, timeoutMs]);

  const recheckMaintenance = useCallback(async (): Promise<void> => {
    const resolvedEnvActive = isFlagEnabled(
      envFlag ?? process.env.EXPO_PUBLIC_MAINTENANCE_MODE,
    );

    if (resolvedEnvActive) {
      applyMaintenanceState(true, esCR.auth.maintenance.body);
      return;
    }

    await runBackendCheck();
  }, [applyMaintenanceState, envFlag, runBackendCheck]);

  useEffect(() => {
    isMountedRef.current = true;

    if (initialEnvActive) {
      return undefined;
    }

    const controller = new AbortController();
    let timeoutCleanup = (): void => undefined;
    activeAbortRef.current = {
      cancelTimeout: () => timeoutCleanup(),
      controller,
    };

    void queryBackendMaintenanceStatus(client, timeoutMs, controller).then(
      (result) => {
        timeoutCleanup = result.cancelTimeout;
        if (activeAbortRef.current?.controller === controller) {
          activeAbortRef.current = null;
        }
        if (!result.aborted) {
          applyMaintenanceState(result.state.isActive, result.state.message);
        }
      },
    );

    return () => {
      isMountedRef.current = false;
      activeAbortRef.current?.cancelTimeout();
      activeAbortRef.current?.controller.abort();
      activeAbortRef.current = null;
    };
  }, [applyMaintenanceState, client, initialEnvActive, timeoutMs]);

  return {
    isMaintenanceActive,
    maintenanceMessage,
    recheckMaintenance,
  };
};
