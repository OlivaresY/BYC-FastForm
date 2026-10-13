import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import {
  CUSTOM_TEXT_INPUT_COLORS,
  CUSTOM_TEXT_INPUT_COPY,
  CUSTOM_TEXT_INPUT_ICON_DIMENSIONS,
  CUSTOM_TEXT_INPUT_ICONS,
  CUSTOM_TEXT_INPUT_STYLES,
  CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES,
  CUSTOM_TEXT_INPUT_TEST_IDS,
} from "./constants/CustomTextInput.constants";
import type {
  CustomTextInputPresetIcon,
  CustomTextInputProps,
} from "./CustomTextInput.types";

interface LeftIconProps {
  testID: string;
  type: CustomTextInputPresetIcon;
}

interface ValidIconProps {
  testID: string;
}

const LeftIcon = ({ testID, type }: LeftIconProps): React.JSX.Element => (
  <View testID={testID}>
    <Svg
      fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
      height={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.SIZE_PX}
      stroke={CUSTOM_TEXT_INPUT_COLORS.ICON_STROKE}
      strokeLinecap={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.VIEW_BOX}
      width={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.SIZE_PX}
    >
      {type === "calendar" ? (
        <>
          <Rect
            fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
            height={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.height}
            rx={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.rx}
            ry={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.ry}
            width={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.width}
            x={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.x}
            y={CUSTOM_TEXT_INPUT_ICONS.CALENDAR.rect.y}
          />
          {CUSTOM_TEXT_INPUT_ICONS.CALENDAR.paths.map((pathData, index) => (
            <Path
              d={pathData}
              fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
              key={`calendar-path-${index}`}
            />
          ))}
        </>
      ) : (
        CUSTOM_TEXT_INPUT_ICONS.HASH.paths.map((pathData, index) => (
          <Path
            d={pathData}
            fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
            key={`hash-path-${index}`}
          />
        ))
      )}
    </Svg>
  </View>
);

const ValidCheckmarkIcon = ({ testID }: ValidIconProps): React.JSX.Element => (
  <View testID={testID}>
    <Svg
      fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
      height={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.SIZE_PX}
      stroke={CUSTOM_TEXT_INPUT_COLORS.VALID_ICON_STROKE}
      strokeLinecap={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.VIEW_BOX}
      width={CUSTOM_TEXT_INPUT_ICON_DIMENSIONS.SIZE_PX}
    >
      <Path
        d={CUSTOM_TEXT_INPUT_ICONS.CHECKMARK.path}
        fill={CUSTOM_TEXT_INPUT_SVG_ATTRIBUTES.FILL_NONE}
      />
    </Svg>
  </View>
);

export const CustomTextInput = ({
  error,
  helperText,
  isPassword = false,
  isValid = false,
  label,
  leftIcon,
  onBlur,
  onFocus,
  placeholder,
  required = false,
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

  const containerTestId = testID
    ? `${testID}-container`
    : CUSTOM_TEXT_INPUT_TEST_IDS.CONTAINER;
  const labelTestId = testID
    ? `${testID}-label`
    : CUSTOM_TEXT_INPUT_TEST_IDS.LABEL;
  const requiredAsteriskTestId = testID
    ? `${testID}-required-asterisk`
    : CUSTOM_TEXT_INPUT_TEST_IDS.REQUIRED_ASTERISK;
  const wrapperTestId = testID
    ? `${testID}-wrapper`
    : CUSTOM_TEXT_INPUT_TEST_IDS.INPUT_WRAPPER;
  const inputTestId = testID ?? CUSTOM_TEXT_INPUT_TEST_IDS.INPUT;
  const leftIconTestId = testID
    ? `${testID}-left-icon`
    : CUSTOM_TEXT_INPUT_TEST_IDS.LEFT_ICON;
  const validIconTestId = testID
    ? `${testID}-valid-icon`
    : CUSTOM_TEXT_INPUT_TEST_IDS.VALID_ICON;
  const errorTestId = testID
    ? `${testID}-error`
    : CUSTOM_TEXT_INPUT_TEST_IDS.ERROR;
  const helperTestId = testID
    ? `${testID}-helper-text`
    : CUSTOM_TEXT_INPUT_TEST_IDS.HELPER_TEXT;

  return (
    <View className={CUSTOM_TEXT_INPUT_STYLES.CONTAINER} testID={containerTestId}>
      {label ? (
        <View className={CUSTOM_TEXT_INPUT_STYLES.LABEL_ROW}>
          <Text
            className={CUSTOM_TEXT_INPUT_STYLES.LABEL_TEXT}
            testID={labelTestId}
          >
            {label}
          </Text>
          {required ? (
            <Text
              className={CUSTOM_TEXT_INPUT_STYLES.REQUIRED_ASTERISK}
              testID={requiredAsteriskTestId}
            >
              {CUSTOM_TEXT_INPUT_COPY.REQUIRED_ASTERISK}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View
        className={`${CUSTOM_TEXT_INPUT_STYLES.INPUT_WRAPPER_BASE} ${getBorderClass()}`}
        testID={wrapperTestId}
      >
        {leftIcon ? <LeftIcon testID={leftIconTestId} type={leftIcon} /> : null}

        <TextInput
          accessibilityLabel={label}
          aria-invalid={Boolean(error)}
          className={CUSTOM_TEXT_INPUT_STYLES.INPUT}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={CUSTOM_TEXT_INPUT_COLORS.PLACEHOLDER}
          secureTextEntry={isPassword}
          testID={inputTestId}
          {...rest}
        />

        {isValid ? <ValidCheckmarkIcon testID={validIconTestId} /> : null}
      </View>

      {error ? (
        <Text
          className={CUSTOM_TEXT_INPUT_STYLES.ERROR_TEXT}
          testID={errorTestId}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          className={CUSTOM_TEXT_INPUT_STYLES.HELPER_TEXT}
          testID={helperTestId}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};
