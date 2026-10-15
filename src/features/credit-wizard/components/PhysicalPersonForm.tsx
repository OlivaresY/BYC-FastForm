import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { CustomSelect } from "@/shared/ui/CustomSelect";
import { CustomTextInput } from "@/shared/ui/CustomTextInput";
import {
  PHYSICAL_PERSON_FORM_COLORS,
  PHYSICAL_PERSON_FORM_COPY,
  PHYSICAL_PERSON_FORM_DEFAULT_OPTIONS,
  PHYSICAL_PERSON_FORM_ICON_DIMENSIONS,
  PHYSICAL_PERSON_FORM_ICONS,
  PHYSICAL_PERSON_FORM_STYLES,
  PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES,
  PHYSICAL_PERSON_FORM_TEST_IDS,
} from "../constants/PhysicalPersonForm.constants";
import type { PhysicalPersonFormProps } from "../types/PhysicalPersonForm.types";

interface SectionHeaderProps {
  icon: React.JSX.Element;
  testID: string;
  title: string;
}

const IdCardIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_1_ICON}>
    <Svg
      fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      <Rect
        fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
        height={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.height}
        rx={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.rx}
        ry={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.ry}
        width={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.width}
        x={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.x}
        y={PHYSICAL_PERSON_FORM_ICONS.ID_CARD.rect.y}
      />
      {PHYSICAL_PERSON_FORM_ICONS.ID_CARD.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
          key={`id-card-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

const UserIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_2_ICON}>
    <Svg
      fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      <Circle
        cx={PHYSICAL_PERSON_FORM_ICONS.USER.circle.cx}
        cy={PHYSICAL_PERSON_FORM_ICONS.USER.circle.cy}
        fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
        r={PHYSICAL_PERSON_FORM_ICONS.USER.circle.r}
      />
      <Path
        d={PHYSICAL_PERSON_FORM_ICONS.USER.path}
        fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
      />
    </Svg>
  </View>
);

const ClockIcon = (): React.JSX.Element => (
  <View testID={PHYSICAL_PERSON_FORM_TEST_IDS.SECTION_3_ICON}>
    <Svg
      fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={PHYSICAL_PERSON_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={PHYSICAL_PERSON_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      <Circle
        cx={PHYSICAL_PERSON_FORM_ICONS.CLOCK.circle.cx}
        cy={PHYSICAL_PERSON_FORM_ICONS.CLOCK.circle.cy}
        fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
        r={PHYSICAL_PERSON_FORM_ICONS.CLOCK.circle.r}
      />
      <Path
        d={PHYSICAL_PERSON_FORM_ICONS.CLOCK.path}
        fill={PHYSICAL_PERSON_FORM_SVG_ATTRIBUTES.FILL_NONE}
      />
    </Svg>
  </View>
);

const SectionHeader = ({
  icon,
  testID,
  title,
}: SectionHeaderProps): React.JSX.Element => (
  <View className={PHYSICAL_PERSON_FORM_STYLES.SECTION_HEADER_ROW} testID={testID}>
    {icon}
    <Text className={PHYSICAL_PERSON_FORM_STYLES.SECTION_HEADER_TITLE}>
      {title}
    </Text>
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
          onValueChange={(val) => onFieldChange("identificationType", val)}
          options={identificationTypeOptions}
          placeholder={
            PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_TYPE_PLACEHOLDER
          }
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_TYPE_SELECT}
          value={values.identificationType}
        />

        <CustomTextInput
          editable={!disabled}
          error={errors?.identificationNumber}
          helperText={PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_HELPER}
          isValid={isIdentificationValid}
          label={PHYSICAL_PERSON_FORM_COPY.IDENTIFICATION_NUMBER_LABEL}
          leftIcon="hash"
          onChangeText={(val) => onFieldChange("identificationNumber", val)}
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
              editable={!disabled}
              error={errors?.firstName}
              label={PHYSICAL_PERSON_FORM_COPY.FIRST_NAME_LABEL}
              onChangeText={(val) => onFieldChange("firstName", val)}
              placeholder={PHYSICAL_PERSON_FORM_COPY.FIRST_NAME_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_NAME_INPUT}
              value={values.firstName}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              editable={!disabled}
              error={errors?.middleName}
              label={PHYSICAL_PERSON_FORM_COPY.MIDDLE_NAME_LABEL}
              onChangeText={(val) => onFieldChange("middleName", val)}
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
              editable={!disabled}
              error={errors?.firstLastName}
              label={PHYSICAL_PERSON_FORM_COPY.FIRST_LAST_NAME_LABEL}
              onChangeText={(val) => onFieldChange("firstLastName", val)}
              placeholder={PHYSICAL_PERSON_FORM_COPY.FIRST_LAST_NAME_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_LAST_NAME_INPUT}
              value={values.firstLastName}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomTextInput
              editable={!disabled}
              error={errors?.secondLastName}
              label={PHYSICAL_PERSON_FORM_COPY.SECOND_LAST_NAME_LABEL}
              onChangeText={(val) => onFieldChange("secondLastName", val)}
              placeholder={PHYSICAL_PERSON_FORM_COPY.SECOND_LAST_NAME_PLACEHOLDER}
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
          leftIcon="calendar"
          onChangeText={(val) => onFieldChange("birthDate", val)}
          placeholder={PHYSICAL_PERSON_FORM_COPY.BIRTH_DATE_PLACEHOLDER}
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.BIRTH_DATE_INPUT}
          value={values.birthDate}
        />

        <CustomSelect
          disabled={disabled}
          errorMessage={errors?.nationality}
          label={PHYSICAL_PERSON_FORM_COPY.NATIONALITY_LABEL}
          leftIcon="globe"
          onValueChange={(val) => onFieldChange("nationality", val)}
          options={nationalityOptions}
          placeholder={PHYSICAL_PERSON_FORM_COPY.NATIONALITY_PLACEHOLDER}
          required
          testID={PHYSICAL_PERSON_FORM_TEST_IDS.NATIONALITY_SELECT}
          value={values.nationality}
        />

        {/* 2-Column Row: Estado Civil & Género */}
        <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_ROW}>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomSelect
              disabled={disabled}
              errorMessage={errors?.maritalStatus}
              label={PHYSICAL_PERSON_FORM_COPY.MARITAL_STATUS_LABEL}
              onValueChange={(val) => onFieldChange("maritalStatus", val)}
              options={maritalStatusOptions}
              placeholder={
                PHYSICAL_PERSON_FORM_COPY.MARITAL_STATUS_PLACEHOLDER
              }
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.MARITAL_STATUS_SELECT}
              value={values.maritalStatus}
            />
          </View>
          <View className={PHYSICAL_PERSON_FORM_STYLES.GRID_COLUMN}>
            <CustomSelect
              disabled={disabled}
              errorMessage={errors?.gender}
              label={PHYSICAL_PERSON_FORM_COPY.GENDER_LABEL}
              onValueChange={(val) => onFieldChange("gender", val)}
              options={genderOptions}
              placeholder={PHYSICAL_PERSON_FORM_COPY.GENDER_PLACEHOLDER}
              required
              testID={PHYSICAL_PERSON_FORM_TEST_IDS.GENDER_SELECT}
              value={values.gender}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
