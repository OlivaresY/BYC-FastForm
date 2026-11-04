import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Controller, useWatch } from 'react-hook-form';
import {
  BanknoteIcon,
  CarIcon,
  CustomSelect,
  type CustomSelectOption,
  CustomTextInput,
} from '@/shared/ui';
import {
  formatCapitalizeWords,
  formatCurrencyDisplay,
  formatYear,
  useVehicleCreditViewModel,
  type UseVehicleCreditViewModelReturn,
} from '../hooks/useVehicleCreditViewModel';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { WizardStepLayout } from './WizardStepLayout';

const CURRENCY_OPTIONS: readonly CustomSelectOption[] = [
  { label: 'Dólares (USD)', value: 'USD' },
  { label: 'Colones (CRC)', value: 'CRC' },
];

export interface VehicleCreditStepViewProps {
  currentStep?: number;
  disabled?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSubmit?: (data: VehicleCreditFormValues) => void | Promise<void>;
  testID?: string;
  totalSteps?: number;
  viewModel?: UseVehicleCreditViewModelReturn;
}

export const VehicleCreditStepView = ({
  currentStep = 3,
  disabled = false,
  onBack,
  onClose,
  onSubmit,
  testID = 'vehicle-credit-step-view',
  totalSteps = 4,
  viewModel: viewModelProp,
}: VehicleCreditStepViewProps): React.JSX.Element => {
  const defaultViewModel = useVehicleCreditViewModel({ onSuccess: onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;

  const {
    brands = [],
    control,
    derivedMontoFinanciar,
    errors,
    financingTerms = [],
    handleNext,
    isSubmitting,
    isValid,
  } = viewModel;

  const watchedMontoFinanciar = useWatch({
    control,
    name: 'monto_financiar',
  });

  const brandOptions = useMemo<readonly CustomSelectOption[]>(
    () => brands.map((brand) => ({ label: brand, value: brand })),
    [brands],
  );

  const financingTermOptions = useMemo<readonly CustomSelectOption[]>(
    () => financingTerms.map((term) => ({ label: term, value: term })),
    [financingTerms],
  );

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description='Ingresa las especificaciones del vehículo y el plan de financiamiento requerido.'
      disabled={disabled}
      isSubmitDisabled={!isValid}
      isSubmitting={isSubmitting}
      onBack={onBack}
      onClose={onClose}
      onNext={handleNext}
      submitButtonLabel='Siguiente'
      testID={testID}
      title='Vehículo y Crédito'
      totalSteps={totalSteps}
    >
      <View className='w-full gap-4'>
          {/* CONTAINER 1: ESPECIFICACIONES DE LA UNIDAD */}
          <View
            className='w-full rounded-2xl bg-stone-50 p-4 gap-4 border border-stone-200'
            testID='vehicle-credit-unit-specifications-container'
          >
            <View className='flex-row items-center gap-2'>
              <CarIcon
                color='#111111'
                size={20}
                strokeWidth={2}
              />
              <Text className='text-base font-bold text-gray-900'>
                1. ESPECIFICACIONES DE LA UNIDAD
              </Text>
            </View>

            {/* Marca */}
            <Controller
              control={control}
              name='marca'
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  disabled={disabled || isSubmitting}
                  errorMessage={errors.marca?.message}
                  label='Marca'
                  modalTitle='Seleccione la Marca'
                  onValueChange={onChange}
                  options={brandOptions}
                  placeholder='Seleccione la marca'
                  required
                  testID='vehicle-credit-marca-select'
                  value={value}
                />
              )}
            />

            {/* Modelo */}
            <Controller
              control={control}
              name='modelo'
              render={({ field: { onBlur, onChange, value } }) => (
                <CustomTextInput
                  editable={!disabled && !isSubmitting}
                  error={errors.modelo?.message}
                  label='Modelo'
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCapitalizeWords(text);
                    onChange(formatted);
                  }}
                  placeholder='Ej. S1 Pro, Denza, BJ41'
                  required
                  testID='vehicle-credit-modelo-input'
                  value={value}
                />
              )}
            />

            {/* Color y Año (Parallel Inputs) */}
            <View className='flex-row gap-3'>
              <View className='flex-1'>
                <Controller
                  control={control}
                  name='color'
                  render={({ field: { onBlur, onChange, value } }) => (
                    <CustomTextInput
                      editable={!disabled && !isSubmitting}
                      error={errors.color?.message}
                      label='Color'
                      onBlur={onBlur}
                      onChangeText={(text: string) => {
                        const formatted = formatCapitalizeWords(text);
                        onChange(formatted);
                      }}
                          placeholder='Ej. Blanco'
                      required
                      testID='vehicle-credit-color-input'
                      value={value}
                    />
                  )}
                />
              </View>

              <View className='w-28'>
                <Controller
                  control={control}
                  name='anio'
                  render={({ field: { onBlur, onChange, value } }) => (
                    <CustomTextInput
                      editable={!disabled && !isSubmitting}
                      error={errors.anio?.message}
                      keyboardType='numeric'
                      label='Año'
                      maxLength={4}
                      onBlur={onBlur}
                      onChangeText={(text: string) => {
                        const formatted = formatYear(text);
                        onChange(formatted);
                      }}
                          placeholder='2024'
                      required
                      testID='vehicle-credit-anio-input'
                      value={value}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* CONTAINER 2: PLAN DE FINANCIAMIENTO */}
          <View
            className='w-full rounded-2xl bg-stone-50 p-4 gap-4 border border-stone-200'
            testID='vehicle-credit-financing-plan-container'
          >
            <View className='flex-row items-center gap-2'>
              <BanknoteIcon
                color='#111111'
                size={20}
                strokeWidth={2}
              />
              <Text className='text-base font-bold text-gray-900'>
                2. PLAN DE FINANCIAMIENTO
              </Text>
            </View>

            {/* Moneda */}
            <Controller
              control={control}
              name='moneda'
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  disabled={disabled || isSubmitting}
                  errorMessage={errors.moneda?.message}
                  label='Moneda'
                  modalTitle='Seleccione la Moneda'
                  onValueChange={onChange}
                  options={CURRENCY_OPTIONS}
                  placeholder='Seleccione la moneda'
                  required
                  testID='vehicle-credit-moneda-select'
                  value={value}
                />
              )}
            />

            {/* Valor del Vehículo */}
            <Controller
              control={control}
              name='valor_vehiculo'
              render={({ field: { onBlur, onChange, value } }) => (
                <CustomTextInput
                  editable={!disabled && !isSubmitting}
                  error={errors.valor_vehiculo?.message}
                  keyboardType='numeric'
                  label='Valor del Vehículo'
                  leftIcon='banknote'
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrencyDisplay(text);
                    onChange(formatted);
                  }}
                  placeholder='0'
                  required
                  testID='vehicle-credit-valor-vehiculo-input'
                  value={
                    value !== undefined && value !== null
                      ? String(value)
                      : ''
                  }
                />
              )}
            />

            {/* Monto de Prima */}
            <Controller
              control={control}
              name='monto_prima'
              render={({ field: { onBlur, onChange, value } }) => (
                <CustomTextInput
                  editable={!disabled && !isSubmitting}
                  error={
                    errors.monto_prima
                      ? errors.monto_prima.message ??
                        '10% de prima mínima permitida'
                      : undefined
                  }
                  helperText={
                    errors.monto_prima
                      ? undefined
                      : '10% de prima mínima permitida'
                  }
                  keyboardType='numeric'
                  label='Monto de Prima'
                  leftIcon='banknote'
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrencyDisplay(text);
                    onChange(formatted);
                  }}
                  placeholder='0'
                  required
                  testID='vehicle-credit-monto-prima-input'
                  value={
                    value !== undefined && value !== null
                      ? String(value)
                      : ''
                  }
                />
              )}
            />

            {/* Monto a Financiar (Read-Only Auto-Calculated) */}
            <CustomTextInput
              editable={false}
              error={errors.monto_financiar?.message}
              helperText='Calculado automáticamente'
              keyboardType='numeric'
              label='Monto a Financiar'
              leftIcon='banknote'
              testID='vehicle-credit-derived-monto-financiar'
              value={
                typeof watchedMontoFinanciar === 'string' &&
                watchedMontoFinanciar !== ''
                  ? watchedMontoFinanciar
                  : formatCurrencyDisplay(derivedMontoFinanciar)
              }
            />

            {/* Plazo en Meses */}
            <Controller
              control={control}
              name='plazo_meses'
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  errorMessage={errors.plazo_meses?.message}
                  hideChevron={true}
                  isDisabled={true}
                  label='Plazo en Meses'
                  modalTitle='Seleccione el Plazo'
                  onValueChange={onChange}
                  options={financingTermOptions}
                  placeholder='Seleccione el plazo'
                  required={false}
                  testID='vehicle-credit-plazo-meses-select'
                  value={value ? String(value) : ''}
                />
              )}
            />
          </View>
        </View>
    </WizardStepLayout>
  );
};

VehicleCreditStepView.displayName = 'VehicleCreditStepView';

export default VehicleCreditStepView;
