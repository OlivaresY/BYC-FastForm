import {
  BanknoteIcon,
  BuildingIcon,
  CustomTextInput,
  PhoneIcon,
  SectionHeader,
  UserIcon,
} from '@/shared/ui';
import {
  formatCorporateIdDisplay,
  formatCurrencyDisplay,
  formatDateDisplay,
  sanitizeNumericDigits,
} from '@/shared/utils';
import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import {
  LEGAL_ENTITY_CONTACT_FORM_COLORS,
  LEGAL_ENTITY_CONTACT_FORM_COPY,
  LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS,
  LEGAL_ENTITY_CONTACT_FORM_NUMERICAL,
  LEGAL_ENTITY_CONTACT_FORM_STYLES,
  LEGAL_ENTITY_CONTACT_FORM_TEST_IDS,
} from '../constants/LegalEntityContactForm.constants';
import type { LegalEntityContactFormProps } from '../types/LegalEntityContactForm.types';


const CorporateSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_ICON}>
    <BuildingIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const ContactSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_ICON}>
    <PhoneIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const RepresentativeSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_ICON}>
    <UserIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const FinancialSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_ICON}>
    <BanknoteIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);


export const LegalEntityContactForm = ({
  control,
  disabled = false,
  onInputFocus,
  testID,
}: LegalEntityContactFormProps): React.JSX.Element => {
  return (
    <View
      className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CONTAINER}
      testID={testID ?? LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CONTAINER}
    >
      {/* SECTION 1: INFORMACIÓN CORPORATIVA */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_1}
      >
        <SectionHeader
          icon={<CorporateSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_1_TITLE}
        />

        {/* Razón Social */}
        <Controller
          control={control}
          name='corporateName'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.CORPORATE_NAME_LABEL}
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.CORPORATE_NAME_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CORPORATE_NAME_INPUT}
              value={value ?? ''}
            />
          )}
        />

        {/* Cédula Jurídica & Fecha de Constitución (2-Column Flex Row) */}
        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='corporateId'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  autoCapitalize='none'
                  autoCorrect={false}
                  editable={!disabled}
                  error={error?.message}
                  helperText={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CORPORATE_ID_HELPER
                  }
                  keyboardType='numeric'
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.CORPORATE_ID_LABEL}
                  leftIcon='hash'
                  maxLength={
                    LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_CORPORATE_ID
                  }
                  onBlur={onBlur}
                  onChangeText={(text: string): void => {
                    const masked = formatCorporateIdDisplay(text);
                    onChange(masked);
                  }}
                  onFocus={onInputFocus}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CORPORATE_ID_PLACEHOLDER
                  }
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CORPORATE_ID_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='constitutionDate'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  helperText={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CONSTITUTION_DATE_HELPER
                  }
                  keyboardType='numeric'
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.CONSTITUTION_DATE_LABEL}
                  leftIcon='calendar'
                  maxLength={
                    LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_DATE
                  }
                  onBlur={onBlur}
                  onChangeText={(text: string): void => {
                    const maskedDate = formatDateDisplay(text);
                    onChange(maskedDate);
                  }}
                  onFocus={onInputFocus}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CONSTITUTION_DATE_PLACEHOLDER
                  }
                  required
                  testID={
                    LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CONSTITUTION_DATE_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* SECTION 2: CONTACTO CORPORATIVO */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_2}
      >
        <SectionHeader
          icon={<ContactSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_2_TITLE}
        />

        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='phone'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='phone-pad'
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.PHONE_LABEL}
                  leftIcon='phone-call'
                  maxLength={
                    LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_PHONE
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={LEGAL_ENTITY_CONTACT_FORM_COPY.PHONE_PLACEHOLDER}
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.PHONE_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='email'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  autoCapitalize='none'
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='email-address'
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.EMAIL_LABEL}
                  leftIcon='mail'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={LEGAL_ENTITY_CONTACT_FORM_COPY.EMAIL_PLACEHOLDER}
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EMAIL_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* SECTION 3: REPRESENTANTE LEGAL */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_3}
      >
        <SectionHeader
          icon={<RepresentativeSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_3_TITLE}
        />

        {/* Nombre Completo del Representante */}
        <Controller
          control={control}
          name='representativeName'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.REPRESENTATIVE_NAME_LABEL}
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.REPRESENTATIVE_NAME_PLACEHOLDER
              }
              required
              testID={
                LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT
              }
              value={value ?? ''}
            />
          )}
        />

        {/* Cédula del Representante */}
        <Controller
          control={control}
          name='representativeId'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='none'
              autoCorrect={false}
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.REPRESENTATIVE_ID_LABEL}
              leftIcon='hash'
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.REPRESENTATIVE_ID_PLACEHOLDER
              }
              required
              testID={
                LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REPRESENTATIVE_ID_INPUT
              }
              value={value ?? ''}
            />
          )}
        />
      </View>

      {/* SECTION 4: CAPACIDAD FINANCIERA */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CARD_SECTION_4}
      >
        <SectionHeader
          icon={<FinancialSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_4_TITLE}
        />

        {/* Ingreso Bruto & Ingreso Neto (2-Column Flex Row) */}
        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='grossIncome'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => {
                const displayValue =
                  value !== undefined && value !== null
                    ? formatCurrencyDisplay(value)
                    : '';

                return (
                  <CustomTextInput
                    editable={!disabled}
                    error={error?.message}
                    keyboardType='numeric'
                    label={LEGAL_ENTITY_CONTACT_FORM_COPY.GROSS_INCOME_LABEL}
                    leftIcon='banknote'
                    maxLength={
                      LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_INCOME
                    }
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = sanitizeNumericDigits(text);
                      onChange(digits === '' ? undefined : Number(digits));
                    }}
                    onFocus={onInputFocus}
                    placeholder={
                      LEGAL_ENTITY_CONTACT_FORM_COPY.GROSS_INCOME_PLACEHOLDER
                    }
                    required
                    testID={
                      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT
                    }
                    value={displayValue}
                  />
                );
              }}
            />
          </View>

          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='netIncome'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => {
                const displayValue =
                  value !== undefined && value !== null
                    ? formatCurrencyDisplay(value)
                    : '';

                return (
                  <CustomTextInput
                    editable={!disabled}
                    error={error?.message}
                    keyboardType='numeric'
                    label={LEGAL_ENTITY_CONTACT_FORM_COPY.NET_INCOME_LABEL}
                    leftIcon='banknote'
                    maxLength={
                      LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_INCOME
                    }
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = sanitizeNumericDigits(text);
                      onChange(digits === '' ? undefined : Number(digits));
                    }}
                    onFocus={onInputFocus}
                    placeholder={
                      LEGAL_ENTITY_CONTACT_FORM_COPY.NET_INCOME_PLACEHOLDER
                    }
                    required
                    testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT}
                    value={displayValue}
                  />
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export const LegalEntityContactFormMemo = React.memo(LegalEntityContactForm);
