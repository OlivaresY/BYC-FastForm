import React from 'react';
import { Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import {
  BanknoteIcon,
  CarIcon,
  CustomSelect,
  type CustomSelectOption,
  CustomTextInput,
} from '@/shared/ui';
import {
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
    control,
    derivedMontoFinanciar,
    errors,
    handleFinancialChange,
    handleNext,
    isSubmitting,
    isValid,
  } = viewModel;

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
      {({ onInputFocus }) => (
        <View className='w-full gap-4'>
          {/* CONTAINER 1: ESPECIFICACIONES DE LA UNIDAD */}
          <View
            className='bg-stone-50 rounded-2xl p-4 gap-4 mb-2 border border-stone-200'
            testID='vehicle-credit-unit-specifications-container'
          >
            <View className='flex-row items-center gap-2 mb-2'>
              <CarIcon
                color='#111111'
                size={20}
                strokeWidth={2}
              />
              <Text className='text-base font-bold text-gray-900'>
                Especificaciones de la Unidad
              </Text>
            </View>

            {/* Marca */}
            <Controller
              control={control}
              name='marca'
              render={({ field: { onBlur, onChange, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.marca?.message}
                    label='Marca'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onFocus={onInputFocus}
                    placeholder='Ej. Toyota, Hyundai, BYD'
                    required
                    testID='vehicle-credit-marca-input'
                    value={value}
                  />
                </View>
              )}
            />

            {/* Modelo */}
            <Controller
              control={control}
              name='modelo'
              render={({ field: { onBlur, onChange, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.modelo?.message}
                    label='Modelo'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onFocus={onInputFocus}
                    placeholder='Ej. Corolla, Tucson, Yuan Pro'
                    required
                    testID='vehicle-credit-modelo-input'
                    value={value}
                  />
                </View>
              )}
            />

            {/* Color y Año */}
            <Controller
              control={control}
              name='color_ano'
              render={({ field: { onBlur, onChange, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.color_ano?.message}
                    label='Color y Año'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onFocus={onInputFocus}
                    placeholder='Ej. Blanco 2024'
                    required
                    testID='vehicle-credit-color-ano-input'
                    value={value}
                  />
                </View>
              )}
            />
          </View>

          {/* CONTAINER 2: PLAN DE FINANCIAMIENTO */}
          <View
            className='bg-stone-50 rounded-2xl p-4 gap-4 mb-4 border border-stone-200'
            testID='vehicle-credit-financing-plan-container'
          >
            <View className='flex-row items-center gap-2 mb-2'>
              <BanknoteIcon
                color='#111111'
                size={20}
                strokeWidth={2}
              />
              <Text className='text-base font-bold text-gray-900'>
                Plan de Financiamiento
              </Text>
            </View>

            {/* Moneda */}
            <Controller
              control={control}
              name='moneda'
              render={({ field: { onChange, value } }) => (
                <View className='mb-2'>
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
                </View>
              )}
            />

            {/* Valor del Vehículo */}
            <Controller
              control={control}
              name='valor_vehiculo'
              render={({ field: { onBlur, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.valor_vehiculo?.message}
                    keyboardType='numeric'
                    label='Valor del Vehículo'
                    leftIcon='banknote'
                    onBlur={onBlur}
                    onChangeText={(text: string) => {
                      const digits = text.replace(/[^0-9]/g, '');
                      const num = digits === '' ? 0 : Number(digits);
                      handleFinancialChange('valor_vehiculo', num);
                    }}
                    onFocus={onInputFocus}
                    placeholder='0'
                    required
                    testID='vehicle-credit-valor-vehiculo-input'
                    value={value ? String(value) : ''}
                  />
                </View>
              )}
            />

            {/* Monto de Prima */}
            <Controller
              control={control}
              name='monto_prima'
              render={({ field: { onBlur, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.monto_prima?.message}
                    helperText='20% Prima Mínima'
                    keyboardType='numeric'
                    label='Monto de Prima'
                    labelRight={
                      <Text className='text-xs text-gray-500 font-medium'>
                        20% Prima Mínima
                      </Text>
                    }
                    leftIcon='banknote'
                    onBlur={onBlur}
                    onChangeText={(text: string) => {
                      const digits = text.replace(/[^0-9]/g, '');
                      const num = digits === '' ? 0 : Number(digits);
                      handleFinancialChange('monto_prima', num);
                    }}
                    onFocus={onInputFocus}
                    placeholder='0'
                    required
                    testID='vehicle-credit-monto-prima-input'
                    value={value ? String(value) : ''}
                  />
                </View>
              )}
            />

            {/* Monto a Financiar (Derived Read-Only) */}
            <View className='mb-2'>
              <Text className='text-sm font-medium text-gray-900 mb-1.5'>
                Monto a Financiar
              </Text>
              <View
                accessibilityLabel='Monto a Financiar'
                className='bg-stone-100 rounded-lg border border-gray-200 px-3.5 py-2.5 min-h-[48px] justify-center'
              >
                <Text
                  className='text-base font-semibold text-gray-900'
                  testID='vehicle-credit-derived-monto-financiar'
                >
                  {derivedMontoFinanciar !== 0
                    ? String(derivedMontoFinanciar)
                    : '0'}
                </Text>
              </View>
              {errors.monto_financiar?.message ? (
                <Text
                  className='mt-1 text-xs text-brand-red'
                  testID='vehicle-credit-monto-financiar-error'
                >
                  {errors.monto_financiar.message}
                </Text>
              ) : null}
            </View>

            {/* Plazo en Meses */}
            <Controller
              control={control}
              name='plazo_meses'
              render={({ field: { onBlur, onChange, value } }) => (
                <View className='mb-2'>
                  <CustomTextInput
                    editable={!disabled && !isSubmitting}
                    error={errors.plazo_meses?.message}
                    keyboardType='numeric'
                    label='Plazo en Meses'
                    onBlur={onBlur}
                    onChangeText={(text: string) => {
                      const digits = text.replace(/[^0-9]/g, '');
                      onChange(digits === '' ? 0 : Number(digits));
                    }}
                    onFocus={onInputFocus}
                    placeholder='84'
                    required
                    testID='vehicle-credit-plazo-meses-input'
                    value={value ? String(value) : ''}
                  />
                </View>
              )}
            />
          </View>
        </View>
      )}
    </WizardStepLayout>
  );
};

VehicleCreditStepView.displayName = 'VehicleCreditStepView';

export default VehicleCreditStepView;
