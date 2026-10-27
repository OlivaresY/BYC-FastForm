import React from 'react';
import { Text, View } from 'react-native';
import {
  ERROR_BANNER_STYLES,
  ERROR_BANNER_TEST_IDS,
} from './constants/ErrorBanner.constants';
import type { ErrorBannerProps } from './ErrorBanner.types';

export const ErrorBanner = React.memo(
  ({
    error,
    message,
    style,
    testID,
    title,
  }: ErrorBannerProps): React.JSX.Element | null => {
    const displayMessage = message ?? error;

    if (!displayMessage) {
      return null;
    }

    return (
      <View
        accessibilityRole='alert'
        className={ERROR_BANNER_STYLES.CONTAINER}
        style={style}
        testID={testID ?? ERROR_BANNER_TEST_IDS.CONTAINER}
      >
        {title ? (
          <Text
            className={ERROR_BANNER_STYLES.TITLE}
            testID={ERROR_BANNER_TEST_IDS.TITLE}
          >
            {title}
          </Text>
        ) : null}
        <Text
          className={ERROR_BANNER_STYLES.MESSAGE}
          testID={ERROR_BANNER_TEST_IDS.MESSAGE}
        >
          {displayMessage}
        </Text>
      </View>
    );
  },
);

ErrorBanner.displayName = 'ErrorBanner';
