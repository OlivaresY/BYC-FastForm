import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { createFormControl } from 'react-hook-form';
import {
  FINANCING_TERMS,
  VEHICLE_BRANDS,
  VEHICLE_COLORS_YEARS,
} from '../constants/VehicleCredit.constants';
import {
  VEHICLE_CREDIT_DEFAULT_VALUES,
  type UseVehicleCreditViewModelReturn,
} from '../hooks/useVehicleCreditViewModel';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { VehicleCreditStepView } from './VehicleCreditStepView';

const defaultControl = createFormControl<VehicleCreditFormValues>({
  defaultValues: VEHICLE_CREDIT_DEFAULT_VALUES,
}).control;

const action =
  (_name: string) =>
  async (): Promise<void> => {
    // Storybook action logger placeholder
  };

const createMockViewModel = (
  overrides?: Partial<UseVehicleCreditViewModelReturn>,
): UseVehicleCreditViewModelReturn => ({
  availableColorsYears: VEHICLE_COLORS_YEARS,
  availableModels: [],
  brands: VEHICLE_BRANDS,
  colorsYears: VEHICLE_COLORS_YEARS,
  control: defaultControl,
  derivedMontoFinanciar: 0,
  errors: {},
  financingTerms: FINANCING_TERMS,
  handleFinancialChange: (): void => undefined,
  handleNext: action('handleNext'),
  handleSubmit: action('handleNext'),
  isSubmitting: false,
  isValid: false,
  setValue: (() => undefined) as never,
  vehicleBrands: VEHICLE_BRANDS,
  vehicleColorsYears: VEHICLE_COLORS_YEARS,
  ...overrides,
});

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
  render: (args): React.JSX.Element => (
    <VehicleCreditStepView
      {...args}
      viewModel={createMockViewModel({
        isValid: false,
      })}
    />
  ),
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
          plazo_meses: {
            message: 'El plazo en meses debe ser mayor a 0.',
            type: 'custom',
          },
          valor_vehiculo: {
            message: 'El valor del vehículo debe ser mayor a 0.',
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
