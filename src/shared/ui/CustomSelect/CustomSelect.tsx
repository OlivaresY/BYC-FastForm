import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { CheckmarkIcon, ChevronDownIcon, CloseIcon, GlobeIcon } from '../Icons';
import {
  CUSTOM_SELECT_COLORS,
  CUSTOM_SELECT_COPY,
  CUSTOM_SELECT_ICON_DIMENSIONS,
  CUSTOM_SELECT_STYLES,
  CUSTOM_SELECT_TEST_IDS,
} from './constants/CustomSelect.constants';
import type { CustomSelectProps } from './CustomSelect.types';
import { useCustomSelect } from './hooks/useCustomSelect';

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
    : '';

  const displayText = selectedOptionLabel ?? placeholder;
  const isSelected = Boolean(selectedOptionLabel);
  const resolvedModalTitle =
    modalTitle ?? label ?? CUSTOM_SELECT_COPY.DEFAULT_MODAL_TITLE;

  const labelTestId = testID ? `${testID}-label` : CUSTOM_SELECT_TEST_IDS.LABEL;
  const requiredAsteriskTestId = testID
    ? `${testID}-required-asterisk`
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
  const leftIconTestId = testID
    ? `${testID}-left-icon`
    : CUSTOM_SELECT_TEST_IDS.LEFT_ICON;
  const chevronIconTestId = testID
    ? `${testID}-chevron-icon`
    : CUSTOM_SELECT_TEST_IDS.CHEVRON_ICON;

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
          {required && !label.trim().endsWith('*') ? (
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
        accessibilityRole='button'
        accessibilityState={{ disabled: !!disabled, expanded: isOpen }}
        aria-invalid={Boolean(errorMessage)}
        className={`${CUSTOM_SELECT_STYLES.TRIGGER_BASE} ${borderClass}${disabledClass}`}
        disabled={disabled}
        onPress={openModal}
        testID={triggerTestId}
      >
        {leftIcon === 'globe' ? (
          <View testID={leftIconTestId}>
            <GlobeIcon
              color={CUSTOM_SELECT_COLORS.GLOBE_STROKE}
              size={CUSTOM_SELECT_ICON_DIMENSIONS.GLOBE_SIZE_PX}
              strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
            />
          </View>
        ) : null}

        <Text
          className={
            isSelected
              ? CUSTOM_SELECT_STYLES.TRIGGER_TEXT_SELECTED
              : CUSTOM_SELECT_STYLES.TRIGGER_TEXT_PLACEHOLDER
          }
          ellipsizeMode='tail'
          numberOfLines={1}
          testID={triggerTextTestId}
        >
          {displayText}
        </Text>

        <View testID={chevronIconTestId}>
          <ChevronDownIcon
            color={CUSTOM_SELECT_COLORS.CHEVRON_STROKE}
            size={CUSTOM_SELECT_ICON_DIMENSIONS.CHEVRON_SIZE_PX}
            strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
          />
        </View>
      </Pressable>

      {/* Feedback Row: Error takes precedence over Helper text */}
      {errorMessage ? (
        <Text className={CUSTOM_SELECT_STYLES.ERROR_TEXT} testID={errorTestId}>
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
        animationType='fade'
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
          accessibilityRole='button'
          className={CUSTOM_SELECT_STYLES.MODAL_BACKDROP}
          onPress={closeModal}
          testID={CUSTOM_SELECT_TEST_IDS.MODAL_BACKDROP}
        >
          <Pressable
            accessibilityViewIsModal
            className={CUSTOM_SELECT_STYLES.MODAL_CARD}
            onPress={(event) => {
              event?.stopPropagation?.();
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(event) => {
              event?.stopPropagation?.();
            }}
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
                accessibilityRole='button'
                className={CUSTOM_SELECT_STYLES.MODAL_CLOSE_BUTTON}
                hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                onPress={closeModal}
                testID={CUSTOM_SELECT_TEST_IDS.MODAL_CLOSE_BUTTON}
              >
                <CloseIcon
                  color={CUSTOM_SELECT_COLORS.CLOSE_STROKE}
                  size={CUSTOM_SELECT_ICON_DIMENSIONS.CLOSE_SIZE_PX}
                  strokeWidth={CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX}
                />
              </Pressable>
            </View>

            {/* Modal Options List */}
            <ScrollView
              className='max-h-80'
              showsVerticalScrollIndicator={false}
            >
              <View className={CUSTOM_SELECT_STYLES.OPTION_LIST}>
                {options.map((option) => {
                  const isOptionActive = option.value === value;
                  const itemTestId = `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${option.value}`;
                  const checkTestId = `${CUSTOM_SELECT_TEST_IDS.OPTION_CHECK_PREFIX}${option.value}`;

                  return (
                    <Pressable
                      accessibilityRole='button'
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
                          <CheckmarkIcon
                            color={CUSTOM_SELECT_COLORS.CHECKMARK_STROKE}
                            size={
                              CUSTOM_SELECT_ICON_DIMENSIONS.CHECKMARK_SIZE_PX
                            }
                            strokeWidth={
                              CUSTOM_SELECT_ICON_DIMENSIONS.STROKE_WIDTH_PX
                            }
                          />
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
