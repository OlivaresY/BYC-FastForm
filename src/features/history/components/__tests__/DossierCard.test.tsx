import type React from 'react';
import { SELECTED_BANK_CODES } from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';
import {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  CREDIT_APPLICATION_REGIMES,
  DOSSIER_CARD_COLORS,
  DOSSIER_CARD_DIMENSIONS,
  DOSSIER_CARD_STATUS_STYLES,
  DOSSIER_CARD_STYLES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_TEMPLATE_TOKENS,
} from '../../constants';
import type {
  ApplicationStatus,
  DossierCardProps,
  HistoryDossierItem,
  MasterCreditApplicationPayload,
} from '../../types';
import { DossierCardPageObject } from './DossierCard.po';

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  const createMockIcon =
    () =>
    (props?: {
      accessible?: boolean;
      color?: string;
      importantForAccessibility?: string;
      size?: number;
    }) => {
      const viewProps = {
        accessible: props?.accessible,
        color: props?.color,
        importantForAccessibility: props?.importantForAccessibility,
        size: props?.size,
      } as React.ComponentProps<typeof MockView> & {
        color?: string;
        size?: number;
      };

      return MockReact.createElement(MockView, viewProps);
    };

  return {
    AlertCircle: createMockIcon(),
    Calendar: createMockIcon(),
    Car: createMockIcon(),
    CheckCircle2: createMockIcon(),
    ChevronRight: createMockIcon(),
    Landmark: createMockIcon(),
    Lock: createMockIcon(),
    Printer: createMockIcon(),
  };
});

const FIXTURE_USER_ID = '550e8400-e29b-41d4-a716-446655440000' as const;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const MIN_TOUCH_TARGET_CLASS =
  `min-h-[${DOSSIER_CARD_DIMENSIONS.MIN_TOUCH_TARGET_PX}px] min-w-[${DOSSIER_CARD_DIMENSIONS.MIN_TOUCH_TARGET_PX}px]`;

const PHYSICAL_PAYLOAD_FIXTURE: Extract<
  MasterCreditApplicationPayload,
  { regime: 'physical' }
> = {
  applicant: {
    regime: 'physical',
    values: {
      birthDate: '15-08-1988',
      firstLastName: 'Mora',
      firstName: 'Sofía',
      gender: 'female',
      identificationNumber: '1-1456-0789',
      identificationType: 'national_id',
      maritalStatus: 'single',
      middleName: 'Elena',
      nationality: 'CR',
      nationalityOther: '',
      secondLastName: 'Quesada',
    },
    vehicleBeneficiary: 'same_holder',
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
      companyReference: 'CoriMotors S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2200-0000',
    },
    contactInfo: {
      cellPhone: '+506 8888-8888',
      email: 'sofia.mora@correo.cr',
      homePhone: '+506 2222-2222',
    },
    employmentData: {
      employer: 'Grupo Financiero CR',
      employmentStatus: 'salaried_private',
      entryDate: '01-03-2020',
      officePhone: '+506 2210-1010',
      profession: 'Arquitecta',
    },
    financialCapacity: {
      currency: 'CRC',
      grossIncome: 2500000,
      netIncome: 2100000,
      otherIncomes: 0,
    },
    residentialAddress: {
      canton: 'San José',
      district: 'Carmen',
      exactAddress: 'Avenida Central 100m oeste',
      province: 'San José',
    },
  },
  regime: 'physical',
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  templateVersion: 'v1',
  userId: FIXTURE_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Blanco',
    marca: 'BYD',
    modelo: 'Song Plus',
    moneda: 'USD',
    monto_financiar: 32000,
    monto_prima: 8000,
    plazo_meses: 60,
    valor_vehiculo: 40000,
  },
};

const LEGAL_PAYLOAD_FIXTURE: Extract<
  MasterCreditApplicationPayload,
  { regime: 'legal' }
> = {
  applicant: {
    regime: 'legal',
    values: {
      identificationNumber: '3-101-765432',
      identificationType: 'legal_id',
      legalName: 'Logística Integral del Pacífico S.A.',
      representativeIdentification: '1-1234-0567',
      representativeName: 'Carlos Rodríguez',
    },
    vehicleBeneficiary: 'same_holder',
  },
  bankAuthorizations: {
    autoriza_buros_credito: true,
    autoriza_sugef_cic: true,
    banco_bac: true,
    banco_bncr: true,
    banco_carro_facil: false,
    banco_promerica: false,
    banco_scotiabank: false,
  },
  contact: {
    commercialActivity: {
      accountingPhone: '+506 2200-1111',
      constitutionDate: '10-05-2015',
      economicSector: 'Comercio',
      economicSectorOther: '',
      employeesCount: 30,
      mainActivity: 'Transporte de carga',
    },
    commercialAddress: {
      canton: 'Alajuela',
      district: 'San José',
      exactAddress: 'Zona Franca Coyol',
      province: 'Alajuela',
    },
    commercialReference: {
      companyReference: 'Distribuidora Automotriz S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2299-9999',
    },
    contactInfo: {
      cellPhone: '+506 8888-1234',
      email: 'finanzas@pacificocr.com',
      officePhone: '+506 2200-2222',
    },
    financialStatements: {
      currency: 'USD',
      grossSales: 650000,
      netProfit: 145000,
      otherIncomes: 0,
    },
  },
  regime: 'legal',
  selectedBanks: [SELECTED_BANK_CODES.BAC, SELECTED_BANK_CODES.BNCR],
  status: APPLICATION_STATUS_VALUES.PENDING,
  templateVersion: 'v1',
  userId: FIXTURE_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Gris',
    marca: 'BYD',
    modelo: 'Yuan Pro',
    moneda: 'USD',
    monto_financiar: 28000,
    monto_prima: 7000,
    plazo_meses: 60,
    valor_vehiculo: 35000,
  },
};

const createDossierFixture = (
  overrides?: Partial<HistoryDossierItem>,
): HistoryDossierItem => ({
  applicantName: 'Sofía Elena Mora Quesada',
  canQuickPrint: true,
  createdAt: '2026-11-20T18:00:00.000Z',
  formattedDate: '20 nov 2026',
  id: 'dossier-approved-1',
  identificationNumber: '1-1456-0789',
  primaryBankLabel: BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BAC],
  rawPayload: PHYSICAL_PAYLOAD_FIXTURE,
  regime: CREDIT_APPLICATION_REGIMES.PHYSICAL,
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  templateVersion: 'v1',
  vehicleSummary: 'BYD Song Plus 2026',
  ...overrides,
});

const createProps = (overrides?: Partial<DossierCardProps>): DossierCardProps => ({
  dossier: createDossierFixture(),
  isPrinting: false,
  onPressQuickPrint: jest.fn(),
  onPressRetry: jest.fn(),
  onPressViewDossier: jest.fn(),
  ...overrides,
});

describe('DossierCard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Approved dossier with APROBADO badge, vehicle/bank/date details, active quick print, and view dossier triggers', () => {
    // Arrange
    const props = createProps();
    const approvedStyle =
      DOSSIER_CARD_STATUS_STYLES[APPLICATION_STATUS_VALUES.APPROVED];
    const expectedQuickPrintA11y =
      esCR.history.cards.printButtonA11y.replace(
        HISTORY_TEMPLATE_TOKENS.APPLICANT,
        props.dossier.applicantName,
      );
    const expectedViewA11y = esCR.history.cards.viewDossierButtonA11y.replace(
      HISTORY_TEMPLATE_TOKENS.APPLICANT,
      props.dossier.applicantName,
    );

    // Act
    const page = DossierCardPageObject.render(props);

    // Assert: Header, details & status badge
    expect(page.getCardRootStyleClasses()).toBe(DOSSIER_CARD_STYLES.CARD_ROOT);
    expect(page.getStatusBadgeAccessibilityRole()).toBe('text');
    expect(page.getByText(esCR.history.badges.approved)).toBeTruthy();
    expect(page.getStatusBadgeContainerClasses()).toContain(
      approvedStyle.containerClassName,
    );
    expect(page.getStatusBadgeTextClasses()).toContain(
      approvedStyle.textClassName,
    );

    expect(page.getApplicantNameNode(props.dossier.applicantName)).toBeTruthy();
    expect(
      page.getIdentificationNode(props.dossier.identificationNumber),
    ).toBeTruthy();
    expect(
      page.getVehicleSummaryNode(props.dossier.vehicleSummary),
    ).toBeTruthy();
    expect(page.getPrimaryBankNode(props.dossier.primaryBankLabel)).toBeTruthy();
    expect(page.getFormattedDateNode(props.dossier.formattedDate)).toBeTruthy();
    expect(
      page.getStatusHelperMessageNode(esCR.history.cards.readyToPrint),
    ).toBeTruthy();

    // Assert: Quick Print active + View Dossier active
    expect(page.isQuickPrintDisabled()).toBe(false);
    expect(page.getByText(esCR.history.cards.printButton)).toBeTruthy();
    expect(page.getQuickPrintAccessibilityLabel()).toBe(expectedQuickPrintA11y);
    expect(page.getQuickPrintAccessibilityState()).toEqual({
      busy: false,
      disabled: false,
    });
    expect(page.getViewDossierAccessibilityLabel()).toBe(expectedViewA11y);

    // Act & Assert: Press callbacks
    page.pressQuickPrint().pressViewDossier();
    expect(props.onPressQuickPrint).toHaveBeenCalledTimes(1);
    expect(props.onPressQuickPrint).toHaveBeenCalledWith(props.dossier);
    expect(props.onPressViewDossier).toHaveBeenCalledTimes(1);
    expect(props.onPressViewDossier).toHaveBeenCalledWith(props.dossier);
  });

  it('renders spinner state and blocks duplicate quick print calls when isPrinting is true', () => {
    // Arrange
    const props = createProps({ isPrinting: true });

    // Act
    const page = DossierCardPageObject.render(props);
    const indicator = page.queryActivityIndicator();

    // Assert
    expect(indicator).toBeTruthy();
    expect(indicator?.props.color).toBe(DOSSIER_CARD_COLORS.PRIMARY_GREEN);
    expect(page.getByText(esCR.history.cards.printInProgress)).toBeTruthy();
    expect(page.queryByText(esCR.history.cards.printButton)).toBeNull();
    expect(page.isQuickPrintDisabled()).toBe(true);
    expect(page.getQuickPrintAccessibilityState()).toEqual({
      busy: true,
      disabled: true,
    });

    // Act: Attempt press while printing
    page.pressQuickPrint();

    // Assert
    expect(props.onPressQuickPrint).not.toHaveBeenCalled();
  });

  it('locks quick print cleanly on Pending, Draft, Approved without canQuickPrint, and ignores isPrinting when unapproved', () => {
    // Arrange
    const pendingProps = createProps({
      dossier: createDossierFixture({
        canQuickPrint: false,
        id: 'dossier-pending-1',
        status: APPLICATION_STATUS_VALUES.PENDING,
      }),
      isPrinting: true,
    });

    // Act: Pending with stray isPrinting: true
    const page = DossierCardPageObject.render(pendingProps);

    // Assert: Pending locked state (never shows printing spinner)
    expect(page.getByText(esCR.history.badges.pending)).toBeTruthy();
    expect(
      page.getStatusHelperMessageNode(esCR.history.cards.printLockedMessage),
    ).toBeTruthy();
    expect(page.queryActivityIndicator()).toBeNull();
    expect(page.isQuickPrintDisabled()).toBe(true);
    expect(page.getQuickPrintAccessibilityState()).toEqual({ disabled: true });
    page.pressQuickPrint().pressViewDossier();
    expect(pendingProps.onPressQuickPrint).not.toHaveBeenCalled();
    expect(pendingProps.onPressViewDossier).toHaveBeenCalledWith(
      pendingProps.dossier,
    );

    // Act: Rerender as Draft
    const draftProps = createProps({
      dossier: createDossierFixture({
        canQuickPrint: false,
        id: 'dossier-draft-1',
        status: APPLICATION_STATUS_VALUES.DRAFT,
      }),
    });
    page.rerender(draftProps);

    // Assert: Draft locked state
    expect(page.getByText(esCR.history.badges.draft)).toBeTruthy();
    expect(page.isQuickPrintDisabled()).toBe(true);
    page.pressQuickPrint();
    expect(draftProps.onPressQuickPrint).not.toHaveBeenCalled();

    // Act: Rerender as Approved with canQuickPrint explicitly false
    const approvedBlockedProps = createProps({
      dossier: createDossierFixture({
        canQuickPrint: false,
        id: 'dossier-approved-blocked',
        status: APPLICATION_STATUS_VALUES.APPROVED,
      }),
    });
    page.rerender(approvedBlockedProps);

    // Assert: Strict approval gate treats canQuickPrint: false as locked
    expect(
      page.getStatusHelperMessageNode(esCR.history.cards.printLockedMessage),
    ).toBeTruthy();
    expect(page.isQuickPrintDisabled()).toBe(true);
    page.pressQuickPrint();
    expect(approvedBlockedProps.onPressQuickPrint).not.toHaveBeenCalled();
  });

  it('renders RECHAZADO badge, omits quick print, executes onPressRetry, and disables retry safely when omitted', () => {
    // Arrange
    const rejectedDossier = createDossierFixture({
      canQuickPrint: false,
      id: 'dossier-rejected-1',
      status: APPLICATION_STATUS_VALUES.REJECTED,
    });
    const retryProps = createProps({ dossier: rejectedDossier });
    const expectedRetryA11y = esCR.history.cards.retryButtonA11y.replace(
      HISTORY_TEMPLATE_TOKENS.APPLICANT,
      rejectedDossier.applicantName,
    );

    // Act
    const page = DossierCardPageObject.render(retryProps);

    // Assert: Rejected status layout
    expect(page.getByText(esCR.history.badges.rejected)).toBeTruthy();
    expect(
      page.getStatusHelperMessageNode(esCR.history.cards.rejectedMessage),
    ).toBeTruthy();
    expect(page.queryQuickPrintButton()).toBeNull();
    expect(page.getByText(esCR.history.cards.retryButton)).toBeTruthy();
    expect(page.isRetryDisabled()).toBe(false);
    expect(page.getRetryAccessibilityLabel()).toBe(expectedRetryA11y);
    expect(page.getRetryAccessibilityState()).toEqual({ disabled: false });

    // Act & Assert: Retry + View Dossier
    page.pressRetry().pressViewDossier();
    expect(retryProps.onPressRetry).toHaveBeenCalledTimes(1);
    expect(retryProps.onPressRetry).toHaveBeenCalledWith(rejectedDossier);
    expect(retryProps.onPressViewDossier).toHaveBeenCalledTimes(1);

    // Act: Rerender without onPressRetry handler (Option A guard)
    const noRetryProps = createProps({
      dossier: rejectedDossier,
      onPressRetry: undefined,
    });
    page.rerender(noRetryProps);

    // Assert: Retry button disabled & visually muted without runtime error
    expect(page.isRetryDisabled()).toBe(true);
    expect(page.getRetryAccessibilityState()).toEqual({ disabled: true });
    expect(page.getButtonStyleClasses('retry')).toContain(
      DOSSIER_CARD_STYLES.RETRY_BUTTON_DISABLED,
    );
    page.pressRetry();
  });

  it('renders legal entity dossiers, satisfies 48x48 touch targets, marks decorative SVG icons non-accessible, handles unknown status safely, and contains zero emojis', () => {
    // Arrange
    const legalDossier = createDossierFixture({
      applicantName: 'Logística Integral del Pacífico S.A.',
      canQuickPrint: false,
      id: 'dossier-legal-1',
      identificationNumber: '3-101-765432',
      primaryBankLabel: `${BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BAC]}${HISTORY_INTERNAL_STRINGS.SPACE}${esCR.history.cards.additionalBanksTemplate.replace(
        HISTORY_TEMPLATE_TOKENS.COUNT,
        '1',
      )}`,
      rawPayload: LEGAL_PAYLOAD_FIXTURE,
      regime: CREDIT_APPLICATION_REGIMES.LEGAL,
      selectedBanks: [SELECTED_BANK_CODES.BAC, SELECTED_BANK_CODES.BNCR],
      status: APPLICATION_STATUS_VALUES.PENDING,
      vehicleSummary: 'BYD Yuan Pro 2026',
    });
    const legalProps = createProps({ dossier: legalDossier });

    // Act
    const page = DossierCardPageObject.render(legalProps);

    // Assert: Legal entity rendering & truncation
    const applicantNode = page.getApplicantNameNode(legalDossier.applicantName);
    const idNode = page.getIdentificationNode(
      legalDossier.identificationNumber,
    );
    expect(applicantNode.props.numberOfLines).toBe(1);
    expect(idNode.props.numberOfLines).toBe(1);
    expect(page.getPrimaryBankNode(legalDossier.primaryBankLabel)).toBeTruthy();

    // Assert: Minimum 48x48px touch targets
    expect(page.getButtonStyleClasses('quickPrint')).toContain(
      MIN_TOUCH_TARGET_CLASS,
    );
    expect(page.getButtonStyleClasses('viewDossier')).toContain(
      MIN_TOUCH_TARGET_CLASS,
    );

    // Assert: Decorative Lucide SVG icons hidden from screen readers
    const iconA11yProps = page.getDecorativeIconAccessibilityProps();
    expect(iconA11yProps.length).toBeGreaterThan(0);
    iconA11yProps.forEach((iconProps) => {
      expect(iconProps.accessible).toBe(false);
      expect(iconProps.importantForAccessibility).toBe('no');
    });

    // Assert: Zero emojis in rendered texts
    page.getRenderedTexts().forEach((renderedText) => {
      expect(EMOJI_PATTERN.test(renderedText)).toBe(false);
    });

    // Act: Check Rejected touch target & fallback on unexpected runtime status
    page.rerender(
      createProps({
        dossier: createDossierFixture({
          status: APPLICATION_STATUS_VALUES.REJECTED,
        }),
      }),
    );
    expect(page.getButtonStyleClasses('retry')).toContain(
      MIN_TOUCH_TARGET_CLASS,
    );

    page.rerender(
      createProps({
        dossier: createDossierFixture({
          canQuickPrint: false,
          status: 'UnexpectedStatus' as ApplicationStatus,
        }),
      }),
    );
    expect(page.getByText(esCR.history.badges.draft)).toBeTruthy();
    expect(page.isQuickPrintDisabled()).toBe(true);
  });
});
