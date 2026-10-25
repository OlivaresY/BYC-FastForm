import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { PHYSICAL_PERSON_CONTACT_DEFAULT_VALUES } from '../constants/PhysicalPersonContact.constants';
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
