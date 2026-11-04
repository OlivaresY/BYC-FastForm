import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { createFormControl } from 'react-hook-form';
import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
} from '../constants/VehicleCredit.constants';
import {
  VEHICLE_CREDIT_DEFAULT_VALUES,
  type UseVehicleCreditViewModelReturn,
} from '../hooks/useVehicleCreditViewModel';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { VehicleCreditStepView } from './VehicleCreditStepView';

const action =
  (_name: string) =>
  async (): Promise<void> => {
    // Storybook action logger placeholder
  };

const createMockViewModel = (
  overrides?: Partial<UseVehicleCreditViewModelReturn>,
): UseVehicleCreditViewModelReturn => {
  const form = createFormControl<VehicleCreditFormValues>({
    defaultValues: VEHICLE_CREDIT_DEFAULT_VALUES,
  });

  return {
    brands: VEHICLE_BRANDS,
    control: form.control,
    derivedMontoFinanciar: 0,
    errors: {},
    financingTerms: FINANCING_TERMS,
    handleFinancialChange: (field, val): void => {
      form.setValue(field, val);
    },
    handleNext: action('handleNext'),
    handleSubmit: action('handleNext'),
    isSubmitting: false,
    isValid: false,
    setValue: form.setValue,
    vehicleBrands: VEHICLE_BRANDS,
    ...overrides,
  };
};

const meta = {
  args: {
    currentStep: 3,
    disabled: false,
    onBack: (): void => undefined,
    onClose: (): void => undefined,
    onSubmit: (): void => undefined,
    totalSteps: 4,
  },
  component: VehicleCreditStepView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-background'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/CreditWizard/VehicleCreditStepView',
} satisfies Meta<typeof VehicleCreditStepView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): React.JSX.Element => <VehicleCreditStepView {...args} />,
};

export const ValidState: Story = {
  render: (args): React.JSX.Element => (
    <VehicleCreditStepView
      {...args}
      viewModel={createMockViewModel({
        derivedMontoFinanciar: 20000,
        isValid: true,
      })}
    />
  ),
};

export const ErrorState: Story = {
  render: (args): React.JSX.Element => (
    <VehicleCreditStepView
      {...args}
      viewModel={createMockViewModel({
        errors: {
          monto_prima: {
            message: '10% de prima mínima permitida',
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
    <VehicleCreditStepView
      {...args}
      viewModel={createMockViewModel({
        derivedMontoFinanciar: 20000,
        isSubmitting: true,
        isValid: true,
      })}
    />
  ),
};
