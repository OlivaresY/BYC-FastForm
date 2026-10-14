import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  CUSTOM_SELECT_COLORS,
  CUSTOM_SELECT_COPY,
  CUSTOM_SELECT_ICON_DIMENSIONS,
  CUSTOM_SELECT_ICONS,
  CUSTOM_SELECT_STYLES,
  CUSTOM_SELECT_SVG_ATTRIBUTES,
  CUSTOM_SELECT_TEST_IDS,
} from "./constants/CustomSelect.constants";
import type { CustomSelectProps } from "./CustomSelect.types";
import { useCustomSelect } from "./hooks/useCustomSelect";

const ChevronDownIcon = (): React.JSX.Element => (
  <View testID={CUSTOM_SELECT_TEST_IDS.CHEVRON_ICON}>
    <Svg
      fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
      height={CUSTOM_SELECT_ICON_DIMENSIONS.CHEVRON_SIZE_PX}
      stroke={CUSTOM_SELECT_COLORS.CHEVRON_STROKE}
      strokeLinecap={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={CUSTOM_SELECT_ICON_DIMENSIONS.VIEW_BOX}
      width={CUSTOM_SELECT_ICON_DIMENSIONS.CHEVRON_SIZE_PX}
    >
      {CUSTOM_SELECT_ICONS.CHEVRON_DOWN.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
          key={`chevron-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

const GlobeIcon = (): React.JSX.Element => (
  <View testID={CUSTOM_SELECT_TEST_IDS.LEFT_ICON}>
    <Svg
      fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
      height={CUSTOM_SELECT_ICON_DIMENSIONS.GLOBE_SIZE_PX}
      stroke={CUSTOM_SELECT_COLORS.GLOBE_STROKE}
      strokeLinecap={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
      strokeLinejoin={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
      strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
      viewBox={CUSTOM_SELECT_ICON_DIMENSIONS.VIEW_BOX}
      width={CUSTOM_SELECT_ICON_DIMENSIONS.GLOBE_SIZE_PX}
    >
      {CUSTOM_SELECT_ICONS.GLOBE.paths.map((pathData, index) => (
        <Path
          d={pathData}
          fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
          key={`globe-path-${index}`}
        />
      ))}
    </Svg>
  </View>
);

const CheckmarkIcon = (): React.JSX.Element => (
  <Svg
    fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
    height={CUSTOM_SELECT_ICON_DIMENSIONS.CHECKMARK_SIZE_PX}
    stroke={CUSTOM_SELECT_COLORS.CHECKMARK_STROKE}
    strokeLinecap={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
    strokeLinejoin={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
    strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    viewBox={CUSTOM_SELECT_ICON_DIMENSIONS.VIEW_BOX}
    width={CUSTOM_SELECT_ICON_DIMENSIONS.CHECKMARK_SIZE_PX}
  >
    {CUSTOM_SELECT_ICONS.CHECKMARK.paths.map((pathData, index) => (
      <Path
        d={pathData}
        fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
        key={`check-path-${index}`}
      />
    ))}
  </Svg>
);

const CloseIcon = (): React.JSX.Element => (
  <Svg
    fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
    height={CUSTOM_SELECT_ICON_DIMENSIONS.CLOSE_SIZE_PX}
    stroke={CUSTOM_SELECT_COLORS.CLOSE_STROKE}
    strokeLinecap={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_CAP}
    strokeLinejoin={CUSTOM_SELECT_SVG_ATTRIBUTES.STROKE_LINE_JOIN}
    strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
    viewBox={CUSTOM_SELECT_ICON_DIMENSIONS.VIEW_BOX}
    width={CUSTOM_SELECT_ICON_DIMENSIONS.CLOSE_SIZE_PX}
  >
    {CUSTOM_SELECT_ICONS.CLOSE.paths.map((pathData, index) => (
      <Path
        d={pathData}
        fill={CUSTOM_SELECT_SVG_ATTRIBUTES.FILL_NONE}
        key={`close-path-${index}`}
      />
    ))}
  </Svg>
);

export const CustomSelect = ({
  disabled = false,
  errorMessage,
  helperText,
  label,
  leftIcon,
  modalTitle,
  onValueChange,
  options,
  placeholder = CUSTOM_SELECT_COPY.DEFAULT_PLACEHOLDER,
  required = false,
  testID,
  value,
}: CustomSelectProps): React.JSX.Element => {
  const {
    closeModal,
    handleSelectOption,
    isOpen,
    openModal,
    selectedOptionLabel,
  } = useCustomSelect({
    onValueChange,
    options,
    value,
  });

  const borderClass = errorMessage
    ? CUSTOM_SELECT_STYLES.TRIGGER_BORDER_ERROR
    : isOpen
      ? CUSTOM_SELECT_STYLES.TRIGGER_BORDER_OPEN
      : CUSTOM_SELECT_STYLES.TRIGGER_BORDER_BASE;

  const disabledClass = disabled
    ? ` ${CUSTOM_SELECT_STYLES.TRIGGER_DISABLED}`
    : "";

  const displayText = selectedOptionLabel ?? placeholder;
  const isSelected = Boolean(selectedOptionLabel);
  const resolvedModalTitle =
    modalTitle ?? label ?? CUSTOM_SELECT_COPY.DEFAULT_MODAL_TITLE;

  const labelTestId = testID
    ? `${testID}-${CUSTOM_SELECT_TEST_IDS.LABEL}`
    : CUSTOM_SELECT_TEST_IDS.LABEL;
  const requiredAsteriskTestId = testID
    ? `${testID}-${CUSTOM_SELECT_TEST_IDS.REQUIRED_ASTERISK}`
    : CUSTOM_SELECT_TEST_IDS.REQUIRED_ASTERISK;
  const triggerTestId = testID
    ? `${testID}-trigger`
    : CUSTOM_SELECT_TEST_IDS.TRIGGER;
  const triggerTextTestId = testID
    ? `${testID}-trigger-text`
    : CUSTOM_SELECT_TEST_IDS.TRIGGER_TEXT;
  const errorTestId = testID
    ? `${testID}-error`
    : CUSTOM_SELECT_TEST_IDS.ERROR_MESSAGE;
  const helperTestId = testID
    ? `${testID}-helper-text`
    : CUSTOM_SELECT_TEST_IDS.HELPER_TEXT;

  return (
    <View
      className={CUSTOM_SELECT_STYLES.CONTAINER}
      testID={testID ?? CUSTOM_SELECT_TEST_IDS.CONTAINER}
    >
      {/* Label Row */}
      {label ? (
        <View className={CUSTOM_SELECT_STYLES.LABEL_ROW}>
          <Text
            className={CUSTOM_SELECT_STYLES.LABEL_TEXT}
            testID={labelTestId}
          >
            {label}
          </Text>
          {required ? (
            <Text
              className={CUSTOM_SELECT_STYLES.REQUIRED_ASTERISK}
              testID={requiredAsteriskTestId}
            >
              {CUSTOM_SELECT_COPY.REQUIRED_ASTERISK}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Trigger Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled, expanded: isOpen }}
        aria-invalid={Boolean(errorMessage)}
        className={`${CUSTOM_SELECT_STYLES.TRIGGER_BASE} ${borderClass}${disabledClass}`}
        disabled={disabled}
        onPress={openModal}
        testID={triggerTestId}
      >
        {leftIcon === "globe" ? <GlobeIcon /> : null}

        <Text
          className={
            isSelected
              ? CUSTOM_SELECT_STYLES.TRIGGER_TEXT_SELECTED
              : CUSTOM_SELECT_STYLES.TRIGGER_TEXT_PLACEHOLDER
          }
          ellipsizeMode="tail"
          numberOfLines={1}
          testID={triggerTextTestId}
        >
          {displayText}
        </Text>

        <ChevronDownIcon />
      </Pressable>

      {/* Feedback Row: Error takes precedence over Helper text */}
      {errorMessage ? (
        <Text
          className={CUSTOM_SELECT_STYLES.ERROR_TEXT}
          testID={errorTestId}
        >
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text
          className={CUSTOM_SELECT_STYLES.HELPER_TEXT}
          testID={helperTestId}
        >
          {helperText}
        </Text>
      ) : null}

      {/* Options Modal */}
      <Modal
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
        testID={CUSTOM_SELECT_TEST_IDS.MODAL}
        transparent
        visible={isOpen}
      >
        <Pressable
          accessibilityLabel={
            CUSTOM_SELECT_COPY.CLOSE_MODAL_ACCESSIBILITY_LABEL
          }
          className={CUSTOM_SELECT_STYLES.MODAL_BACKDROP}
          onPress={closeModal}
          testID={CUSTOM_SELECT_TEST_IDS.MODAL_BACKDROP}
        >
          <Pressable
            accessibilityViewIsModal
            className={CUSTOM_SELECT_STYLES.MODAL_CARD}
            onPress={(event) => event?.stopPropagation?.()}
            testID={CUSTOM_SELECT_TEST_IDS.MODAL_CARD}
          >
            {/* Modal Header */}
            <View className={CUSTOM_SELECT_STYLES.MODAL_HEADER}>
              <Text
                className={CUSTOM_SELECT_STYLES.MODAL_TITLE}
                testID={CUSTOM_SELECT_TEST_IDS.MODAL_TITLE}
              >
                {resolvedModalTitle}
              </Text>
              <Pressable
                accessibilityLabel={
                  CUSTOM_SELECT_COPY.CLOSE_MODAL_ACCESSIBILITY_LABEL
                }
                accessibilityRole="button"
                className={CUSTOM_SELECT_STYLES.MODAL_CLOSE_BUTTON}
                hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                onPress={closeModal}
                testID={CUSTOM_SELECT_TEST_IDS.MODAL_CLOSE_BUTTON}
              >
                <CloseIcon />
              </Pressable>
            </View>

            {/* Modal Options List */}
            <ScrollView
              className="max-h-80"
              showsVerticalScrollIndicator={false}
            >
              <View className={CUSTOM_SELECT_STYLES.OPTION_LIST}>
                {options.map((option) => {
                  const isOptionActive = option.value === value;
                  const itemTestId = `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${option.value}`;
                  const checkTestId = `${CUSTOM_SELECT_TEST_IDS.OPTION_CHECK_PREFIX}${option.value}`;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isOptionActive }}
                      className={
                        isOptionActive
                          ? CUSTOM_SELECT_STYLES.OPTION_ACTIVE
                          : CUSTOM_SELECT_STYLES.OPTION_INACTIVE
                      }
                      key={option.value}
                      onPress={() => handleSelectOption(option.value)}
                      testID={itemTestId}
                    >
                      <Text
                        className={
                          isOptionActive
                            ? CUSTOM_SELECT_STYLES.OPTION_ACTIVE_TEXT
                            : CUSTOM_SELECT_STYLES.OPTION_INACTIVE_TEXT
                        }
                      >
                        {option.label}
                      </Text>

                      {isOptionActive ? (
                        <View testID={checkTestId}>
                          <CheckmarkIcon />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
