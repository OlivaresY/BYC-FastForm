import type { Meta, StoryObj } from '@storybook/react-native';
import { APPLICANT_STEP_VIEW_DEFAULT_VALUES } from '../constants/ApplicantStepView.constants';
import { ApplicantStepView } from './ApplicantStepView';

const meta = {
  args: {
    disabled: false,
    isIdentificationValid: false,
    isValid: false,
    legalErrors: {},
    legalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
    onLegalFieldChange: () => {},
    onPhysicalFieldChange: () => {},
    onRegimeChange: () => {},
    onSubmit: () => {},
    onVehicleBeneficiaryChange: () => {},
    physicalErrors: {},
    physicalValues: APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
    regime: 'physical',
    vehicleBeneficiary: 'same_holder',
  },
  component: ApplicantStepView,
  title: 'CreditWizard/ApplicantStepView',
} satisfies Meta<typeof ApplicantStepView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PhysicalRegime: Story = {
  args: {
    regime: 'physical',
  },
};

export const LegalRegime: Story = {
  args: {
    regime: 'legal',
  },
};

export const PhysicalValid: Story = {
  args: {
    isIdentificationValid: true,
    isValid: true,
    physicalValues: {
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
    regime: 'physical',
    vehicleBeneficiary: 'same_holder',
  },
};

export const LegalValid: Story = {
  args: {
    isIdentificationValid: true,
    isValid: true,
    legalValues: {
      identificationNumber: '3-101-123456',
      identificationType: 'legal_id',
      legalName: 'Inversiones Tecnológicas S.A.',
      representativeIdentification: '1-1150-0222',
      representativeName: 'Juan Alberto Pérez Rojas',
    },
    regime: 'legal',
    vehicleBeneficiary: 'same_holder',
  },
};
