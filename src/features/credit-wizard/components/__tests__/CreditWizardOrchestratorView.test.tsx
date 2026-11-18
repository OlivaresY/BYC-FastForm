import type React from 'react';
import { LEGAL_ENTITY_SELECTOR_ENTITIES } from '../../constants/LegalEntitySelector.constants';
import { EMPLOYMENT_STATUSES } from '../../constants/PhysicalPersonContact.constants';
import { FINANCIAL_CURRENCIES } from '../../constants/SharedCatalogs.constants';
import { VEHICLE_BENEFICIARY_SECTION_ENTITIES } from '../../constants/VehicleBeneficiarySection.constants';
import { MOCK_AUTH_USER_ID } from '../../hooks/useCreditWizardOrchestrator';
import type { ICreditApplicationRepository } from '../../services/creditApplication.service';
import type {
  ApplicantStepViewProps,
  LegalApplicantStepData,
  PhysicalApplicantStepData,
} from '../../types/ApplicantStepView.types';
import type { BankAuthorizationsFormValues } from '../../types/BankAuthorizations.types';
import type { LegalEntityContact } from '../../types/LegalEntityContact.types';
import type { LegalEntityContactStepViewProps } from '../../types/LegalEntityContactStepView.types';
import {
  APPLICATION_STATUS,
  DEFAULT_TEMPLATE_VERSION,
  SELECTED_BANK_CODES,
} from '../../types/MasterCreditApplication.types';
import type { PhysicalPersonContact } from '../../types/PhysicalPersonContact.types';
import type { PhysicalPersonContactStepViewProps } from '../../types/PhysicalPersonContactStepView.types';
import type { VehicleCreditFormValues } from '../../types/VehicleCredit.types';
import type { BankAuthorizationsStepViewProps } from '../BankAuthorizationsStepView';
import type { VehicleCreditStepViewProps } from '../VehicleCreditStepView';
import {
  CreditWizardOrchestratorPageObject,
  MOCK_STEP_TEST_IDS,
} from './CreditWizardOrchestratorView.po';

const VALID_CR_IBAN = 'CR05015202001026284066';

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

const mockLegalStep1Data: LegalApplicantStepData = {
  regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
  values: {
    identificationNumber: '3-101-123456',
    identificationType: 'legal_id',
    legalName: 'CoriMotors Inversiones S.A.',
    representativeIdentification: '1-1234-0567',
    representativeName: 'Carlos Rodríguez Castro',
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

const mockLegalStep2Data: LegalEntityContact = {
  commercialActivity: {
    accountingPhone: '+506 2200-1111',
    constitutionDate: '10-05-2015',
    economicSector: 'Comercio',
    economicSectorOther: '',
    employeesCount: 35,
    mainActivity: 'Importación y venta de vehículos',
  },
  commercialAddress: {
    canton: 'Alajuela',
    district: 'Alajuela',
    exactAddress: 'Edificio Corporativo CoriMotors, Piso 2',
    province: 'Alajuela',
  },
  commercialReference: {
    companyReference: 'Distribuidora Automotriz S.A.',
    ibanAccount: VALID_CR_IBAN,
    referencePhone: '+506 2299-9999',
  },
  contactInfo: {
    cellPhone: '+506 8888-1234',
    email: 'finanzas@corimotors.cr',
    officePhone: '+506 2200-2222',
  },
  financialStatements: {
    currency: FINANCIAL_CURRENCIES.USD,
    grossSales: 500000,
    netProfit: 120000,
    otherIncomes: 15000,
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

interface CapturedStepProps {
  step1?: ApplicantStepViewProps;
  step2Legal?: LegalEntityContactStepViewProps;
  step2Physical?: PhysicalPersonContactStepViewProps;
  step3?: VehicleCreditStepViewProps;
  step4?: BankAuthorizationsStepViewProps;
}

const mockCapturedProps: CapturedStepProps = {};

jest.mock('../ApplicantStepView', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { Pressable: MockPressable, View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    ApplicantStepView: (props: ApplicantStepViewProps): React.JSX.Element => {
      mockCapturedProps.step1 = props;
      return MockReact.createElement(
        MockView,
        { testID: MOCK_STEP_TEST_IDS.STEP_1_CONTAINER },
        MockReact.createElement(MockPressable, {
          onPress: () => props.onSubmit?.(mockPhysicalStep1Data),
          testID: MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_PHYSICAL,
        }),
        MockReact.createElement(MockPressable, {
          onPress: () => props.onSubmit?.(mockLegalStep1Data),
          testID: MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_LEGAL,
        }),
      );
    },
  };
});

jest.mock('../PhysicalPersonContactStepView', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { Pressable: MockPressable, View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    PhysicalPersonContactStepView: (
      props: PhysicalPersonContactStepViewProps,
    ): React.JSX.Element => {
      mockCapturedProps.step2Physical = props;
      return MockReact.createElement(
        MockView,
        { testID: MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_CONTAINER },
        MockReact.createElement(MockPressable, {
          onPress: props.onBack,
          testID: MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_BACK,
        }),
        MockReact.createElement(MockPressable, {
          onPress: () => props.onSubmit?.(mockPhysicalStep2Data),
          testID: MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_SUBMIT,
        }),
      );
    },
  };
});

jest.mock('../LegalEntityContactStepView', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { Pressable: MockPressable, View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    LegalEntityContactStepView: (
      props: LegalEntityContactStepViewProps,
    ): React.JSX.Element => {
      mockCapturedProps.step2Legal = props;
      return MockReact.createElement(
        MockView,
        { testID: MOCK_STEP_TEST_IDS.STEP_2_LEGAL_CONTAINER },
        MockReact.createElement(MockPressable, {
          onPress: props.onBack,
          testID: MOCK_STEP_TEST_IDS.STEP_2_LEGAL_BACK,
        }),
        MockReact.createElement(MockPressable, {
          onPress: () => props.onSubmit?.(mockLegalStep2Data),
          testID: MOCK_STEP_TEST_IDS.STEP_2_LEGAL_SUBMIT,
        }),
      );
    },
  };
});

jest.mock('../VehicleCreditStepView', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { Pressable: MockPressable, View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    VehicleCreditStepView: (
      props: VehicleCreditStepViewProps,
    ): React.JSX.Element => {
      mockCapturedProps.step3 = props;
      return MockReact.createElement(
        MockView,
        { testID: MOCK_STEP_TEST_IDS.STEP_3_CONTAINER },
        MockReact.createElement(MockPressable, {
          onPress: props.onBack,
          testID: MOCK_STEP_TEST_IDS.STEP_3_BACK,
        }),
        MockReact.createElement(MockPressable, {
          onPress: () => props.onSubmit?.(mockStep3Data),
          testID: MOCK_STEP_TEST_IDS.STEP_3_SUBMIT,
        }),
      );
    },
  };
});

jest.mock('../BankAuthorizationsStepView', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const {
    Pressable: MockPressable,
    Text: MockText,
    View: MockView,
  } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    BankAuthorizationsStepView: (
      props: BankAuthorizationsStepViewProps,
    ): React.JSX.Element => {
      mockCapturedProps.step4 = props;
      return MockReact.createElement(
        MockView,
        { testID: MOCK_STEP_TEST_IDS.STEP_4_CONTAINER },
        MockReact.createElement(
          MockText,
          { testID: MOCK_STEP_TEST_IDS.STEP_4_IS_SUBMITTING },
          String(Boolean(props.isSubmitting)),
        ),
        MockReact.createElement(MockPressable, {
          onPress: props.onBack,
          testID: MOCK_STEP_TEST_IDS.STEP_4_BACK,
        }),
        MockReact.createElement(MockPressable, {
          onPress: () => {
            void props.onSubmit?.(mockStep4Data);
          },
          testID: MOCK_STEP_TEST_IDS.STEP_4_SUBMIT,
        }),
      );
    },
  };
});

describe('CreditWizardOrchestratorView Integration Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCapturedProps.step1 = undefined;
    mockCapturedProps.step2Legal = undefined;
    mockCapturedProps.step2Physical = undefined;
    mockCapturedProps.step3 = undefined;
    mockCapturedProps.step4 = undefined;
  });

  it('renders Step 1 initially with WizardProgressHeader synced to step 1', () => {
    const repository: ICreditApplicationRepository = {
      submitMasterDraft: jest.fn().mockResolvedValue(undefined),
    };

    const page = CreditWizardOrchestratorPageObject.render({ repository });

    expect(page.progressHeader).toBeTruthy();
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_1_CONTAINER)).toBeTruthy();
    expect(
      page.queryStep(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_CONTAINER),
    ).toBeNull();
    expect(
      page.queryStep(MOCK_STEP_TEST_IDS.STEP_2_LEGAL_CONTAINER),
    ).toBeNull();
    expect(page.queryStep(MOCK_STEP_TEST_IDS.STEP_3_CONTAINER)).toBeNull();
    expect(page.queryStep(MOCK_STEP_TEST_IDS.STEP_4_CONTAINER)).toBeNull();
  });

  it('routes a complete Physical Person application through Steps 1 -> 2 -> 3 -> 4 and submits via mocked repository', async () => {
    let resolveSubmission!: () => void;
    const submissionPromise = new Promise<void>((resolve) => {
      resolveSubmission = resolve;
    });
    const submitMasterDraft = jest.fn().mockReturnValue(submissionPromise);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorPageObject.render({
      onSubmissionSuccess,
      repository,
    });

    // Step 1 -> Step 2 (Physical)
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_PHYSICAL);
    expect(
      page.getStep(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_CONTAINER),
    ).toBeTruthy();
    expect(
      page.queryStep(MOCK_STEP_TEST_IDS.STEP_2_LEGAL_CONTAINER),
    ).toBeNull();

    // Step 2 -> Step 3
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_SUBMIT);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_3_CONTAINER)).toBeTruthy();

    // Step 3 -> Step 4
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_3_SUBMIT);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_4_CONTAINER)).toBeTruthy();
    expect(page.getStep4SubmittingText()).toBe('false');

    // Step 4 -> Final Master Draft Submission
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_4_SUBMIT);
    expect(page.getStep4SubmittingText()).toBe('true');
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
        userId: MOCK_AUTH_USER_ID,
        vehicleCredit: mockStep3Data,
      }),
    );

    await page.flushAsync(async () => {
      resolveSubmission();
      await submissionPromise;
    });

    expect(page.getStep4SubmittingText()).toBe('false');
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
  });

  it('routes a complete Legal Entity application through Step 2 Legal view and submits via mocked repository', async () => {
    const submitMasterDraft = jest.fn().mockResolvedValue(undefined);
    const repository: ICreditApplicationRepository = {
      submitMasterDraft,
    };
    const onSubmissionSuccess = jest.fn();

    const page = CreditWizardOrchestratorPageObject.render({
      onSubmissionSuccess,
      repository,
    });

    // Step 1 (Legal) -> Step 2 (Legal)
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_LEGAL);
    expect(
      page.getStep(MOCK_STEP_TEST_IDS.STEP_2_LEGAL_CONTAINER),
    ).toBeTruthy();
    expect(
      page.queryStep(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_CONTAINER),
    ).toBeNull();

    // Step 2 (Legal) -> Step 3 -> Step 4 -> Submit
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_LEGAL_SUBMIT);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_3_CONTAINER)).toBeTruthy();

    page.pressButton(MOCK_STEP_TEST_IDS.STEP_3_SUBMIT);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_4_CONTAINER)).toBeTruthy();

    await page.pressAsyncButton(MOCK_STEP_TEST_IDS.STEP_4_SUBMIT);

    expect(submitMasterDraft).toHaveBeenCalledTimes(1);
    expect(submitMasterDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        applicant: mockLegalStep1Data,
        bankAuthorizations: mockStep4Data,
        contact: mockLegalStep2Data,
        regime: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
        selectedBanks: [
          SELECTED_BANK_CODES.BAC,
          SELECTED_BANK_CODES.SCOTIABANK,
        ],
        status: APPLICATION_STATUS.PENDING,
        templateVersion: DEFAULT_TEMPLATE_VERSION,
        userId: MOCK_AUTH_USER_ID,
        vehicleCredit: mockStep3Data,
      }),
    );
    expect(onSubmissionSuccess).toHaveBeenCalledTimes(1);
  });

  it('preserves accumulated RAM draftState across backward navigation (4 -> 3 -> 2 -> 1)', () => {
    const repository: ICreditApplicationRepository = {
      submitMasterDraft: jest.fn().mockResolvedValue(undefined),
    };

    const page = CreditWizardOrchestratorPageObject.render({ repository });

    // Advance 1 -> 2 -> 3 -> 4
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_PHYSICAL);
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_SUBMIT);
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_3_SUBMIT);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_4_CONTAINER)).toBeTruthy();

    // Navigate back 4 -> 3 and verify Step 3 defaultValues
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_4_BACK);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_3_CONTAINER)).toBeTruthy();
    expect(mockCapturedProps.step3?.defaultValues).toEqual(mockStep3Data);

    // Navigate back 3 -> 2 and verify Step 2 defaultValues
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_3_BACK);
    expect(
      page.getStep(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_CONTAINER),
    ).toBeTruthy();
    expect(mockCapturedProps.step2Physical?.defaultValues).toEqual(
      mockPhysicalStep2Data,
    );

    // Navigate back 2 -> 1 and verify Step 1 defaultValues
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_BACK);
    expect(page.getStep(MOCK_STEP_TEST_IDS.STEP_1_CONTAINER)).toBeTruthy();
    expect(mockCapturedProps.step1?.defaultValues).toEqual(
      mockPhysicalStep1Data,
    );
  });

  it('clears stale Step 2 contact data if user returns to Step 1 and switches regime', () => {
    const repository: ICreditApplicationRepository = {
      submitMasterDraft: jest.fn().mockResolvedValue(undefined),
    };

    const page = CreditWizardOrchestratorPageObject.render({ repository });

    // Start as Physical and save Step 2 physical contact
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_PHYSICAL);
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_SUBMIT);

    // Navigate back 3 -> 2 -> 1 and switch to Legal
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_3_BACK);
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_2_PHYSICAL_BACK);
    page.pressButton(MOCK_STEP_TEST_IDS.STEP_1_SUBMIT_LEGAL);

    expect(
      page.getStep(MOCK_STEP_TEST_IDS.STEP_2_LEGAL_CONTAINER),
    ).toBeTruthy();
    expect(mockCapturedProps.step2Legal?.defaultValues).toBeUndefined();
  });
});
