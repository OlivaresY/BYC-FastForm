import type { SupabaseClient } from '@supabase/supabase-js';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  CREDIT_APPLICATION_REGIMES,
  HISTORY_DATE_LIMITS,
  HISTORY_DB_COLUMNS,
  HISTORY_DB_TABLES,
  HISTORY_EVENT_NAMES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_QUERY_LIMITS,
  HISTORY_SELECT_COLUMNS,
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

const createAbortError = (): Error => {
  const abortError = new Error(HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME);
  abortError.name = HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME;
  return abortError;
};

const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const joinNonEmptySegments = (
  segments: readonly (string | undefined | null)[],
  fallback: string,
): string => {
  const cleaned = segments
    .map((segment) =>
      typeof segment === 'string'
        ? segment.trim()
        : HISTORY_INTERNAL_STRINGS.EMPTY,
    )
    .filter((segment) => segment.length > 0);

  return cleaned.length > 0
    ? cleaned.join(HISTORY_INTERNAL_STRINGS.SPACE)
    : fallback;
};

const extractApplicantIdentity = (
  row: CreditApplicationRow,
  copy: HistoryCopy,
): { applicantName: string; identificationNumber: string } => {
  const rawPayload = isPlainObject(row.payload)
    ? (row.payload as Partial<MasterCreditApplicationPayload>)
    : undefined;
  const resolvedRegime = row.regime ?? rawPayload?.regime;
  const applicantSection = isPlainObject(rawPayload?.applicant)
    ? rawPayload.applicant
    : undefined;
  const applicantRegime = applicantSection?.regime;
  const rawValues = isPlainObject(applicantSection?.values)
    ? applicantSection.values
    : undefined;

  if (resolvedRegime === CREDIT_APPLICATION_REGIMES.LEGAL) {
    const canReadLegal =
      applicantRegime === undefined ||
      applicantRegime === CREDIT_APPLICATION_REGIMES.LEGAL;
    const legalValues = canReadLegal
      ? (rawValues as
          | Partial<
              Extract<
                MasterCreditApplicationPayload,
                { regime: 'legal' }
              >['applicant']['values']
            >
          | undefined)
      : undefined;

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

  const canReadPhysical =
    applicantRegime === undefined ||
    applicantRegime === CREDIT_APPLICATION_REGIMES.PHYSICAL;
  const physicalValues = canReadPhysical
    ? (rawValues as
        | Partial<
            Extract<
              MasterCreditApplicationPayload,
              { regime: 'physical' }
            >['applicant']['values']
          >
        | undefined)
    : undefined;

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
  payload: unknown,
  copy: HistoryCopy,
): string => {
  const safePayload = isPlainObject(payload)
    ? (payload as Partial<MasterCreditApplicationPayload>)
    : undefined;
  const vehicle = isPlainObject(safePayload?.vehicleCredit)
    ? safePayload.vehicleCredit
    : undefined;

  return joinNonEmptySegments(
    [vehicle?.marca, vehicle?.modelo, vehicle?.anio],
    copy.cards.vehicleFallback,
  );
};

const resolveSelectedBanks = (row: CreditApplicationRow): SelectedBankCode[] => {
  const rowBanks =
    Array.isArray(row.selected_banks) && row.selected_banks.length > 0
      ? row.selected_banks
      : undefined;
  const payloadBanks =
    isPlainObject(row.payload) && Array.isArray(row.payload.selectedBanks)
      ? row.payload.selectedBanks
      : [];
  const rawBanks: unknown[] = rowBanks ?? payloadBanks;

  const uniqueBanks = new Set<SelectedBankCode>();
  rawBanks.forEach((candidate) => {
    if (typeof candidate === 'string') {
      const normalized = candidate.trim();
      if (normalized.length > 0) {
        uniqueBanks.add(normalized as SelectedBankCode);
      }
    }
  });

  return Array.from(uniqueBanks);
};

const resolvePrimaryBankLabel = (
  selectedBanks: readonly SelectedBankCode[],
  copy: HistoryCopy,
): string => {
  const recognizedLabels = selectedBanks
    .filter((bankCode) =>
      Object.prototype.hasOwnProperty.call(BANK_DISPLAY_LABELS, bankCode),
    )
    .map((bankCode) => BANK_DISPLAY_LABELS[bankCode]);

  const primaryLabel = recognizedLabels[0];
  if (!primaryLabel) {
    return copy.cards.bankFallback;
  }

  if (recognizedLabels.length === 1) {
    return primaryLabel;
  }

  const extraCountText = copy.cards.additionalBanksTemplate.replace(
    HISTORY_TEMPLATE_TOKENS.COUNT,
    String(recognizedLabels.length - 1),
  );

  return `${primaryLabel}${HISTORY_INTERNAL_STRINGS.SPACE}${extraCountText}`;
};

export const formatDossierDate = (
  isoDate: string,
  copy: HistoryCopy = esCR.history,
): string => {
  if (typeof isoDate !== 'string' || isoDate.trim().length === 0) {
    return copy.cards.dateFallback;
  }

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return copy.cards.dateFallback;
  }

  const monthShort = copy.dates.monthsShort[parsedDate.getMonth()];
  if (!monthShort) {
    return copy.cards.dateFallback;
  }

  const day = String(parsedDate.getDate()).padStart(
    HISTORY_DATE_LIMITS.PAD_WIDTH_CHARS,
    HISTORY_DATE_LIMITS.PAD_ZERO_CHAR,
  );
  const year = parsedDate.getFullYear();

  return `${day}${HISTORY_INTERNAL_STRINGS.SPACE}${monthShort}${HISTORY_INTERNAL_STRINGS.SPACE}${year}`;
};

export const formatNotificationRelativeTime = (
  isoDate: string,
  copy: HistoryCopy = esCR.history,
  referenceMs: number = Date.now(),
): string => {
  if (typeof isoDate !== 'string' || isoDate.trim().length === 0) {
    return copy.cards.dateFallback;
  }

  const createdMs = Date.parse(isoDate);
  if (Number.isNaN(createdMs)) {
    return copy.cards.dateFallback;
  }

  const safeReferenceMs = Number.isFinite(referenceMs)
    ? referenceMs
    : Date.now();
  const elapsedMs = Math.max(0, safeReferenceMs - createdMs);

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
  const createdAt =
    typeof row.created_at === 'string'
      ? row.created_at
      : HISTORY_INTERNAL_STRINGS.EMPTY;

  return {
    applicantName,
    canQuickPrint: row.status === APPLICATION_STATUS_VALUES.APPROVED,
    createdAt,
    formattedDate: formatDossierDate(createdAt, copy),
    id: typeof row.id === 'string' ? row.id : HISTORY_INTERNAL_STRINGS.EMPTY,
    identificationNumber,
    primaryBankLabel: resolvePrimaryBankLabel(selectedBanks, copy),
    rawPayload: row.payload,
    regime: row.regime ?? CREDIT_APPLICATION_REGIMES.PHYSICAL,
    selectedBanks,
    status: row.status,
    templateVersion:
      typeof row.template_version === 'string'
        ? row.template_version
        : HISTORY_INTERNAL_STRINGS.EMPTY,
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

  const requestedLimit = options?.limit;
  const limit =
    typeof requestedLimit === 'number' &&
    Number.isFinite(requestedLimit) &&
    requestedLimit > 0
      ? Math.floor(requestedLimit)
      : HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let abortListener: (() => void) | undefined;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(esCR.history.errors.timeoutError));
      }, HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS);
    });

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
          signal.addEventListener(HISTORY_EVENT_NAMES.ABORT, abortListener, {
            once: true,
          });
        }),
      );
    }

    const { data, error } = await Promise.race(raceCandidates);

    if (options?.signal?.aborted) {
      throw createAbortError();
    }

    if (error) {
      console.error(HISTORY_INTERNAL_STRINGS.LOG_FETCH_FAILED, error);
      throw new Error(esCR.history.errors.loadFailed);
    }

    return Array.isArray(data) ? (data as CreditApplicationRow[]) : [];
  } catch (caughtError) {
    if (
      options?.signal?.aborted ||
      (caughtError instanceof Error &&
        caughtError.name === HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME)
    ) {
      throw createAbortError();
    }

    if (
      caughtError instanceof Error &&
      (caughtError.message === esCR.history.errors.loadFailed ||
        caughtError.message === esCR.history.errors.timeoutError)
    ) {
      throw caughtError;
    }

    console.error(HISTORY_INTERNAL_STRINGS.LOG_FETCH_UNEXPECTED, caughtError);
    throw new Error(esCR.history.errors.loadFailed);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (options?.signal && abortListener) {
      options.signal.removeEventListener(
        HISTORY_EVENT_NAMES.ABORT,
        abortListener,
      );
    }
  }
};
