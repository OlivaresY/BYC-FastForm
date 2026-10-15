import type { Meta, StoryObj } from "@storybook/react-native";
import { CustomSelect } from "./CustomSelect";

const sampleOptions = [
  { label: "Costa Rica", value: "CR" },
  { label: "Nicaragua", value: "NI" },
  { label: "Panamá", value: "PA" },
  { label: "Estados Unidos", value: "US" },
] as const;

const meta = {
  args: {
    disabled: false,
    label: "Nacionalidad",
    onValueChange: () => {},
    options: sampleOptions,
    placeholder: "Seleccionar país...",
    required: false,
  },
  component: CustomSelect,
  title: "Shared/UI/CustomSelect",
} satisfies Meta<typeof CustomSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: undefined,
  },
};

export const WithValueSelected: Story = {
  args: {
    value: "CR",
  },
};

export const WithGlobeIcon: Story = {
  args: {
    leftIcon: "globe",
    value: "CR",
  },
};

export const RequiredWithHelper: Story = {
  args: {
    helperText: "Seleccione según su documento de identidad",
    required: true,
    value: undefined,
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "Debe seleccionar una opción válida",
    required: true,
    value: undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "CR",
  },
};
