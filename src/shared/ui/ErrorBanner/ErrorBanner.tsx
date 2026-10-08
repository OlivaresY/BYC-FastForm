import React from "react";
import { Text, View } from "react-native";
import { ERROR_BANNER_TEST_IDS } from "./constants/ErrorBanner.constants";
import type { ErrorBannerProps } from "./ErrorBanner.types";

export const ErrorBanner = ({
  message,
  style,
  testID,
  title,
}: ErrorBannerProps): React.JSX.Element => {
  return (
    <View
      accessibilityRole="alert"
      className="w-full rounded-lg border border-red-200 bg-red-50 p-4"
      style={style}
      testID={testID ?? ERROR_BANNER_TEST_IDS.CONTAINER}
    >
      {title ? (
        <Text
          className="mb-1 text-sm font-bold text-brand-red"
          testID={ERROR_BANNER_TEST_IDS.TITLE}
        >
          {title}
        </Text>
      ) : null}
      <Text
        className="text-sm font-medium text-brand-red"
        testID={ERROR_BANNER_TEST_IDS.MESSAGE}
      >
        {message}
      </Text>
    </View>
  );
};
