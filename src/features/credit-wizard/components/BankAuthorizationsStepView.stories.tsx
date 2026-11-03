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
    acepta_terminos: false,
    autoriza_buro: false,
    autoriza_sugef: false,
    banco_destino: '',
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
  handleNext: action('handleNext'),
  handleSubmit: action('handleNext'),
  isSubmitting: false,
  isValid: false,
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
    <BankAuthorizationsStepView
      {...args}
      viewModel={createMockViewModel({
        isValid: false,
      })}
    />
  ),
};

export const ValidState: Story = {
  render: (args): React.JSX.Element => (
    <BankAuthorizationsStepView
      {...args}
      viewModel={createMockViewModel({
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
          autoriza_sugef: {
            message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.AUTORIZA_SUGEF_REQUIRED,
            type: 'custom',
          },
          banco_destino: {
            message: BANK_AUTHORIZATIONS_ERROR_MESSAGES.BANCO_DESTINO_REQUIRED,
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

