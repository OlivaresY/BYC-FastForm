import type { Meta, StoryObj } from "@storybook/react-native";
import { LegalEntitySelector } from "./LegalEntitySelector";

const meta = {
  args: {
    disabled: false,
    onSelectEntity: () => {},
    selectedEntity: "physical",
  },
  component: LegalEntitySelector,
  title: "Features/CreditWizard/LegalEntitySelector",
} satisfies Meta<typeof LegalEntitySelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PhysicalPersonSelected: Story = {
  args: {
    disabled: false,
    selectedEntity: "physical",
  },
};

export const LegalEntitySelected: Story = {
  args: {
    disabled: false,
    selectedEntity: "legal",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    selectedEntity: "physical",
  },
};
