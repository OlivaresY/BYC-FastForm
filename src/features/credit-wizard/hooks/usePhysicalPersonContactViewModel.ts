import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
  PHYSICAL_PERSON_CONTACT_ERRORS,
} from '../constants/PhysicalPersonContact.constants';
import { PhysicalPersonContactSchema } from '../schemas/PhysicalPersonContact.schema';
import type {
  PhysicalPersonContact,
  UsePhysicalPersonContactViewModelProps,
  UsePhysicalPersonContactViewModelReturn,
} from '../types/PhysicalPersonContact.types';

export const usePhysicalPersonContactViewModel = (
  props?: UsePhysicalPersonContactViewModelProps,
): UsePhysicalPersonContactViewModelReturn => {
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
  } = useForm<PhysicalPersonContact>({
    defaultValues: {
      ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES,
      ...defaultValuesProp,
      contactInfo: {
        ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.contactInfo,
        ...defaultValuesProp?.contactInfo,
      },
      employmentData: {
        ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.employmentData,
        ...defaultValuesProp?.employmentData,
      },
      financialCapacity: {
        ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.financialCapacity,
        ...defaultValuesProp?.financialCapacity,
      },
      residentialAddress: {
        ...PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES.residentialAddress,
        ...defaultValuesProp?.residentialAddress,
      },
    },
    mode,
    resolver: zodResolver(PhysicalPersonContactSchema),
  });

  const onValidSubmit = useCallback(
    async (data: PhysicalPersonContact): Promise<void> => {
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
          'contactInfo' in dataOrEvent &&
          'residentialAddress' in dataOrEvent
        ) {
          const parseResult = PhysicalPersonContactSchema.safeParse(dataOrEvent);
          if (!parseResult.success) {
            throw new Error('Programmatic validation failed');
          }
          await onValidSubmit(parseResult.data);
          return;
        }
        await handleSubmit(onValidSubmit)(dataOrEvent as never);
      } catch {
        setSubmitError(PHYSICAL_PERSON_CONTACT_ERRORS.SUBMIT_FAILED);
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
