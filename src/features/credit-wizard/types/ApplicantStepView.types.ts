import type { LegalEntityType } from "./LegalEntitySelector.types";
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from "./PhysicalPersonForm.types";
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from "./LegalEntityForm.types";
import type { VehicleBeneficiaryType } from "./VehicleBeneficiarySection.types";

// =============================================================================
// Discriminated Submission Payloads
// =============================================================================

export interface PhysicalApplicantStepData {
  regime: "physical";
  values: PhysicalPersonFormValues;
  vehicleBeneficiary: VehicleBeneficiaryType;
}

export interface LegalApplicantStepData {
  regime: "legal";
  values: LegalEntityFormValues;
  vehicleBeneficiary: VehicleBeneficiaryType;
}

export type ApplicantStepData =
  PhysicalApplicantStepData | LegalApplicantStepData;

// =============================================================================
// ViewModel Hook Options & Return Interface
// =============================================================================

export interface UseApplicantStepViewModelProps {
  initialLegalValues?: Partial<LegalEntityFormValues>;
  initialPhysicalValues?: Partial<PhysicalPersonFormValues>;
  initialRegime?: LegalEntityType;
  initialVehicleBeneficiary?: VehicleBeneficiaryType;
  onSubmit?: (data: ApplicantStepData) => void;
}

export interface UseApplicantStepViewModelReturn {
  // State
  isIdentificationValid: boolean;
  isValid: boolean;
  legalErrors: Partial<Record<LegalEntityFormField, string>>;
  legalValues: LegalEntityFormValues;
  physicalErrors: Partial<Record<PhysicalPersonFormField, string>>;
  physicalValues: PhysicalPersonFormValues;
  regime: LegalEntityType;
  vehicleBeneficiary: VehicleBeneficiaryType;

  // Handlers
  onLegalFieldChange: <K extends LegalEntityFormField>(
    field: K,
    value: LegalEntityFormValues[K],
  ) => void;
  onPhysicalFieldChange: <K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ) => void;
  onRegimeChange: (regime: LegalEntityType) => void;
  onSubmit: () => void;
  onVehicleBeneficiaryChange: (beneficiary: VehicleBeneficiaryType) => void;
}

// =============================================================================
// Orchestrator Component Props
// =============================================================================

export interface ApplicantStepViewProps extends Omit<
  UseApplicantStepViewModelReturn,
  "isIdentificationValid" | "isValid" | "legalErrors" | "physicalErrors"
> {
  disabled?: boolean;
  isIdentificationValid?: boolean;
  isValid?: boolean;
  legalErrors?: Partial<Record<LegalEntityFormField, string>>;
  onClose: () => void;
  physicalErrors?: Partial<Record<PhysicalPersonFormField, string>>;
  testID?: string;
}
