import type { SupabaseClient } from '@supabase/supabase-js';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  HISTORY_DATE_LIMITS,
  HISTORY_DB_COLUMNS,
  HISTORY_DB_TABLES,
  HISTORY_QUERY_LIMITS,
  HISTORY_TEMPLATE_TOKENS,
  HISTORY_TIME_UNITS_MS,
} from '../constants';
import type {
  CreditApplicationRow,
  DossierNotificationItem,
  HistoryDossierItem,
  MasterCreditApplicationPayload,
  SelectedBankCode,
} from '../types';

export type HistoryCopy = typeof esCR.history;

export interface FetchAdvisorCreditApplicationsOptions {
  limit?: number;
  signal?: AbortSignal;
}

interface SelectApplicationsQueryResponse {
  data: unknown;
  error: unknown;
}

interface AbortableSelectQuery extends PromiseLike<SelectApplicationsQueryResponse> {
  abortSignal?: (
    signal: AbortSignal,
  ) => PromiseLike<SelectApplicationsQueryResponse>;
}

const HISTORY_SELECT_COLUMNS =
  'id, user_id, regime, status, template_version, selected_banks, payload, created_at' as const;

const EMPTY_TEXT = '' as const;
const SPACE_SEPARATOR = ' ' as const;
const ABORT_ERROR_NAME = 'AbortError' as const;

const createAbortError = (): Error => {
  const abortError = new Error(ABORT_ERROR_NAME);
  abortError.name = ABORT_ERROR_NAME;
  return abortError;
};

const joinNonEmptySegments = (
  segments: readonly (string | undefined | null)[],
  fallback: string,
): string => {
  const cleaned = segments
    .map((segment) => (typeof segment === 'string' ? segment.trim() : EMPTY_TEXT))
    .filter((segment) => segment.length > 0);

  return cleaned.length > 0 ? cleaned.join(SPACE_SEPARATOR) : fallback;
};

const extractApplicantIdentity = (
  row: CreditApplicationRow,
  copy: HistoryCopy,
): { applicantName: string; identificationNumber: string } => {
  const payload = row.payload as Partial<MasterCreditApplicationPayload> | null;
  const resolvedRegime = row.regime ?? payload?.regime;

  if (resolvedRegime === 'legal') {
    const legalValues =
      payload?.regime === 'legal' ? payload.applicant?.values : undefined;

    return {
      applicantName: joinNonEmptySegments(
        [legalValues?.legalName],
        copy.cards.applicantFallback,
      ),
      identificationNumber: joinNonEmptySegments(
        [legalValues?.identificationNumber],
        copy.cards.identificationFallback,
      ),
    };
  }

  const physicalValues =
    payload?.regime === 'physical' ? payload.applicant?.values : undefined;

  return {
    applicantName: joinNonEmptySegments(
      [
        physicalValues?.firstName,
        physicalValues?.middleName,
        physicalValues?.firstLastName,
        physicalValues?.secondLastName,
      ],
      copy.cards.applicantFallback,
    ),
    identificationNumber: joinNonEmptySegments(
      [physicalValues?.identificationNumber],
      copy.cards.identificationFallback,
    ),
  };
};

const extractVehicleSummary = (
  payload: Partial<MasterCreditApplicationPayload> | null | undefined,
  copy: HistoryCopy,
): string => {
  const vehicle = payload?.vehicleCredit;

  return joinNonEmptySegments(
    [vehicle?.marca, vehicle?.modelo, vehicle?.anio],
    copy.cards.vehicleFallback,
  );
};

const resolveSelectedBanks = (row: CreditApplicationRow): SelectedBankCode[] => {
  if (Array.isArray(row.selected_banks) && row.selected_banks.length > 0) {
    return row.selected_banks;
  }

  const payloadBanks = row.payload?.selectedBanks;
  return Array.isArray(payloadBanks) ? payloadBanks : [];
};

const resolvePrimaryBankLabel = (
  selectedBanks: readonly SelectedBankCode[],
  copy: HistoryCopy,
): string => {
  const primaryBankCode = selectedBanks[0];

  if (!primaryBankCode) {
    return copy.cards.bankFallback;
  }

  const primaryLabel =
    BANK_DISPLAY_LABELS[primaryBankCode] ?? copy.cards.bankFallback;

  if (selectedBanks.length <= 1) {
    return primaryLabel;
  }

  const extraCountText = copy.cards.additionalBanksTemplate.replace(
    HISTORY_TEMPLATE_TOKENS.COUNT,
    String(selectedBanks.length - 1),
  );

  return `${primaryLabel}${SPACE_SEPARATOR}${extraCountText}`;
};

export const formatDossierDate = (
  isoDate: string,
  copy: HistoryCopy = esCR.history,
): string => {
  if (!isoDate) {
    return copy.cards.dateFallback;
  }

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return copy.cards.dateFallback;
  }

  const day = String(parsedDate.getDate()).padStart(
    HISTORY_DATE_LIMITS.PAD_WIDTH_CHARS,
    HISTORY_DATE_LIMITS.PAD_ZERO_CHAR,
  );
  const monthShort = copy.dates.monthsShort[parsedDate.getMonth()] ?? EMPTY_TEXT;
  const year = parsedDate.getFullYear();

  return `${day} ${monthShort} ${year}`;
};

export const formatNotificationRelativeTime = (
  isoDate: string,
  copy: HistoryCopy = esCR.history,
  referenceMs: number = Date.now(),
): string => {
  if (!isoDate) {
    return copy.cards.dateFallback;
  }

  const createdMs = Date.parse(isoDate);
  if (Number.isNaN(createdMs)) {
    return copy.cards.dateFallback;
  }

  const elapsedMs = Math.max(0, referenceMs - createdMs);

  if (elapsedMs < HISTORY_TIME_UNITS_MS.MINUTE_MS) {
    return copy.relativeTime.justNow;
  }

  if (elapsedMs < HISTORY_TIME_UNITS_MS.HOUR_MS) {
    const minutes = Math.floor(elapsedMs / HISTORY_TIME_UNITS_MS.MINUTE_MS);
    return copy.relativeTime.minutesAgo.replace(
      HISTORY_TEMPLATE_TOKENS.COUNT,
      String(minutes),
    );
  }

  if (elapsedMs < HISTORY_TIME_UNITS_MS.DAY_MS) {
    const hours = Math.floor(elapsedMs / HISTORY_TIME_UNITS_MS.HOUR_MS);
    return copy.relativeTime.hoursAgo.replace(
      HISTORY_TEMPLATE_TOKENS.COUNT,
      String(hours),
    );
  }

  const days = Math.floor(elapsedMs / HISTORY_TIME_UNITS_MS.DAY_MS);
  if (days <= HISTORY_DATE_LIMITS.MAX_RELATIVE_DAYS) {
    return copy.relativeTime.daysAgo.replace(
      HISTORY_TEMPLATE_TOKENS.COUNT,
      String(days),
    );
  }

  return formatDossierDate(isoDate, copy);
};

export const mapCreditApplicationRowToDossierItem = (
  row: CreditApplicationRow,
  copy: HistoryCopy = esCR.history,
): HistoryDossierItem => {
  const { applicantName, identificationNumber } = extractApplicantIdentity(
    row,
    copy,
  );
  const selectedBanks = resolveSelectedBanks(row);

  return {
    applicantName,
    canQuickPrint: row.status === APPLICATION_STATUS_VALUES.APPROVED,
    createdAt: row.created_at,
    formattedDate: formatDossierDate(row.created_at, copy),
    id: row.id,
    identificationNumber,
    primaryBankLabel: resolvePrimaryBankLabel(selectedBanks, copy),
    rawPayload: row.payload,
    regime: row.regime,
    selectedBanks,
    status: row.status,
    templateVersion: row.template_version,
    vehicleSummary: extractVehicleSummary(row.payload, copy),
  };
};

export const mapDossiersToNotifications = (
  dossiers: readonly HistoryDossierItem[],
  copy: HistoryCopy = esCR.history,
  referenceMs: number = Date.now(),
): DossierNotificationItem[] =>
  dossiers
    .filter(
      (dossier) =>
        dossier.status === APPLICATION_STATUS_VALUES.APPROVED ||
        dossier.status === APPLICATION_STATUS_VALUES.REJECTED,
    )
    .slice()
    .sort((dossierA, dossierB) => {
      const timeA = Date.parse(dossierA.createdAt);
      const timeB = Date.parse(dossierB.createdAt);
      const safeTimeA = Number.isNaN(timeA) ? 0 : timeA;
      const safeTimeB = Number.isNaN(timeB) ? 0 : timeB;
      return safeTimeB - safeTimeA;
    })
    .slice(0, HISTORY_QUERY_LIMITS.MAX_NOTIFICATIONS_COUNT)
    .map((dossier) => {
      const isApproved = dossier.status === APPLICATION_STATUS_VALUES.APPROVED;
      const descriptionTemplate = isApproved
        ? copy.notifications.approvedDescription
        : copy.notifications.rejectedDescription;

      return {
        applicantName: dossier.applicantName,
        description: descriptionTemplate
          .replace(HISTORY_TEMPLATE_TOKENS.APPLICANT, dossier.applicantName)
          .replace(HISTORY_TEMPLATE_TOKENS.VEHICLE, dossier.vehicleSummary),
        dossierId: dossier.id,
        id: dossier.id,
        isRead: false,
        relativeTime: formatNotificationRelativeTime(
          dossier.createdAt,
          copy,
          referenceMs,
        ),
        status: isApproved
          ? APPLICATION_STATUS_VALUES.APPROVED
          : APPLICATION_STATUS_VALUES.REJECTED,
        title: isApproved
          ? copy.notifications.approvedTitle
          : copy.notifications.rejectedTitle,
      };
    });

export const fetchAdvisorCreditApplications = async (
  client: SupabaseClient = supabase,
  options?: FetchAdvisorCreditApplicationsOptions,
): Promise<CreditApplicationRow[]> => {
  if (options?.signal?.aborted) {
    throw createAbortError();
  }

  const limit =
    options?.limit ?? HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE;

  const baseQuery = client
    .from(HISTORY_DB_TABLES.CREDIT_APPLICATIONS)
    .select(HISTORY_SELECT_COLUMNS)
    .order(HISTORY_DB_COLUMNS.CREATED_AT, { ascending: false })
    .limit(limit);

  const abortableQuery = baseQuery as unknown as AbortableSelectQuery;
  const executableQuery: PromiseLike<SelectApplicationsQueryResponse> =
    options?.signal && typeof abortableQuery?.abortSignal === 'function'
      ? abortableQuery.abortSignal(options.signal)
      : (baseQuery as unknown as PromiseLike<SelectApplicationsQueryResponse>);

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let abortListener: (() => void) | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(esCR.history.errors.timeoutError));
    }, HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS);
  });

  const raceCandidates: Promise<SelectApplicationsQueryResponse>[] = [
    Promise.resolve(executableQuery),
    timeoutPromise,
  ];

  if (options?.signal) {
    const signal = options.signal;
    raceCandidates.push(
      new Promise<never>((_, reject) => {
        abortListener = (): void => {
          reject(createAbortError());
        };
        signal.addEventListener('abort', abortListener, { once: true });
      }),
    );
  }

  try {
    const { data, error } = await Promise.race(raceCandidates);

    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    if (error) {
      console.error(
        '[history.service] Failed to fetch advisor credit applications:',
        error,
      );
      throw new Error(esCR.history.errors.loadFailed);
    }

    return Array.isArray(data) ? (data as CreditApplicationRow[]) : [];
  } catch (caughtError) {
    if (
      options?.signal?.aborted ||
      (caughtError instanceof Error && caughtError.name === ABORT_ERROR_NAME)
    ) {
      throw createAbortError();
    }

    if (
      caughtError instanceof Error &&
      caughtError.message === esCR.history.errors.loadFailed
    ) {
      throw caughtError;
    }

    console.error(
      '[history.service] Unexpected error fetching advisor credit applications:',
      caughtError,
    );
    throw new Error(esCR.history.errors.loadFailed);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (options?.signal && abortListener) {
      options.signal.removeEventListener('abort', abortListener);
    }
  }
};
