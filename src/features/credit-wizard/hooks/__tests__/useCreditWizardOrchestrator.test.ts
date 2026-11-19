import { esCR } from '@/shared/i18n';
import { supabase } from '@/shared/lib/supabaseClient';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import type { ICreditApplicationRepository } from '../../services/creditApplication.service';
import type { PhysicalApplicantStepData } from '../../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
} from '../../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../../types/PhysicalPersonContact.types';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';
import {
  AUTH_RESOLUTION_TIMEOUT_MS,
  WIZARD_STEPS,
} from '../useCreditWizardOrchestrator';
import { CreditWizardOrchestratorHookPageObject } from './useCreditWizardOrchestrator.po';

const VALID_CR_IBAN = 'CR05015202001026284066';
const AUTHENTICATED_USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const DIFFERENT_USER_ID = '660e8400-e29b-41d4-a716-446655449999';

const mockPhysicalStep1Data: PhysicalApplicantStepData = {
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
};

const mockPhysicalStep2Data: PhysicalPersonContact = {
  commercialReference: {
    companyReference: 'Corporación CoriMotors S.A.',
    ibanAccount: VALID_CR_IBAN,
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
};

const mockStep3Data: VehicleCreditFormValues = {
  anio: '2026',
  color: 'Blanco Perla',
  marca: 'KAIYI',
  modelo: 'X3 Pro',
  moneda: 'USD',
  monto_financiar: 22500,
  monto_prima: 2500,
  plazo_meses: '72',
  valor_vehiculo: 25000,
};

const mockStep4Data: BankAuthorizationsFormValues = {
  autoriza_buros_credito: true,
  autoriza_sugef_cic: true,
  banco_bac: true,
  banco_bncr: false,
  banco_carro_facil: false,
  banco_promerica: false,
  banco_scotiabank: true,
};

describe('useCreditWizardOrchestrator', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves the real authenticated user ID via resolveAuthenticatedUserId and passes it to submitMasterDraft', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue(AUTHENTICATED_USER_ID);
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorHookPageObject.render({
      onSubmissionSuccess,
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert
    expect(resolveAuthenticatedUserId).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        applicant: mockPhysicalStep1Data,
        bankAuthorizations: mockStep4Data,
        contact: mockPhysicalStep2Data,
        regime: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
        selectedBanks: [
          SELECTED_BANK_CODES.BAC,
          SELECTED_BANK_CODES.SCOTIABANK,
        ],
        status: APPLICATION_STATUS.PENDING,
        templateVersion: DEFAULT_TEMPLATE_VERSION,
        userId: AUTHENTICATED_USER_ID,
        vehicleCredit: mockStep3Data,
      }),
      expect.objectContaining({
        idempotencyKey: expect.any(String),
        signal: expect.any(AbortSignal),
      }),
    );
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
    expect(page.current.hasSubmittedSuccessfully).toBe(true);
    expect(page.current.isSubmitted).toBe(true);
    expect(page.current.draftState).toEqual({});
    expect(page.current.submitError).toBeNull();
  });

  it('always invokes default supabase.auth.getUser() even when explicit userId is provided and blocks mismatches', async () => {
    // Arrange
    const getUserSpy = jest.spyOn(supabase.auth, 'getUser').mockResolvedValue({
      data: {
        user: {
          id: DIFFERENT_USER_ID,
        },
      },
      error: null,
    } as never);
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };

    const page = CreditWizardOrchestratorHookPageObject.render({
      repository,
      userId: AUTHENTICATED_USER_ID,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert: auth check was NOT bypassed, mismatch rejected submission
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).not.toHaveBeenCalled();
    expect(page.current.hasSubmittedSuccessfully).toBe(false);
    expect(page.current.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.authErrorMessage,
    );
  });

  it('allows submission when explicit userId matches resolveAuthenticatedUserId result', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue(AUTHENTICATED_USER_ID);

    const page = CreditWizardOrchestratorHookPageObject.render({
      repository,
      resolveAuthenticatedUserId,
      userId: AUTHENTICATED_USER_ID,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert
    expect(resolveAuthenticatedUserId).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(page.current.isSubmitted).toBe(true);
  });

  it('blocks submission with a Spanish authentication error and never calls submitMasterDraft when session user is missing or invalid', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest.fn().mockResolvedValue(null);
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorHookPageObject.render({
      onSubmissionSuccess,
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert
    expect(resolveAuthenticatedUserId).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).not.toHaveBeenCalled();
    expect(onSubmissionSuccess).not.toHaveBeenCalled();
    expect(page.current.hasSubmittedSuccessfully).toBe(false);
    expect(page.current.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.authErrorMessage,
    );
    expect(page.current.draftState.step1).toEqual(mockPhysicalStep1Data);
  });

  it('blocks mock/placeholder user IDs cleanly before submission', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue('mock-uuid-until-auth');

    const page = CreditWizardOrchestratorHookPageObject.render({
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert
    expect(submitMasterDraft).not.toHaveBeenCalled();
    expect(page.current.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.authErrorMessage,
    );
  });

  it('enforces AUTH_RESOLUTION_TIMEOUT_MS on stalled auth calls, exposes Spanish timeout error, and resets isSubmitting', async () => {
    // Arrange
    jest.useFakeTimers();

    const stalledAuthResolver = jest.fn(
      () => new Promise<string | null>(() => undefined),
    );
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };

    const page = CreditWizardOrchestratorHookPageObject.render({
      repository,
      resolveAuthenticatedUserId: stalledAuthResolver,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    const pendingSubmit = page.startSubmitStep4(mockStep4Data);
    expect(page.current.isSubmitting).toBe(true);

    await page.advanceTimers(AUTH_RESOLUTION_TIMEOUT_MS);
    await page.settle(async () => {
      await pendingSubmit;
    });

    // Assert
    expect(stalledAuthResolver).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).not.toHaveBeenCalled();
    expect(page.current.isSubmitting).toBe(false);
    expect(page.current.isSubmitted).toBe(false);
    expect(page.current.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.timeoutErrorMessage,
    );
  });

  it('preserves strict isSubmitted invariant (submitError remains null) even if onSubmissionSuccess throws after persistence succeeds', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue(AUTHENTICATED_USER_ID);
    const onSubmissionSuccess = jest
      .fn()
      .mockRejectedValue(new Error('Navigation stack error'));

    const page = CreditWizardOrchestratorHookPageObject.render({
      onSubmissionSuccess,
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    await page.submitStep4(mockStep4Data);

    // Assert: committed persistence guarantees isSubmitted=true and submitError=null
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
    expect(page.current.hasSubmittedSuccessfully).toBe(true);
    expect(page.current.isSubmitted).toBe(true);
    expect(page.current.isSubmitting).toBe(false);
    expect(page.current.draftState).toEqual({});
    expect(page.current.submitError).toBeNull();

    // Subsequent clicks remain blocked
    await page.submitStep4(mockStep4Data);
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
  });

  it('atomically marks submitted and blocks duplicate resubmission or backwards navigation until restarted', async () => {
    // Arrange
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue(AUTHENTICATED_USER_ID);
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorHookPageObject.render({
      onSubmissionSuccess,
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act: first valid submission
    await page.submitStep4(mockStep4Data);

    expect(page.current.hasSubmittedSuccessfully).toBe(true);
    expect(page.current.isSubmitted).toBe(true);
    expect(page.current.currentStep).toBe(WIZARD_STEPS.STEP_4);

    // Act: duplicate submission attempt on locked Step 4 + backward navigation attempt
    await page.submitStep4(mockStep4Data);
    page.goBack();

    // Assert: second submission and backward step change are completely blocked
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(resolveAuthenticatedUserId).toHaveBeenCalledTimes(1);
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
    expect(page.current.currentStep).toBe(WIZARD_STEPS.STEP_4);

    // Act: restartWizard opens a clean new application flow
    page.restartWizard();

    expect(page.current.hasSubmittedSuccessfully).toBe(false);
    expect(page.current.isSubmitted).toBe(false);
    expect(page.current.currentStep).toBe(WIZARD_STEPS.STEP_1);
    expect(page.current.draftState).toEqual({});

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );
    await page.submitStep4(mockStep4Data);

    expect(submitMasterDraft).toHaveBeenCalledTimes(2);
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(2);
  });

  it('prevents concurrent double-tap submissions while auth or network request is already in flight', async () => {
    // Arrange
    let resolveAuth!: (value: string | null) => void;
    const authPromise = new Promise<string | null>((resolve) => {
      resolveAuth = resolve;
    });
    const resolveAuthenticatedUserId = jest.fn().mockReturnValue(authPromise);
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };

    const page = CreditWizardOrchestratorHookPageObject.render({
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act
    const firstTap = page.startSubmitStep4(mockStep4Data);
    const secondTap = page.startSubmitStep4(mockStep4Data);

    expect(page.current.isSubmitting).toBe(true);
    expect(resolveAuthenticatedUserId).toHaveBeenCalledTimes(1);

    await page.settle(async () => {
      resolveAuth(AUTHENTICATED_USER_ID);
      await Promise.all([firstTap, secondTap]);
    });

    // Assert
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(page.current.hasSubmittedSuccessfully).toBe(true);
  });

  it('preserves draft state and exposes Spanish submitError on network failure so the user can retry safely', async () => {
    // Arrange
    const submitMasterDraft = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network request failed'))
      .mockResolvedValueOnce(undefined);
    const repository: ICreditApplicationRepository = { submitMasterDraft };
    const resolveAuthenticatedUserId = jest
      .fn()
      .mockResolvedValue(AUTHENTICATED_USER_ID);
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorHookPageObject.render({
      onSubmissionSuccess,
      repository,
      resolveAuthenticatedUserId,
    });

    page.completeThroughStep3(
      mockPhysicalStep1Data,
      mockPhysicalStep2Data,
      mockStep3Data,
    );

    // Act 1: failing submission preserves draft and exposes Spanish error
    await page.submitStep4(mockStep4Data);

    expect(page.current.hasSubmittedSuccessfully).toBe(false);
    expect(onSubmissionSuccess).not.toHaveBeenCalled();
    expect(page.current.draftState.step1).toEqual(mockPhysicalStep1Data);
    expect(page.current.draftState.step4).toEqual(mockStep4Data);
    expect(page.current.submitError).toBe(
      esCR.creditWizard.masterDraftSubmission.errorMessage,
    );

    // Act 2: manual clear and retry succeed cleanly
    page.clearSubmitError();
    expect(page.current.submitError).toBeNull();

    await page.submitStep4(mockStep4Data);

    expect(page.current.hasSubmittedSuccessfully).toBe(true);
    expect(page.current.submitError).toBeNull();
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
  });
});
