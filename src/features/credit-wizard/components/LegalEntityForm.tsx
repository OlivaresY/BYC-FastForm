import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import {
  BuildingIcon as SharedBuildingIcon,
  DocumentIcon as SharedDocumentIcon,
  UserIcon as SharedUserIcon,
  CustomSelect,
  CustomTextInput,
} from '@/shared/ui';
import {
  LEGAL_ENTITY_FORM_COLORS,
  LEGAL_ENTITY_FORM_COPY,
  LEGAL_ENTITY_FORM_DEFAULT_OPTIONS,
  LEGAL_ENTITY_FORM_ICON_DIMENSIONS,
  LEGAL_ENTITY_FORM_STYLES,
  LEGAL_ENTITY_FORM_TEST_IDS,
} from '../constants/LegalEntityForm.constants';
import type { LegalEntityFormProps } from '../types/LegalEntityForm.types';

interface SectionHeaderProps {
  icon: React.JSX.Element;
  testID: string;
  title: string;
}

const BuildingIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_1_ICON}>
    <SharedBuildingIcon
      color={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const DocumentIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_2_ICON}>
    <SharedDocumentIcon
      color={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const UserIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_3_ICON}>
    <SharedUserIcon
      color={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      size={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const SectionHeader = ({
  icon,
  testID,
  title,
}: SectionHeaderProps): React.JSX.Element => (
  <View className={LEGAL_ENTITY_FORM_STYLES.SECTION_HEADER_ROW} testID={testID}>
    {icon}
    <Text
      accessibilityRole='header'
      className={LEGAL_ENTITY_FORM_STYLES.SECTION_HEADER_TITLE}
    >
      {title}
    </Text>
  </View>
);

export const LegalEntityForm = ({
  disabled = false,
  errors,
  isIdentificationValid = false,
  onFieldChange,
  options,
  testID,
  values,
}: LegalEntityFormProps): React.JSX.Element => {
  const identificationTypeOptions =
    options?.identificationTypeOptions ??
    LEGAL_ENTITY_FORM_DEFAULT_OPTIONS.IDENTIFICATION_TYPE;

  const handlers = useMemo(
    () => ({
      identificationNumber: (val: string): void =>
        onFieldChange('identificationNumber', val),
      identificationType: (val: string): void =>
        onFieldChange('identificationType', val),
      legalName: (val: string): void => onFieldChange('legalName', val),
      representativeIdentification: (val: string): void =>
        onFieldChange('representativeIdentification', val),
      representativeName: (val: string): void =>
        onFieldChange('representativeName', val),
    }),
    [onFieldChange],
  );

  return (
    <View
      className={LEGAL_ENTITY_FORM_STYLES.CONTAINER}
      testID={testID ?? LEGAL_ENTITY_FORM_TEST_IDS.CONTAINER}
    >
      {/* SECTION 1: DATOS DE LA EMPRESA */}
      <View className={LEGAL_ENTITY_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<BuildingIcon />}
          testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_1_HEADER}
          title={LEGAL_ENTITY_FORM_COPY.SECTION_1_TITLE}
        />

        <CustomSelect
          disabled={disabled}
          errorMessage={errors?.identificationType}
          label={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_TYPE_LABEL}
          onValueChange={handlers.identificationType}
          options={identificationTypeOptions}
          placeholder={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_TYPE_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_TYPE_DROPDOWN}
          value={values.identificationType}
        />

        <CustomTextInput
          autoCapitalize='none'
          autoCorrect={false}
          editable={!disabled}
          error={errors?.identificationNumber}
          helperText={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_HELPER}
          isValid={isIdentificationValid}
          label={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_LABEL}
          leftIcon='hash'
          onChangeText={handlers.identificationNumber}
          placeholder={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT}
          value={values.identificationNumber}
        />
      </View>

      {/* SECTION 2: RAZÓN SOCIAL */}
      <View className={LEGAL_ENTITY_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<DocumentIcon />}
          testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_2_HEADER}
          title={LEGAL_ENTITY_FORM_COPY.SECTION_2_TITLE}
        />

        <CustomTextInput
          autoCapitalize='words'
          editable={!disabled}
          error={errors?.legalName}
          label={LEGAL_ENTITY_FORM_COPY.LEGAL_NAME_LABEL}
          onChangeText={handlers.legalName}
          placeholder={LEGAL_ENTITY_FORM_COPY.LEGAL_NAME_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.LEGAL_NAME_INPUT}
          value={values.legalName}
        />
      </View>

      {/* SECTION 3: REPRESENTANTE LEGAL */}
      <View className={LEGAL_ENTITY_FORM_STYLES.SECTION_CONTAINER}>
        <SectionHeader
          icon={<UserIcon />}
          testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_3_HEADER}
          title={LEGAL_ENTITY_FORM_COPY.SECTION_3_TITLE}
        />

        <CustomTextInput
          autoCapitalize='none'
          autoCorrect={false}
          editable={!disabled}
          error={errors?.representativeIdentification}
          label={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_IDENTIFICATION_LABEL}
          onChangeText={handlers.representativeIdentification}
          placeholder={
            LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_IDENTIFICATION_PLACEHOLDER
          }
          required
          testID={
            LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_IDENTIFICATION_INPUT
          }
          value={values.representativeIdentification}
        />

        <CustomTextInput
          autoCapitalize='words'
          editable={!disabled}
          error={errors?.representativeName}
          label={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_NAME_LABEL}
          onChangeText={handlers.representativeName}
          placeholder={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_NAME_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT}
          value={values.representativeName}
        />
      </View>
    </View>
  );
};

export const LegalEntityFormMemo = React.memo(LegalEntityForm);
