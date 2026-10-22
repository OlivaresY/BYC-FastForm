import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { APPLICANT_STEP_VIEW_DEFAULT_VALUES } from '../constants/ApplicantStepView.constants';
import { ApplicantStepView } from './ApplicantStepView';

const meta = {
  args: {
    disabled: false,
    isIdentificationValid: false,
    isValid: false,
    legalErrors: {},
    legalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
    onClose: () => {},
    onLegalFieldChange: () => {},
    onPhysicalFieldChange: () => {},
    onRegimeChange: () => {},
    onSubmit: () => {},
    onVehicleBeneficiaryChange: () => {},
    physicalErrors: {},
    physicalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
    regime: 'physical',
    vehicleBeneficiary: 'same_holder',
  },
  component: ApplicantStepView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-background'>
        <Story />
      </View>
    ),
  ],
  title: 'CreditWizard/ApplicantStepView',
} satisfies Meta<typeof ApplicantStepView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isIdentificationValid: true,
    isValid: true,
    physicalValues: {
      birthDate: '15 / 08 / 1988',
      firstLastName: 'Rodríguez',
      firstName: 'Carlos',
      gender: 'male',
      identificationNumber: '1-1234-0567',
      identificationType: 'national_id',
      maritalStatus: 'married',
      middleName: 'Alberto',
      nationality: 'CR',
      secondLastName: 'Castro',
    },
    regime: 'physical',
    vehicleBeneficiary: 'same_holder',
  },
};

export const PhysicalDisabled: Story = {
  args: {
    isIdentificationValid: false,
    isValid: false,
    regime: 'physical',
  },
};

export const LegalValid: Story = {
  args: {
    isIdentificationValid: true,
    isValid: true,
    legalValues: {
      identificationNumber: '3-101-123456',
      identificationType: 'legal_id',
      legalName: 'Inversiones Tecnológicas S.A.',
      representativeIdentification: '1-1150-0222',
      representativeName: 'Juan Alberto Pérez Rojas',
    },
    regime: 'legal',
    vehicleBeneficiary: 'same_holder',
  },
};

export const LegalDisabled: Story = {
  args: {
    isIdentificationValid: false,
    isValid: false,
    regime: 'legal',
  },
};
