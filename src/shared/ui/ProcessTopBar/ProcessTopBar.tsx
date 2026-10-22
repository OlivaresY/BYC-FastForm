import React from "react";
import { Pressable, Text, View } from "react-native";
import { CarIcon, CloseIcon } from "@/shared/ui/Icons";
import {
  PROCESS_TOP_BAR_COLORS,
  PROCESS_TOP_BAR_COPY,
  PROCESS_TOP_BAR_DIMENSIONS,
  PROCESS_TOP_BAR_HIT_SLOP,
  PROCESS_TOP_BAR_STYLES,
  PROCESS_TOP_BAR_TEST_IDS,
} from "./constants/ProcessTopBar.constants";
import type { ProcessTopBarProps } from "./ProcessTopBar.types";

export const ProcessTopBar = React.memo(
  ({
    className,
    onClose,
    onProfilePress,
    testID,
    userInitials = PROCESS_TOP_BAR_COPY.DEFAULT_INITIALS,
  }: ProcessTopBarProps): React.JSX.Element => {
    const containerClasses = [PROCESS_TOP_BAR_STYLES.CONTAINER, className]
      .filter(Boolean)
      .join(" ");

    return (
      <View
        className={containerClasses}
        testID={testID ?? PROCESS_TOP_BAR_TEST_IDS.CONTAINER}
      >
        <View
          className={PROCESS_TOP_BAR_STYLES.LEFT_SECTION}
          testID={PROCESS_TOP_BAR_TEST_IDS.LEFT_SECTION}
        >
          <Pressable
            accessibilityLabel={PROCESS_TOP_BAR_COPY.CLOSE_ACCESSIBILITY_LABEL}
            accessibilityRole="button"
            className={PROCESS_TOP_BAR_STYLES.CLOSE_BUTTON}
            hitSlop={PROCESS_TOP_BAR_HIT_SLOP}
            onPress={onClose}
            testID={PROCESS_TOP_BAR_TEST_IDS.CLOSE_BUTTON}
          >
            <CloseIcon
              color={PROCESS_TOP_BAR_COLORS.CLOSE_ICON}
              size={PROCESS_TOP_BAR_DIMENSIONS.CLOSE_ICON_SIZE_PX}
            />
          </Pressable>
        </View>

        <View className={PROCESS_TOP_BAR_STYLES.BRANDING_CONTAINER}>
          <Text
            accessibilityRole="header"
            className={PROCESS_TOP_BAR_STYLES.TITLE_TEXT}
            testID={PROCESS_TOP_BAR_TEST_IDS.TITLE}
          >
            {PROCESS_TOP_BAR_COPY.TITLE}
          </Text>

          <View
            className={PROCESS_TOP_BAR_STYLES.DIVIDER}
            testID={PROCESS_TOP_BAR_TEST_IDS.DIVIDER}
          />

          <View
            className={PROCESS_TOP_BAR_STYLES.BADGE_CONTAINER}
            testID={PROCESS_TOP_BAR_TEST_IDS.BADGE}
          >
            <CarIcon
              color={PROCESS_TOP_BAR_COLORS.BADGE_ICON}
              size={PROCESS_TOP_BAR_DIMENSIONS.BADGE_CAR_ICON_SIZE_PX}
            />
            <Text
              className={PROCESS_TOP_BAR_STYLES.BADGE_TEXT}
              testID={PROCESS_TOP_BAR_TEST_IDS.BADGE_TEXT}
            >
              {PROCESS_TOP_BAR_COPY.BADGE_TEXT}
            </Text>
          </View>
        </View>

        <View
          className={PROCESS_TOP_BAR_STYLES.RIGHT_SECTION}
          testID={PROCESS_TOP_BAR_TEST_IDS.RIGHT_SECTION}
        >
          <Pressable
            accessibilityLabel={PROCESS_TOP_BAR_COPY.AVATAR_ACCESSIBILITY_LABEL}
            accessibilityRole="button"
            className={PROCESS_TOP_BAR_STYLES.AVATAR_CONTAINER}
            disabled={!onProfilePress}
            hitSlop={PROCESS_TOP_BAR_HIT_SLOP}
            onPress={onProfilePress}
            testID={PROCESS_TOP_BAR_TEST_IDS.AVATAR_BUTTON}
          >
            <Text
              className={PROCESS_TOP_BAR_STYLES.AVATAR_TEXT}
              testID={PROCESS_TOP_BAR_TEST_IDS.AVATAR_INITIALS}
            >
              {userInitials}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

ProcessTopBar.displayName = "ProcessTopBar";
