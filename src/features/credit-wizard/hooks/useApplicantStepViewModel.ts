import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
} from '../constants/ApplicantStepView.constants';
import {
  ApplicantStepFormStateSchema,
  LEGAL_APPLICANT_FIELDS,
  LegalApplicantSchema,
  LegalIdentificationNumberSchema,
  PHYSICAL_APPLICANT_FIELDS,
  PhysicalApplicantSchema,
  PhysicalIdentificationNumberSchema,
  StrictThirdPartyBeneficiarySchema,
  THIRD_PARTY_BENEFICIARY_FIELDS,
} from '../schemas/ApplicantStepView.schema';
import type { LegalEntityType } from '../types/LegalEntitySelector.types';
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from '../types/LegalEntityForm.types';
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from '../types/PhysicalPersonForm.types';
import type { VehicleBeneficiaryType } from '../types/VehicleBeneficiarySection.types';
import type {
  ApplicantStepData,
  ApplicantStepFormValues,
  ThirdPartyBeneficiaryField,
  ThirdPartyBeneficiaryValues,
  UseApplicantStepViewModelProps,
  UseApplicantStepViewModelReturn,
} from '../types/ApplicantStepView.types';

export type { ApplicantStepFormValues };

export const useApplicantStepViewModel = (
  props?: UseApplicantStepViewModelProps,
): UseApplicantStepViewModelReturn => {
  const {
    initialLegalValues,
    initialPhysicalValues,
    initialRegime,
    initialThirdPartyValues,
    initialVehicleBeneficiary,
    mode,
    onSubmit: onSubmitProp,
  } = props ?? {};

  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [savedThirdPartyValues, setSavedThirdPartyValues] =
    useState<ThirdPartyBeneficiaryValues | null>(() => {
      if (
        initialVehicleBeneficiary === 'third_party' &&
        initialThirdPartyValues
      ) {
        const candidate: ThirdPartyBeneficiaryValues = {
          ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
          ...initialThirdPartyValues,
          isThirdPartyRegistration: true,
        };
        if (StrictThirdPartyBeneficiarySchema.safeParse(candidate).success) {
          return candidate;
        }
      }
      return null;
    });

  const {
    clearErrors,
    control,
    formState: { errors, isValid: isFormValid },
    getValues,
    handleSubmit,
    setError,
    setValue,
  } = useForm<ApplicantStepFormValues>({
    defaultValues: {
      legalValues: {
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
        ...initialLegalValues,
      },
      physicalValues: {
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
        ...initialPhysicalValues,
      },
      regime: initialRegime ?? 'physical',
      thirdPartyValues: {
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
        ...(initialVehicleBeneficiary === 'third_party'
          ? { isThirdPartyRegistration: true }
          : {}),
        ...initialThirdPartyValues,
      },
      vehicleBeneficiary: initialVehicleBeneficiary ?? 'same_holder',
    },
    mode: mode ?? 'onSubmit',
    resolver: zodResolver(ApplicantStepFormStateSchema),
  });

  const currentValues = useWatch({ control });

  const regime = currentValues.regime ?? initialRegime ?? 'physical';
  const vehicleBeneficiary =
    currentValues.vehicleBeneficiary ??
    initialVehicleBeneficiary ??
    'same_holder';
  const physicalValues = useMemo<PhysicalPersonFormValues>(
    () =>
      ({
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
        ...currentValues.physicalValues,
      }) as PhysicalPersonFormValues,
    [currentValues.physicalValues],
  );

  const legalValues = useMemo<LegalEntityFormValues>(
    () =>
      ({
        ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
        ...currentValues.legalValues,
      }) as LegalEntityFormValues,
    [currentValues.legalValues],
  );

  const thirdPartyValues = useMemo<ThirdPartyBeneficiaryValues>(
    () => ({
      ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
      ...currentValues.thirdPartyValues,
    }),
    [currentValues.thirdPartyValues],
  );

  // ===========================================================================
  // Validation Computations
  // ===========================================================================

  const isPhysicalIdentificationValid = useMemo<boolean>(
    () =>
      PhysicalIdentificationNumberSchema.safeParse(
        physicalValues.identificationNumber,
      ).success,
    [physicalValues.identificationNumber],
  );

  const isLegalIdentificationValid = useMemo<boolean>(
    () =>
      LegalIdentificationNumberSchema.safeParse(
        legalValues.identificationNumber,
      ).success,
    [legalValues.identificationNumber],
  );

  const isIdentificationValid =
    regime === 'physical'
      ? isPhysicalIdentificationValid
      : isLegalIdentificationValid;

  const isPhysicalValid = useMemo<boolean>(
    () => PhysicalApplicantSchema.safeParse(physicalValues).success,
    [physicalValues],
  );

  const isLegalValid = useMemo<boolean>(
    () => LegalApplicantSchema.safeParse(legalValues).success,
    [legalValues],
  );

  const isApplicantValid =
    regime === 'physical' ? isPhysicalValid : isLegalValid;

  const isThirdPartyValid = useMemo<boolean>(() => {
    if (vehicleBeneficiary !== 'third_party') {
      return true;
    }

    return StrictThirdPartyBeneficiarySchema.safeParse({
      ...thirdPartyValues,
      isThirdPartyRegistration: true,
    }).success;
  }, [thirdPartyValues, vehicleBeneficiary]);

  const isValid =
    (isFormValid || (isApplicantValid && isThirdPartyValid)) &&
    isApplicantValid &&
    isThirdPartyValid;

  const physicalErrors: Partial<Record<PhysicalPersonFormField, string>> = {};
  if (errors.physicalValues) {
    const raw = errors.physicalValues as Partial<
      Record<PhysicalPersonFormField, { message?: string }>
    >;
    PHYSICAL_APPLICANT_FIELDS.forEach((field) => {
      if (raw[field]?.message) {
        physicalErrors[field] = raw[field]!.message;
      }
    });
  }

  const legalErrors: Partial<Record<LegalEntityFormField, string>> = {};
  if (errors.legalValues) {
    const raw = errors.legalValues as Partial<
      Record<LegalEntityFormField, { message?: string }>
    >;
    LEGAL_APPLICANT_FIELDS.forEach((field) => {
      if (raw[field]?.message) {
        legalErrors[field] = raw[field]!.message;
      }
    });
  }

  const thirdPartyErrors: Partial<Record<ThirdPartyBeneficiaryField, string>> =
    {};
  if (errors.thirdPartyValues) {
    const raw = errors.thirdPartyValues as Partial<
      Record<ThirdPartyBeneficiaryField, { message?: string }>
    >;
    THIRD_PARTY_BENEFICIARY_FIELDS.forEach((field) => {
      if (raw[field]?.message) {
        thirdPartyErrors[field] = raw[field]!.message;
      }
    });
  }

  // ===========================================================================
  // Modal Handlers
  // ===========================================================================

  const openBeneficiaryModal = useCallback((): void => {
    setIsBeneficiaryModalOpen(true);
  }, []);

  const closeBeneficiaryModal = useCallback((): void => {
    if (savedThirdPartyValues !== null) {
      setValue('thirdPartyValues', savedThirdPartyValues, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      clearErrors('thirdPartyValues');
      setIsBeneficiaryModalOpen(false);
    } else {
      setValue('vehicleBeneficiary', 'same_holder', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue(
        'thirdPartyValues',
        APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );
      clearErrors('thirdPartyValues');
      setIsBeneficiaryModalOpen(false);
    }
  }, [clearErrors, savedThirdPartyValues, setValue]);

  const handleSaveThirdPartyData = useCallback((): boolean => {
    const currentThirdParty = getValues('thirdPartyValues');
    const candidate: ThirdPartyBeneficiaryValues = {
      ...currentThirdParty,
      isThirdPartyRegistration: true,
    };
    const result = StrictThirdPartyBeneficiarySchema.safeParse(candidate);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const [field] = issue.path;
        if (typeof field === 'string') {
          setError(
            `thirdPartyValues.${field as ThirdPartyBeneficiaryField}` as const,
            {
              message: issue.message,
              type: 'manual',
            },
          );
        }
      });
      return false;
    }

    clearErrors('thirdPartyValues');
    setValue('thirdPartyValues', candidate, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setSavedThirdPartyValues(candidate);
    setIsBeneficiaryModalOpen(false);
    return true;
  }, [clearErrors, getValues, setError, setValue]);

  // ===========================================================================
  // Form Handlers
  // ===========================================================================

  const onRegimeChange = useCallback(
    (newRegime: LegalEntityType): void => {
      setValue('regime', newRegime, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onPhysicalFieldChange = useCallback(
    <K extends PhysicalPersonFormField>(
      field: K,
      value: PhysicalPersonFormValues[K],
    ): void => {
      const next = {
        ...getValues('physicalValues'),
        [field]: value,
      };
      setValue('physicalValues', next, {
        shouldDirty: true,
        shouldTouch: true,
      });
      clearErrors(`physicalValues.${field}` as const);
    },
    [clearErrors, getValues, setValue],
  );

  const onLegalFieldChange = useCallback(
    <K extends LegalEntityFormField>(
      field: K,
      value: LegalEntityFormValues[K],
    ): void => {
      const next = {
        ...getValues('legalValues'),
        [field]: value,
      };
      setValue('legalValues', next, {
        shouldDirty: true,
        shouldTouch: true,
      });
      clearErrors(`legalValues.${field}` as const);
    },
    [clearErrors, getValues, setValue],
  );

  const onThirdPartyFieldChange = useCallback(
    <K extends ThirdPartyBeneficiaryField>(
      field: K,
      value: ThirdPartyBeneficiaryValues[K],
    ): void => {
      const next = {
        ...getValues('thirdPartyValues'),
        [field]: value,
      };
      setValue('thirdPartyValues', next, {
        shouldDirty: true,
        shouldTouch: true,
      });
      clearErrors(`thirdPartyValues.${field}` as const);
    },
    [clearErrors, getValues, setValue],
  );

  const onVehicleBeneficiaryChange = useCallback(
    (beneficiary: VehicleBeneficiaryType): void => {
      setValue('vehicleBeneficiary', beneficiary, {
        shouldDirty: true,
        shouldTouch: true,
      });

      if (beneficiary === 'third_party') {
        if (savedThirdPartyValues !== null) {
          setValue('thirdPartyValues', savedThirdPartyValues, {
            shouldDirty: true,
            shouldTouch: true,
          });
        } else {
          setValue(
            'thirdPartyValues',
            {
              ...getValues('thirdPartyValues'),
              isThirdPartyRegistration: true,
            },
            {
              shouldDirty: true,
              shouldTouch: true,
            },
          );
        }
        setIsBeneficiaryModalOpen(true);
      } else {
        setSavedThirdPartyValues(null);
        setValue(
          'thirdPartyValues',
          APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
          {
            shouldDirty: true,
            shouldTouch: true,
          },
        );
        clearErrors('thirdPartyValues');
        setIsBeneficiaryModalOpen(false);
      }
    },
    [clearErrors, getValues, savedThirdPartyValues, setValue],
  );

  const onValidSubmit = useCallback(
    async (validData: ApplicantStepFormValues): Promise<void> => {
      const isThirdParty = validData.vehicleBeneficiary === 'third_party';

      const payload: ApplicantStepData = isThirdParty
        ? ({
            regime: validData.regime,
            values:
              validData.regime === 'physical'
                ? validData.physicalValues
                : validData.legalValues,
            vehicleBeneficiary: 'third_party',
            ...validData.thirdPartyValues,
            isThirdPartyRegistration: true,
          } as ApplicantStepData)
        : ({
            regime: validData.regime,
            values:
              validData.regime === 'physical'
                ? validData.physicalValues
                : validData.legalValues,
            vehicleBeneficiary: 'same_holder',
          } as ApplicantStepData);

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const maybePromise = onSubmitProp?.(payload);
        if (
          maybePromise &&
          typeof (maybePromise as Promise<void>).then === 'function'
        ) {
          await maybePromise;
        }
      } catch {
        setSubmitError(APPLICANT_STEP_VIEW_ERRORS.SUBMIT_FAILED);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmitProp],
  );

  const handleNextStep = useCallback(
    async (dataOrEvent?: unknown): Promise<void> => {
      if (
        dataOrEvent &&
        typeof dataOrEvent === 'object' &&
        'regime' in dataOrEvent &&
        'vehicleBeneficiary' in dataOrEvent
      ) {
        await onValidSubmit(dataOrEvent as ApplicantStepFormValues);
        return;
      }

      await handleSubmit(onValidSubmit, (fieldErrors) => {
        if (fieldErrors.thirdPartyValues) {
          setIsBeneficiaryModalOpen(true);
        }
      })(dataOrEvent as never);
    },
    [handleSubmit, onValidSubmit],
  );

  const onSubmit = useCallback((): Promise<void> => {
    return handleNextStep();
  }, [handleNextStep]);

  return {
    closeBeneficiaryModal,
    handleNextStep,
    handleSaveThirdPartyData,
    isBeneficiaryModalOpen,
    isIdentificationValid,
    isSubmitting,
    isValid,
    legalErrors,
    legalValues,
    onLegalFieldChange,
    onPhysicalFieldChange,
    onRegimeChange,
    onSubmit,
    onThirdPartyFieldChange,
    onVehicleBeneficiaryChange,
    openBeneficiaryModal,
    physicalErrors,
    physicalValues,
    regime,
    submitError,
    thirdPartyErrors,
    thirdPartyValues,
    vehicleBeneficiary,
  };
};
