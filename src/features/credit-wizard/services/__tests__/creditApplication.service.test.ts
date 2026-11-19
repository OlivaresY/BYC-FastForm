import type { SupabaseClient } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import { MasterCreditApplicationSchema } from '../../schemas/MasterCreditApplication.schema';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
  type PhysicalMasterCreditApplicationPayload,
} from '../../types/MasterCreditApplication.types';
import {
  CREDIT_APPLICATIONS_TABLE,
  CREDIT_APPLICATION_SERVICE_ERRORS,
  SupabaseCreditApplicationRepository,
} from '../creditApplication.service';

const AUTHENTICATED_USER_ID = '550e8400-e29b-41d4-a716-446655440000' as const;

const createValidPayload = (
  overrides?: Partial<PhysicalMasterCreditApplicationPayload>,
): PhysicalMasterCreditApplicationPayload => ({
  applicant: {
    regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
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
    vehicleBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
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
      employmentStatus: EMPLOYMENT_STATUSES.SALARIED_PRIVATE,
      entryDate: '01-03-2020',
      officePhone: '+506 2210-1010',
      profession: 'Ingeniero de Sistemas',
    },
    financialCapacity: {
      currency: FINANCIAL_CURRENCIES.CRC,
      grossIncome: 2500000,
      netIncome: 2100000,
      otherIncomes: 150000,
    },
    residentialAddress: {
      canton: 'Alajuela',
      district: 'Alajuela',
      exactAddress: '200 metros norte del parque central',
      province: 'Alajuela',
    },
  },
  regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS.PENDING,
  templateVersion: DEFAULT_TEMPLATE_VERSION,
  userId: AUTHENTICATED_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Blanco Perla',
    marca: 'KAIYI',
    modelo: 'X3 Pro',
    moneda: 'USD',
    monto_financiar: 22500,
    monto_prima: 2500,
    plazo_meses: '72',
    valor_vehiculo: 25000,
  },
  ...overrides,
});

interface MockSupabaseHarness {
  abortSignalMock: jest.Mock;
  client: SupabaseClient;
  fromMock: jest.Mock;
  getUserMock: jest.Mock;
  insertMock: jest.Mock;
}

interface MockSupabaseOptions {
  authenticatedUserId?: string | null;
  insertResult?: {
    error: { code?: string; details?: string; message: string } | null;
  };
  withAbortSignalBuilder?: boolean;
  withAuthClient?: boolean;
}

const createMockSupabaseClient = (
  optionsOrInsertResult:
    | MockSupabaseOptions
    | {
        error: { code?: string; details?: string; message: string } | null;
      } = {},
): MockSupabaseHarness => {
  const normalizedOptions: MockSupabaseOptions =
    'error' in optionsOrInsertResult
      ? { insertResult: optionsOrInsertResult }
      : optionsOrInsertResult;

  const insertResult = normalizedOptions.insertResult ?? { error: null };
  const abortSignalMock = jest.fn().mockResolvedValue(insertResult);
  const insertMock = normalizedOptions.withAbortSignalBuilder
    ? jest.fn().mockReturnValue({
        abortSignal: abortSignalMock,
      })
    : jest.fn().mockResolvedValue(insertResult);
  const fromMock = jest.fn().mockReturnValue({
    insert: insertMock,
  });
  const getUserMock = jest.fn().mockResolvedValue({
    data: {
      user:
        normalizedOptions.authenticatedUserId === null ||
        normalizedOptions.authenticatedUserId === undefined
          ? null
          : { id: normalizedOptions.authenticatedUserId },
    },
    error: null,
  });

  const client = {
    ...(normalizedOptions.withAuthClient
      ? { auth: { getUser: getUserMock } }
      : {}),
    from: fromMock,
  } as unknown as SupabaseClient;

  return {
    abortSignalMock,
    client,
    fromMock,
    getUserMock,
    insertMock,
  };
};

describe('SupabaseCreditApplicationRepository', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('validates via MasterCreditApplicationSchema, maps row with user_id, and inserts into Supabase', async () => {
    // Arrange
    const { client, fromMock, insertMock } = createMockSupabaseClient({
      error: null,
    });
    const parseSpy = jest.spyOn(MasterCreditApplicationSchema, 'parse');
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();

    // Act
    await repository.submitMasterDraft(payload);

    // Assert
    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(parseSpy).toHaveBeenCalledWith(payload);
    expect(fromMock).toHaveBeenCalledWith(CREDIT_APPLICATIONS_TABLE);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith({
      payload,
      regime: payload.regime,
      selected_banks: payload.selectedBanks,
      status: payload.status,
      template_version: payload.templateVersion,
      user_id: AUTHENTICATED_USER_ID,
    });
  });

  it('throws ZodError before touching Supabase when an invalid or partial payload is passed', async () => {
    // Arrange
    const { client, fromMock, insertMock } = createMockSupabaseClient();
    const repository = new SupabaseCreditApplicationRepository(client);
    const partialPayload = {
      regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
      userId: AUTHENTICATED_USER_ID,
    } as unknown as PhysicalMasterCreditApplicationPayload;

    // Act & Assert
    await expect(
      repository.submitMasterDraft(partialPayload),
    ).rejects.toBeInstanceOf(ZodError);
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('throws Spanish authentication error before touching Supabase when userId is empty or whitespace', async () => {
    // Arrange
    const { client, fromMock, insertMock } = createMockSupabaseClient();
    const repository = new SupabaseCreditApplicationRepository(client);
    const emptyUserPayload = createValidPayload({ userId: '' });
    const whitespaceUserPayload = createValidPayload({ userId: '   \t\n  ' });

    // Act & Assert
    await expect(
      repository.submitMasterDraft(emptyUserPayload),
    ).rejects.toThrow(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
    await expect(
      repository.submitMasterDraft(whitespaceUserPayload),
    ).rejects.toThrow(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('throws Spanish authentication error before touching Supabase when userId is a mock or placeholder ID', async () => {
    // Arrange
    const { client, fromMock, insertMock } = createMockSupabaseClient();
    const repository = new SupabaseCreditApplicationRepository(client);
    const mockUserPayload = createValidPayload({
      userId: 'mock-uuid-until-auth',
    });
    const placeholderUserPayload = createValidPayload({
      userId: 'placeholder-user-id',
    });

    // Act & Assert
    await expect(repository.submitMasterDraft(mockUserPayload)).rejects.toThrow(
      CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED,
    );
    await expect(
      repository.submitMasterDraft(placeholderUserPayload),
    ).rejects.toThrow(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED);
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('throws a clean Spanish error without leaking raw database internals when Supabase insert fails', async () => {
    // Arrange
    const rawDatabaseError = {
      code: '42501',
      details: 'Failing row contains secret-sql-column=123',
      message:
        'new row violates row-level security policy for table "credit_applications"',
    };
    const { client, insertMock } = createMockSupabaseClient({
      error: rawDatabaseError,
    });
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();

    // Act
    let caughtError: unknown;
    try {
      await repository.submitMasterDraft(payload);
    } catch (error) {
      caughtError = error;
    }

    // Assert
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(caughtError).toBeInstanceOf(Error);
    const message = (caughtError as Error).message;
    expect(message).toBe(CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_FAILED);
    expect(message).not.toContain('42501');
    expect(message).not.toContain('row-level security');
    expect(message).not.toContain('secret-sql-column');
  });

  it('rejects immediately without calling Supabase insert when given an already-aborted AbortSignal', async () => {
    // Arrange
    const { client, fromMock, insertMock } = createMockSupabaseClient();
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();
    const abortController = new AbortController();
    abortController.abort();

    // Act & Assert
    await expect(
      repository.submitMasterDraft(payload, { signal: abortController.signal }),
    ).rejects.toMatchObject({
      message: CREDIT_APPLICATION_SERVICE_ERRORS.SUBMIT_ABORTED,
      name: 'AbortError',
    });
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('forwards options.signal to the Supabase query builder .abortSignal() when supported', async () => {
    // Arrange
    const { abortSignalMock, client, fromMock, insertMock } =
      createMockSupabaseClient({
        withAbortSignalBuilder: true,
      });
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();
    const abortController = new AbortController();

    // Act
    await repository.submitMasterDraft(payload, {
      idempotencyKey: 'byc-draft-test-key',
      signal: abortController.signal,
    });

    // Assert
    expect(fromMock).toHaveBeenCalledWith(CREDIT_APPLICATIONS_TABLE);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(abortSignalMock).toHaveBeenCalledTimes(1);
    expect(abortSignalMock).toHaveBeenCalledWith(abortController.signal);
  });

  it('rejects with AUTH_REQUIRED before .insert() when client.auth.getUser() returns a mismatched user ID', async () => {
    // Arrange
    const { client, fromMock, getUserMock, insertMock } =
      createMockSupabaseClient({
        authenticatedUserId: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        withAuthClient: true,
      });
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();

    // Act & Assert
    await expect(repository.submitMasterDraft(payload)).rejects.toThrow(
      CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED,
    );
    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('allows insert when client.auth.getUser() confirms user ID matches payload.userId', async () => {
    // Arrange
    const { client, fromMock, getUserMock, insertMock } =
      createMockSupabaseClient({
        authenticatedUserId: AUTHENTICATED_USER_ID,
        withAuthClient: true,
      });
    const repository = new SupabaseCreditApplicationRepository(client);
    const payload = createValidPayload();

    // Act
    await repository.submitMasterDraft(payload);

    // Assert
    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith(CREDIT_APPLICATIONS_TABLE);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });
});
