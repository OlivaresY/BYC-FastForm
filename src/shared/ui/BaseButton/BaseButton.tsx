import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import {
  BASE_BUTTON_TEST_IDS,
  BASE_BUTTON_VARIANTS,
} from "./constants/BaseButton.constants";
import type { BaseButtonProps } from "./BaseButton.types";

export const BaseButton = ({
  disabled = false,
  icon,
  label,
  loading = false,
  onPress,
  style,
  testID,
  variant = BASE_BUTTON_VARIANTS.PRIMARY,
  ...rest
}: BaseButtonProps): React.JSX.Element => {
  const isInteractionDisabled = disabled || loading;

  const getVariantStyles = (): {
    container: string;
    loaderColor: string;
    text: string;
  } => {
    switch (variant) {
      case BASE_BUTTON_VARIANTS.SECONDARY:
        return {
          container: "bg-primary-dark active:opacity-90",
          loaderColor: "#FFFFFF",
          text: "text-surface font-semibold text-base",
        };
      case BASE_BUTTON_VARIANTS.GHOST:
        return {
          container: "bg-transparent active:bg-brand-red/10",
          loaderColor: "#B91C1C",
          text: "text-brand-red font-semibold text-base",
        };
      case BASE_BUTTON_VARIANTS.OUTLINE:
        return {
          container:
            "border-2 border-brand-red bg-transparent active:bg-brand-red/10",
          loaderColor: "#B91C1C",
          text: "text-brand-red font-semibold text-base",
        };
      case BASE_BUTTON_VARIANTS.PRIMARY:
      default:
        return {
          container: "bg-brand-red active:opacity-90",
          loaderColor: "#FFFFFF",
          text: "text-surface font-semibold text-base",
        };
    }
  };

  const { container, loaderColor, text } = getVariantStyles();

  const containerClasses = [
    "min-h-[48px]",
    "min-w-[48px]",
    "flex-row",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-xl",
    "px-4",
    "py-3",
    container,
    isInteractionDisabled ? "opacity-40" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInteractionDisabled }}
      className={containerClasses}
      disabled={isInteractionDisabled}
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      onPress={onPress}
      style={style}
      testID={testID ?? BASE_BUTTON_TEST_IDS.BUTTON}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={loaderColor}
          size="small"
          testID={BASE_BUTTON_TEST_IDS.LOADER}
        />
      ) : (
        <>
          {icon ?? null}
          <Text
            className={`${text} text-center flex-shrink`}
            testID={BASE_BUTTON_TEST_IDS.LABEL}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};
