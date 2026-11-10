import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import type {
  Control,
  FieldErrors,
  Resolver,
  UseFormReturn,
} from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import { bankAuthorizationsSchema } from '../schemas/BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

const SUBMIT_DELAY_MS = 500;

export const BANK_AUTHORIZATIONS_DEFAULT_VALUES: BankAuthorizationsFormValues =
  {
    autoriza_buros_credito: false,
    autoriza_sugef_cic: false,
    banco_bac: false,
    banco_bncr: false,
    banco_carro_facil: false,
    banco_promerica: false,
    banco_scotiabank: false,
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
    resolver: zodResolver(
      bankAuthorizationsSchema as never,
    ) as unknown as Resolver<BankAuthorizationsFormValues>,
  });

  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit: rhfHandleSubmit,
    setValue,
  } = form;

  const [
    bancoBac,
    bancoBncr,
    bancoCarroFacil,
    bancoPromerica,
    bancoScotiabank,
  ] = useWatch({
    control,
    name: [
      'banco_bac',
      'banco_bncr',
      'banco_carro_facil',
      'banco_promerica',
      'banco_scotiabank',
    ],
  });

  const isAllBanksSelected = Boolean(
    bancoBac &&
      bancoBncr &&
      bancoCarroFacil &&
      bancoPromerica &&
      bancoScotiabank,
  );

  const toggleAllBanks = useCallback((): void => {
    const currentValues = getValues([
      'banco_bac',
      'banco_bncr',
      'banco_carro_facil',
      'banco_promerica',
      'banco_scotiabank',
    ]);
    const areAllSelected = currentValues.every(Boolean);
    const nextValue = !areAllSelected;

    const options = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    };

    setValue('banco_bac', nextValue, options);
    setValue('banco_bncr', nextValue, options);
    setValue('banco_carro_facil', nextValue, options);
    setValue('banco_promerica', nextValue, options);
    setValue('banco_scotiabank', nextValue, options);
  }, [getValues, setValue]);

  const onValidSubmit = useCallback(
    async (data: BankAuthorizationsFormValues): Promise<void> => {
      setIsSubmitting(true);
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, SUBMIT_DELAY_MS);
        });
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
