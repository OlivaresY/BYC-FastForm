import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import {
  CUSTOM_TEXT_INPUT_COLORS,
  CUSTOM_TEXT_INPUT_TEST_IDS,
} from "./constants/CustomTextInput.constants";
import type { CustomTextInputProps } from "./CustomTextInput.types";

export const CustomTextInput = ({
  error,
  isPassword = false,
  label,
  onBlur,
  onFocus,
  placeholder,
  testID,
  ...rest
}: CustomTextInputProps): React.JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus: TextInputProps["onFocus"] = (event): void => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps["onBlur"] = (event): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const getBorderClass = (): string => {
    if (error) {
      return "border-brand-red";
    }
    if (isFocused) {
      return "border-text-secondary";
    }
    return "border-border-base";
  };

  const inputClasses = [
    "min-h-[48px]",
    "w-full",
    "rounded-lg",
    "border",
    "bg-surface",
    "px-4",
    "py-3",
    "text-base",
    "text-text-primary",
    getBorderClass(),
  ].join(" ");

  return (
    <View className="w-full" testID={CUSTOM_TEXT_INPUT_TEST_IDS.CONTAINER}>
      {label ? (
        <Text
          className="mb-1.5 text-sm font-medium text-text-primary"
          testID={CUSTOM_TEXT_INPUT_TEST_IDS.LABEL}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        accessibilityLabel={label}
        className={inputClasses}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        placeholderTextColor={CUSTOM_TEXT_INPUT_COLORS.PLACEHOLDER}
        secureTextEntry={isPassword}
        testID={testID ?? CUSTOM_TEXT_INPUT_TEST_IDS.INPUT}
        {...rest}
      />

      {error ? (
        <Text
          className="mt-1 text-xs text-brand-red"
          testID={CUSTOM_TEXT_INPUT_TEST_IDS.ERROR}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};
