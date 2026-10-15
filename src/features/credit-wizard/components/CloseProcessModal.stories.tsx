import type { Meta, StoryObj } from "@storybook/react-native";
import { CloseProcessModal } from "./CloseProcessModal";

const meta = {
  title: "Features/CreditWizard/CloseProcessModal",
  component: CloseProcessModal,
  args: {
    onClose: () => {},
    onDiscard: () => {},
    onSaveDraft: () => {},
    visible: true,
  },
} satisfies Meta<typeof CloseProcessModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};
