import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
  LEGAL_ENTITY_CONTACT_ERRORS,
} from '../constants/LegalEntityContact.constants';
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      await onSubmitProp?.(data);
    },
    [onSubmitProp],
  );

  const handleNextStep = useCallback(
    async (dataOrEvent?: unknown): Promise<void> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
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
      } catch {
        setSubmitError(LEGAL_ENTITY_CONTACT_ERRORS.SUBMIT_FAILED);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleSubmit, onValidSubmit],
  );

  return {
    control,
    errors,
    handleNextStep,
    handleSubmit,
    isSubmitting,
    isValid,
    submitError,
  };
};
