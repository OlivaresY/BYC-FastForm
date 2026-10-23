import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import {
  BookmarkIcon as SharedBookmarkIcon,
  BuildingIcon as SharedBuildingIcon,
  DocumentIcon as SharedDocumentIcon,
  MailIcon as SharedMailIcon,
} from '@/shared/ui/Icons';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { CustomTextInput } from '@/shared/ui/CustomTextInput';
import {
  PHYSICAL_PERSON_CONTACT_FORM_COLORS,
  PHYSICAL_PERSON_CONTACT_FORM_COPY,
  PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_FORM_OPTIONS,
  PHYSICAL_PERSON_CONTACT_FORM_STYLES,
  PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS,
} from '../constants/PhysicalPersonContactForm.constants';
import type { PhysicalPersonContactFormProps } from '../types/PhysicalPersonContactForm.types';

interface SectionHeaderProps {
  icon: React.JSX.Element;
  testID: string;
  title: string;
}

const ContactSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_1_ICON}>
    <SharedMailIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const AddressSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_2_ICON}>
    <SharedBuildingIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const EmploymentSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_3_ICON}>
    <SharedDocumentIcon
      color={PHYSICAL_PERSON_CONTACT_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const FinancialSectionIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.SECTION_4_ICON}>
    <SharedBookmarkIcon
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
              helperText={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMAIL_HELPER}
              keyboardType='email-address'
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMAIL_LABEL}
              leftIcon='mail'
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={PHYSICAL_PERSON_CONTACT_FORM_COPY.EMAIL_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMAIL_INPUT}
              value={value ?? ''}
            />
          )}
        />

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
              helperText={PHYSICAL_PERSON_CONTACT_FORM_COPY.CELL_PHONE_HELPER}
              keyboardType='phone-pad'
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.CELL_PHONE_LABEL}
              leftIcon='phone'
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.CELL_PHONE_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.CELL_PHONE_INPUT}
              value={value ?? ''}
            />
          )}
        />

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
              helperText={PHYSICAL_PERSON_CONTACT_FORM_COPY.HOME_PHONE_HELPER}
              keyboardType='phone-pad'
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.HOME_PHONE_LABEL}
              leftIcon='phone'
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.HOME_PHONE_PLACEHOLDER
              }
              required={false}
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.HOME_PHONE_INPUT}
              value={value ?? ''}
            />
          )}
        />
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

        <Controller
          control={control}
          name='residentialAddress.province'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
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
              helperText={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.EXACT_ADDRESS_HELPER
              }
              label={PHYSICAL_PERSON_CONTACT_FORM_COPY.EXACT_ADDRESS_LABEL}
              multiline
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
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
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.PROFESSION_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.PROFESSION_INPUT}
              value={value ?? ''}
            />
          )}
        />

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
              placeholder={
                PHYSICAL_PERSON_CONTACT_FORM_COPY.EMPLOYER_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.EMPLOYER_INPUT}
              value={value ?? ''}
            />
          )}
        />

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
                  helperText={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.ENTRY_DATE_HELPER
                  }
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.ENTRY_DATE_LABEL}
                  leftIcon='calendar'
                  onBlur={onBlur}
                  onChangeText={onChange}
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
                  helperText={
                    PHYSICAL_PERSON_CONTACT_FORM_COPY.OFFICE_PHONE_HELPER
                  }
                  keyboardType='phone-pad'
                  label={PHYSICAL_PERSON_CONTACT_FORM_COPY.OFFICE_PHONE_LABEL}
                  leftIcon='phone'
                  onBlur={onBlur}
                  onChangeText={onChange}
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

        <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_CONTACT_FORM_STYLES.GRID_COLUMN}>
            <Controller
              control={control}
              name='financialCapacity.grossIncome'
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => {
                const stringValue =
                  value !== undefined && value !== null && value !== 0
                    ? String(value)
                    : '';

                return (
                  <CustomTextInput
                    editable={!disabled}
                    error={error?.message}
                    helperText={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.GROSS_INCOME_HELPER
                    }
                    keyboardType='numeric'
                    label={PHYSICAL_PERSON_CONTACT_FORM_COPY.GROSS_INCOME_LABEL}
                    leftIcon='hash'
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = text.replace(/[^0-9]/g, '');
                      onChange(digits === '' ? 0 : Number(digits));
                    }}
                    placeholder={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.GROSS_INCOME_PLACEHOLDER
                    }
                    required
                    testID={
                      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.GROSS_INCOME_INPUT
                    }
                    value={stringValue}
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
                const stringValue =
                  value !== undefined && value !== null && value !== 0
                    ? String(value)
                    : '';

                return (
                  <CustomTextInput
                    editable={!disabled}
                    error={error?.message}
                    helperText={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.NET_INCOME_HELPER
                    }
                    keyboardType='numeric'
                    label={PHYSICAL_PERSON_CONTACT_FORM_COPY.NET_INCOME_LABEL}
                    leftIcon='hash'
                    onBlur={onBlur}
                    onChangeText={(text: string): void => {
                      const digits = text.replace(/[^0-9]/g, '');
                      onChange(digits === '' ? 0 : Number(digits));
                    }}
                    placeholder={
                      PHYSICAL_PERSON_CONTACT_FORM_COPY.NET_INCOME_PLACEHOLDER
                    }
                    required
                    testID={
                      PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.NET_INCOME_INPUT
                    }
                    value={stringValue}
                  />
                );
              }}
            />
          </View>
        </View>

        <Controller
          control={control}
          name='financialCapacity.otherIncomes'
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => {
            const stringValue =
              value !== undefined && value !== null && value !== 0
                ? String(value)
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
                leftIcon='hash'
                onBlur={onBlur}
                onChangeText={(text: string): void => {
                  const digits = text.replace(/[^0-9]/g, '');
                  onChange(digits === '' ? undefined : Number(digits));
                }}
                placeholder={
                  PHYSICAL_PERSON_CONTACT_FORM_COPY.OTHER_INCOMES_PLACEHOLDER
                }
                required={false}
                testID={
                  PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS.OTHER_INCOMES_INPUT
                }
                value={stringValue}
              />
            );
          }}
        />
      </View>
    </View>
  );
};
