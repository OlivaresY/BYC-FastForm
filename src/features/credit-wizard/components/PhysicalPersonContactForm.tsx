import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { CustomTextInput } from '@/shared/ui/CustomTextInput';
import {
  BanknoteIcon,
  IdCardIcon,
  MapPinIcon,
} from '@/shared/ui/Icons';
import { PHYSICAL_PERSON_CONTACT_PATTERNS } from '../constants/PhysicalPersonContact.constants';
import {
  PHYSICAL_PERSON_CONTACT_FORM_COLORS,
  PHYSICAL_PERSON_CONTACT_FORM_COPY,
  PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_FORM_OPTIONS,
  PHYSICAL_PERSON_CONTACT_FORM_STYLES,
  PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS,
} from '../constants/PhysicalPersonContactForm.constants';
import type { PhysicalPersonContactFormProps } from '../types/PhysicalPersonContactForm.types';

const formatCurrencyDisplay = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).replace(
    PHYSICAL_PERSON_CONTACT_PATTERNS.CURRENCY_THOUSANDS_SEPARATOR,
    '.',
  );
};

const formatDateDisplay = (text: string): string => {
  let workingText = text;

  // If the user types a separator, split by it to auto-pad
  if (text.includes('-') || text.includes('/')) {
    const parts = text.split(/[-/]/);
    let day = parts[0].replace(/[^0-9]/g, '');
    let month = parts.length > 1 ? parts[1].replace(/[^0-9]/g, '') : '';
    const year = parts.length > 2 ? parts[2].replace(/[^0-9]/g, '') : '';

    if (parts.length > 1 && day.length === 1) {
      day = `0${day}`;
    }
    if (parts.length > 2 && month.length === 1) {
      month = `0${month}`;
    }

    const combined = [day, month, year].filter(Boolean).join('');
    workingText = combined;
  }

  // Fallback to strict digit formatting
  const cleaned = workingText.replace(/[^0-9]/g, '');
  if (cleaned.length <= 2) {
    return cleaned;
  }
  if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
};

interface SectionHeaderProps {
  icon: React.JSX.Element;
  testID: string;
  title: string;
}

const ContactSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_ICON}>
    <IdCardIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const AddressSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_ICON}>
    <MapPinIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const EmploymentSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_ICON}>
    <IdCardIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const FinancialSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_ICON}>
    <BanknoteIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const SectionHeader = ({
  icon,
  testID,
  title,
}: SectionHeaderProps): React.JSX.Element => (
  <View
    className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.SECTION_HEADER_ROW}
    testID={testID}
  >
    {icon}
    <Text className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.SECTION_HEADER_TITLE}>
      {title}
    </Text>
  </View>
);

export const PhysicalPersonContactForm = ({
  control,
  disabled = false,
  errors: _errorsProp,
  onInputFocus,
  options,
  testID,
  viewModel: _viewModelProp,
}: PhysicalPersonContactFormProps): React.JSX.Element => {
  const provinceOptions =
    options?.provinceOptions ?? PHYSICAL_PERSON_CONTACT_FORM_OPTIONS.PROVINCE;
  const cantonOptions =
    options?.cantonOptions ?? PHYSICAL_PERSON_CONTACT_FORM_OPTIONS.CANTON;
  const districtOptions =
    options?.districtOptions ?? PHYSICAL_PERSON_CONTACT_FORM_OPTIONS.DISTRICT;
  const employmentStatusOptions =
    options?.employmentStatusOptions ??
    PHYSICAL_PERSON_CONTACT_FORM_OPTIONS.EMPLOYMENT_STATUS;
  const currencyOptions =
    options?.currencyOptions ?? PHYSICAL_PERSON_CONTACT_FORM_OPTIONS.CURRENCY;

  return (
    <View
      className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.CONTAINER}
      testID={testID ?? PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CONTAINER}
    >
      {/* SECTION 1: INFORMACIÓN DE CONTACTO */}
      <View
        className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_CARD}
      >
        <SectionHeader
          icon={<ContactSectionIcon />}
          testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER}
          title={PHYSICAL_PERSON_CONTACT_FORM_COPY.SECTION_1_TITLE}
        />

        {/* Correo Electrónico (Full Width) */}
        <Controller
          control={control}
          name='contactInfo.email'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='none'
              editable={!disabled}
              error={error?.message}
              keyboardType='email-address'
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMAIL_LABEL}
              leftIcon='mail'
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMAIL_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMAIL_INPUT}
              value={value ?? ''}
            />
          )}
        />

        {/* Teléfono Celular & Teléfono Habitación (2-Column Flex Row) */}
        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='contactInfo.cellPhone'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='phone-pad'
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.CELL_PHONE_LABEL}
                  leftIcon='smartphone'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.CELL_PHONE_PLACEHOLDER
                  }
                  required
                  testID={
                    PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='contactInfo.homePhone'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='phone-pad'
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.HOME_PHONE_LABEL}
                  leftIcon='phone-call'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.HOME_PHONE_PLACEHOLDER
                  }
                  required={false}
                  testID={
                    PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.HOME_PHONE_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* SECTION 2: DOMICILIO RESIDENCIAL */}
      <View
        className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_CARD}
      >
        <SectionHeader
          icon={<AddressSectionIcon />}
          testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER}
          title={PHYSICAL_PERSON_CONTACT_FORM_COPY.SECTION_2_TITLE}
        />

        {/* Provincia (Full Width) */}
        <Controller
          control={control}
          name='residentialAddress.province'
          render={({
            field: { onChange, value },
            fieldState: { error },
          }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.PROVINCE_LABEL}
              onValueChange={onChange}
              options={provinceOptions}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.PROVINCE_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.PROVINCE_SELECT}
              value={value ?? ''}
            />
          )}
        />

        {/* Cantón & Distrito (2-Column Flex Row) */}
        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='residentialAddress.canton'
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelect
                  disabled={disabled}
                  errorMessage={error?.message}
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.CANTON_LABEL}
                  onValueChange={onChange}
                  options={cantonOptions}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.CANTON_PLACEHOLDER
                  }
                  required
                  testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CANTON_SELECT}
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='residentialAddress.district'
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelect
                  disabled={disabled}
                  errorMessage={error?.message}
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.DISTRICT_LABEL}
                  onValueChange={onChange}
                  options={districtOptions}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.DISTRICT_PLACEHOLDER
                  }
                  required
                  testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.DISTRICT_SELECT}
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>

        {/* Dirección Exacta (Full Width) */}
        <Controller
          control={control}
          name='residentialAddress.exactAddress'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              editable={!disabled}
              error={error?.message}
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EXACT_ADDRESS_LABEL}
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.EXACT_ADDRESS_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EXACT_ADDRESS_INPUT}
              value={value ?? ''}
            />
          )}
        />
      </View>

      {/* SECTION 3: DATOS LABORALES */}
      <View
        className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_CARD}
      >
        <SectionHeader
          icon={<EmploymentSectionIcon />}
          testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER}
          title={PHYSICAL_PERSON_CONTACT_FORM_COPY.SECTION_3_TITLE}
        />

        {/* Condición Laboral (Full Width) */}
        <Controller
          control={control}
          name='employmentData.employmentStatus'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMPLOYMENT_STATUS_LABEL}
              onValueChange={onChange}
              options={employmentStatusOptions}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.EMPLOYMENT_STATUS_PLACEHOLDER
              }
              required
              testID={
                PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMPLOYMENT_STATUS_SELECT
              }
              value={value ?? ''}
            />
          )}
        />

        {/* Profesión u Oficio & Patrono / Empresa (2-Column Flex Row) */}
        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='employmentData.profession'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.PROFESSION_LABEL}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.PROFESSION_PLACEHOLDER
                  }
                  required
                  testID={
                    PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.PROFESSION_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='employmentData.employer'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMPLOYER_LABEL}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.EMPLOYER_PLACEHOLDER
                  }
                  required
                  testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMPLOYER_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>

        {/* Fecha de Ingreso & Tel. Oficina (2-Column Flex Row) */}
        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='employmentData.entryDate'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.ENTRY_DATE_LABEL}
                  leftIcon='calendar'
                  maxLength={10}
                  onBlur={onBlur}
                  onChangeText={(text: string): void => {
                    const maskedDate = formatDateDisplay(text);
                    onChange(maskedDate);
                  }}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.ENTRY_DATE_PLACEHOLDER
                  }
                  required
                  testID={
                    PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.ENTRY_DATE_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='employmentData.officePhone'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='phone-pad'
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.OFFICE_PHONE_LABEL}
                  leftIcon='phone-call'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.OFFICE_PHONE_PLACEHOLDER
                  }
                  required
                  testID={
                    PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OFFICE_PHONE_INPUT
                  }
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* SECTION 4: CAPACIDAD FINANCIERA */}
      <View
        className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_CARD}
      >
        <SectionHeader
          icon={<FinancialSectionIcon />}
          testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER}
          title={PHYSICAL_PERSON_CONTACT_FORM_COPY.SECTION_4_TITLE}
        />

        {/* Moneda de Ingresos (Full Width) */}
        <Controller
          control={control}
          name='financialCapacity.currency'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.CURRENCY_LABEL}
              onValueChange={onChange}
              options={currencyOptions}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.CURRENCY_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CURRENCY_SELECT}
              value={value ?? ''}
            />
          )}
        />

        {/* Ingreso Bruto & Ingreso Neto (2-Column Flex Row with BanknoteIcon) */}
        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='financialCapacity.grossIncome'
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
                    label={PHYSICAL_PERSON_CONTACT_FORM_COPY.GROSS_INCOME_LABEL}
                    leftIcon='banknote'
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = text.replace(/[^0-9]/g, '');
                      onChange(digits === '' ? undefined : Number(digits));
                    }}
                    onFocus={onInputFocus}
                    placeholder={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.GROSS_INCOME_PLACEHOLDER
                    }
                    required
                    testID={
                      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT
                    }
                    value={displayValue}
                  />
                );
              }}
            />
          </View>

          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='financialCapacity.netIncome'
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
                    label={PHYSICAL_PERSON_CONTACT_FORM_COPY.NET_INCOME_LABEL}
                    leftIcon='banknote'
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = text.replace(/[^0-9]/g, '');
                      onChange(digits === '' ? undefined : Number(digits));
                    }}
                    onFocus={onInputFocus}
                    placeholder={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.NET_INCOME_PLACEHOLDER
                    }
                    required
                    testID={
                      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT
                    }
                    value={displayValue}
                  />
                );
              }}
            />
          </View>
        </View>

        {/* Otros Ingresos Mensuales (Full Width with Opcional Badge & Helper Text) */}
        <Controller
          control={control}
          name='financialCapacity.otherIncomes'
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
                helperText={
                  PHYSICAL_PERSON_CONTACT_FORM_COPY.OTHER_INCOMES_HELPER
                }
                keyboardType='numeric'
                label={PHYSICAL_PERSON_CONTACT_FORM_COPY.OTHER_INCOMES_LABEL}
                labelRight={
                  <Text
                    className={
                      PHYSICAL_PERSON_CONTACT_FORM_STYLES.OTHER_INCOMES_BADGE_TEXT
                    }
                  >
                    {PHYSICAL_PERSON_CONTACT_FORM_COPY.OTHER_INCOMES_BADGE}
                  </Text>
                }
                leftIcon='banknote'
                onBlur={onBlur}
                onChangeText={(text: string): void => {
                  const digits = text.replace(/[^0-9]/g, '');
                  onChange(digits === '' ? undefined : Number(digits));
                }}
                onFocus={onInputFocus}
                placeholder={
                  PHYSICAL_PERSON_CONTACT_FORM_COPY.OTHER_INCOMES_PLACEHOLDER
                }
                required={false}
                testID={
                  PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OTHER_INCOMES_INPUT
                }
                value={displayValue}
              />
            );
          }}
        />
      </View>
    </View>
  );
};
