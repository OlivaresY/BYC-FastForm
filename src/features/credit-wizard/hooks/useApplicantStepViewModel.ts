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
  LegalApplicantSchema,
  PHYSICAL_APPLICANT_FIELDS,
  PhysicalApplicantSchema,
  sanitizeIdentificationNumber,
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

  const [editingThirdPartyValues, setEditingThirdPartyValues] =
    useState<ThirdPartyBeneficiaryValues | null>(null);
  const [draftErrors, setDraftErrors] = useState<
    Partial<Record<ThirdPartyBeneficiaryField, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isBeneficiaryModalOpen = editingThirdPartyValues !== null;

  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    handleSubmit,
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
      ...(editingThirdPartyValues ?? currentValues.thirdPartyValues),
    }),
    [editingThirdPartyValues, currentValues.thirdPartyValues],
  );

  const isApplicantValid = useMemo<boolean>(() => {
    if (regime === 'physical') {
      return PhysicalApplicantSchema.safeParse(currentValues.physicalValues)
        .success;
    }
    return LegalApplicantSchema.safeParse(currentValues.legalValues).success;
  }, [currentValues.legalValues, currentValues.physicalValues, regime]);

  const isValid = useMemo<boolean>(() => {
    if (!isApplicantValid) {
      return false;
    }
    if (vehicleBeneficiary === 'third_party') {
      const dataToValidate =
        editingThirdPartyValues ?? currentValues.thirdPartyValues;
      return StrictThirdPartyBeneficiarySchema.safeParse({
        ...dataToValidate,
        isThirdPartyRegistration: true,
      }).success;
    }
    return true;
  }, [
    currentValues.thirdPartyValues,
    editingThirdPartyValues,
    isApplicantValid,
    vehicleBeneficiary,
  ]);

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
  }, [errors]);

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
  }, [errors]);

  const thirdPartyErrors = useMemo<
    Partial<Record<ThirdPartyBeneficiaryField, string>>
  >(() => {
    if (editingThirdPartyValues !== null) {
      return draftErrors;
    }
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
  }, [draftErrors, editingThirdPartyValues, errors.thirdPartyValues]);

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
    const saved = getValues('thirdPartyValues');
    const hasSaved = Boolean(saved?.thirdPartyDocNumber);
    setEditingThirdPartyValues(
      hasSaved
        ? { ...saved, isThirdPartyRegistration: true }
        : {
            ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
            isThirdPartyRegistration: true,
          },
    );
  }, [getValues]);

  const closeBeneficiaryModal = useCallback((): void => {
    const saved = getValues('thirdPartyValues');
    const hasSaved = Boolean(saved?.thirdPartyDocNumber);

    if (!hasSaved) {
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
    }

    setDraftErrors({});
    clearErrors('thirdPartyValues');
    setEditingThirdPartyValues(null);
  }, [clearErrors, getValues, setValue]);

  const handleSaveThirdPartyData = useCallback(async (): Promise<boolean> => {
    const draft = {
      ...(editingThirdPartyValues ?? getValues('thirdPartyValues')),
      isThirdPartyRegistration: true as const,
    };

    const parseResult = StrictThirdPartyBeneficiarySchema.safeParse(draft);

    if (parseResult.success) {
      setValue('thirdPartyValues', parseResult.data, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setDraftErrors({});
      clearErrors('thirdPartyValues');
      setEditingThirdPartyValues(null);
      return true;
    }

    const fieldErrors: Partial<Record<ThirdPartyBeneficiaryField, string>> = {};
    parseResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as ThirdPartyBeneficiaryField;
      if (fieldName && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    });

    setDraftErrors(fieldErrors);
    return false;
  }, [clearErrors, editingThirdPartyValues, getValues, setValue]);

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
      setEditingThirdPartyValues((prev) => ({
        ...(prev ??
          getValues('thirdPartyValues') ??
          APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY),
        [field]: value,
      }));
      setDraftErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      clearErrors(`thirdPartyValues.${field}` as never);
    },
    [clearErrors, getValues],
  );

  const onVehicleBeneficiaryChange = useCallback(
    (beneficiary: VehicleBeneficiaryType): void => {
      setValue('vehicleBeneficiary', beneficiary, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (beneficiary === 'third_party') {
        const saved = getValues('thirdPartyValues');
        const hasSaved = Boolean(saved?.thirdPartyDocNumber);
        const nextThirdPartyValues = hasSaved
          ? { ...saved, isThirdPartyRegistration: true as const }
          : {
              ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
              isThirdPartyRegistration: true as const,
            };
        setValue('thirdPartyValues', nextThirdPartyValues, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        setEditingThirdPartyValues(nextThirdPartyValues);
      } else {
        setValue(
          'thirdPartyValues',
          APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          },
        );
        setDraftErrors({});
        clearErrors('thirdPartyValues');
        setEditingThirdPartyValues(null);
      }
    },
    [clearErrors, getValues, setValue],
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
    (dataOrEvent?: unknown): Promise<void> => {
      if (editingThirdPartyValues !== null) {
        const parseResult = StrictThirdPartyBeneficiarySchema.safeParse({
          ...editingThirdPartyValues,
          isThirdPartyRegistration: true,
        });
        if (parseResult.success) {
          setValue('thirdPartyValues', parseResult.data, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
          setDraftErrors({});
          setEditingThirdPartyValues(null);
        }
      }

      return handleSubmit(onValidSubmit, (fieldErrors) => {
        if (fieldErrors.thirdPartyValues) {
          const raw = fieldErrors.thirdPartyValues as Partial<
            Record<ThirdPartyBeneficiaryField, { message?: string }>
          >;
          const newDraftErrors: Partial<
            Record<ThirdPartyBeneficiaryField, string>
          > = {};
          THIRD_PARTY_BENEFICIARY_FIELDS.forEach((field) => {
            if (raw[field]?.message) {
              newDraftErrors[field] = raw[field]!.message;
            }
          });
          setDraftErrors(newDraftErrors);
          const saved = getValues('thirdPartyValues');
          setEditingThirdPartyValues({
            ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
            ...saved,
            isThirdPartyRegistration: true,
          });
        }
      })(dataOrEvent as React.BaseSyntheticEvent | undefined);
    },
    [
      editingThirdPartyValues,
      getValues,
      handleSubmit,
      onValidSubmit,
      setValue,
    ],
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
