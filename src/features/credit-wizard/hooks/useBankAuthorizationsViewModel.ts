import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import type { Control, FieldErrors, Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { bankAuthorizationsSchema } from '../schemas/BankAuthorizations.schema';
import type { BankAuthorizationsFormValues } from '../types/BankAuthorizations.types';

export interface UseBankAuthorizationsViewModelProps {
  defaultValues?: Partial<BankAuthorizationsFormValues>;
  mode?: 'all' | 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched';
  onSuccess?: (data: BankAuthorizationsFormValues) => void | Promise<void>;
}

export interface UseBankAuthorizationsViewModelReturn {
  control: Control<BankAuthorizationsFormValues>;
  errors: FieldErrors<BankAuthorizationsFormValues>;
  handleNext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
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

  const {
    control,
    formState: { errors, isValid },
    handleSubmit: rhfHandleSubmit,
  } = useForm<BankAuthorizationsFormValues>({
    defaultValues: {
      acepta_terminos: false,
      autoriza_buro: false,
      autoriza_sugef: false,
      banco_destino: '',
      ...defaultValuesProp,
    },
    mode,
    resolver: zodResolver(
      bankAuthorizationsSchema as never,
    ) as unknown as Resolver<BankAuthorizationsFormValues>,
  });

  const onValidSubmit = useCallback(
    async (data: BankAuthorizationsFormValues): Promise<void> => {
      setIsSubmitting(true);
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 500);
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
    handleNext,
    handleSubmit: handleNext,
    isSubmitting,
    isValid,
  };
};
