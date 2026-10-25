import type { LegalEntityType } from './LegalEntitySelector.types';
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from './PhysicalPersonForm.types';
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from './LegalEntityForm.types';
import type { VehicleBeneficiaryType } from './VehicleBeneficiarySection.types';

// =============================================================================
// Final Beneficiary (Third-Party) Domain Types
// =============================================================================

export interface ThirdPartyBeneficiaryValues {
  isThirdPartyRegistration?: boolean;
  thirdPartyBirthDate?: string;
  thirdPartyDocNumber?: string;
  thirdPartyDocType?: string;
  thirdPartyEmail?: string;
  thirdPartyFullName?: string;
  thirdPartyNationality?: string;
  thirdPartyPhone?: string;
  thirdPartyRelationship?: string;
}

export type ThirdPartyBeneficiaryField =
  | 'thirdPartyBirthDate'
  | 'thirdPartyDocNumber'
  | 'thirdPartyDocType'
  | 'thirdPartyEmail'
  | 'thirdPartyFullName'
  | 'thirdPartyNationality'
  | 'thirdPartyPhone'
  | 'thirdPartyRelationship';

// =============================================================================
// Discriminated Submission Payloads
// =============================================================================

export interface BaseApplicantStepData extends ThirdPartyBeneficiaryValues {
  vehicleBeneficiary: VehicleBeneficiaryType;
}

export interface PhysicalApplicantStepData extends BaseApplicantStepData {
  regime: 'physical';
  values: PhysicalPersonFormValues;
}

export interface LegalApplicantStepData extends BaseApplicantStepData {
  regime: 'legal';
  values: LegalEntityFormValues;
}

export type ApplicantStepData =
  PhysicalApplicantStepData | LegalApplicantStepData;

export interface ApplicantStepFormData extends ThirdPartyBeneficiaryValues {
  isThirdPartyRegistration: boolean;
  regime: LegalEntityType;
  vehicleBeneficiary: VehicleBeneficiaryType;
}

export interface ApplicantStepFormValues {
  legalValues: LegalEntityFormValues;
  physicalValues: PhysicalPersonFormValues;
  regime: LegalEntityType;
  thirdPartyValues: ThirdPartyBeneficiaryValues;
  vehicleBeneficiary: VehicleBeneficiaryType;
}

// =============================================================================
// ViewModel Hook Options & Return Interface
// =============================================================================

export interface UseApplicantStepViewModelProps {
  initialLegalValues?: Partial<LegalEntityFormValues>;
  initialPhysicalValues?: Partial<PhysicalPersonFormValues>;
  initialRegime?: LegalEntityType;
  initialThirdPartyValues?: Partial<ThirdPartyBeneficiaryValues>;
  initialVehicleBeneficiary?: VehicleBeneficiaryType;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  onSubmit?: (data: ApplicantStepData) => void | Promise<void>;
}

export interface UseApplicantStepViewModelReturn {
  // State
  isBeneficiaryModalOpen: boolean;
  isIdentificationValid: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  legalErrors: Partial<Record<LegalEntityFormField, string>>;
  legalValues: LegalEntityFormValues;
  physicalErrors: Partial<Record<PhysicalPersonFormField, string>>;
  physicalValues: PhysicalPersonFormValues;
  regime: LegalEntityType;
  submitError: string | null;
  thirdPartyErrors: Partial<Record<ThirdPartyBeneficiaryField, string>>;
  thirdPartyValues: ThirdPartyBeneficiaryValues;
  vehicleBeneficiary: VehicleBeneficiaryType;

  // Handlers
  closeBeneficiaryModal: () => void;
  handleNextStep: (dataOrEvent?: unknown) => Promise<void>;
  handleSaveThirdPartyData: () => boolean;
  onLegalFieldChange: <K extends LegalEntityFormField>(
    field: K,
    value: LegalEntityFormValues[K],
  ) => void;
  onPhysicalFieldChange: <K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ) => void;
  onRegimeChange: (regime: LegalEntityType) => void;
  onSubmit: () => void | Promise<void>;
  onThirdPartyFieldChange: <K extends ThirdPartyBeneficiaryField>(
    field: K,
    value: ThirdPartyBeneficiaryValues[K],
  ) => void;
  onVehicleBeneficiaryChange: (beneficiary: VehicleBeneficiaryType) => void;
  openBeneficiaryModal: () => void;
}

// =============================================================================
// Orchestrator Component Props
// =============================================================================

export interface ApplicantStepViewProps extends Partial<UseApplicantStepViewModelReturn> {
  disabled?: boolean;
  onClose?: () => void;
  testID?: string;
  viewModel?: UseApplicantStepViewModelReturn;
}

// =============================================================================
// Final Beneficiary Modal Component Props
// =============================================================================

export interface FinalBeneficiaryModalProps {
  errors?: Partial<Record<ThirdPartyBeneficiaryField, string>>;
  isOpen: boolean;
  onClose: () => void;
  onFieldChange: <K extends ThirdPartyBeneficiaryField>(
    field: K,
    value: ThirdPartyBeneficiaryValues[K],
  ) => void;
  onSave?: () => void;
  testID?: string;
  thirdPartyValues?: ThirdPartyBeneficiaryValues;
  values?: ThirdPartyBeneficiaryValues;
}
