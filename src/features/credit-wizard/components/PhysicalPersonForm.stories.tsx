import type { Meta, StoryObj } from '@storybook/react-native';
import { PhysicalPersonForm } from './PhysicalPersonForm';

const defaultValues = {
  birthDate: '',
  firstLastName: '',
  firstName: '',
  gender: '',
  identificationNumber: '',
  identificationType: '',
  maritalStatus: '',
  middleName: '',
  nationality: '',
  secondLastName: '',
};

const meta = {
  title: 'CreditWizard/PhysicalPersonForm',
  component: PhysicalPersonForm,
  args: {
    onFieldChange: () => {},
    values: defaultValues,
  },
} satisfies Meta<typeof PhysicalPersonForm>;

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
      birthDate: '15 / 08 / 1988',
      firstLastName: 'Rodríguez',
      firstName: 'Carlos',
      gender: 'male',
      identificationNumber: '1-1234-0567',
      identificationType: 'national_id',
      maritalStatus: 'married',
      middleName: 'Alberto',
      nationality: 'CR',
      secondLastName: 'Castro',
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    errors: {
      birthDate: 'Debe ser mayor de 18 años.',
      firstLastName: 'El primer apellido es obligatorio.',
      firstName: 'El primer nombre es obligatorio.',
      identificationNumber: 'Formato de cédula inválido.',
      identificationType: 'Seleccione un tipo de identificación.',
    },
    values: {
      ...defaultValues,
      identificationNumber: '1-123',
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    values: {
      birthDate: '15 / 08 / 1988',
      firstLastName: 'Rodríguez',
      firstName: 'Carlos',
      gender: 'male',
      identificationNumber: '1-1234-0567',
      identificationType: 'national_id',
      maritalStatus: 'married',
      middleName: 'Alberto',
      nationality: 'CR',
      secondLastName: 'Castro',
    },
  },
};

export const ForeignResident: Story = {
  args: {
    isIdentificationValid: true,
    values: {
      birthDate: '20 / 11 / 1992',
      firstLastName: 'Gómez',
      firstName: 'María',
      gender: 'female',
      identificationNumber: '155800123456',
      identificationType: 'dimex',
      maritalStatus: 'single',
      middleName: 'Elena',
      nationality: 'NI',
      secondLastName: 'Pérez',
    },
  },
};
