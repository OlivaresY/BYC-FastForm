export type VehicleBeneficiaryType = 'same_holder' | 'third_party';

export interface VehicleBeneficiarySectionProps {
  disabled?: boolean;
  onSelectBeneficiary: (beneficiary: VehicleBeneficiaryType) => void;
  selectedBeneficiary: VehicleBeneficiaryType;
  testID?: string;
}
