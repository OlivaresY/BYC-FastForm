import type { Meta, StoryObj } from "@storybook/react-native";
import { ErrorBanner } from "./ErrorBanner";

const meta = {
  title: "Shared/UI/ErrorBanner",
  component: ErrorBanner,
  args: {
    message: "Ocurrió un error al procesar el trámite vehicular.",
  },
} satisfies Meta<typeof ErrorBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Ocurrió un error al procesar el trámite vehicular.",
  },
};

export const WithTitle: Story = {
  args: {
    message:
      "Revise los campos requeridos antes de continuar con la solicitud.",
    title: "Datos Incompletos",
  },
};

export const NetworkError: Story = {
  args: {
    message: "No se pudo conectar con el servidor. Verifique su conexión.",
    title: "Error de Red",
  },
};
