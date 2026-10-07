import type { ComponentProps } from "react";
import { BaseButton } from "./BaseButton";
import { BASE_BUTTON_VARIANTS } from "./constants/BaseButton.constants";

type BaseButtonStoryArgs = ComponentProps<typeof BaseButton>;

export interface StoryMeta {
  argTypes?: Record<string, unknown>;
  args?: Partial<BaseButtonStoryArgs>;
  component: typeof BaseButton;
  title: string;
}

export interface Story {
  args: BaseButtonStoryArgs;
}

const meta: StoryMeta = {
  title: "Shared/UI/BaseButton",
  component: BaseButton,
  args: {
    label: "Continuar",
  },
};

export default meta;

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
