import { useMemo, useState } from "react";
import type {
  UseCustomSelectProps,
  UseCustomSelectReturn,
} from "../CustomSelect.types";

export const useCustomSelect = ({
  onValueChange,
  options,
  value,
}: UseCustomSelectProps): UseCustomSelectReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const handleSelectOption = (optionValue: string): void => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const selectedOptionLabel = useMemo((): string | null => {
    if (!value) {
      return null;
    }
    const matchingOption = options.find((option) => option.value === value);
    return matchingOption ? matchingOption.label : null;
  }, [options, value]);

  return {
    closeModal,
    handleSelectOption,
    isOpen,
    openModal,
    selectedOptionLabel,
  };
};
