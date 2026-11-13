import {
  BanknoteIcon,
  BuildingIcon,
  CustomSelect,
  CustomTextInput,
  MapPinIcon,
  PhoneIcon,
  SectionHeader,
} from '@/shared/ui';
import {
  formatCurrencyDisplay,
  formatDateDisplay,
  sanitizeNumericDigits,
} from '@/shared/utils';
import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import {
  LEGAL_ENTITY_CONTACT_FORM_COLORS,
  LEGAL_ENTITY_CONTACT_FORM_COPY,
  LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS,
  LEGAL_ENTITY_CONTACT_FORM_NUMERICAL,
  LEGAL_ENTITY_CONTACT_FORM_OPTIONS,
  LEGAL_ENTITY_CONTACT_FORM_STYLES,
  LEGAL_ENTITY_CONTACT_FORM_TEST_IDS,
} from '../constants/LegalEntityContactForm.constants';
import {
  getCantonOptions,
  getDistrictOptions,
  getProvinceOptions,
} from '../constants/CostaRicaLocations.constants';
import { CURRENCY_OPTIONS } from '../constants/SharedCatalogs.constants';
import type { LegalEntityContactFormProps } from '../types/LegalEntityContactForm.types';

const ContactSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_ICON}>
    <PhoneIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const AddressSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_ICON}>
    <MapPinIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const ActivitySectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_ICON}>
    <BuildingIcon
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

const CommercialSectionIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_ICON}>
    <BuildingIcon
      color={LEGAL_ENTITY_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const LegalEntityContactFormComponent = ({
  control,
  disabled = false,
  onCantonChange,
  onInputFocus,
  onProvinceChange,
  options,
  testID,
}: LegalEntityContactFormProps): React.JSX.Element => {
  const economicSectorOptions =
    options?.economicSectorOptions ??
    LEGAL_ENTITY_CONTACT_FORM_OPTIONS.ECONOMIC_SECTOR;

  const selectedProvince = useWatch({
    control,
    name: 'commercialAddress.province',
  });
  const selectedCanton = useWatch({
    control,
    name: 'commercialAddress.canton',
  });
  const provinceOptions = options?.provinceOptions ?? getProvinceOptions();
  const cantonOptions =
    options?.cantonOptions ?? getCantonOptions(selectedProvince);
  const districtOptions =
    options?.districtOptions ??
    getDistrictOptions(selectedProvince, selectedCanton);
  const currencyOptions = options?.currencyOptions ?? CURRENCY_OPTIONS;

  return (
    <View
      className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CONTAINER}
      testID={testID ?? LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CONTAINER}
    >
      {/* SECTION 1: CONTACTO CORPORATIVO */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_CARD}
      >
        <SectionHeader
          icon={<ContactSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_1_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_1_TITLE}
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

        {/* Teléfono Celular & Teléfono de Oficina (2-Column Flex Row) */}
        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
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
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.CELL_PHONE_LABEL}
                  leftIcon='phone-call'
                  maxLength={
                    LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_PHONE
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CELL_PHONE_PLACEHOLDER
                  }
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='contactInfo.officePhone'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  editable={!disabled}
                  error={error?.message}
                  keyboardType='phone-pad'
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.OFFICE_PHONE_LABEL}
                  leftIcon='phone-call'
                  maxLength={
                    LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_PHONE
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onFocus={onInputFocus}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.OFFICE_PHONE_PLACEHOLDER
                  }
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.OFFICE_PHONE_INPUT}
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* SECTION 2: DOMICILIO COMERCIAL */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_CARD}
      >
        <SectionHeader
          icon={<AddressSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_2_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_2_TITLE}
        />

        {/* Provincia (Full Width) */}
        <Controller
          control={control}
          name='commercialAddress.province'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.PROVINCE_LABEL}
              onFocus={onInputFocus}
              onValueChange={(selected: string): void => {
                onChange(selected);
                onProvinceChange?.(selected);
              }}
              options={provinceOptions}
              placeholder={LEGAL_ENTITY_CONTACT_FORM_COPY.PROVINCE_PLACEHOLDER}
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.PROVINCE_SELECT}
              value={value ?? ''}
            />
          )}
        />

        {/* Cantón & Distrito (2-Column Flex Row) */}
        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='commercialAddress.canton'
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelect
                  disabled={disabled}
                  errorMessage={error?.message}
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.CANTON_LABEL}
                  onFocus={onInputFocus}
                  onValueChange={(selected: string): void => {
                    onChange(selected);
                    onCantonChange?.(selected);
                  }}
                  options={cantonOptions}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.CANTON_PLACEHOLDER
                  }
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CANTON_SELECT}
                  value={value ?? ''}
                />
              )}
            />
          </View>

          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='commercialAddress.district'
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelect
                  disabled={disabled}
                  errorMessage={error?.message}
                  label={LEGAL_ENTITY_CONTACT_FORM_COPY.DISTRICT_LABEL}
                  onFocus={onInputFocus}
                  onValueChange={onChange}
                  options={districtOptions}
                  placeholder={
                    LEGAL_ENTITY_CONTACT_FORM_COPY.DISTRICT_PLACEHOLDER
                  }
                  required
                  testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.DISTRICT_SELECT}
                  value={value ?? ''}
                />
              )}
            />
          </View>
        </View>

        {/* Dirección Exacta (Full Width, Multiline) */}
        <Controller
          control={control}
          name='commercialAddress.exactAddress'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.EXACT_ADDRESS_LABEL}
              multiline
              numberOfLines={
                LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.EXACT_ADDRESS_NUMBER_OF_LINES
              }
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.EXACT_ADDRESS_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EXACT_ADDRESS_INPUT}
              value={value ?? ''}
            />
          )}
        />
      </View>

      {/* SECTION 3: ACTIVIDAD COMERCIAL */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_CARD}
      >
        <SectionHeader
          icon={<ActivitySectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_3_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_3_TITLE}
        />

        {/* Sector Económico (Full Width Dropdown) */}
        <Controller
          control={control}
          name='commercialActivity.economicSector'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.ECONOMIC_SECTOR_LABEL}
              onFocus={onInputFocus}
              onValueChange={onChange}
              options={economicSectorOptions}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.ECONOMIC_SECTOR_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.ECONOMIC_SECTOR_SELECT}
              value={value ?? ''}
            />
          )}
        />

        {/* Actividad Principal (Full Width) */}
        <Controller
          control={control}
          name='commercialActivity.mainActivity'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.MAIN_ACTIVITY_LABEL}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.MAIN_ACTIVITY_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.MAIN_ACTIVITY_INPUT}
              value={value ?? ''}
            />
          )}
        />

        {/* Fecha de Constitución (Full Width) */}
        <Controller
          control={control}
          name='commercialActivity.constitutionDate'
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
              maxLength={LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_DATE}
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

        {/* Cantidad de Empleados (Full Width) */}
        <Controller
          control={control}
          name='commercialActivity.employeesCount'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              editable={!disabled}
              error={error?.message}
              keyboardType='numeric'
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.EMPLOYEES_COUNT_LABEL}
              maxLength={
                LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_EMPLOYEES
              }
              onBlur={onBlur}
              onChangeText={(text: string): void => {
                const digits = sanitizeNumericDigits(text);
                onChange(digits === '' ? undefined : Number(digits));
              }}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.EMPLOYEES_COUNT_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.EMPLOYEES_COUNT_INPUT}
              value={value !== undefined ? String(value) : ''}
            />
          )}
        />

        {/* Teléfono de Contabilidad (Full Width) */}
        <Controller
          control={control}
          name='commercialActivity.accountingPhone'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              editable={!disabled}
              error={error?.message}
              keyboardType='phone-pad'
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.ACCOUNTING_PHONE_LABEL}
              leftIcon='phone-call'
              maxLength={LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_PHONE}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.ACCOUNTING_PHONE_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.ACCOUNTING_PHONE_INPUT}
              value={value ?? ''}
            />
          )}
        />
      </View>

      {/* SECTION 4: ESTADOS FINANCIEROS */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_CARD}
      >
        <SectionHeader
          icon={<FinancialSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_4_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_4_TITLE}
        />

        {/* Moneda (Full Width Dropdown) */}
        <Controller
          control={control}
          name='financialStatements.currency'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomSelect
              disabled={disabled}
              errorMessage={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.CURRENCY_LABEL}
              onFocus={onInputFocus}
              onValueChange={onChange}
              options={currencyOptions}
              placeholder={LEGAL_ENTITY_CONTACT_FORM_COPY.CURRENCY_PLACEHOLDER}
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.CURRENCY_SELECT}
              value={value ?? ''}
            />
          )}
        />

        {/* Ventas Brutas & Utilidad Neta (2-Column Flex Row) */}
        <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={LEGAL_ENTITY_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='financialStatements.grossSales'
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
                    label={LEGAL_ENTITY_CONTACT_FORM_COPY.GROSS_SALES_LABEL}
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
                      LEGAL_ENTITY_CONTACT_FORM_COPY.GROSS_SALES_PLACEHOLDER
                    }
                    required
                    testID={
                      LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.GROSS_SALES_INPUT
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
              name='financialStatements.netProfit'
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
                    label={LEGAL_ENTITY_CONTACT_FORM_COPY.NET_PROFIT_LABEL}
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
                      LEGAL_ENTITY_CONTACT_FORM_COPY.NET_PROFIT_PLACEHOLDER
                    }
                    required
                    testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.NET_PROFIT_INPUT}
                    value={displayValue}
                  />
                );
              }}
            />
          </View>
        </View>

        {/* Otros Ingresos (Full Width, Opcional) */}
        <Controller
          control={control}
          name='financialStatements.otherIncomes'
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
                helperText={LEGAL_ENTITY_CONTACT_FORM_COPY.OTHER_INCOMES_HELPER}
                keyboardType='numeric'
                label={LEGAL_ENTITY_CONTACT_FORM_COPY.OTHER_INCOMES_LABEL}
                labelRight={
                  <Text
                    className={
                      LEGAL_ENTITY_CONTACT_FORM_STYLES.OTHER_INCOMES_BADGE_TEXT
                    }
                  >
                    {LEGAL_ENTITY_CONTACT_FORM_COPY.OPTIONAL_BADGE}
                  </Text>
                }
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
                  LEGAL_ENTITY_CONTACT_FORM_COPY.OTHER_INCOMES_PLACEHOLDER
                }
                required={false}
                testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.OTHER_INCOMES_INPUT}
                value={displayValue}
              />
            );
          }}
        />
      </View>

      {/* SECTION 5: REFERENCIA COMERCIAL Y CUENTA */}
      <View
        className={LEGAL_ENTITY_CONTACT_FORM_STYLES.CARD_CONTAINER}
        testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_CARD}
      >
        <SectionHeader
          icon={<CommercialSectionIcon />}
          testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.SECTION_5_HEADER}
          title={LEGAL_ENTITY_CONTACT_FORM_COPY.SECTION_5_TITLE}
        />

        {/* Referencia Comercial (Full Width) */}
        <Controller
          control={control}
          name='commercialReference.companyReference'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={error?.message}
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.COMPANY_REFERENCE_LABEL}
              leftIcon='hash'
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.COMPANY_REFERENCE_PLACEHOLDER
              }
              required
              testID={
                LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.COMPANY_REFERENCE_INPUT
              }
              value={value ?? ''}
            />
          )}
        />

        {/* Teléfono de Referencia (Full Width) */}
        <Controller
          control={control}
          name='commercialReference.referencePhone'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              editable={!disabled}
              error={error?.message}
              keyboardType='phone-pad'
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.REFERENCE_PHONE_LABEL}
              leftIcon='phone-call'
              maxLength={LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_PHONE}
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.REFERENCE_PHONE_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.REFERENCE_PHONE_INPUT}
              value={value ?? ''}
            />
          )}
        />

        {/* Cuenta IBAN (Full Width) */}
        <Controller
          control={control}
          name='commercialReference.ibanAccount'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => (
            <CustomTextInput
              autoCapitalize='characters'
              editable={!disabled}
              error={error?.message}
              keyboardType='default'
              label={LEGAL_ENTITY_CONTACT_FORM_COPY.IBAN_ACCOUNT_LABEL}
              leftIcon='banknote'
              maxLength={LEGAL_ENTITY_CONTACT_FORM_NUMERICAL.MAX_LENGTH_IBAN}
              onBlur={onBlur}
              onChangeText={(text: string): void => {
                onChange(text.toUpperCase());
              }}
              onFocus={onInputFocus}
              placeholder={
                LEGAL_ENTITY_CONTACT_FORM_COPY.IBAN_ACCOUNT_PLACEHOLDER
              }
              required
              testID={LEGAL_ENTITY_CONTACT_FORM_TEST_IDS.IBAN_ACCOUNT_INPUT}
              value={value ?? ''}
            />
          )}
        />
      </View>
    </View>
  );
};

export const LegalEntityContactForm = React.memo(
  LegalEntityContactFormComponent,
);
export const LegalEntityContactFormMemo = LegalEntityContactForm;
