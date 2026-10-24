export {
  ApplicantStepView,
  CloseProcessModal,
  FinalBeneficiaryModal,
  LegalEntityForm,
  LegalEntitySelector,
  PhysicalPersonContactForm,
  PhysicalPersonContactStepView,
  PhysicalPersonForm,
  VehicleBeneficiarySection,
  WizardProgressHeader,
} from './components';

export {
  useApplicantStepViewModel,
  usePhysicalPersonContactViewModel,
  useWizardProgressHeaderViewModel,
} from './hooks';

export {
  BENEFICIARY_MODAL_COLORS,
  BENEFICIARY_MODAL_COPY,
  BENEFICIARY_MODAL_DIMENSIONS,
  BENEFICIARY_MODAL_OPTIONS,
  BENEFICIARY_MODAL_STYLES,
  BENEFICIARY_MODAL_TEST_IDS,
} from './constants/ApplicantStepView.constants';

export {
  ApplicantStepFormSchema,
  ApplicantStepSchema,
  ApplicantStepSubmissionSchema,
  LegalApplicantSchema,
  LegalApplicantStepSchema,
  PhysicalApplicantSchema,
  PhysicalApplicantStepSchema,
  StrictThirdPartyBeneficiarySchema,
  ThirdPartyBeneficiaryFieldsSchema,
  ThirdPartyBeneficiarySchema,
  ThirdPartyBeneficiaryStrictFieldsSchema,
} from './types/ApplicantStepView.schema';

export type {
  ApplicantStepData,
  ApplicantStepFormData,
  ApplicantStepViewProps,
  BaseApplicantStepData,
  FinalBeneficiaryModalProps,
  LegalApplicantStepData,
  PhysicalApplicantStepData,
  ThirdPartyBeneficiaryField,
  ThirdPartyBeneficiaryValues,
  UseApplicantStepViewModelProps,
  UseApplicantStepViewModelReturn,
} from './types/ApplicantStepView.types';

export type { CloseProcessModalProps } from './types/CloseProcessModal.types';
export type {
  LegalEntityFormField,
  LegalEntityFormOptions,
  LegalEntityFormProps,
  LegalEntityFormValues,
} from './types/LegalEntityForm.types';
export type {
  LegalEntitySelectorProps,
  LegalEntityType,
} from './types/LegalEntitySelector.types';
export type {
  PhysicalPersonFormField,
  PhysicalPersonFormOptions,
  PhysicalPersonFormProps,
  PhysicalPersonFormValues,
} from './types/PhysicalPersonForm.types';
export type {
  VehicleBeneficiarySectionProps,
  VehicleBeneficiaryType,
} from './types/VehicleBeneficiarySection.types';
export type { WizardProgressHeaderProps } from './types/WizardProgressHeader.types';

export {
  FINANCIAL_CURRENCIES,
  PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
  PHYSICAL_PERSON_CONTACT_PATTERNS,
} from './constants/PhysicalPersonContact.constants';

export {
  PHYSICAL_PERSON_CONTACT_FORM_COLORS,
  PHYSICAL_PERSON_CONTACT_FORM_COPY,
  PHYSICAL_PERSON_CONTACT_FORM_ICON_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_FORM_OPTIONS,
  PHYSICAL_PERSON_CONTACT_FORM_STYLES,
  PHYSICAL_PERSON_CONTACT_FORM_TEST_IDS,
} from './constants/PhysicalPersonContactForm.constants';

export {
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS,
} from './constants/PhysicalPersonContactStepView.constants';

export {
  ContactInfoSchema,
  EmploymentDataSchema,
  FinancialCapacitySchema,
  INTERNATIONAL_PHONE_REGEX,
  PhysicalPersonContactSchema,
  ResidentialAddressSchema,
} from './schemas/PhysicalPersonContact.schema';

export type {
  ContactInfo,
  EmploymentData,
  FinancialCapacity,
  FinancialCurrency,
  PhysicalPersonContact,
  ResidentialAddress,
  UsePhysicalPersonContactViewModelProps,
  UsePhysicalPersonContactViewModelReturn,
} from './types/PhysicalPersonContact.types';

export type {
  PhysicalPersonContactFormOptions,
  PhysicalPersonContactFormProps,
} from './types/PhysicalPersonContactForm.types';

export type { PhysicalPersonContactStepViewProps } from './types/PhysicalPersonContactStepView.types';
