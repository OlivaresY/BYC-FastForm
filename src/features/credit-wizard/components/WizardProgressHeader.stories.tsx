import type { Meta, StoryObj } from "@storybook/react-native";
import { WizardProgressHeader } from "./WizardProgressHeader";

const meta = {
  component: WizardProgressHeader,
  title: "Features/CreditWizard/WizardProgressHeader",
  args: {
    currentStep: 1,
    subtitle: "Ingrese la información básica del solicitante.",
    title: "Datos Personales",
    totalSteps: 4,
  },
} satisfies Meta<typeof WizardProgressHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Step1Of4: Story = {
  args: {
    currentStep: 1,
    subtitle: "Ingrese la información básica del solicitante.",
    title: "Datos Personales",
    totalSteps: 4,
  },
};

export const Step2Of4: Story = {
  args: {
    currentStep: 2,
    subtitle: "Seleccione la unidad y condiciones de financiamiento.",
    title: "Datos del Vehículo",
    totalSteps: 4,
  },
};

export const FullProgress: Story = {
  args: {
    currentStep: 4,
    subtitle: "Verifique los datos antes de enviar la solicitud.",
    title: "Revisión y Firma",
    totalSteps: 4,
  },
};
