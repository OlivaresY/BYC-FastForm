import { createHash } from 'node:crypto';
import { esCR } from '@/shared/i18n';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import {
  CREDIT_APPLICATION_SERVICE_ERRORS,
  type ICreditApplicationRepository,
  type SubmitMasterDraftOptions,
} from '../../services/creditApplication.service';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
  type MasterCreditApplicationPayload,
  type PhysicalMasterCreditApplicationPayload,
} from '../../types/MasterCreditApplication.types';
import {
  SUBMISSION_TIMEOUT_MS,
  buildPayloadIdempotencyKey,
} from '../useDraftSubmissionViewModel';
import { DraftSubmissionViewModelPageObject } from './useDraftSubmissionViewModel.po';

const INITIAL_AUTHORIZATIONS: BankAuthorizationsFormValues = {
  autoriza_buros_credito: true,
  autoriza_sugef_cic: true,
  banco_bac: true,
  banco_bncr: false,
  banco_carro_facil: false,
  banco_promerica: false,
  banco_scotiabank: false,
};

const createMockMasterPayload = (): PhysicalMasterCreditApplicationPayload => ({
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
  bankAuthorizations: { ...INITIAL_AUTHORIZATIONS },
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
  userId: '550e8400-e29b-41d4-a716-446655440000',
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
});

describe('useDraftSubmissionViewModel', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('initializes with isSubmitting as false and submitError as null', () => {
    const repository: ICreditApplicationRepository = {
      submitMasterDraft: jest.fn().mockResolvedValue(undefined),
    };
    const onSuccess = jest.fn();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    expect(page.isSubmitting).toBe(false);
    expect(page.submitError).toBeNull();
    expect(repository.submitMasterDraft).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('toggles isSubmitting from false to true while submitting and resets to false on success', async () => {
    let resolveSubmission!: () => void;
    const submissionPromise = new Promise<void>((resolve) => {
      resolveSubmission = resolve;
    });
    const submitMasterDraft = jest.fn().mockReturnValue(submissionPromise);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    const pendingCall = page.startSubmitDraft(payload);

    expect(page.isSubmitting).toBe(true);
    expect(page.submitError).toBeNull();
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledWith(payload, {
      idempotencyKey: buildPayloadIdempotencyKey(payload),
      signal: expect.any(AbortSignal),
    });
    expect(onSuccess).not.toHaveBeenCalled();

    await page.settle(async () => {
      resolveSubmission();
      await pendingCall;
    });

    expect(page.isSubmitting).toBe(false);
    expect(page.submitError).toBeNull();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('prevents concurrent duplicate submissions while a request is already in flight', async () => {
    let resolveSubmission!: () => void;
    const submissionPromise = new Promise<void>((resolve) => {
      resolveSubmission = resolve;
    });
    const submitMasterDraft = jest.fn().mockReturnValue(submissionPromise);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    const firstCall = page.startSubmitDraft(payload);
    const secondCall = page.startSubmitDraft(payload);

    expect(submitMasterDraft).toHaveBeenCalledTimes(1);

    await page.settle(async () => {
      resolveSubmission();
      await Promise.all([firstCall, secondCall]);
    });

    expect(page.isSubmitting).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('populates Spanish submitError without silent console.error swallowing when repository rejects with a network error', async () => {
    let rejectSubmission!: (reason: Error) => void;
    const submissionPromise = new Promise<void>((_, reject) => {
      rejectSubmission = reject;
    });
    const submitMasterDraft = jest.fn().mockReturnValue(submissionPromise);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    const pendingCall = page.startHandleSubmit(payload);

    expect(page.isSubmitting).toBe(true);

    await page.settle(async () => {
      rejectSubmission(new Error('Network failure'));
      await pendingCall;
    });

    expect(page.isSubmitting).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(page.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.errorMessage,
    );
  });

  it('preserves canonical Spanish domain auth error messages from the repository', async () => {
    const submitMasterDraft = jest
      .fn()
      .mockRejectedValue(
        new Error(CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED),
      );
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    await page.settle(async () => {
      await page.startHandleSubmit(payload);
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(page.submitError).toBe(
      CREDIT_APPLICATION_SERVICE_ERRORS.AUTH_REQUIRED,
    );
  });

  it('clears submitError immediately on retry, via clearSubmitError(), or when authorization checkboxes change', async () => {
    const submitMasterDraft = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network timeout'))
      .mockRejectedValueOnce(new Error('Connection lost'))
      .mockResolvedValueOnce(undefined);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const initialProps = {
      authorizationValues: INITIAL_AUTHORIZATIONS,
      onSuccess,
      repository,
    };
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render(initialProps);

    await page.settle(async () => {
      await page.startHandleSubmit(payload);
    });
    expect(page.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.errorMessage,
    );

    // Clear automatically when any authorization checkbox toggles
    page.rerenderWithAuthorizations(initialProps, {
      ...INITIAL_AUTHORIZATIONS,
      banco_bncr: true,
    });
    expect(page.submitError).toBeNull();

    // Verify manual clearSubmitError() and safe retry after another failure
    await page.settle(async () => {
      await page.startHandleSubmit(payload);
    });
    expect(page.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.errorMessage,
    );

    page.clearSubmitError();
    expect(page.submitError).toBeNull();

    // Retry succeeds cleanly without duplicating submissions
    await page.settle(async () => {
      await page.startHandleSubmit(payload);
    });

    expect(page.submitError).toBeNull();
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledTimes(3);
  });

  it('aborts the active request signal after SUBMISSION_TIMEOUT_MS and populates Spanish timeout message', async () => {
    jest.useFakeTimers();

    const capturedOptions: (SubmitMasterDraftOptions | undefined)[] = [];
    const submitMasterDraft = jest.fn(
      (
        _payload: MasterCreditApplicationPayload,
        options?: SubmitMasterDraftOptions,
      ) => {
        capturedOptions.push(options);
        return new Promise<void>(() => undefined);
      },
    );
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    const pendingCall = page.startHandleSubmit(payload);
    expect(page.isSubmitting).toBe(true);
    expect(capturedOptions[0]?.signal).toBeInstanceOf(AbortSignal);
    expect(capturedOptions[0]?.signal?.aborted).toBe(false);

    await page.advanceTimers(SUBMISSION_TIMEOUT_MS);
    await page.settle(async () => {
      await pendingCall;
    });

    expect(capturedOptions[0]?.signal?.aborted).toBe(true);
    expect(page.isSubmitting).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(page.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.timeoutErrorMessage,
    );
  });

  it('reuses identical deterministic idempotencyKey when retrying the same payload after a timeout and aborts the previous controller cleanly', async () => {
    jest.useFakeTimers();

    const capturedOptions: (SubmitMasterDraftOptions | undefined)[] = [];
    const submitMasterDraft = jest
      .fn<
        Promise<void>,
        [MasterCreditApplicationPayload, SubmitMasterDraftOptions?]
      >()
      .mockImplementationOnce((_payload, options) => {
        capturedOptions.push(options);
        return new Promise<void>(() => undefined);
      })
      .mockImplementationOnce((_payload, options) => {
        capturedOptions.push(options);
        return Promise.resolve();
      });

    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSuccess = jest.fn();
    const payload = createMockMasterPayload();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    const timedOutAttempt = page.startHandleSubmit(payload);
    await page.advanceTimers(SUBMISSION_TIMEOUT_MS);
    await page.settle(async () => {
      await timedOutAttempt;
    });

    expect(capturedOptions).toHaveLength(1);
    expect(capturedOptions[0]?.signal?.aborted).toBe(true);
    expect(page.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.timeoutErrorMessage,
    );

    await page.settle(async () => {
      await page.startHandleSubmit(payload);
    });

    expect(capturedOptions).toHaveLength(2);
    expect(capturedOptions[0]?.idempotencyKey).toBe(
      buildPayloadIdempotencyKey(payload),
    );
    expect(capturedOptions[1]?.idempotencyKey).toBe(
      capturedOptions[0]?.idempotencyKey,
    );
    expect(capturedOptions[1]?.signal).not.toBe(capturedOptions[0]?.signal);
    expect(capturedOptions[1]?.signal?.aborted).toBe(false);
    expect(page.isSubmitting).toBe(false);
    expect(page.submitError).toBeNull();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('produces a new idempotencyKey when any draft field changes and aborts in-flight signal on unmount', async () => {
    const capturedSignals: (AbortSignal | undefined)[] = [];
    const submitMasterDraft = jest.fn(
      (
        _payload: MasterCreditApplicationPayload,
        options?: SubmitMasterDraftOptions,
      ) => {
        capturedSignals.push(options?.signal);
        return new Promise<void>(() => undefined);
      },
    );
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const initialPayload = createMockMasterPayload();
    const modifiedPayload: MasterCreditApplicationPayload = {
      ...initialPayload,
      vehicleCredit: {
        ...initialPayload.vehicleCredit,
        monto_financiar: 23000,
      },
    };

    expect(buildPayloadIdempotencyKey(initialPayload)).not.toBe(
      buildPayloadIdempotencyKey(modifiedPayload),
    );

    const page = DraftSubmissionViewModelPageObject.render({
      repository,
    });

    const pendingCall = page.startHandleSubmit(initialPayload);
    expect(capturedSignals[0]?.aborted).toBe(false);

    page.unmount();
    expect(capturedSignals[0]?.aborted).toBe(true);

    await page.settle(async () => {
      await pendingCall;
    });
  });

  it('produces a deterministic 64-char SHA-256 hex digest matching UTF-8 canonical payload bytes and changing on any edit', () => {
    const payload = createMockMasterPayload();
    const idempotencyKey = buildPayloadIdempotencyKey(payload);

    const sha256Pattern = new RegExp(
      `^byc-draft-${payload.userId}-([0-9a-f]{64})$`,
    );
    const match = idempotencyKey.match(sha256Pattern);
    expect(match).not.toBeNull();

    const canonicalJson = JSON.stringify({
      applicant: {
        regime: payload.applicant.regime,
        values: {
          birthDate: payload.applicant.values.birthDate,
          firstLastName: payload.applicant.values.firstLastName,
          firstName: payload.applicant.values.firstName,
          gender: payload.applicant.values.gender,
          identificationNumber: payload.applicant.values.identificationNumber,
          identificationType: payload.applicant.values.identificationType,
          maritalStatus: payload.applicant.values.maritalStatus,
          middleName: payload.applicant.values.middleName,
          nationality: payload.applicant.values.nationality,
          nationalityOther: payload.applicant.values.nationalityOther,
          secondLastName: payload.applicant.values.secondLastName,
        },
        vehicleBeneficiary: payload.applicant.vehicleBeneficiary,
      },
      bankAuthorizations: {
        autoriza_buros_credito:
          payload.bankAuthorizations.autoriza_buros_credito,
        autoriza_sugef_cic: payload.bankAuthorizations.autoriza_sugef_cic,
        banco_bac: payload.bankAuthorizations.banco_bac,
        banco_bncr: payload.bankAuthorizations.banco_bncr,
        banco_carro_facil: payload.bankAuthorizations.banco_carro_facil,
        banco_promerica: payload.bankAuthorizations.banco_promerica,
        banco_scotiabank: payload.bankAuthorizations.banco_scotiabank,
      },
      contact: {
        commercialReference: {
          companyReference:
            payload.contact.commercialReference.companyReference,
          ibanAccount: payload.contact.commercialReference.ibanAccount,
          referencePhone: payload.contact.commercialReference.referencePhone,
        },
        contactInfo: {
          cellPhone: payload.contact.contactInfo.cellPhone,
          email: payload.contact.contactInfo.email,
          homePhone: payload.contact.contactInfo.homePhone,
        },
        employmentData: {
          employer: payload.contact.employmentData.employer,
          employmentStatus: payload.contact.employmentData.employmentStatus,
          entryDate: payload.contact.employmentData.entryDate,
          officePhone: payload.contact.employmentData.officePhone,
          profession: payload.contact.employmentData.profession,
        },
        financialCapacity: {
          currency: payload.contact.financialCapacity.currency,
          grossIncome: payload.contact.financialCapacity.grossIncome,
          netIncome: payload.contact.financialCapacity.netIncome,
          otherIncomes: payload.contact.financialCapacity.otherIncomes,
        },
        residentialAddress: {
          canton: payload.contact.residentialAddress.canton,
          district: payload.contact.residentialAddress.district,
          exactAddress: payload.contact.residentialAddress.exactAddress,
          province: payload.contact.residentialAddress.province,
        },
      },
      regime: payload.regime,
      selectedBanks: payload.selectedBanks,
      status: payload.status,
      templateVersion: payload.templateVersion,
      userId: payload.userId,
      vehicleCredit: {
        anio: payload.vehicleCredit.anio,
        color: payload.vehicleCredit.color,
        marca: payload.vehicleCredit.marca,
        modelo: payload.vehicleCredit.modelo,
        moneda: payload.vehicleCredit.moneda,
        monto_financiar: payload.vehicleCredit.monto_financiar,
        monto_prima: payload.vehicleCredit.monto_prima,
        plazo_meses: payload.vehicleCredit.plazo_meses,
        valor_vehiculo: payload.vehicleCredit.valor_vehiculo,
      },
    });
    const expectedSha256 = createHash('sha256')
      .update(canonicalJson, 'utf8')
      .digest('hex');

    expect(match?.[1]).toBe(expectedSha256);

    const reorderedKeysPayload: PhysicalMasterCreditApplicationPayload = {
      userId: payload.userId,
      templateVersion: payload.templateVersion,
      status: payload.status,
      selectedBanks: [...payload.selectedBanks],
      regime: payload.regime,
      vehicleCredit: { ...payload.vehicleCredit },
      contact: { ...payload.contact },
      bankAuthorizations: { ...payload.bankAuthorizations },
      applicant: { ...payload.applicant },
    };
    expect(buildPayloadIdempotencyKey(reorderedKeysPayload)).toBe(
      idempotencyKey,
    );

    const editedPayload: PhysicalMasterCreditApplicationPayload = {
      ...payload,
      applicant: {
        ...payload.applicant,
        values: {
          ...payload.applicant.values,
          firstName: 'María José',
        },
      },
    };
    const editedKey = buildPayloadIdempotencyKey(editedPayload);
    expect(editedKey).toMatch(sha256Pattern);
    expect(editedKey).not.toBe(idempotencyKey);
  });
});
