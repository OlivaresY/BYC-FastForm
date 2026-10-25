import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { LEGAL_ENTITY_CONTACT_DEFAULT_VALUES } from '../constants/LegalEntityContact.constants';
import { LegalEntityContactSchema } from '../schemas/LegalEntityContact.schema';
import type {
  LegalEntityContact,
  UseLegalEntityContactViewModelProps,
  UseLegalEntityContactViewModelReturn,
} from '../types/LegalEntityContact.types';

export const useLegalEntityContactViewModel = (
  props?: UseLegalEntityContactViewModelProps,
): UseLegalEntityContactViewModelReturn => {
  const {
    defaultValues: defaultValuesProp,
    mode = 'onChange',
    onSubmit: onSubmitProp,
  } = props ?? {};

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LegalEntityContact>({
    defaultValues: {
      ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
      ...defaultValuesProp,
    },
    mode,
    resolver: zodResolver(LegalEntityContactSchema),
  });

  const onValidSubmit = useCallback(
    async (data: LegalEntityContact): Promise<void> => {
      try {
        await onSubmitProp?.(data);
      } catch (error) {
        throw error;
      }
    },
    [onSubmitProp],
  );

  const handleNextStep = useCallback(
    async (dataOrEvent?: unknown): Promise<void> => {
      if (
        dataOrEvent &&
        typeof dataOrEvent === 'object' &&
        'corporateId' in dataOrEvent &&
        'corporateName' in dataOrEvent
      ) {
        const parseResult = LegalEntityContactSchema.safeParse(dataOrEvent);
        if (!parseResult.success) {
          throw new Error('Programmatic validation failed');
        }
        await onValidSubmit(parseResult.data);
        return;
      }
      await handleSubmit(onValidSubmit)(dataOrEvent as never);
    },
    [handleSubmit, onValidSubmit],
  );

  return {
    control,
    errors,
    handleNextStep,
    handleSubmit,
    isValid,
  };
};
