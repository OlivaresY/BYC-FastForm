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
import {
  CURRENCY_OPTIONS,
  VEHICLE_CREDIT_STEP_COLORS,
  VEHICLE_CREDIT_STEP_COPY,
  VEHICLE_CREDIT_STEP_NUMERICAL,
  VEHICLE_CREDIT_STEP_STYLES,
} from '../constants/VehicleCredit.constants';
import type { VehicleCreditFormValues } from '../types/VehicleCredit.types';
import { WizardStepLayout } from './WizardStepLayout';

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

export const VehicleCreditStepView = React.memo(
  ({
    currentStep = VEHICLE_CREDIT_STEP_NUMERICAL.CURRENT_STEP,
    disabled = false,
    onBack,
    onClose,
    onSubmit,
    testID = 'vehicle-credit-step-view',
    totalSteps = VEHICLE_CREDIT_STEP_NUMERICAL.TOTAL_STEPS,
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
        description={VEHICLE_CREDIT_STEP_COPY.DESCRIPTION}
        disabled={disabled}
        isSubmitDisabled={!isValid}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onClose={onClose}
        onNext={handleNext}
        submitButtonLabel={VEHICLE_CREDIT_STEP_COPY.SUBMIT_BUTTON}
        testID={testID}
        title={VEHICLE_CREDIT_STEP_COPY.TITLE}
        totalSteps={totalSteps}
      >
        <View className={VEHICLE_CREDIT_STEP_STYLES.CONTAINER}>
          {/* CONTAINER 1: ESPECIFICACIONES DE LA UNIDAD */}
          <View
            className={VEHICLE_CREDIT_STEP_STYLES.CARD_CONTAINER}
            testID='vehicle-credit-unit-specifications-container'
          >
            <View className='flex-row items-center gap-2'>
              <CarIcon
                color={VEHICLE_CREDIT_STEP_COLORS.ICON_COLOR}
                size={VEHICLE_CREDIT_STEP_NUMERICAL.ICON_SIZE}
                strokeWidth={VEHICLE_CREDIT_STEP_NUMERICAL.ICON_STROKE_WIDTH}
              />
              <Text className='text-base font-bold text-gray-900'>
                {VEHICLE_CREDIT_STEP_COPY.SECTION_1_TITLE}
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
                  label={VEHICLE_CREDIT_STEP_COPY.MARCA_LABEL}
                  modalTitle={VEHICLE_CREDIT_STEP_COPY.MARCA_MODAL_TITLE}
                  onValueChange={onChange}
                  options={brandOptions}
                  placeholder={VEHICLE_CREDIT_STEP_COPY.MARCA_PLACEHOLDER}
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
                  label={VEHICLE_CREDIT_STEP_COPY.MODELO_LABEL}
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCapitalizeWords(text);
                    onChange(formatted);
                  }}
                  placeholder={VEHICLE_CREDIT_STEP_COPY.MODELO_PLACEHOLDER}
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
                      label={VEHICLE_CREDIT_STEP_COPY.COLOR_LABEL}
                      onBlur={onBlur}
                      onChangeText={(text: string) => {
                        const formatted = formatCapitalizeWords(text);
                        onChange(formatted);
                      }}
                      placeholder={VEHICLE_CREDIT_STEP_COPY.COLOR_PLACEHOLDER}
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
                      label={VEHICLE_CREDIT_STEP_COPY.ANIO_LABEL}
                      maxLength={VEHICLE_CREDIT_STEP_NUMERICAL.MAX_LENGTH_YEAR}
                      onBlur={onBlur}
                      onChangeText={(text: string) => {
                        const formatted = formatYear(text);
                        onChange(formatted);
                      }}
                      placeholder={VEHICLE_CREDIT_STEP_COPY.ANIO_PLACEHOLDER}
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
            className={VEHICLE_CREDIT_STEP_STYLES.CARD_CONTAINER}
            testID='vehicle-credit-financing-plan-container'
          >
            <View className='flex-row items-center gap-2'>
              <BanknoteIcon
                color={VEHICLE_CREDIT_STEP_COLORS.ICON_COLOR}
                size={VEHICLE_CREDIT_STEP_NUMERICAL.ICON_SIZE}
                strokeWidth={VEHICLE_CREDIT_STEP_NUMERICAL.ICON_STROKE_WIDTH}
              />
              <Text className='text-base font-bold text-gray-900'>
                {VEHICLE_CREDIT_STEP_COPY.SECTION_2_TITLE}
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
                  label={VEHICLE_CREDIT_STEP_COPY.MONEDA_LABEL}
                  modalTitle={VEHICLE_CREDIT_STEP_COPY.MONEDA_MODAL_TITLE}
                  onValueChange={onChange}
                  options={CURRENCY_OPTIONS}
                  placeholder={VEHICLE_CREDIT_STEP_COPY.MONEDA_PLACEHOLDER}
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
                  label={VEHICLE_CREDIT_STEP_COPY.VALOR_VEHICULO_LABEL}
                  leftIcon='banknote'
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrencyDisplay(text);
                    onChange(formatted);
                  }}
                  placeholder={
                    VEHICLE_CREDIT_STEP_COPY.VALOR_VEHICULO_PLACEHOLDER
                  }
                  required
                  testID='vehicle-credit-valor-vehiculo-input'
                  value={
                    value !== undefined && value !== null ? String(value) : ''
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
                      ? (errors.monto_prima.message ??
                        VEHICLE_CREDIT_STEP_COPY.MONTO_PRIMA_HELPER)
                      : undefined
                  }
                  helperText={
                    errors.monto_prima
                      ? undefined
                      : VEHICLE_CREDIT_STEP_COPY.MONTO_PRIMA_HELPER
                  }
                  keyboardType='numeric'
                  label={VEHICLE_CREDIT_STEP_COPY.MONTO_PRIMA_LABEL}
                  leftIcon='banknote'
                  onBlur={onBlur}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrencyDisplay(text);
                    onChange(formatted);
                  }}
                  placeholder={VEHICLE_CREDIT_STEP_COPY.MONTO_PRIMA_PLACEHOLDER}
                  required
                  testID='vehicle-credit-monto-prima-input'
                  value={
                    value !== undefined && value !== null ? String(value) : ''
                  }
                />
              )}
            />

            {/* Monto a Financiar (Read-Only Auto-Calculated) */}
            <CustomTextInput
              editable={false}
              error={errors.monto_financiar?.message}
              helperText={
                VEHICLE_CREDIT_STEP_COPY.DERIVED_MONTO_FINANCIAR_HELPER
              }
              keyboardType='numeric'
              label={VEHICLE_CREDIT_STEP_COPY.DERIVED_MONTO_FINANCIAR_LABEL}
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
                  label={VEHICLE_CREDIT_STEP_COPY.PLAZO_MESES_LABEL}
                  modalTitle={VEHICLE_CREDIT_STEP_COPY.PLAZO_MESES_MODAL_TITLE}
                  onValueChange={onChange}
                  options={financingTermOptions}
                  placeholder={VEHICLE_CREDIT_STEP_COPY.PLAZO_MESES_PLACEHOLDER}
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
  },
);

VehicleCreditStepView.displayName = 'VehicleCreditStepView';

export default VehicleCreditStepView;
