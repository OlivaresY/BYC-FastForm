import type { Meta, StoryObj } from '@storybook/react-native';
import { VehicleBeneficiarySection } from './VehicleBeneficiarySection';

const meta = {
  args: {
    disabled: false,
    onSelectBeneficiary: () => {},
    selectedBeneficiary: 'same_holder',
  },
  component: VehicleBeneficiarySection,
  title: 'Features/CreditWizard/VehicleBeneficiarySection',
} satisfies Meta<typeof VehicleBeneficiarySection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SameHolderSelected: Story = {
  args: {
    disabled: false,
    selectedBeneficiary: 'same_holder',
  },
};

export const ThirdPartySelected: Story = {
  args: {
    disabled: false,
    selectedBeneficiary: 'third_party',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    selectedBeneficiary: 'same_holder',
  },
};
