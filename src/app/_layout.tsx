import "../../global.css";
import React from "react";
import { Stack } from "expo-router";
import Storybook from "../../.storybook/Storybook";

const RootLayout = (): React.JSX.Element => {
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
    return <Storybook />;
  }

  return <Stack />;
};

export default RootLayout;
