import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import {
  getCantonOptions,
  getDistrictOptions,
  getProvinceOptions,
} from '../constants/CostaRicaLocations.constants';
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
    setValue,
  } = useForm<LegalEntityContact>({
    defaultValues: {
      ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES,
      ...defaultValuesProp,
      commercialActivity: {
        ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialActivity,
        ...defaultValuesProp?.commercialActivity,
      },
      commercialAddress: {
        ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialAddress,
        ...defaultValuesProp?.commercialAddress,
      },
      commercialReference: {
        ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.commercialReference,
        ...defaultValuesProp?.commercialReference,
      },
      contactInfo: {
        ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.contactInfo,
        ...defaultValuesProp?.contactInfo,
      },
      financialStatements: {
        ...LEGAL_ENTITY_CONTACT_DEFAULT_VALUES.financialStatements,
        ...defaultValuesProp?.financialStatements,
      },
    },
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
        setSubmitError(LEGAL_ENTITY_CONTACT_ERRORS.SUBMIT_FAILED);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleSubmit, onValidSubmit],
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
