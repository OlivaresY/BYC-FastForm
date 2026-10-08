import React from "react";
import { StyleSheet, View } from "react-native";
import type { Preview } from "@storybook/react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F7F7F6",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export default preview;
