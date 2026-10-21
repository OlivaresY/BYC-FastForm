import React from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react-native";
import { ProcessTopBar } from "./ProcessTopBar";

const meta = {
  component: ProcessTopBar,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className="w-full flex-1 justify-center bg-background p-4">
        <Story />
      </View>
    ),
  ],
  title: "Shared/UI/ProcessTopBar",
} satisfies Meta<typeof ProcessTopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userInitials: "YO",
  },
};

export const CustomInitials: Story = {
  args: {
    userInitials: "JD",
  },
};
