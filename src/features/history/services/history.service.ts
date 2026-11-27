import type { SupabaseClient } from '@supabase/supabase-js';
import { SELECTED_BANK_CODES } from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  APPLICATION_STATUS_VALUES,
  CREDIT_APPLICATION_REGIMES,
  HISTORY_DATE_LIMITS,
  HISTORY_DB_COLUMNS,
  HISTORY_DB_TABLES,
  HISTORY_ERROR_CLASSIFICATION,
  HISTORY_ERROR_CODES,
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
  FetchAdvisorCreditApplicationsPage,
  HistoryDossierItem,
  HistoryErrorCode,
  MasterCreditApplicationPayload,
  SelectedBankCode,
} from '../types';

export type HistoryCopy = typeof esCR.history;

export interface FetchAdvisorCreditApplicationsOptions {
  limit?: number;
  offset?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

interface SelectApplicationsQueryResponse {
  data: unknown;
  error: unknown;
}

interface AbortableSelectQuery
  extends PromiseLike<SelectApplicationsQueryResponse> {
  abortSignal?: (
    signal: AbortSignal,
  ) => PromiseLike<SelectApplicationsQueryResponse>;
}

interface RangeableOrderedQuery {
  limit?: (count: number) => AbortableSelectQuery;
  range?: (from: number, to: number) => AbortableSelectQuery;
}

const resolveErrorMessageForCode = (
  code: HistoryErrorCode,
  copy: HistoryCopy = esCR.history,
): string => {
  switch (code) {
    case HISTORY_ERROR_CODES.AUTH_REQUIRED:
      return copy.errors.authRequired;
    case HISTORY_ERROR_CODES.NETWORK_ERROR:
      return copy.errors.networkError;
    case HISTORY_ERROR_CODES.TIMEOUT:
      return copy.errors.timeoutError;
    case HISTORY_ERROR_CODES.LOAD_FAILED:
    default:
      return copy.errors.loadFailed;
  }
};

export class HistoryServiceError extends Error {
  public readonly code: HistoryErrorCode;

  public constructor(code: HistoryErrorCode, message?: string) {
    super(message ?? resolveErrorMessageForCode(code));
    this.name = HISTORY_ERROR_CLASSIFICATION.ERROR_NAME;
    this.code = code;
    Object.setPrototypeOf(this, HistoryServiceError.prototype);
  }
}

export const isHistoryServiceError = (
  error: unknown,
): error is HistoryServiceError =>
  error instanceof HistoryServiceError ||
  (error instanceof Error &&
    error.name === HISTORY_ERROR_CLASSIFICATION.ERROR_NAME &&
    'code' in error);

const createAbortError = (): Error => {
  const abortError = new Error(HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME);
  abortError.name = HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME;
  return abortError;
};

const isAbortError = (error: unknown): boolean =>
  (error instanceof Error &&
    error.name === HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME) ||
  (isPlainObject(error) &&
    error.name === HISTORY_INTERNAL_STRINGS.ABORT_ERROR_NAME);

const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const extractErrorDetails = (
  rawError: unknown,
): { code: string; message: string; name: string; status: number | null } => {
  if (rawError instanceof Error) {
    const errorRecord = rawError as Error & { code?: unknown; status?: unknown };
    return {
      code:
        typeof errorRecord.code === 'string'
          ? errorRecord.code.trim()
          : HISTORY_INTERNAL_STRINGS.EMPTY,
      message: rawError.message,
      name: rawError.name,
      status: typeof errorRecord.status === 'number' ? errorRecord.status : null,
    };
  }

  if (isPlainObject(rawError)) {
    const status =
      typeof rawError.status === 'number'
        ? rawError.status
        : typeof rawError.statusCode === 'number'
          ? rawError.statusCode
          : null;

    return {
      code:
        typeof rawError.code === 'string'
          ? rawError.code.trim()
          : HISTORY_INTERNAL_STRINGS.EMPTY,
      message:
        typeof rawError.message === 'string'
          ? rawError.message
          : typeof rawError.details === 'string'
            ? rawError.details
            : HISTORY_INTERNAL_STRINGS.EMPTY,
      name:
        typeof rawError.name === 'string'
          ? rawError.name
          : HISTORY_INTERNAL_STRINGS.EMPTY,
      status,
    };
  }

  return {
    code: HISTORY_INTERNAL_STRINGS.EMPTY,
    message: HISTORY_INTERNAL_STRINGS.EMPTY,
    name: HISTORY_INTERNAL_STRINGS.EMPTY,
    status: null,
  };
};

const classifySupabaseError = (rawError: unknown): HistoryServiceError => {
  if (isHistoryServiceError(rawError)) {
    return rawError;
  }

  const details = extractErrorDetails(rawError);
  const normalizedCode = details.code.toUpperCase();
  const normalizedMessage = details.message.toLowerCase();

  const isAuthError =
    (details.status !== null &&
      HISTORY_ERROR_CLASSIFICATION.AUTH_HTTP_STATUSES.includes(
        details.status,
      )) ||
    HISTORY_ERROR_CLASSIFICATION.AUTH_NAMES.includes(details.name) ||
    HISTORY_ERROR_CLASSIFICATION.AUTH_CODES.includes(normalizedCode) ||
    HISTORY_ERROR_CLASSIFICATION.AUTH_MESSAGE_PATTERNS.some((pattern) =>
      normalizedMessage.includes(pattern),
    );

  if (isAuthError) {
    return new HistoryServiceError(HISTORY_ERROR_CODES.AUTH_REQUIRED);
  }

  const isNetworkError =
    HISTORY_ERROR_CLASSIFICATION.NETWORK_NAMES.includes(details.name) ||
    HISTORY_ERROR_CLASSIFICATION.NETWORK_CODES.includes(normalizedCode) ||
    HISTORY_ERROR_CLASSIFICATION.NETWORK_MESSAGE_PATTERNS.some((pattern) =>
      normalizedMessage.includes(pattern),
    );

  if (isNetworkError) {
    return new HistoryServiceError(HISTORY_ERROR_CODES.NETWORK_ERROR);
  }

  return new HistoryServiceError(HISTORY_ERROR_CODES.LOAD_FAILED);
};

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

const resolveBankDisplayLabels = (
  copy: HistoryCopy,
): Readonly<Record<SelectedBankCode, string>> => ({
  [SELECTED_BANK_CODES.BAC]: copy.banks.bac,
  [SELECTED_BANK_CODES.BNCR]: copy.banks.bncr,
  [SELECTED_BANK_CODES.CARRO_FACIL]: copy.banks.carroFacil,
  [SELECTED_BANK_CODES.PROMERICA]: copy.banks.promerica,
  [SELECTED_BANK_CODES.SCOTIABANK]: copy.banks.scotiabank,
});

const resolvePrimaryBankLabel = (
  selectedBanks: readonly SelectedBankCode[],
  copy: HistoryCopy,
): string => {
  const labelsByCode = resolveBankDisplayLabels(copy);
  const recognizedLabels = selectedBanks
    .filter((bankCode) =>
      Object.prototype.hasOwnProperty.call(labelsByCode, bankCode),
    )
    .map((bankCode) => labelsByCode[bankCode]);

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

const formatDateComponents = (
  year: number,
  monthIndex: number,
  day: number,
  copy: HistoryCopy,
): string => {
  const monthShort = copy.dates.monthsShort[monthIndex];
  if (!monthShort || !Number.isInteger(year) || !Number.isInteger(day)) {
    return copy.cards.dateFallback;
  }

  const paddedDay = String(day).padStart(
    HISTORY_DATE_LIMITS.PAD_WIDTH_CHARS,
    HISTORY_DATE_LIMITS.PAD_ZERO_CHAR,
  );

  return `${paddedDay}${HISTORY_INTERNAL_STRINGS.SPACE}${monthShort}${HISTORY_INTERNAL_STRINGS.SPACE}${year}`;
};

export const formatDossierDate = (
  isoDate: string,
  copy: HistoryCopy = esCR.history,
): string => {
  if (typeof isoDate !== 'string') {
    return copy.cards.dateFallback;
  }

  const trimmedDate = isoDate.trim();
  if (trimmedDate.length === 0) {
    return copy.cards.dateFallback;
  }

  // Date-only strings (YYYY-MM-DD) represent calendar dates rather than UTC midnight.
  const dateOnlyMatch =
    HISTORY_DATE_LIMITS.DATE_ONLY_PATTERN.exec(trimmedDate);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const monthIndex =
      Number(dateOnlyMatch[2]) - HISTORY_DATE_LIMITS.MIN_MONTH_NUMBER;
    const day = Number(dateOnlyMatch[3]);
    const validatedDate = new Date(Date.UTC(year, monthIndex, day));

    if (
      validatedDate.getUTCFullYear() !== year ||
      validatedDate.getUTCMonth() !== monthIndex ||
      validatedDate.getUTCDate() !== day
    ) {
      return copy.cards.dateFallback;
    }

    return formatDateComponents(year, monthIndex, day, copy);
  }

  const parsedTimestampMs = Date.parse(trimmedDate);
  if (Number.isNaN(parsedTimestampMs)) {
    return copy.cards.dateFallback;
  }

  const costaRicaDate = new Date(
    parsedTimestampMs + HISTORY_DATE_LIMITS.COSTA_RICA_UTC_OFFSET_MS,
  );

  return formatDateComponents(
    costaRicaDate.getUTCFullYear(),
    costaRicaDate.getUTCMonth(),
    costaRicaDate.getUTCDate(),
    copy,
  );
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

const sanitizePageSize = (
  requestedPageSize?: number,
  legacyLimit?: number,
): number => {
  const candidate = requestedPageSize ?? legacyLimit;
  if (typeof candidate !== 'number' || !Number.isFinite(candidate)) {
    return HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE;
  }

  const floored = Math.floor(candidate);
  return floored >= HISTORY_QUERY_LIMITS.MIN_PAGE_SIZE
    ? floored
    : HISTORY_QUERY_LIMITS.DEFAULT_DOSSIERS_PAGE_SIZE;
};

const sanitizeOffset = (requestedOffset?: number): number => {
  if (typeof requestedOffset !== 'number' || !Number.isFinite(requestedOffset)) {
    return HISTORY_QUERY_LIMITS.DEFAULT_OFFSET;
  }

  const floored = Math.floor(requestedOffset);
  return floored >= HISTORY_QUERY_LIMITS.DEFAULT_OFFSET
    ? floored
    : HISTORY_QUERY_LIMITS.DEFAULT_OFFSET;
};

export const fetchAdvisorCreditApplications = async (
  client: SupabaseClient = supabase,
  options?: FetchAdvisorCreditApplicationsOptions,
): Promise<FetchAdvisorCreditApplicationsPage> => {
  const callerSignal = options?.signal;
  if (callerSignal?.aborted) {
    throw createAbortError();
  }

  const pageSize = sanitizePageSize(options?.pageSize, options?.limit);
  const offset = sanitizeOffset(options?.offset);
  const requestController = new AbortController();

  let didTimeout = false;
  let didCallerAbort = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let callerAbortListener: (() => void) | undefined;
  let requestAbortListener: (() => void) | undefined;

  if (callerSignal) {
    callerAbortListener = (): void => {
      didCallerAbort = true;
      requestController.abort();
    };
    callerSignal.addEventListener(
      HISTORY_EVENT_NAMES.ABORT,
      callerAbortListener,
      { once: true },
    );
  }

  try {
    const abortPromise = new Promise<never>((_, reject) => {
      requestAbortListener = (): void => {
        if (didTimeout) {
          reject(new HistoryServiceError(HISTORY_ERROR_CODES.TIMEOUT));
          return;
        }
        reject(createAbortError());
      };

      requestController.signal.addEventListener(
        HISTORY_EVENT_NAMES.ABORT,
        requestAbortListener,
        { once: true },
      );
    });

    timeoutId = setTimeout(() => {
      if (!requestController.signal.aborted) {
        didTimeout = true;
        requestController.abort();
      }
    }, HISTORY_QUERY_LIMITS.REQUEST_TIMEOUT_MS);

    const orderedQuery = client
      .from(HISTORY_DB_TABLES.CREDIT_APPLICATIONS)
      .select(HISTORY_SELECT_COLUMNS)
      .order(HISTORY_DB_COLUMNS.CREATED_AT, {
        ascending: false,
      }) as unknown as RangeableOrderedQuery;

    const rangedQuery =
      typeof orderedQuery.range === 'function'
        ? orderedQuery.range(offset, offset + pageSize)
        : orderedQuery.limit?.(pageSize + 1);

    const executableQuery: PromiseLike<SelectApplicationsQueryResponse> =
      rangedQuery && typeof rangedQuery.abortSignal === 'function'
        ? rangedQuery.abortSignal(requestController.signal)
        : (rangedQuery as unknown as PromiseLike<SelectApplicationsQueryResponse>);

    const { data, error } = await Promise.race([
      Promise.resolve(executableQuery),
      abortPromise,
    ]);

    if (didCallerAbort || callerSignal?.aborted) {
      throw createAbortError();
    }

    if (didTimeout) {
      throw new HistoryServiceError(HISTORY_ERROR_CODES.TIMEOUT);
    }

    if (error) {
      if (isAbortError(error)) {
        throw createAbortError();
      }
      console.error(HISTORY_INTERNAL_STRINGS.LOG_FETCH_FAILED, error);
      throw classifySupabaseError(error);
    }

    const fetchedRows = Array.isArray(data)
      ? (data as CreditApplicationRow[])
      : [];
    const hasMore = fetchedRows.length > pageSize;
    const rows = hasMore ? fetchedRows.slice(0, pageSize) : fetchedRows;

    return {
      hasMore,
      nextOffset: offset + pageSize,
      rows,
    };
  } catch (caughtError) {
    if (didCallerAbort || callerSignal?.aborted) {
      throw createAbortError();
    }

    if (didTimeout) {
      throw new HistoryServiceError(HISTORY_ERROR_CODES.TIMEOUT);
    }

    if (isAbortError(caughtError)) {
      throw createAbortError();
    }

    if (isHistoryServiceError(caughtError)) {
      throw caughtError;
    }

    console.error(HISTORY_INTERNAL_STRINGS.LOG_FETCH_UNEXPECTED, caughtError);
    throw classifySupabaseError(caughtError);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (callerSignal && callerAbortListener) {
      callerSignal.removeEventListener(
        HISTORY_EVENT_NAMES.ABORT,
        callerAbortListener,
      );
    }
    if (requestAbortListener) {
      requestController.signal.removeEventListener(
        HISTORY_EVENT_NAMES.ABORT,
        requestAbortListener,
      );
    }
  }
};
