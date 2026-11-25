import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { SELECTED_BANK_CODES } from '@/features/credit-wizard/types';
import { esCR } from '@/shared/i18n';
import {
  APPLICATION_STATUS_VALUES,
  BANK_DISPLAY_LABELS,
  CREDIT_APPLICATION_REGIMES,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_TEMPLATE_TOKENS,
} from '../constants';
import type {
  HistoryDossierItem,
  MasterCreditApplicationPayload,
} from '../types';
import { DossierCard } from './DossierCard';

const STORY_USER_ID = '550e8400-e29b-41d4-a716-446655440000' as const;

const STORY_PHYSICAL_PAYLOAD: Extract<
  MasterCreditApplicationPayload,
  { regime: 'physical' }
> = {
  applicant: {
    regime: 'physical',
    values: {
      birthDate: '12-04-1990',
      firstLastName: 'Montero',
      firstName: 'Sofía',
      gender: 'female',
      identificationNumber: '1-1489-0321',
      identificationType: 'national_id',
      maritalStatus: 'single',
      middleName: 'Valeria',
      nationality: 'CR',
      nationalityOther: '',
      secondLastName: 'Chinchilla',
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
      cellPhone: '+506 8888-9000',
      email: 'sofia.montero@correo.cr',
      homePhone: '+506 2222-3333',
    },
    employmentData: {
      employer: 'Consultora del Este CR',
      employmentStatus: 'salaried_private',
      entryDate: '15-02-2021',
      officePhone: '+506 2210-2020',
      profession: 'Ingeniera Industrial',
    },
    financialCapacity: {
      currency: 'CRC',
      grossIncome: 2800000,
      netIncome: 2350000,
      otherIncomes: 0,
    },
    residentialAddress: {
      canton: 'Curridabat',
      district: 'Granadilla',
      exactAddress: '300m este de la plaza de deportes',
      province: 'San José',
    },
  },
  regime: 'physical',
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  templateVersion: 'v1',
  userId: STORY_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Azul Eléctrico',
    marca: 'BYD',
    modelo: 'Seal',
    moneda: 'USD',
    monto_financiar: 36000,
    monto_prima: 9000,
    plazo_meses: 72,
    valor_vehiculo: 45000,
  },
};

const STORY_LEGAL_PAYLOAD: Extract<
  MasterCreditApplicationPayload,
  { regime: 'legal' }
> = {
  applicant: {
    regime: 'legal',
    values: {
      identificationNumber: '3-101-842190',
      identificationType: 'legal_id',
      legalName: 'Servicios Logísticos Valle Central S.A.',
      representativeIdentification: '2-0678-0412',
      representativeName: 'Andrés Valverde Solís',
    },
    vehicleBeneficiary: 'same_holder',
  },
  bankAuthorizations: {
    autoriza_buros_credito: true,
    autoriza_sugef_cic: true,
    banco_bac: true,
    banco_bncr: true,
    banco_carro_facil: true,
    banco_promerica: false,
    banco_scotiabank: false,
  },
  contact: {
    commercialActivity: {
      accountingPhone: '+506 2440-1100',
      constitutionDate: '04-06-2017',
      economicSector: 'Comercio',
      economicSectorOther: '',
      employeesCount: 42,
      mainActivity: 'Distribución regional',
    },
    commercialAddress: {
      canton: 'Alajuela',
      district: 'Río Segundo',
      exactAddress: 'Ofibodegas del Aeropuerto, bodega 14',
      province: 'Alajuela',
    },
    commercialReference: {
      companyReference: 'Corporación CoriMotors S.A.',
      ibanAccount: 'CR05015202001026284066',
      referencePhone: '+506 2299-9999',
    },
    contactInfo: {
      cellPhone: '+506 8701-4455',
      email: 'tesoreria@vallecentral.cr',
      officePhone: '+506 2440-2200',
    },
    financialStatements: {
      currency: 'USD',
      grossSales: 820000,
      netProfit: 185000,
      otherIncomes: 0,
    },
  },
  regime: 'legal',
  selectedBanks: [
    SELECTED_BANK_CODES.BAC,
    SELECTED_BANK_CODES.BNCR,
    SELECTED_BANK_CODES.CARRO_FACIL,
  ],
  status: APPLICATION_STATUS_VALUES.PENDING,
  templateVersion: 'v1',
  userId: STORY_USER_ID,
  vehicleCredit: {
    anio: '2026',
    color: 'Blanco Glaciar',
    marca: 'BYD',
    modelo: 'Song Plus DM-i',
    moneda: 'USD',
    monto_financiar: 31500,
    monto_prima: 8500,
    plazo_meses: 60,
    valor_vehiculo: 40000,
  },
};

const createStoryDossier = (
  overrides?: Partial<HistoryDossierItem>,
): HistoryDossierItem => ({
  applicantName: 'Sofía Valeria Montero Chinchilla',
  canQuickPrint: true,
  createdAt: '2026-11-22T17:30:00.000Z',
  formattedDate: '22 nov 2026',
  id: 'story-dossier-approved',
  identificationNumber: '1-1489-0321',
  primaryBankLabel: BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BAC],
  rawPayload: STORY_PHYSICAL_PAYLOAD,
  regime: CREDIT_APPLICATION_REGIMES.PHYSICAL,
  selectedBanks: [SELECTED_BANK_CODES.BAC],
  status: APPLICATION_STATUS_VALUES.APPROVED,
  templateVersion: 'v1',
  vehicleSummary: 'BYD Seal 2026',
  ...overrides,
});

const createDossierWithStatus = (
  status: HistoryDossierItem['status'],
): HistoryDossierItem =>
  createStoryDossier({
    canQuickPrint: false,
    formattedDate: '19 nov 2026',
    id: `story-dossier-${status.toLowerCase()}`,
    primaryBankLabel: BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.SCOTIABANK],
    selectedBanks: [SELECTED_BANK_CODES.SCOTIABANK],
    status,
    vehicleSummary: 'BYD Dolphin Mini 2026',
  });

const handleStoryPress = (): void => undefined;

const meta = {
  argTypes: {
    onPressQuickPrint: { action: 'onPressQuickPrint', control: false },
    onPressRetry: { action: 'onPressRetry', control: false },
    onPressViewDossier: { action: 'onPressViewDossier', control: false },
  },
  args: {
    dossier: createStoryDossier(),
    isPrinting: false,
    onPressQuickPrint: handleStoryPress,
    onPressRetry: handleStoryPress,
    onPressViewDossier: handleStoryPress,
  },
  component: DossierCard,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 bg-background p-4'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/History/DossierCard',
} satisfies Meta<typeof DossierCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ApprovedPhysical: Story = {
  args: {
    dossier: createStoryDossier(),
    isPrinting: false,
  },
};

export const ApprovedPrinting: Story = {
  args: {
    dossier: createStoryDossier({
      id: 'story-dossier-printing',
    }),
    isPrinting: true,
  },
};

export const PendingLegal: Story = {
  args: {
    dossier: createStoryDossier({
      applicantName: 'Servicios Logísticos Valle Central S.A.',
      canQuickPrint: false,
      formattedDate: '21 nov 2026',
      id: 'story-dossier-pending-legal',
      identificationNumber: '3-101-842190',
      primaryBankLabel: `${BANK_DISPLAY_LABELS[SELECTED_BANK_CODES.BAC]}${HISTORY_INTERNAL_STRINGS.SPACE}${esCR.history.cards.additionalBanksTemplate.replace(
        HISTORY_TEMPLATE_TOKENS.COUNT,
        '2',
      )}`,
      rawPayload: STORY_LEGAL_PAYLOAD,
      regime: CREDIT_APPLICATION_REGIMES.LEGAL,
      selectedBanks: STORY_LEGAL_PAYLOAD.selectedBanks,
      status: APPLICATION_STATUS_VALUES.PENDING,
      vehicleSummary: 'BYD Song Plus DM-i 2026',
    }),
  },
};

export const RejectedWithRetry: Story = {
  args: {
    dossier: createDossierWithStatus(APPLICATION_STATUS_VALUES.REJECTED),
  },
};

export const DraftDossier: Story = {
  args: {
    dossier: createDossierWithStatus(APPLICATION_STATUS_VALUES.DRAFT),
  },
};
