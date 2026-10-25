import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  CarIcon as SharedCarIcon,
  CheckmarkIcon as SharedCheckmarkIcon,
  CircleIcon as SharedCircleIcon,
} from '@/shared/ui';
import {
  VEHICLE_BENEFICIARY_SECTION_COLORS,
  VEHICLE_BENEFICIARY_SECTION_COPY,
  VEHICLE_BENEFICIARY_SECTION_ENTITIES,
  VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS,
  VEHICLE_BENEFICIARY_SECTION_STYLES,
  VEHICLE_BENEFICIARY_SECTION_TEST_IDS,
} from '../constants/VehicleBeneficiarySection.constants';
import type { VehicleBeneficiarySectionProps } from '../types/VehicleBeneficiarySection.types';

interface OptionIconProps {
  isActive: boolean;
  testID: string;
}

const CarIcon = (): React.JSX.Element => (
  <View testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.CAR_ICON}>
    <SharedCarIcon
      color={VEHICLE_BENEFICIARY_SECTION_COLORS.CAR_ICON_STROKE}
      size={VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.CAR_ICON_SIZE_PX}
      strokeWidth={VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    />
  </View>
);

const OptionIcon = ({
  isActive,
  testID,
}: OptionIconProps): React.JSX.Element => (
  <View testID={testID}>
    {isActive ? (
      <SharedCheckmarkIcon
        color={VEHICLE_BENEFICIARY_SECTION_COLORS.ACTIVE_ICON_STROKE}
        size={VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.OPTION_ICON_SIZE_PX}
        strokeWidth={
          VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.STROKE_WIDTH_PX
        }
      />
    ) : (
      <SharedCircleIcon
        color={VEHICLE_BENEFICIARY_SECTION_COLORS.INACTIVE_ICON_STROKE}
        size={VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.OPTION_ICON_SIZE_PX}
        strokeWidth={
          VEHICLE_BENEFICIARY_SECTION_ICON_DIMENSIONS.STROKE_WIDTH_PX
        }
      />
    )}
  </View>
);

export const VehicleBeneficiarySection = ({
  disabled = false,
  onSelectBeneficiary,
  selectedBeneficiary,
  testID,
}: VehicleBeneficiarySectionProps): React.JSX.Element => {
  const isSameHolderSelected =
    selectedBeneficiary === VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER;
  const isThirdPartySelected =
    selectedBeneficiary === VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY;

  const handleSelectSameHolder = useCallback((): void => {
    onSelectBeneficiary(VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER);
  }, [onSelectBeneficiary]);

  const handleSelectThirdParty = useCallback((): void => {
    onSelectBeneficiary(VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY);
  }, [onSelectBeneficiary]);

  const sameHolderBorderClass = isSameHolderSelected
    ? VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_BUTTON
    : VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_BUTTON;

  const thirdPartyBorderClass = isThirdPartySelected
    ? VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_BUTTON
    : VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_BUTTON;

  const disabledClass = disabled
    ? ` ${VEHICLE_BENEFICIARY_SECTION_STYLES.BUTTON_DISABLED}`
    : '';

  return (
    <View
      className={VEHICLE_BENEFICIARY_SECTION_STYLES.CONTAINER}
      testID={testID ?? VEHICLE_BENEFICIARY_SECTION_TEST_IDS.CONTAINER}
    >
      {/* Header Row: Car Icon + Section Title */}
      <View
        className={VEHICLE_BENEFICIARY_SECTION_STYLES.HEADER_ROW}
        testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.HEADER_ROW}
      >
        <CarIcon />
        <Text
          className={VEHICLE_BENEFICIARY_SECTION_STYLES.HEADER_TITLE}
          testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.HEADER_TITLE}
        >
          {VEHICLE_BENEFICIARY_SECTION_COPY.HEADER_TITLE}
        </Text>
      </View>

      {/* Clarifying Prompt */}
      <Text
        className={VEHICLE_BENEFICIARY_SECTION_STYLES.PROMPT}
        testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.PROMPT}
      >
        {VEHICLE_BENEFICIARY_SECTION_COPY.PROMPT}
      </Text>

      {/* Two-Button Horizontal Selector */}
      <View className={VEHICLE_BENEFICIARY_SECTION_STYLES.SELECTOR_ROW}>
        {/* Option 1: Sí, mismo titular */}
        <Pressable
          accessibilityRole='button'
          accessibilityState={{
            disabled: !!disabled,
            selected: isSameHolderSelected,
          }}
          className={`${VEHICLE_BENEFICIARY_SECTION_STYLES.BUTTON_BASE} ${sameHolderBorderClass}${disabledClass}`}
          disabled={disabled}
          onPress={handleSelectSameHolder}
          testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_BUTTON}
        >
          <OptionIcon
            isActive={isSameHolderSelected}
            testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_ICON}
          />
          <Text
            className={
              isSameHolderSelected
                ? VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_LABEL
                : VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_LABEL
            }
            testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_LABEL}
          >
            {VEHICLE_BENEFICIARY_SECTION_COPY.SAME_HOLDER_LABEL}
          </Text>
        </Pressable>

        {/* Option 2: No, a nombre de un tercero */}
        <Pressable
          accessibilityRole='button'
          accessibilityState={{
            disabled: !!disabled,
            selected: isThirdPartySelected,
          }}
          className={`${VEHICLE_BENEFICIARY_SECTION_STYLES.BUTTON_BASE} ${thirdPartyBorderClass}${disabledClass}`}
          disabled={disabled}
          onPress={handleSelectThirdParty}
          testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_BUTTON}
        >
          <OptionIcon
            isActive={isThirdPartySelected}
            testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_ICON}
          />
          <Text
            className={
              isThirdPartySelected
                ? VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_LABEL
                : VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_LABEL
            }
            testID={VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_LABEL}
          >
            {VEHICLE_BENEFICIARY_SECTION_COPY.THIRD_PARTY_LABEL}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export const VehicleBeneficiarySectionMemo = React.memo(
  VehicleBeneficiarySection,
);
