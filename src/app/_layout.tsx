import "../../global.css";
import React from "react";
import { Stack } from "expo-router";

const RootLayout = (): React.JSX.Element => {
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Storybook = require("../../.storybook/Storybook").default;
    return <Storybook />;
  }

  return <Stack />;
};

export default RootLayout;
