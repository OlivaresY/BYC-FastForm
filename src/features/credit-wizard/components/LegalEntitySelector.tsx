import React from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  LEGAL_ENTITY_SELECTOR_COLORS,
  LEGAL_ENTITY_SELECTOR_COPY,
  LEGAL_ENTITY_SELECTOR_ENTITIES,
  LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS,
  LEGAL_ENTITY_SELECTOR_ICONS,
  LEGAL_ENTITY_SELECTOR_STYLES,
  LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES,
  LEGAL_ENTITY_SELECTOR_TEST_IDS,
} from "../constants/LegalEntitySelector.constants";
import type { LegalEntitySelectorIconConfig } from "../constants/LegalEntitySelector.constants";
import type { LegalEntitySelectorProps } from "../types/LegalEntitySelector.types";

interface EntityCardBadgeProps {
  iconConfig: LegalEntitySelectorIconConfig;
  iconStroke: string;
  isActive: boolean;
  testID: string;
}

const EntityCardBadge = ({
  iconConfig,
  iconStroke,
  isActive,
  testID,
}: EntityCardBadgeProps): React.JSX.Element => (
  <View
    className={`${LEGAL_ENTITY_SELECTOR_STYLES.ICON_BADGE_BASE} ${
      isActive
        ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_BADGE
        : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_BADGE
    }`}
    testID={testID}
  >
    <Svg
      fill={LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES.FILL_NONE}
      height={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.ICON_SIZE_PX}
      stroke={iconStroke}
      strokeLinecap={LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.VIEW_BOX}
      width={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.ICON_SIZE_PX}
    >
      {iconConfig.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={LEGAL_ENTITY_SELECTOR_SVG_ATTRIBUTES.FILL_NONE}
          key={`${testID}-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

export const LegalEntitySelector = ({
  disabled = false,
  onSelectEntity,
  selectedEntity,
  testID,
}: LegalEntitySelectorProps): React.JSX.Element => {
  const isPhysicalSelected =
    selectedEntity === LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL;
  const isLegalSelected =
    selectedEntity === LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL;

  const handleSelectPhysical = (): void => {
    onSelectEntity(LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL);
  };

  const handleSelectLegal = (): void => {
    onSelectEntity(LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL);
  };

  const physicalBorderClass = isPhysicalSelected
    ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD
    : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD;

  const legalBorderClass = isLegalSelected
    ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD
    : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD;

  const disabledClass = disabled
    ? ` ${LEGAL_ENTITY_SELECTOR_STYLES.CARD_DISABLED}`
    : "";

  return (
    <View
      className={LEGAL_ENTITY_SELECTOR_STYLES.CONTAINER}
      testID={testID ?? LEGAL_ENTITY_SELECTOR_TEST_IDS.CONTAINER}
    >
      {/* Section Header */}
      <Text
        className={LEGAL_ENTITY_SELECTOR_STYLES.HEADER_TITLE}
        testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.HEADER_TITLE}
      >
        {LEGAL_ENTITY_SELECTOR_COPY.HEADER_TITLE}
      </Text>

      <Text
        className={LEGAL_ENTITY_SELECTOR_STYLES.HEADER_SUBTITLE}
        testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.HEADER_SUBTITLE}
      >
        {LEGAL_ENTITY_SELECTOR_COPY.HEADER_SUBTITLE}
      </Text>

      {/* Two-Card Horizontal Grid */}
      <View className={LEGAL_ENTITY_SELECTOR_STYLES.GRID}>
        {/* Card 1: Persona Física */}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: !!disabled,
            selected: isPhysicalSelected,
          }}
          className={`${LEGAL_ENTITY_SELECTOR_STYLES.CARD_BASE} ${physicalBorderClass}${disabledClass}`}
          disabled={disabled}
          onPress={handleSelectPhysical}
          testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_CARD}
        >
          <EntityCardBadge
            iconConfig={
              LEGAL_ENTITY_SELECTOR_ICONS[
                LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL
              ]
            }
            iconStroke={
              isPhysicalSelected
                ? LEGAL_ENTITY_SELECTOR_COLORS.ACTIVE_ICON_STROKE
                : LEGAL_ENTITY_SELECTOR_COLORS.INACTIVE_ICON_STROKE
            }
            isActive={isPhysicalSelected}
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_BADGE}
          />

          <Text
            className={
              isPhysicalSelected
                ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_TITLE
                : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_TITLE
            }
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_TITLE}
          >
            {LEGAL_ENTITY_SELECTOR_COPY.PHYSICAL_TITLE}
          </Text>

          <Text
            className={
              isPhysicalSelected
                ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_SUBTITLE
                : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_SUBTITLE
            }
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_SUBTITLE}
          >
            {LEGAL_ENTITY_SELECTOR_COPY.PHYSICAL_SUBTITLE}
          </Text>
        </Pressable>

        {/* Card 2: Persona Jurídica */}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: !!disabled,
            selected: isLegalSelected,
          }}
          className={`${LEGAL_ENTITY_SELECTOR_STYLES.CARD_BASE} ${legalBorderClass}${disabledClass}`}
          disabled={disabled}
          onPress={handleSelectLegal}
          testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_CARD}
        >
          <EntityCardBadge
            iconConfig={
              LEGAL_ENTITY_SELECTOR_ICONS[LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL]
            }
            iconStroke={
              isLegalSelected
                ? LEGAL_ENTITY_SELECTOR_COLORS.ACTIVE_ICON_STROKE
                : LEGAL_ENTITY_SELECTOR_COLORS.INACTIVE_ICON_STROKE
            }
            isActive={isLegalSelected}
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_BADGE}
          />

          <Text
            className={
              isLegalSelected
                ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_TITLE
                : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_TITLE
            }
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_TITLE}
          >
            {LEGAL_ENTITY_SELECTOR_COPY.LEGAL_TITLE}
          </Text>

          <Text
            className={
              isLegalSelected
                ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_SUBTITLE
                : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_SUBTITLE
            }
            testID={LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_SUBTITLE}
          >
            {LEGAL_ENTITY_SELECTOR_COPY.LEGAL_SUBTITLE}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
