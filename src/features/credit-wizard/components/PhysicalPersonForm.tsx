import {
  CustomSelect,
  CustomTextInput,
  SectionHeader,
  ClockIcon as SharedClockIcon,
  IdCardIcon as SharedIdCardIcon,
  UserIcon as SharedUserIcon,
} from '@/shared/ui';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import {
  PHYSICAL_PERSON_FORM_COLORS,
  PHYSICAL_PERSON_FORM_COPY,
  PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS,
  PHYSICAL_PERSON_FORM_ICON_DIMENSIONS,
  PHYSICAL_PERSON_FORM_STYLES,
  PHYSICAL_PERSON_FORM_TEST_IDS,
} from '../constants/PhysicalPersonForm.constants';
import type { PhysicalPersonFormProps } from '../types/PhysicalPersonForm.types';

const IdCardIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_1_ICON}>
    <SharedIdCardIcon
      color={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const UserIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_2_ICON}>
    <SharedUserIcon
      color={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const ClockIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_3_ICON}>
    <SharedClockIcon
      color={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      size={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

export const PhysicalPersonForm = ({
  disabled = false,
  errors,
  isIdentificationValid = false,
  onFieldChange,
  options,
  testID,
  values,
}: PhysicalPersonFormProps): React.JSX.Element => {
  const identificationTypeOptions =
    options?.identificationTypeOptions ??
    PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS.IDENTIFICATION_TYPE;

  const nationalityOptions =
    options?.nationalityOptions ??
    PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS.NATIONALITY;

  const maritalStatusOptions =
    options?.maritalStatusOptions ??
    PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS.MARITAL_STATUS;

  const genderOptions =
    options?.genderOptions ?? PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS.GENDER;

  const handlers = useMemo(
    () => ({
      birthDate: (val: string): void => onFieldChange('birthDate', val),
      firstLastName: (val: string): void => onFieldChange('firstLastName', val),
      firstName: (val: string): void => onFieldChange('firstName', val),
      gender: (val: string): void => onFieldChange('gender', val),
      identificationNumber: (val: string): void =>
        onFieldChange('identificationNumber', val),
      identificationType: (val: string): void =>
        onFieldChange('identificationType', val),
      maritalStatus: (val: string): void => onFieldChange('maritalStatus', val),
      middleName: (val: string): void => onFieldChange('middleName', val),
      nationality: (val: string): void => onFieldChange('nationality', val),
      secondLastName: (val: string): void =>
        onFieldChange('secondLastName', val),
    }),
    [onFieldChange],
  );

  return (
    <View
      className={PHYSICAL_PERSON_FORM_STYLES.CONTAINER}
      testID={testID ?? PHYSICAL_PERSON_FORM_TEST_IDS.CONTAINER}
    >
      {/* SECTION 1: DOCUMENTO DE IDENTIDAD */}
      <View className={PHYSICAL_PERSON_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<IdCardIcon />}
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_1_HEADER}
          title={PHYSICAL_PERSON_FORM_COPY.SECTION_1_TITLE}
        />

        <CustomSelect
          disabled={disabled}
          errorMessage={errors?.identificationType}
          label={PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_TYPE_LABEL}
          onValueChange={handlers.identificationType}
          options={identificationTypeOptions}
          placeholder={
            PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_TYPE_PLACEHOLDER
          }
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_TYPE_DROPDOWN}
          value={values.identificationType}
        />

        <CustomTextInput
          autoCapitalize='none'
          autoCorrect={false}
          editable={!disabled}
          error={errors?.identificationNumber}
          helperText={PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_HELPER}
          isValid={isIdentificationValid}
          label={PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_LABEL}
          leftIcon='hash'
          onChangeText={handlers.identificationNumber}
          placeholder={
            PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_PLACEHOLDER
          }
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}
          value={values.identificationNumber}
        />
      </View>

      {/* SECTION 2: NOMBRES Y APELLIDOS OFICIALES */}
      <View className={PHYSICAL_PERSON_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<UserIcon />}
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_2_HEADER}
          title={PHYSICAL_PERSON_FORM_COPY.SECTION_2_TITLE}
        />

        {/* Row 1: Primer Nombre & Segundo Nombre */}
        <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={errors?.firstName}
              label={PHYSICAL_PERSON_FORM_COPY.FIRST_NAME_LABEL}
              onChangeText={handlers.firstName}
              placeholder={PHYSICAL_PERSON_FORM_COPY.FIRST_NAME_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_NAME_INPUT}
              value={values.firstName}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={errors?.middleName}
              label={PHYSICAL_PERSON_FORM_COPY.MIDDLE_NAME_LABEL}
              onChangeText={handlers.middleName}
              placeholder={PHYSICAL_PERSON_FORM_COPY.MIDDLE_NAME_PLACEHOLDER}
              required={false}
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.MIDDLE_NAME_INPUT}
              value={values.middleName}
            />
          </View>
        </View>

        {/* Row 2: Primer Apellido & Segundo Apellido */}
        <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={errors?.firstLastName}
              label={PHYSICAL_PERSON_FORM_COPY.FIRST_LAST_NAME_LABEL}
              onChangeText={handlers.firstLastName}
              placeholder={
                PHYSICAL_PERSON_FORM_COPY.FIRST_LAST_NAME_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_LAST_NAME_INPUT}
              value={values.firstLastName}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              autoCapitalize='words'
              editable={!disabled}
              error={errors?.secondLastName}
              label={PHYSICAL_PERSON_FORM_COPY.SECOND_LAST_NAME_LABEL}
              onChangeText={handlers.secondLastName}
              placeholder={
                PHYSICAL_PERSON_FORM_COPY.SECOND_LAST_NAME_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECOND_LAST_NAME_INPUT}
              value={values.secondLastName}
            />
          </View>
        </View>
      </View>

      {/* SECTION 3: DATOS DEMOGRÁFICOS */}
      <View className={PHYSICAL_PERSON_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<ClockIcon />}
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_3_HEADER}
          title={PHYSICAL_PERSON_FORM_COPY.SECTION_3_TITLE}
        />

        <CustomTextInput
          editable={!disabled}
          error={errors?.birthDate}
          helperText={PHYSICAL_PERSON_FORM_COPY.BIRTH_DATE_HELPER}
          label={PHYSICAL_PERSON_FORM_COPY.BIRTH_DATE_LABEL}
          leftIcon='calendar'
          onChangeText={handlers.birthDate}
          placeholder={PHYSICAL_PERSON_FORM_COPY.BIRTH_DATE_PLACEHOLDER}
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.BIRTH_DATE_INPUT}
          value={values.birthDate}
        />

        <CustomSelect
          disabled={disabled}
          errorMessage={errors?.nationality}
          label={PHYSICAL_PERSON_FORM_COPY.NATIONALITY_LABEL}
          leftIcon='globe'
          onValueChange={handlers.nationality}
          options={nationalityOptions}
          placeholder={PHYSICAL_PERSON_FORM_COPY.NATIONALITY_PLACEHOLDER}
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.NATIONALITY_DROPDOWN}
          value={values.nationality}
        />

        {/* 2-Column Row: Estado Civil & Género */}
        <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomSelect
              disabled={disabled}
              errorMessage={errors?.maritalStatus}
              label={PHYSICAL_PERSON_FORM_COPY.MARITAL_STATUS_LABEL}
              onValueChange={handlers.maritalStatus}
              options={maritalStatusOptions}
              placeholder={PHYSICAL_PERSON_FORM_COPY.MARITAL_STATUS_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.MARITAL_STATUS_DROPDOWN}
              value={values.maritalStatus}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomSelect
              disabled={disabled}
              errorMessage={errors?.gender}
              label={PHYSICAL_PERSON_FORM_COPY.GENDER_LABEL}
              onValueChange={handlers.gender}
              options={genderOptions}
              placeholder={PHYSICAL_PERSON_FORM_COPY.GENDER_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.GENDER_DROPDOWN}
              value={values.gender}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export const PhysicalPersonFormMemo = React.memo(PhysicalPersonForm);
