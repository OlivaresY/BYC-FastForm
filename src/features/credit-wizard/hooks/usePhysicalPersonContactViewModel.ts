import { useTranslation } from '@/shared/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import {
  getCantonOptions,
  getDistrictOptions,
  getProvinceOptions,
} from '../constants/CostaRicaLocations.constants';
import { PhysicalPersonContactSchema } from '../schemas/PhysicalPersonContact.schema';
import type {
  PhysicalPersonContact,
  UsePhysicalPersonContactViewModelProps,
  UsePhysicalPersonContactViewModelReturn,
} from '../types/PhysicalPersonContact.types';
import { normalizePhysicalPersonContactPayload } from '../utils/contactPayloadNormalizer';

export const usePhysicalPersonContactViewModel = (
  props?: UsePhysicalPersonContactViewModelProps,
): UsePhysicalPersonContactViewModelReturn => {
  const { t } = useTranslation();
  const {
    defaultValues: defaultValuesProp,
    mode = 'onChange',
    onSubmit: onSubmitProp,
  } = props ?? {};

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedDefaultValues = useMemo(
    () => normalizePhysicalPersonContactPayload(defaultValuesProp),
    [defaultValuesProp],
  );

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<PhysicalPersonContact>({
    defaultValues: normalizedDefaultValues,
    mode,
    resolver: zodResolver(
      PhysicalPersonContactSchema,
    ) as unknown as Resolver<PhysicalPersonContact>,
  });

  const selectedProvince = useWatch({
    control,
    name: 'residentialAddress.province',
  });
  const selectedCanton = useWatch({
    control,
    name: 'residentialAddress.canton',
  });

  const provinceOptions = useMemo(() => getProvinceOptions(), []);
  const cantonOptions = useMemo(
    () => getCantonOptions(selectedProvince),
    [selectedProvince],
  );
  const districtOptions = useMemo(
    () => getDistrictOptions(selectedProvince, selectedCanton),
    [selectedCanton, selectedProvince],
  );

  const handleProvinceChange = useCallback(
    (province: string): void => {
      setValue('residentialAddress.canton', '', { shouldDirty: true });
      setValue('residentialAddress.district', '', { shouldDirty: true });
      setValue('residentialAddress.province', province, { shouldDirty: true });
    },
    [setValue],
  );

  const handleCantonChange = useCallback(
    (canton: string): void => {
      setValue('residentialAddress.district', '', { shouldDirty: true });
      setValue('residentialAddress.canton', canton, { shouldDirty: true });
    },
    [setValue],
  );

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
          ('commercialReference' in dataOrEvent ||
            'contactInfo' in dataOrEvent ||
            'residentialAddress' in dataOrEvent)
        ) {
          const parseResult =
            PhysicalPersonContactSchema.safeParse(dataOrEvent);
          if (!parseResult.success) {
            throw new Error('Programmatic validation failed');
          }
          await onValidSubmit(parseResult.data);
          return;
        }
        await handleSubmit(onValidSubmit)(dataOrEvent as never);
      } catch {
        setSubmitError(t.creditWizard.step2PhysicalContact.errors.submitFailed);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      handleSubmit,
      onValidSubmit,
      t.creditWizard.step2PhysicalContact.errors.submitFailed,
    ],
  );

  return {
    cantonOptions,
    control,
    districtOptions,
    errors,
    handleCantonChange,
    handleNextStep,
    handleProvinceChange,
    handleSubmit,
    isSubmitting,
    isValid,
    provinceOptions,
    submitError,
  };
};
