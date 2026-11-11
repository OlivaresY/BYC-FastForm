import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type { LegalEntityContact } from '../types/LegalEntityContact.types';
import type { LegalEntityContactStepViewProps } from '../types/LegalEntityContactStepView.types';
import { LegalEntityContactStepView } from './LegalEntityContactStepView';

const FIGMA_VALID_LEGAL_ENTITY_MOCK_DATA: LegalEntityContact = {
  commercialActivity: {
    accountingPhone: '+506 2200-1111',
    constitutionDate: '15-05-2015',
    economicSector: 'Comercio',
    employeesCount: 25,
    mainActivity: 'Venta de repuestos y mantenimiento vehicular',
  },
  commercialAddress: {
    canton: 'Central',
    district: 'Carmen',
    exactAddress:
      'De la rotonda de la Bandera 300m este, Edificio Corporativo Los Laureles, Piso 3.',
    province: 'San José',
  },
  commercialReference: {
    companyReference: 'Corporación CoriMotors S.A.',
    ibanAccount: 'CR05015202001026284066',
    referencePhone: '+506 2200-2222',
  },
  contactInfo: {
    cellPhone: '+506 8888-9999',
    email: 'contacto@distribuidoradeleste.cr',
    officePhone: '+506 2200-0000',
  },
  financialStatements: {
    currency: 'CRC',
    grossSales: 50000000,
    netProfit: 15000000,
    otherIncomes: 2500000,
  },
};

const ValidCompletedFormWrapper = (
  props: LegalEntityContactStepViewProps,
): React.JSX.Element => {
  const viewModel = useLegalEntityContactViewModel({
    defaultValues: FIGMA_VALID_LEGAL_ENTITY_MOCK_DATA,
    mode: 'onChange',
    onSubmit: props.onSubmit,
  });

  return (
    <LegalEntityContactStepView
      {...props}
      viewModel={{
        ...viewModel,
        isValid: true,
      }}
    />
  );
};

const meta = {
  args: {
    currentStep: 2,
    disabled: false,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
    totalSteps: 4,
  },
  component: LegalEntityContactStepView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-background'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/Credit Wizard/Step 2: Legal Entity Contact',
} satisfies Meta<typeof LegalEntityContactStepView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
  },
};

export const ValidCompletedForm: Story = {
  render: (args): React.JSX.Element => <ValidCompletedFormWrapper {...args} />,
  args: {
    disabled: false,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
  },
};

