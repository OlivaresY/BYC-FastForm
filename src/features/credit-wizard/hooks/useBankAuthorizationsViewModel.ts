import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import type { Control, FieldErrors, UseFormReturn } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import {
  AVAILABLE_BANKS,
  type BankKey,
} from '../constants/BankAuthorizations.constants';
import { bankAuthorizationsSchema } from '../schemas/BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

const defaultBankFlags = AVAILABLE_BANKS.reduce(
  (acc, bank) => {
    acc[bank] = false;
    return acc;
  },
  {} as Record<BankKey, boolean>,
);

export const BANK_AUTHORIZATIONS_DEFAULT_VALUES: BankAuthorizationsFormValues =
  {
    ...defaultBankFlags,
    autoriza_buros_credito: false,
    autoriza_sugef_cic: false,
  };

export interface UseBankAuthorizationsViewModelProps {
  defaultValues?: Partial<BankAuthorizationsFormValues>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSuccess?: (data: BankAuthorizationsFormValues) => void | Promise<void>;
}

export interface UseBankAuthorizationsViewModelReturn {
  control: Control<BankAuthorizationsFormValues>;
  errors: FieldErrors<BankAuthorizationsFormValues>;
  form: UseFormReturn<BankAuthorizationsFormValues>;
  handleNext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  isAllBanksSelected: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  toggleAllBanks: () => void;
}

export const useBankAuthorizationsViewModel = (
  props?: UseBankAuthorizationsViewModelProps,
): UseBankAuthorizationsViewModelReturn => {
  const {
    defaultValues: defaultValuesProp,
    mode = 'onChange',
    onSuccess: onSuccessProp,
  } = props ?? {};

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<BankAuthorizationsFormValues>({
    defaultValues: {
      ...BANK_AUTHORIZATIONS_DEFAULT_VALUES,
      ...defaultValuesProp,
    },
    mode,
    resolver: zodResolver(bankAuthorizationsSchema),
  });

  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit: rhfHandleSubmit,
    setValue,
  } = form;

  const bankValues = useWatch({
    control,
    name: AVAILABLE_BANKS,
  });

  const isAllBanksSelected = Boolean(
    bankValues && bankValues.length > 0 && bankValues.every(Boolean),
  );

  const toggleAllBanks = useCallback((): void => {
    const currentValues = getValues(AVAILABLE_BANKS);
    const areAllSelected = currentValues.every(Boolean);
    const nextValue = !areAllSelected;

    const options = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    };

    AVAILABLE_BANKS.forEach((bank) => {
      setValue(bank, nextValue, options);
    });
  }, [getValues, setValue]);

  const onValidSubmit = useCallback(
    async (data: BankAuthorizationsFormValues): Promise<void> => {
      setIsSubmitting(true);
      try {
        await onSuccessProp?.(data);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccessProp],
  );

  const handleNext = useCallback(async (): Promise<void> => {
    await rhfHandleSubmit(onValidSubmit)();
  }, [rhfHandleSubmit, onValidSubmit]);

  return {
    control,
    errors,
    form,
    handleNext,
    handleSubmit: handleNext,
    isAllBanksSelected,
    isSubmitting,
    isValid,
    toggleAllBanks,
  };
};
