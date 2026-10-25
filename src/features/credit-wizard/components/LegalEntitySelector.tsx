import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BuildingIcon, UserIcon } from '@/shared/ui';
import {
  LEGAL_ENTITY_SELECTOR_COLORS,
  LEGAL_ENTITY_SELECTOR_COPY,
  LEGAL_ENTITY_SELECTOR_ENTITIES,
  LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS,
  LEGAL_ENTITY_SELECTOR_STYLES,
  LEGAL_ENTITY_SELECTOR_TEST_IDS,
} from '../constants/LegalEntitySelector.constants';
import type { LegalEntitySelectorProps } from '../types/LegalEntitySelector.types';

interface EntityCardBadgeProps {
  icon: React.JSX.Element;
  isActive: boolean;
  testID: string;
}

const EntityCardBadge = ({
  icon,
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
    {icon}
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

  const handleSelectPhysical = useCallback((): void => {
    onSelectEntity(LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL);
  }, [onSelectEntity]);

  const handleSelectLegal = useCallback((): void => {
    onSelectEntity(LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL);
  }, [onSelectEntity]);

  const physicalBorderClass = isPhysicalSelected
    ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD
    : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD;

  const legalBorderClass = isLegalSelected
    ? LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD
    : LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD;

  const disabledClass = disabled
    ? ` ${LEGAL_ENTITY_SELECTOR_STYLES.CARD_DISABLED}`
    : '';

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
          accessibilityRole='button'
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
            icon={
              <UserIcon
                color={
                  isPhysicalSelected
                    ? LEGAL_ENTITY_SELECTOR_COLORS.ACTIVE_ICON_STROKE
                    : LEGAL_ENTITY_SELECTOR_COLORS.INACTIVE_ICON_STROKE
                }
                size={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.ICON_SIZE_PX}
                strokeWidth={
                  LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.STROKE_WIDTH_PX
                }
              />
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
          accessibilityRole='button'
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
            icon={
              <BuildingIcon
                color={
                  isLegalSelected
                    ? LEGAL_ENTITY_SELECTOR_COLORS.ACTIVE_ICON_STROKE
                    : LEGAL_ENTITY_SELECTOR_COLORS.INACTIVE_ICON_STROKE
                }
                size={LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.ICON_SIZE_PX}
                strokeWidth={
                  LEGAL_ENTITY_SELECTOR_ICON_DIMENSIONS.STROKE_WIDTH_PX
                }
              />
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

export const LegalEntitySelectorMemo = React.memo(LegalEntitySelector);
