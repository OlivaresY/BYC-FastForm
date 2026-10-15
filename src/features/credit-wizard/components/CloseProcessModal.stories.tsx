import type { Meta, StoryObj } from "@storybook/react-native";
import { CloseProcessModal } from "./CloseProcessModal";

const meta = {
  title: "Features/CreditWizard/CloseProcessModal",
  component: CloseProcessModal,
  args: {
    onClose: () => {},
    onDiscard: () => {},
    onSaveDraft: () => {},
    visible: false,
  },
} satisfies Meta<typeof CloseProcessModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: false,
  },
};

export const Visible: Story = {
  args: {
    visible: true,
  },
};
