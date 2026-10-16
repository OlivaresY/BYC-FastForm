import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  BASE_BUTTON_STYLES,
  BASE_BUTTON_TEST_IDS,
  BASE_BUTTON_VARIANTS,
} from './constants/BaseButton.constants';
import type { BaseButtonProps } from './BaseButton.types';

export const BaseButton = ({
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
          container: 'bg-primary-dark active:opacity-90',
          loaderColor: '#FFFFFF',
          text: 'text-surface font-semibold text-base',
        };
      case BASE_BUTTON_VARIANTS.GHOST:
        return {
          container: 'bg-transparent active:bg-brand-red/10',
          loaderColor: '#B91C1C',
          text: 'text-brand-red font-semibold text-base',
        };
      case BASE_BUTTON_VARIANTS.OUTLINE:
        return {
          container:
            'border-2 border-brand-red bg-transparent active:bg-brand-red/10',
          loaderColor: '#B91C1C',
          text: 'text-brand-red font-semibold text-base',
        };
      case BASE_BUTTON_VARIANTS.PRIMARY:
      default:
        return {
          container: 'bg-brand-red active:opacity-90',
          loaderColor: '#FFFFFF',
          text: 'text-surface font-semibold text-base',
        };
    }
  };

  const { container, loaderColor, text } = getVariantStyles();

  const containerClasses = [
    'min-h-[48px]',
    'min-w-[48px]',
    fullWidth ? 'w-full self-stretch' : '',
    'flex-row',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-xl',
    'px-4',
    'py-3',
    container,
    isInteractionDisabled ? 'opacity-40' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
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
          size="small"
          testID={BASE_BUTTON_TEST_IDS.LOADER}
        />
      ) : (
        <View className={BASE_BUTTON_STYLES.CONTENT_CONTAINER}>
          {icon ?? null}
          <Text
            className={`${text} text-center flex-shrink`}
            testID={BASE_BUTTON_TEST_IDS.LABEL}
          >
            {label}
          </Text>
          {iconRight ?? null}
        </View>
      )}
    </Pressable>
  );
};
