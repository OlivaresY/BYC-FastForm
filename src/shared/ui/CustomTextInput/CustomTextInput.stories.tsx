import type { Meta, StoryObj } from "@storybook/react-native";
import { CustomTextInput } from "./CustomTextInput";

const meta = {
  title: "Shared/UI/CustomTextInput",
  component: CustomTextInput,
  args: {
    label: "Cédula de Identidad",
    placeholder: "Ej: 1-1152-0491",
  },
} satisfies Meta<typeof CustomTextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Cédula de Identidad",
    placeholder: "Ej: 1-1152-0491",
  },
};

export const WithValue: Story = {
  args: {
    label: "Nombre Completo",
    placeholder: "Nombre y apellidos",
    value: "Carlos Alvarado",
  },
};

export const Password: Story = {
  args: {
    isPassword: true,
    label: "PIN de Acceso",
    placeholder: "Ingrese su PIN de 4 dígitos",
  },
};

export const WithError: Story = {
  args: {
    error: "La identificación debe contener 9 dígitos numéricos.",
    label: "Cédula de Identidad",
    placeholder: "Ej: 1-1152-0491",
    value: "1-115",
  },
};
