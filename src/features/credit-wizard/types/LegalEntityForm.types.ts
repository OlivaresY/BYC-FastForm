import type { CustomSelectOption } from '@/shared/ui';

export type LegalEntityFormField =
  | 'identificationNumber'
  | 'identificationType'
  | 'legalName'
  | 'representativeIdentification'
  | 'representativeName';

export interface LegalEntityFormValues {
  identificationNumber: string;
  identificationType: string;
  legalName: string;
  representativeIdentification: string;
  representativeName: string;
}

export interface LegalEntityFormOptions {
  identificationTypeOptions?: readonly CustomSelectOption[];
}

export interface LegalEntityFormProps {
  disabled?: boolean;
  errors?: Partial<Record<LegalEntityFormField, string>>;
  isIdentificationValid?: boolean;
  onFieldChange: <K extends LegalEntityFormField>(
    field: K,
    value: LegalEntityFormValues[K],
  ) => void;
  options?: LegalEntityFormOptions;
  testID?: string;
  values: LegalEntityFormValues;
}
