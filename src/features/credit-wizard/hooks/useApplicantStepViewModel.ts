import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
  APPLICANT_STEP_VIEW_NUMERICAL,
} from '../constants/ApplicantStepView.constants';
import {
  ApplicantStepFormStateSchema,
  LEGAL_APPLICANT_FIELDS,
  PHYSICAL_APPLICANT_FIELDS,
  sanitizeIdentificationNumber,
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
        return {
          ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
          ...initialThirdPartyValues,
          isThirdPartyRegistration: true,
        };
      }
      return null;
    });

  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    setValue,
    trigger,
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
    mode: mode ?? 'onChange',
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
  // Error Mapping & Identification Validation
  // ===========================================================================

  const physicalErrors = useMemo<
    Partial<Record<PhysicalPersonFormField, string>>
  >(() => {
    const fieldErrors: Partial<Record<PhysicalPersonFormField, string>> = {};
    if (errors.physicalValues) {
      const raw = errors.physicalValues as Partial<
        Record<PhysicalPersonFormField, { message?: string }>
      >;
      PHYSICAL_APPLICANT_FIELDS.forEach((field) => {
        if (raw[field]?.message) {
          fieldErrors[field] = raw[field]!.message;
        }
      });
    }
    return fieldErrors;
  }, [errors.physicalValues]);

  const legalErrors = useMemo<
    Partial<Record<LegalEntityFormField, string>>
  >(() => {
    const fieldErrors: Partial<Record<LegalEntityFormField, string>> = {};
    if (errors.legalValues) {
      const raw = errors.legalValues as Partial<
        Record<LegalEntityFormField, { message?: string }>
      >;
      LEGAL_APPLICANT_FIELDS.forEach((field) => {
        if (raw[field]?.message) {
          fieldErrors[field] = raw[field]!.message;
        }
      });
    }
    return fieldErrors;
  }, [errors.legalValues]);

  const thirdPartyErrors = useMemo<
    Partial<Record<ThirdPartyBeneficiaryField, string>>
  >(() => {
    const fieldErrors: Partial<Record<ThirdPartyBeneficiaryField, string>> = {};
    if (errors.thirdPartyValues) {
      const raw = errors.thirdPartyValues as Partial<
        Record<ThirdPartyBeneficiaryField, { message?: string }>
      >;
      THIRD_PARTY_BENEFICIARY_FIELDS.forEach((field) => {
        if (raw[field]?.message) {
          fieldErrors[field] = raw[field]!.message;
        }
      });
    }
    return fieldErrors;
  }, [errors.thirdPartyValues]);

  const isPhysicalIdentificationValid =
    sanitizeIdentificationNumber(physicalValues.identificationNumber).length >=
    APPLICANT_STEP_VIEW_NUMERICAL.MIN_PHYSICAL_ID_LENGTH;

  const isLegalIdentificationValid =
    sanitizeIdentificationNumber(legalValues.identificationNumber).length >=
    APPLICANT_STEP_VIEW_NUMERICAL.MIN_LEGAL_ID_LENGTH;

  const isIdentificationValid =
    regime === 'physical'
      ? isPhysicalIdentificationValid
      : isLegalIdentificationValid;

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
      setIsBeneficiaryModalOpen(false);
    }
  }, [savedThirdPartyValues, setValue]);

  const handleSaveThirdPartyData = useCallback(async (): Promise<boolean> => {
    setValue('thirdPartyValues.isThirdPartyRegistration', true, {
      shouldDirty: true,
      shouldTouch: true,
    });
    const isThirdPartyValid = await trigger('thirdPartyValues');
    if (isThirdPartyValid) {
      setSavedThirdPartyValues(getValues('thirdPartyValues'));
      setIsBeneficiaryModalOpen(false);
      return true;
    }
    return false;
  }, [getValues, setValue, trigger]);

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
      setValue(`physicalValues.${field}` as never, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onLegalFieldChange = useCallback(
    <K extends LegalEntityFormField>(
      field: K,
      value: LegalEntityFormValues[K],
    ): void => {
      setValue(`legalValues.${field}` as never, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onThirdPartyFieldChange = useCallback(
    <K extends ThirdPartyBeneficiaryField>(
      field: K,
      value: ThirdPartyBeneficiaryValues[K],
    ): void => {
      setValue(`thirdPartyValues.${field}` as never, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onVehicleBeneficiaryChange = useCallback(
    (beneficiary: VehicleBeneficiaryType): void => {
      setValue('vehicleBeneficiary', beneficiary, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (beneficiary === 'third_party') {
        if (savedThirdPartyValues !== null) {
          setValue('thirdPartyValues', savedThirdPartyValues, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        } else {
          setValue('thirdPartyValues.isThirdPartyRegistration', true, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
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
            shouldValidate: true,
          },
        );
        setIsBeneficiaryModalOpen(false);
      }
    },
    [savedThirdPartyValues, setValue],
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

  const handleNextStep = handleSubmit(onValidSubmit, (fieldErrors) => {
    if (fieldErrors.thirdPartyValues) {
      setIsBeneficiaryModalOpen(true);
    }
  });

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
