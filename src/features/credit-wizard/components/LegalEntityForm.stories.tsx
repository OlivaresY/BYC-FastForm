import type { Meta, StoryObj } from "@storybook/react-native";
import { LegalEntityForm } from "./LegalEntityForm";

const defaultValues = {
  identificationNumber: "",
  identificationType: "",
  legalName: "",
  representativeIdentification: "",
  representativeName: "",
};

const meta = {
  title: "CreditWizard/LegalEntityForm",
  component: LegalEntityForm,
  args: {
    onFieldChange: () => {},
    values: defaultValues,
  },
} satisfies Meta<typeof LegalEntityForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    values: defaultValues,
  },
};

export const FilledValid: Story = {
  args: {
    isIdentificationValid: true,
    values: {
      identificationNumber: "3-101-123456",
      identificationType: "legal_id",
      legalName: "Inversiones Tecnológicas S.A.",
      representativeIdentification: "1-1150-0222",
      representativeName: "Juan Alberto Pérez Rojas",
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    errors: {
      identificationNumber: "Formato de cédula jurídica inválido.",
      identificationType: "Seleccione un tipo de identificación.",
      legalName: "La razón social es obligatoria.",
      representativeIdentification:
        "La cédula del representante es obligatoria.",
      representativeName: "El nombre del representante es obligatorio.",
    },
    values: {
      ...defaultValues,
      identificationNumber: "3-101",
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    values: {
      identificationNumber: "3-101-123456",
      identificationType: "legal_id",
      legalName: "Inversiones Tecnológicas S.A.",
      representativeIdentification: "1-1150-0222",
      representativeName: "Juan Alberto Pérez Rojas",
    },
  },
};
