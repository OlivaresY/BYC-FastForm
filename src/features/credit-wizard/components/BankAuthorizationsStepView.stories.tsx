import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { createFormControl } from 'react-hook-form';
import { BankAuthorizationsStepView } from './BankAuthorizationsStepView';
import type { UseBankAuthorizationsViewModelReturn } from '../hooks/useBankAuthorizationsViewModel';
import { BANK_AUTHORIZATIONS_ERROR_MESSAGES } from '../schemas/BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

const defaultControl = createFormControl<BankAuthorizationsFormValues>({
  defaultValues: {
    autoriza_buros_credito: false,
    autoriza_sugef_cic: false,
    banco_bac: false,
    banco_bncr: false,
    banco_carro_facil: false,
    banco_promerica: false,
    banco_scotiabank: false,
  },
}).control;

const action =
  (_name: string): (() => Promise<void>) =>
  async (): Promise<void> => {
    // Action handler placeholder for Storybook execution
  };

const createMockViewModel = (
  overrides?: Partial<UseBankAuthorizationsViewModelReturn>,
): UseBankAuthorizationsViewModelReturn => ({
  control: defaultControl,
  errors: {},
  form: {} as never,
  handleNext: action('handleNext'),
  handleSubmit: action('handleNext'),
  isAllBanksSelected: false,
  isSubmitting: false,
  isValid: false,
  toggleAllBanks: (): void => undefined,
  ...overrides,
});

const meta = {
  args: {
    currentStep: 4,
    disabled: false,
    onBack: (): void => undefined,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
    totalSteps: 4,
  },
  component: BankAuthorizationsStepView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-background'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/CreditWizard/BankAuthorizationsStepView',
} satisfies Meta<typeof BankAuthorizationsStepView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): React.JSX.Element => (
    <BankAuthorizationsStepView {...args} />
  ),
};

export const ValidState: Story = {
  render: (args): React.JSX.Element => (
    <BankAuthorizationsStepView
      {...args}
      viewModel={createMockViewModel({
        isAllBanksSelected: true,
        isValid: true,
      })}
    />
  ),
};

export const ErrorState: Story = {
  render: (args): React.JSX.Element => (
    <BankAuthorizationsStepView
      {...args}
      viewModel={createMockViewModel({
        errors: {
          autoriza_sugef_cic: {
            message:
              BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_CIC_REQUIRED,
            type: 'custom',
          },
          banco_bac: {
            message:
              BANK_AUTHORIZATIONS_ERROR_MESSAGES.AT_LEAST_ONE_BANK_REQUIRED,
            type: 'custom',
          },
        },
        isValid: false,
      })}
    />
  ),
};

export const Submitting: Story = {
  render: (args): React.JSX.Element => (
    <BankAuthorizationsStepView
      {...args}
      viewModel={createMockViewModel({
        isSubmitting: true,
        isValid: true,
      })}
    />
  ),
};
