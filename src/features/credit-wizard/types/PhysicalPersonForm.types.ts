import type { CustomSelectOption } from "@/shared/ui/CustomSelect";

export type PhysicalPersonFormField =
  | "birthDate"
  | "firstLastName"
  | "firstName"
  | "gender"
  | "identificationNumber"
  | "identificationType"
  | "maritalStatus"
  | "middleName"
  | "nationality"
  | "secondLastName";

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
  isIdentificationValid?: boolean;
  onFieldChange: <K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ) => void;
  options?: PhysicalPersonFormOptions;
  testID?: string;
  values: PhysicalPersonFormValues;
}
