import type { CustomSelectOption } from '@/shared/ui';

export type PhysicalPersonFormField =
  | 'birthDate'
  | 'firstLastName'
  | 'firstName'
  | 'gender'
  | 'identificationNumber'
  | 'identificationType'
  | 'maritalStatus'
  | 'middleName'
  | 'nationality'
  | 'nationalityOther'
  | 'secondLastName';

export interface PhysicalPersonFormValues {
  birthDate: string;
  firstLastName: string;
  firstName: string;
  gender: string;
  identificationNumber: string;
  identificationType: string;
  maritalStatus: string;
  middleName: string;
  nationality: string;
  nationalityOther?: string;
  secondLastName: string;
}

export interface PhysicalPersonFormOptions {
  genderOptions?: readonly CustomSelectOption[];
  identificationTypeOptions?: readonly CustomSelectOption[];
  maritalStatusOptions?: readonly CustomSelectOption[];
  nationalityOptions?: readonly CustomSelectOption[];
}

export interface PhysicalPersonFormProps {
  disabled?: boolean;
  errors?: Partial<Record<PhysicalPersonFormField, string>>;
  hasSingleSurnameWarning?: boolean;
  isIdentificationValid?: boolean;
  onFieldChange: <K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ) => void;
  options?: PhysicalPersonFormOptions;
  testID?: string;
  values: PhysicalPersonFormValues;
}
