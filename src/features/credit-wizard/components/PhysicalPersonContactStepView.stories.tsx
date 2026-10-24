import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { EMPLOYMENT_STATUSES } from '../constants/PhysicalPersonContact.constants';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type { PhysicalPersonContact } from '../types/PhysicalPersonContact.types';
import type { PhysicalPersonContactStepViewProps } from '../types/PhysicalPersonContactStepView.types';
import { PhysicalPersonContactStepView } from './PhysicalPersonContactStepView';

const FIGMA_VALID_MOCK_DATA: PhysicalPersonContact = {
  contactInfo: {
    cellPhone: '+506 8834-9210',
    email: 'carlos.mora@ejemplo.cr',
    homePhone: '+506 2289-4500',
  },
  employmentData: {
    employer: 'Servicios Tecnológicos',
    employmentStatus: EMPLOYMENT_STATUSES.SALARIED_CCSS,
    entryDate: '15-03-2020',
    officePhone: '+506 2540-1000',
    profession: 'Ingeniero de Software',
  },
  financialCapacity: {
    currency: 'CRC',
    grossIncome: 1950000,
    netIncome: 1520000,
    otherIncomes: 250000,
  },
  residentialAddress: {
    canton: 'Escazú',
    district: 'San Rafael',
    exactAddress:
      'De la rotonda de Multiplaza 400m norte, Condominio Los Laureles, Edificio B, Apto 302.',
    province: 'San José',
  },
};

const ValidCompletedFormWrapper = (
  props: PhysicalPersonContactStepViewProps,
): React.JSX.Element => {
  const viewModel = usePhysicalPersonContactViewModel({
    defaultValues: FIGMA_VALID_MOCK_DATA,
    mode: 'onChange',
    onSubmit: props.onSubmit,
  });

  return (
    <PhysicalPersonContactStepView
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
    disabled: false,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
  },
  component: PhysicalPersonContactStepView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-background'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/Credit Wizard/Step 2: Physical Person Contact',
} satisfies Meta<typeof PhysicalPersonContactStepView>;

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
