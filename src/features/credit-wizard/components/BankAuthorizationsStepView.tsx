import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import {
  BuildingIcon,
  CheckmarkIcon,
  CheckSquareIcon,
  DocumentIcon,
  ShieldCheckIcon,
} from '@/shared/ui';
import {
  BANK_AUTHORIZATIONS_STEP_COLORS,
  BANK_AUTHORIZATIONS_STEP_COPY,
  BANK_AUTHORIZATIONS_STEP_NUMERICAL,
  BANK_AUTHORIZATIONS_STEP_STYLES,
  BANK_AUTHORIZATIONS_STEP_TEST_IDS,
  BANKS_CONFIG,
  type BankOptionConfig,
} from '../constants/BankAuthorizations.constants';
import {
  useBankAuthorizationsViewModel,
  type UseBankAuthorizationsViewModelReturn,
} from '../hooks/useBankAuthorizationsViewModel';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';
import { WizardStepLayout } from './WizardStepLayout';

export interface LegalConsentItemProps {
  description: string;
  disabled?: boolean;
  errorMessage?: string;
  errorTestID?: string;
  isChecked: boolean;
  onToggle: () => void;
  testID: string;
  title: string;
}

export const LegalConsentItem = React.memo(
  ({
    description,
    disabled = false,
    errorMessage,
    errorTestID,
    isChecked,
    onToggle,
    testID,
    title,
  }: LegalConsentItemProps): React.JSX.Element => (
    <View>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: isChecked }}
        className='flex-row items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200'
        disabled={disabled}
        onPress={onToggle}
        testID={testID}
      >
        <View
          className={`mt-0.5 ${BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX} ${
            isChecked
              ? BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX_ACTIVE
              : BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX_INACTIVE
          }`}
        >
          {isChecked ? (
            <CheckmarkIcon
              color={BANK_AUTHORIZATIONS_STEP_COLORS.CHECKBOX_ICON}
              size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.CHECKBOX_ICON_SIZE}
              strokeWidth={
                BANK_AUTHORIZATIONS_STEP_NUMERICAL.CHECKBOX_STROKE_WIDTH
              }
            />
          ) : null}
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-semibold text-gray-900 leading-5'>
            {title}
          </Text>
          <Text className='text-xs text-stone-600 mt-1 leading-4'>
            {description}
          </Text>
        </View>
      </Pressable>
      {errorMessage ? (
        <Text className='mt-1 text-xs text-red-600' testID={errorTestID}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  ),
);

LegalConsentItem.displayName = 'LegalConsentItem';

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

export const BankAuthorizationsStepView = React.memo(
  ({
    currentStep = BANK_AUTHORIZATIONS_STEP_NUMERICAL.CURRENT_STEP,
    disabled = false,
    onBack,
    onClose,
    onSubmit,
    testID = BANK_AUTHORIZATIONS_STEP_TEST_IDS.CONTAINER,
    totalSteps = BANK_AUTHORIZATIONS_STEP_NUMERICAL.TOTAL_STEPS,
    viewModel: viewModelProp,
  }: BankAuthorizationsStepViewProps): React.JSX.Element => {
    const defaultViewModel = useBankAuthorizationsViewModel({
      onSuccess: onSubmit,
    });
    const viewModel = viewModelProp ?? defaultViewModel;

    const {
      control,
      errors,
      handleNext,
      isAllBanksSelected,
      isSubmitting,
      isValid,
      toggleAllBanks,
    } = viewModel;

    const submitIcon = (
      <DocumentIcon
        color='#FFFFFF'
        size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.SUBMIT_ICON_SIZE}
        strokeWidth={
          BANK_AUTHORIZATIONS_STEP_NUMERICAL.SUBMIT_ICON_STROKE_WIDTH
        }
      />
    );

    return (
      <WizardStepLayout
        currentStep={currentStep}
        description={BANK_AUTHORIZATIONS_STEP_COPY.DESCRIPTION}
        disabled={disabled}
        isSubmitDisabled={!isValid}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onClose={onClose}
        onNext={handleNext}
        submitButtonIcon={submitIcon}
        submitButtonLabel={BANK_AUTHORIZATIONS_STEP_COPY.SUBMIT_BUTTON_LABEL}
        testID={testID}
        title={BANK_AUTHORIZATIONS_STEP_COPY.TITLE}
        totalSteps={totalSteps}
      >
        <View className={BANK_AUTHORIZATIONS_STEP_STYLES.CONTAINER}>
          {/* SECTION 1: BANCOS A COTIZAR */}
          <View
            className={BANK_AUTHORIZATIONS_STEP_STYLES.CARD_CONTAINER}
            testID={BANK_AUTHORIZATIONS_STEP_TEST_IDS.SECTION_1_CONTAINER}
          >
            <View className='flex-row items-center justify-between'>
              <View className='flex-1 flex-row items-center gap-3 pr-2'>
                <View
                  className={BANK_AUTHORIZATIONS_STEP_STYLES.HEADER_ICON_BOX}
                >
                  <BuildingIcon
                    color={BANK_AUTHORIZATIONS_STEP_COLORS.HEADER_ICON}
                    size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.HEADER_ICON_SIZE}
                    strokeWidth={
                      BANK_AUTHORIZATIONS_STEP_NUMERICAL.HEADER_ICON_STROKE_WIDTH
                    }
                  />
                </View>
                <View className='flex-1'>
                  <Text className='text-base font-bold text-gray-900'>
                    {BANK_AUTHORIZATIONS_STEP_COPY.SECTION_1_TITLE}
                  </Text>
                  <Text className='text-xs text-stone-600 mt-0.5'>
                    {BANK_AUTHORIZATIONS_STEP_COPY.SECTION_1_HELPER}
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityLabel={
                  BANK_AUTHORIZATIONS_STEP_COPY.TOGGLE_ALL_BANKS
                }
                accessibilityRole='button'
                className={`${BANK_AUTHORIZATIONS_STEP_STYLES.TOGGLE_ALL_BUTTON} ${
                  isAllBanksSelected
                    ? BANK_AUTHORIZATIONS_STEP_STYLES.TOGGLE_ALL_BUTTON_ACTIVE
                    : BANK_AUTHORIZATIONS_STEP_STYLES.TOGGLE_ALL_BUTTON_INACTIVE
                }`}
                disabled={disabled || isSubmitting}
                hitSlop={8}
                onPress={toggleAllBanks}
                testID={BANK_AUTHORIZATIONS_STEP_TEST_IDS.TOGGLE_ALL_BUTTON}
              >
                <CheckSquareIcon
                  color={
                    isAllBanksSelected
                      ? BANK_AUTHORIZATIONS_STEP_COLORS.TOGGLE_ALL_ICON_ACTIVE
                      : BANK_AUTHORIZATIONS_STEP_COLORS.TOGGLE_ALL_ICON_INACTIVE
                  }
                  size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.TOGGLE_ALL_ICON_SIZE}
                  strokeWidth={
                    BANK_AUTHORIZATIONS_STEP_NUMERICAL.TOGGLE_ALL_ICON_STROKE_WIDTH
                  }
                />
                <Text
                  className={
                    isAllBanksSelected
                      ? BANK_AUTHORIZATIONS_STEP_STYLES.TOGGLE_ALL_TEXT_ACTIVE
                      : BANK_AUTHORIZATIONS_STEP_STYLES.TOGGLE_ALL_TEXT_INACTIVE
                  }
                >
                  {BANK_AUTHORIZATIONS_STEP_COPY.TOGGLE_ALL_BANKS}
                </Text>
              </Pressable>
            </View>

            {BANKS_CONFIG.map((bank: BankOptionConfig) => (
              <Controller
                control={control}
                key={bank.id}
                name={bank.formKey}
                render={({ field: { onChange, value } }) => (
                  <Pressable
                    accessibilityLabel={bank.label}
                    accessibilityRole='checkbox'
                    accessibilityState={{ checked: value }}
                    className='flex-row items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200'
                    disabled={disabled || isSubmitting}
                    onPress={() => onChange(!value)}
                    testID={bank.testID}
                  >
                    {/* LEFT: Checkbox */}
                    <View
                      className={`${BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX} ${
                        value
                          ? BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX_ACTIVE
                          : BANK_AUTHORIZATIONS_STEP_STYLES.CHECKBOX_BOX_INACTIVE
                      }`}
                    >
                      {value ? (
                        <CheckmarkIcon
                          color={BANK_AUTHORIZATIONS_STEP_COLORS.CHECKBOX_ICON}
                          size={
                            BANK_AUTHORIZATIONS_STEP_NUMERICAL.CHECKBOX_ICON_SIZE
                          }
                          strokeWidth={
                            BANK_AUTHORIZATIONS_STEP_NUMERICAL.CHECKBOX_STROKE_WIDTH
                          }
                        />
                      ) : null}
                    </View>

                    {/* MIDDLE: Bank Name */}
                    <Text className='flex-1 ml-3 text-sm font-semibold text-gray-900'>
                      {bank.label}
                    </Text>

                    {/* RIGHT: Bank SVG Logo */}
                    <View className='w-12 h-6 items-center justify-center'>
                      <bank.LogoComponent
                        color={BANK_AUTHORIZATIONS_STEP_COLORS.ICON_COLOR}
                        size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.ICON_SIZE}
                        strokeWidth={
                          BANK_AUTHORIZATIONS_STEP_NUMERICAL.ICON_STROKE_WIDTH
                        }
                      />
                    </View>
                  </Pressable>
                )}
              />
            ))}

            {errors.banco_bac?.message ? (
              <Text
                className='text-xs text-red-600'
                testID={BANK_AUTHORIZATIONS_STEP_TEST_IDS.BANCO_ERROR}
              >
                {errors.banco_bac.message}
              </Text>
            ) : null}
          </View>

          {/* SECTION 2: AUTORIZACIONES LEGALES (SUGEF / CIC) */}
          <View
            className={BANK_AUTHORIZATIONS_STEP_STYLES.CARD_CONTAINER}
            testID={BANK_AUTHORIZATIONS_STEP_TEST_IDS.SECTION_2_CONTAINER}
          >
            <View className='flex-row items-center gap-3'>
              <View className={BANK_AUTHORIZATIONS_STEP_STYLES.HEADER_ICON_BOX}>
                <ShieldCheckIcon
                  color={BANK_AUTHORIZATIONS_STEP_COLORS.HEADER_ICON}
                  size={BANK_AUTHORIZATIONS_STEP_NUMERICAL.HEADER_ICON_SIZE}
                  strokeWidth={
                    BANK_AUTHORIZATIONS_STEP_NUMERICAL.HEADER_ICON_STROKE_WIDTH
                  }
                />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-bold text-gray-900'>
                  {BANK_AUTHORIZATIONS_STEP_COPY.SECTION_2_TITLE}
                </Text>
                <Text className='text-xs text-stone-600 mt-0.5'>
                  {BANK_AUTHORIZATIONS_STEP_COPY.SECTION_2_HELPER}
                </Text>
              </View>
            </View>

            {/* Legal Consent 1: SUGEF CIC */}
            <Controller
              control={control}
              name='autoriza_sugef_cic'
              render={({ field: { onChange, value } }) => (
                <LegalConsentItem
                  description={BANK_AUTHORIZATIONS_STEP_COPY.LEGAL_DESC_1}
                  disabled={disabled || isSubmitting}
                  errorMessage={errors.autoriza_sugef_cic?.message}
                  errorTestID={
                    BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_SUGEF_CIC_ERROR
                  }
                  isChecked={value}
                  onToggle={() => onChange(!value)}
                  testID={
                    BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_SUGEF_CIC_CHECKBOX
                  }
                  title={BANK_AUTHORIZATIONS_STEP_COPY.LEGAL_TITLE_1}
                />
              )}
            />

            {/* Legal Consent 2: Burós de Crédito */}
            <Controller
              control={control}
              name='autoriza_buros_credito'
              render={({ field: { onChange, value } }) => (
                <LegalConsentItem
                  description={BANK_AUTHORIZATIONS_STEP_COPY.LEGAL_DESC_2}
                  disabled={disabled || isSubmitting}
                  errorMessage={errors.autoriza_buros_credito?.message}
                  errorTestID={
                    BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_BUROS_CREDITO_ERROR
                  }
                  isChecked={value}
                  onToggle={() => onChange(!value)}
                  testID={
                    BANK_AUTHORIZATIONS_STEP_TEST_IDS.AUTORIZA_BUROS_CREDITO_CHECKBOX
                  }
                  title={BANK_AUTHORIZATIONS_STEP_COPY.LEGAL_TITLE_2}
                />
              )}
            />
          </View>
        </View>
      </WizardStepLayout>
    );
  },
);

BankAuthorizationsStepView.displayName = 'BankAuthorizationsStepView';

export default BankAuthorizationsStepView;
