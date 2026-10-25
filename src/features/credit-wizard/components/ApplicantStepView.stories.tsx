import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useApplicantStepViewModel } from '../hooks/useApplicantStepViewModel';
import type { ApplicantStepViewProps } from '../types/ApplicantStepView.types';
import type { LegalEntityFormValues } from '../types/LegalEntityForm.types';
import type { LegalEntityType } from '../types/LegalEntitySelector.types';
import type { PhysicalPersonFormValues } from '../types/PhysicalPersonForm.types';
import { ApplicantStepView } from './ApplicantStepView';

interface StoryWrapperProps extends ApplicantStepViewProps {
  initialLegalValues?: Partial<LegalEntityFormValues>;
  initialPhysicalValues?: Partial<PhysicalPersonFormValues>;
  initialRegime?: LegalEntityType;
  isValidOverride?: boolean;
}

const StoryWrapper = ({
  initialLegalValues,
  initialPhysicalValues,
  initialRegime,
  isValidOverride,
  ...props
}: StoryWrapperProps): React.JSX.Element => {
  const viewModel = useApplicantStepViewModel({
    initialLegalValues,
    initialPhysicalValues,
    initialRegime,
  });

  return (
    <ApplicantStepView
      {...props}
      viewModel={
        isValidOverride !== undefined
          ? {
              ...viewModel,
              isValid: isValidOverride,
            }
          : viewModel
      }
    />
  );
};

const meta = {
  args: {
    disabled: false,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
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
  render: (args): React.JSX.Element => (
    <StoryWrapper
      {...args}
      initialPhysicalValues={{
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
      }}
      initialRegime='physical'
      isValidOverride={true}
    />
  ),
};

export const PhysicalDisabled: Story = {
  render: (args): React.JSX.Element => (
    <StoryWrapper
      {...args}
      disabled={true}
      initialRegime='physical'
    />
  ),
};

export const LegalValid: Story = {
  render: (args): React.JSX.Element => (
    <StoryWrapper
      {...args}
      initialLegalValues={{
        identificationNumber: '3-101-123456',
        identificationType: 'legal_id',
        legalName: 'Inversiones Tecnológicas S.A.',
        representativeIdentification: '1-1150-0222',
        representativeName: 'Juan Alberto Pérez Rojas',
      }}
      initialRegime='legal'
      isValidOverride={true}
    />
  ),
};

export const LegalDisabled: Story = {
  render: (args): React.JSX.Element => (
    <StoryWrapper
      {...args}
      disabled={true}
      initialRegime='legal'
    />
  ),
};
