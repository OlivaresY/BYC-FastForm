import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { CustomSelect } from "@/shared/ui/CustomSelect";
import { CustomTextInput } from "@/shared/ui/CustomTextInput";
import {
  LEGAL_ENTITY_FORM_COLORS,
  LEGAL_ENTITY_FORM_COPY,
  LEGAL_ENTITY_FORM_DEFAULT_OPTIONS,
  LEGAL_ENTITY_FORM_ICON_DIMENSIONS,
  LEGAL_ENTITY_FORM_ICONS,
  LEGAL_ENTITY_FORM_STYLES,
  LEGAL_ENTITY_FORM_SVG_ATTRIBUTES,
  LEGAL_ENTITY_FORM_TEST_IDS,
} from "../constants/LegalEntityForm.constants";
import type { LegalEntityFormProps } from "../types/LegalEntityForm.types";

interface SectionHeaderProps {
  icon: React.JSX.Element;
  testID: string;
  title: string;
}

const BuildingIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_1_ICON}>
    <Svg
      fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      {LEGAL_ENTITY_FORM_ICONS.BUILDING.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
          key={`building-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

const DocumentIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_2_ICON}>
    <Svg
      fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      {LEGAL_ENTITY_FORM_ICONS.DOCUMENT.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
          key={`document-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

const UserIcon = (): React.JSX.Element => (
  <View testID={LEGAL_ENTITY_FORM_TEST_IDS.SECTION_3_ICON}>
    <Svg
      fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
      height={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
      stroke={LEGAL_ENTITY_FORM_COLORS.HEADER_ICON_STROKE}
      strokeLinecap={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.VIEW_BOX}
      width={LEGAL_ENTITY_FORM_ICON_DIMENSIONS.SIZE_PX}
    >
      <Circle
        cx={LEGAL_ENTITY_FORM_ICONS.USER.circle.cx}
        cy={LEGAL_ENTITY_FORM_ICONS.USER.circle.cy}
        fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
        r={LEGAL_ENTITY_FORM_ICONS.USER.circle.r}
      />
      <Path
        d={LEGAL_ENTITY_FORM_ICONS.USER.path}
        fill={LEGAL_ENTITY_FORM_SVG_ATTRIBUTES.FILL_NONE}
      />
    </Svg>
  </View>
);

const SectionHeader = ({
  icon,
  testID,
  title,
}: SectionHeaderProps): React.JSX.Element => (
  <View className={LEGAL_ENTITY_FORM_STYLES.SECTION_HEADER_ROW} testID={testID}>
    {icon}
    <Text className={LEGAL_ENTITY_FORM_STYLES.SECTION_HEADER_TITLE}>
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
          onValueChange={(val) => onFieldChange("identificationType", val)}
          options={identificationTypeOptions}
          placeholder={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_TYPE_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_TYPE_SELECT}
          value={values.identificationType}
        />

        <CustomTextInput
          editable={!disabled}
          error={errors?.identificationNumber}
          helperText={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_HELPER}
          isValid={isIdentificationValid}
          label={LEGAL_ENTITY_FORM_COPY.IDENTIFICATION_NUMBER_LABEL}
          leftIcon="hash"
          onChangeText={(val) => onFieldChange("identificationNumber", val)}
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
          editable={!disabled}
          error={errors?.legalName}
          label={LEGAL_ENTITY_FORM_COPY.LEGAL_NAME_LABEL}
          onChangeText={(val) => onFieldChange("legalName", val)}
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
          editable={!disabled}
          error={errors?.representativeIdentification}
          label={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_IDENTIFICATION_LABEL}
          onChangeText={(val) =>
            onFieldChange("representativeIdentification", val)
          }
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
          editable={!disabled}
          error={errors?.representativeName}
          label={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_NAME_LABEL}
          onChangeText={(val) => onFieldChange("representativeName", val)}
          placeholder={LEGAL_ENTITY_FORM_COPY.REPRESENTATIVE_NAME_PLACEHOLDER}
          required
          testID={LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT}
          value={values.representativeName}
        />
      </View>
    </View>
  );
};
