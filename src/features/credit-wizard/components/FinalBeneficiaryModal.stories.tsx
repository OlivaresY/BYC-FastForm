import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { ModalStoryWrapper } from '@/shared/components/ModalStoryWrapper';
import { FinalBeneficiaryModalMemo as FinalBeneficiaryModal } from './FinalBeneficiaryModal';

const meta = {
  title: 'Credit Wizard/Final Beneficiary Modal',
  component: FinalBeneficiaryModal,
  decorators: [
    (Story) => (
      <View className='flex-1 justify-center bg-slate-200 p-4'>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FinalBeneficiaryModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ModalStoryWrapper title='Abrir Modal (Default)'>
      {(isOpen, onClose) => (
        <FinalBeneficiaryModal {...args} isOpen={isOpen} onClose={onClose} />
      )}
    </ModalStoryWrapper>
  ),
  args: {
    errors: {},
    isOpen: false,
    onClose: () => {},
    onFieldChange: () => {},
    thirdPartyValues: {
      birthDate: '10 / 05 / 1990',
      email: 'elena.castro@email.com',
      fullName: 'Elena Castro Morales',
      identificationNumber: '2-0456-0789',
      identificationType: 'national_id',
      nationality: 'CR',
      phone: '8888-8888',
      relationship: 'spouse',
      thirdPartyBirthDate: '10 / 05 / 1990',
      thirdPartyDocNumber: '2-0456-0789',
      thirdPartyDocType: 'national_id',
      thirdPartyEmail: 'elena.castro@email.com',
      thirdPartyFullName: 'Elena Castro Morales',
      thirdPartyNationality: 'CR',
      thirdPartyPhone: '8888-8888',
      thirdPartyRelationship: 'spouse',
    },
    values: {
      birthDate: '10 / 05 / 1990',
      email: 'elena.castro@email.com',
      fullName: 'Elena Castro Morales',
      identificationNumber: '2-0456-0789',
      identificationType: 'national_id',
      nationality: 'CR',
      phone: '8888-8888',
      relationship: 'spouse',
      thirdPartyBirthDate: '10 / 05 / 1990',
      thirdPartyDocNumber: '2-0456-0789',
      thirdPartyDocType: 'national_id',
      thirdPartyEmail: 'elena.castro@email.com',
      thirdPartyFullName: 'Elena Castro Morales',
      thirdPartyNationality: 'CR',
      thirdPartyPhone: '8888-8888',
      thirdPartyRelationship: 'spouse',
    },
  },
};

export const WithErrors: Story = {
  render: (args) => (
    <ModalStoryWrapper title='Abrir Modal (Con Errores)'>
      {(isOpen, onClose) => (
        <FinalBeneficiaryModal {...args} isOpen={isOpen} onClose={onClose} />
      )}
    </ModalStoryWrapper>
  ),
  args: {
    errors: {
      thirdPartyDocNumber: 'El número de documento es obligatorio',
      thirdPartyFullName: 'El nombre completo es obligatorio',
      thirdPartyPhone: 'El teléfono es obligatorio',
    },
    isOpen: false,
    onClose: () => {},
    onFieldChange: () => {},
    thirdPartyValues: {
      birthDate: '10 / 05 / 1990',
      email: '',
      fullName: '',
      identificationNumber: '',
      identificationType: 'national_id',
      nationality: 'CR',
      phone: '',
      relationship: 'spouse',
      thirdPartyBirthDate: '10 / 05 / 1990',
      thirdPartyDocNumber: '',
      thirdPartyDocType: 'national_id',
      thirdPartyEmail: '',
      thirdPartyFullName: '',
      thirdPartyNationality: 'CR',
      thirdPartyPhone: '',
      thirdPartyRelationship: 'spouse',
    },
    values: {
      birthDate: '10 / 05 / 1990',
      email: '',
      fullName: '',
      identificationNumber: '',
      identificationType: 'national_id',
      nationality: 'CR',
      phone: '',
      relationship: 'spouse',
      thirdPartyBirthDate: '10 / 05 / 1990',
      thirdPartyDocNumber: '',
      thirdPartyDocType: 'national_id',
      thirdPartyEmail: '',
      thirdPartyFullName: '',
      thirdPartyNationality: 'CR',
      thirdPartyPhone: '',
      thirdPartyRelationship: 'spouse',
    },
  },
};
