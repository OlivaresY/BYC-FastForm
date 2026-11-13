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
import { LegalEntityContactSchema } from '../schemas/LegalEntityContact.schema';
import type {
  LegalEntityContact,
  UseLegalEntityContactViewModelProps,
  UseLegalEntityContactViewModelReturn,
} from '../types/LegalEntityContact.types';
import { normalizeLegalEntityContactPayload } from '../utils/contactPayloadNormalizer';

export const useLegalEntityContactViewModel = (
  props?: UseLegalEntityContactViewModelProps,
): UseLegalEntityContactViewModelReturn => {
  const { t } = useTranslation();
  const {
    defaultValues: defaultValuesProp,
    mode = 'onChange',
    onSubmit: onSubmitProp,
  } = props ?? {};

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedDefaultValues = useMemo(
    () => normalizeLegalEntityContactPayload(defaultValuesProp),
    [defaultValuesProp],
  );

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<LegalEntityContact>({
    defaultValues: normalizedDefaultValues,
    mode,
    resolver: zodResolver(
      LegalEntityContactSchema,
    ) as unknown as Resolver<LegalEntityContact>,
  });

  const selectedProvince = useWatch({
    control,
    name: 'commercialAddress.province',
  });
  const selectedCanton = useWatch({
    control,
    name: 'commercialAddress.canton',
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
      setValue('commercialAddress.canton', '', { shouldDirty: true });
      setValue('commercialAddress.district', '', { shouldDirty: true });
      setValue('commercialAddress.province', province, { shouldDirty: true });
    },
    [setValue],
  );

  const handleCantonChange = useCallback(
    (canton: string): void => {
      setValue('commercialAddress.district', '', { shouldDirty: true });
      setValue('commercialAddress.canton', canton, { shouldDirty: true });
    },
    [setValue],
  );

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
          ('commercialActivity' in dataOrEvent ||
            'commercialAddress' in dataOrEvent ||
            'commercialReference' in dataOrEvent ||
            'contactInfo' in dataOrEvent ||
            'financialStatements' in dataOrEvent)
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
        setSubmitError(t.creditWizard.step2LegalContact.errors.submitFailed);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      handleSubmit,
      onValidSubmit,
      t.creditWizard.step2LegalContact.errors.submitFailed,
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
