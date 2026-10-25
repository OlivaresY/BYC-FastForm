import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  BASE_BUTTON_STYLES,
  BASE_BUTTON_TEST_IDS,
  BASE_BUTTON_VARIANTS,
} from './constants/BaseButton.constants';
import type { BaseButtonProps } from './BaseButton.types';

export const BaseButton = React.memo(
  ({
    className,
    disabled = false,
    fullWidth = false,
    icon,
    iconRight,
    label,
    loading = false,
    onPress,
    style,
    testID,
    textClassName,
    variant = BASE_BUTTON_VARIANTS.PRIMARY,
    ...rest
  }: BaseButtonProps): React.JSX.Element => {
    const isInteractionDisabled = disabled || loading;

    const variantConfig =
      BASE_BUTTON_STYLES.VARIANTS[variant] ??
      BASE_BUTTON_STYLES.VARIANTS[BASE_BUTTON_VARIANTS.PRIMARY];
    const { container, loaderColor, text } = variantConfig;

    const containerClasses = [
      BASE_BUTTON_STYLES.BASE_CONTAINER,
      fullWidth ? BASE_BUTTON_STYLES.FULL_WIDTH : '',
      container,
      isInteractionDisabled ? BASE_BUTTON_STYLES.DISABLED : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Pressable
        {...rest}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityRole='button'
        accessibilityState={{ disabled: isInteractionDisabled }}
        className={containerClasses}
        disabled={isInteractionDisabled}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        onPress={onPress}
        style={style}
        testID={testID ?? BASE_BUTTON_TEST_IDS.BUTTON}
      >
        {loading ? (
          <ActivityIndicator
            color={loaderColor}
            size='small'
            testID={BASE_BUTTON_TEST_IDS.LOADER}
          />
        ) : (
          <View className={BASE_BUTTON_STYLES.CONTENT_CONTAINER}>
            {icon ?? null}
            <Text
              className={`${textClassName ?? text} ${BASE_BUTTON_STYLES.LABEL_BASE}`}
              testID={BASE_BUTTON_TEST_IDS.LABEL}
            >
              {label}
            </Text>
            {iconRight ?? null}
          </View>
        )}
      </Pressable>
    );
  },
);

BaseButton.displayName = 'BaseButton';

