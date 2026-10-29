import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import {
  BuildingIcon,
  CustomSelect,
  type CustomSelectOption,
  DocumentIcon,
} from '@/shared/ui';
import {
  useBankAuthorizationsViewModel,
  type UseBankAuthorizationsViewModelReturn,
} from '../hooks/useBankAuthorizationsViewModel';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import { WizardStepLayout } from './WizardStepLayout';

const BANK_OPTIONS: readonly CustomSelectOption[] = [
  { label: 'BAC San José', value: 'BAC San José' },
  { label: 'Banco Nacional', value: 'Banco Nacional' },
  { label: 'Scotiabank', value: 'Scotiabank' },
  { label: 'Banco Davivienda', value: 'Banco Davivienda' },
  { label: 'Banco de Costa Rica (BCR)', value: 'Banco de Costa Rica' },
];

export interface BankAuthorizationsStepViewProps {
  currentStep?: number;
  disabled?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSubmit?: (data: BankAuthorizationsFormValues) => void | Promise<void>;
  testID?: string;
  totalSteps?: number;
  viewModel?: UseBankAuthorizationsViewModelReturn;
}

export const BankAuthorizationsStepView = ({
  currentStep = 4,
  disabled = false,
  onBack,
  onClose,
  onSubmit,
  testID = 'bank-authorizations-step-view',
  totalSteps = 4,
  viewModel: viewModelProp,
}: BankAuthorizationsStepViewProps): React.JSX.Element => {
  const defaultViewModel = useBankAuthorizationsViewModel({
    onSuccess: onSubmit,
  });
  const viewModel = viewModelProp ?? defaultViewModel;

  const { control, errors, handleNext, isSubmitting, isValid } = viewModel;

  return (
    <WizardStepLayout
      currentStep={currentStep}
      description='Selecciona el banco de destino y confirma las autorizaciones legales para el trámite de crédito.'
      disabled={disabled}
      isSubmitDisabled={!isValid}
      isSubmitting={isSubmitting}
      onBack={onBack}
      onClose={onClose}
      onNext={handleNext}
      submitButtonLabel='Finalizar Solicitud'
      testID={testID}
      title='Autorizaciones y Bancos'
      totalSteps={totalSteps}
    >
      <View className='w-full gap-4'>
        {/* CONTAINER 1: ENTIDAD BANCARIA */}
        <View
          className='bg-stone-50 rounded-2xl p-4 gap-4 mb-2 border border-stone-200'
          testID='bank-authorizations-bank-container'
        >
          <View className='flex-row items-center gap-2 mb-2'>
            <BuildingIcon color='#111111' size={20} strokeWidth={2} />
            <Text className='text-base font-bold text-gray-900'>
              Entidad Bancaria
            </Text>
          </View>

          <Controller
            control={control}
            name='banco_destino'
            render={({ field: { onChange, value } }) => (
              <View className='mb-2'>
                <CustomSelect
                  disabled={disabled || isSubmitting}
                  errorMessage={errors.banco_destino?.message}
                  label='Banco de Destino'
                  modalTitle='Seleccione el Banco'
                  onValueChange={onChange}
                  options={BANK_OPTIONS}
                  placeholder='Seleccione la entidad bancaria'
                  required
                  testID='bank-authorizations-banco-destino-select'
                  value={value}
                />
              </View>
            )}
          />
        </View>

        {/* CONTAINER 2: CONSENTIMIENTOS Y AUTORIZACIONES */}
        <View
          className='bg-stone-50 rounded-2xl p-4 gap-2 mb-4 border border-stone-200'
          testID='bank-authorizations-consents-container'
        >
          <View className='flex-row items-center gap-2 mb-2'>
            <DocumentIcon color='#111111' size={20} strokeWidth={2} />
            <Text className='text-base font-bold text-gray-900'>
              Consentimientos y Autorizaciones
            </Text>
          </View>

          {/* Switch 1: Consulta de Buró de Crédito */}
          <View className='py-2'>
            <View className='flex-row items-center justify-between gap-4'>
              <View className='flex-1'>
                <Text className='text-sm font-semibold text-gray-900'>
                  Consulta de Buró de Crédito
                </Text>
                <Text className='text-xs text-gray-500 mt-0.5 leading-4'>
                  Autorizo la consulta de mi historial crediticio en las
                  centrales de riesgo privadas autorizadas.
                </Text>
              </View>
              <Controller
                control={control}
                name='autoriza_buro'
                render={({ field: { onChange, value } }) => (
                  <Switch
                    accessibilityLabel='Consulta de Buró de Crédito'
                    accessibilityRole='switch'
                    disabled={disabled || isSubmitting}
                    onValueChange={onChange}
                    testID='bank-authorizations-autoriza-buro-switch'
                    thumbColor='#FFFFFF'
                    trackColor={{ false: '#D6D3D1', true: '#10B981' }}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.autoriza_buro?.message ? (
              <Text
                className='mt-1 text-xs text-red-600'
                testID='bank-authorizations-autoriza-buro-error'
              >
                {errors.autoriza_buro.message}
              </Text>
            ) : null}
          </View>

          <View className='h-px bg-stone-200 my-1' />

          {/* Switch 2: Directriz SUGEF CIC */}
          <View className='py-2'>
            <View className='flex-row items-center justify-between gap-4'>
              <View className='flex-1'>
                <Text className='text-sm font-semibold text-gray-900'>
                  Directriz SUGEF CIC
                </Text>
                <Text className='text-xs text-gray-500 mt-0.5 leading-4'>
                  Autorizo la consulta y verificación de mi información
                  crediticia en el Centro de Información Crediticia (CIC) de la
                  SUGEF.
                </Text>
              </View>
              <Controller
                control={control}
                name='autoriza_sugef'
                render={({ field: { onChange, value } }) => (
                  <Switch
                    accessibilityLabel='Directriz SUGEF CIC'
                    accessibilityRole='switch'
                    disabled={disabled || isSubmitting}
                    onValueChange={onChange}
                    testID='bank-authorizations-autoriza-sugef-switch'
                    thumbColor='#FFFFFF'
                    trackColor={{ false: '#D6D3D1', true: '#10B981' }}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.autoriza_sugef?.message ? (
              <Text
                className='mt-1 text-xs text-red-600'
                testID='bank-authorizations-autoriza-sugef-error'
              >
                {errors.autoriza_sugef.message}
              </Text>
            ) : null}
          </View>

          <View className='h-px bg-stone-200 my-1' />

          {/* Switch 3: Términos y Condiciones */}
          <View className='py-2'>
            <View className='flex-row items-center justify-between gap-4'>
              <View className='flex-1'>
                <Text className='text-sm font-semibold text-gray-900'>
                  Términos y Condiciones
                </Text>
                <Text className='text-xs text-gray-500 mt-0.5 leading-4'>
                  Acepto los términos y condiciones del servicio y confirmo que
                  la información suministrada es verídica.
                </Text>
              </View>
              <Controller
                control={control}
                name='acepta_terminos'
                render={({ field: { onChange, value } }) => (
                  <Switch
                    accessibilityLabel='Términos y Condiciones'
                    accessibilityRole='switch'
                    disabled={disabled || isSubmitting}
                    onValueChange={onChange}
                    testID='bank-authorizations-acepta-terminos-switch'
                    thumbColor='#FFFFFF'
                    trackColor={{ false: '#D6D3D1', true: '#10B981' }}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.acepta_terminos?.message ? (
              <Text
                className='mt-1 text-xs text-red-600'
                testID='bank-authorizations-acepta-terminos-error'
              >
                {errors.acepta_terminos.message}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </WizardStepLayout>
  );
};

BankAuthorizationsStepView.displayName = 'BankAuthorizationsStepView';

export default BankAuthorizationsStepView;
