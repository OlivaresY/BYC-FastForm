import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import type { ICreditApplicationRepository } from '../../services/creditApplication.service';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
  type MasterCreditApplicationPayload,
} from '../../types/MasterCreditApplication.types';
import { DraftSubmissionViewModelPageObject } from './useDraftSubmissionViewModel.po';

const createMockMasterPayload = (): MasterCreditApplicationPayload => ({
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
  userId: 'advisor-uuid-001',
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
    consoleErrorSpy.mockRestore();
  });

  it('initializes with isSubmitting as false', () => {
    const repository: ICreditApplicationRepository = {
      submitMasterDraft: jest.fn().mockResolvedValue(undefined),
    };
    const onSuccess = jest.fn();

    const page = DraftSubmissionViewModelPageObject.render({
      onSuccess,
      repository,
    });

    expect(page.isSubmitting).toBe(false);
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

    expect(page.isSubmitting).toBe(false);

    const pendingCall = page.startSubmitDraft(payload);

    expect(page.isSubmitting).toBe(true);
    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledWith(payload);
    expect(onSuccess).not.toHaveBeenCalled();

    await page.settle(async () => {
      resolveSubmission();
      await pendingCall;
    });

    expect(page.isSubmitting).toBe(false);
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

  it('resets isSubmitting to false and does not call onSuccess when repository throws an error', async () => {
    let rejectSubmission!: (reason: Error) => void;
    const submissionPromise = new Promise<void>((_, reject) => {
      rejectSubmission = reject;
    });
    const submissionError = new Error('Network failure');
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

    await page.settle(async () => {
      rejectSubmission(submissionError);
      await pendingCall;
    });

    expect(page.isSubmitting).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
