import type { Meta, StoryObj } from "@storybook/react-native";
import { BaseButton } from "./BaseButton";
import { BASE_BUTTON_VARIANTS } from "./constants/BaseButton.constants";

const meta = {
  title: "Shared/UI/BaseButton",
  component: BaseButton,
  args: {
    label: "Continuar",
  },
} satisfies Meta<typeof BaseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Aprobar Solicitud",
    variant: BASE_BUTTON_VARIANTS.PRIMARY,
  },
};

export const Secondary: Story = {
  args: {
    label: "Cancelar Operación",
    variant: BASE_BUTTON_VARIANTS.SECONDARY,
  },
};

export const Outline: Story = {
  args: {
    label: "Regresar al Inicio",
    variant: BASE_BUTTON_VARIANTS.OUTLINE,
  },
};

export const Ghost: Story = {
  args: {
    label: "Descartar",
    variant: BASE_BUTTON_VARIANTS.GHOST,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Acción Bloqueada",
    variant: BASE_BUTTON_VARIANTS.PRIMARY,
  },
};

export const Loading: Story = {
  args: {
    label: "Cargando Datos",
    loading: true,
    variant: BASE_BUTTON_VARIANTS.PRIMARY,
  },
};
