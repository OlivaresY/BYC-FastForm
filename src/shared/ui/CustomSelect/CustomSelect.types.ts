export interface CustomSelectOption {
  label: string;
  value: string;
}

export type CustomSelectPresetIcon = 'globe';

export interface CustomSelectProps {
  disabled?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  leftIcon?: CustomSelectPresetIcon;
  modalTitle?: string;
  onFocus?: (event?: unknown) => void;
  onValueChange: (value: string) => void;
  options: readonly CustomSelectOption[];
  placeholder?: string;
  required?: boolean;
  testID?: string;
  value?: string;
}

export interface UseCustomSelectProps {
  onValueChange: (value: string) => void;
  options: readonly CustomSelectOption[];
  value?: string;
}

export interface UseCustomSelectReturn {
  closeModal: () => void;
  handleSelectOption: (optionValue: string) => void;
  isOpen: boolean;
  openModal: () => void;
  selectedOptionLabel: string | null;
}
