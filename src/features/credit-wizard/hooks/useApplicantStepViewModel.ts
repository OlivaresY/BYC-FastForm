import { useCallback, useMemo, useState } from 'react';
import { APPLICANT_STEP_VIEW_DEFAULT_VALUES } from '../constants/ApplicantStepView.constants';
import {
  LEGAL_APPLICANT_FIELDS,
  LegalApplicantSchema,
  LegalIdentificationNumberSchema,
  mapIssuesToFieldErrors,
  normalizeThirdPartyBirthDate,
  PHYSICAL_APPLICANT_FIELDS,
  PhysicalApplicantSchema,
  PhysicalIdentificationNumberSchema,
  THIRD_PARTY_BENEFICIARY_FIELDS,
  ThirdPartyBeneficiarySchema,
} from '../types/ApplicantStepView.schema';
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
  ThirdPartyBeneficiaryField,
  ThirdPartyBeneficiaryValues,
  UseApplicantStepViewModelProps,
  UseApplicantStepViewModelReturn,
} from '../types/ApplicantStepView.types';

export const useApplicantStepViewModel = (
  props?: UseApplicantStepViewModelProps,
): UseApplicantStepViewModelReturn => {
  const {
    initialLegalValues,
    initialPhysicalValues,
    initialRegime,
    initialThirdPartyValues,
    initialVehicleBeneficiary,
    onSubmit: onSubmitProp,
  } = props ?? {};

  const [regime, setRegime] = useState<LegalEntityType>(
    initialRegime ?? 'physical',
  );

  const [physicalValues, setPhysicalValues] =
    useState<PhysicalPersonFormValues>({
      ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.PHYSICAL,
      ...initialPhysicalValues,
    });

  const [legalValues, setLegalValues] = useState<LegalEntityFormValues>({
    ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.LEGAL,
    ...initialLegalValues,
  });

  const [vehicleBeneficiary, setVehicleBeneficiary] =
    useState<VehicleBeneficiaryType>(
      initialVehicleBeneficiary ?? 'same_holder',
    );

  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] =
    useState<boolean>(false);

  const [thirdPartyValues, setThirdPartyValues] =
    useState<ThirdPartyBeneficiaryValues>({
      ...APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY,
      ...(initialVehicleBeneficiary === 'third_party'
        ? { isThirdPartyRegistration: true }
        : {}),
      ...initialThirdPartyValues,
    });

  const [physicalErrors, setPhysicalErrors] = useState<
    Partial<Record<PhysicalPersonFormField, string>>
  >({});

  const [legalErrors, setLegalErrors] = useState<
    Partial<Record<LegalEntityFormField, string>>
  >({});

  const [thirdPartyErrors, setThirdPartyErrors] = useState<
    Partial<Record<ThirdPartyBeneficiaryField, string>>
  >({});

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

  const isValid = regime === 'physical' ? isPhysicalValid : isLegalValid;

  // ===========================================================================
  // Modal Handlers
  // ===========================================================================

  const openBeneficiaryModal = useCallback((): void => {
    setIsBeneficiaryModalOpen(true);
  }, []);

  const closeBeneficiaryModal = useCallback((): void => {
    setIsBeneficiaryModalOpen(false);
  }, []);

  // ===========================================================================
  // Form Handlers
  // ===========================================================================

  const onRegimeChange = useCallback((newRegime: LegalEntityType): void => {
    setRegime(newRegime);
  }, []);

  const onPhysicalFieldChange = useCallback(
    <K extends PhysicalPersonFormField>(
      field: K,
      value: PhysicalPersonFormValues[K],
    ): void => {
      setPhysicalValues((prev) => ({ ...prev, [field]: value }));
      setPhysicalErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  const onLegalFieldChange = useCallback(
    <K extends LegalEntityFormField>(
      field: K,
      value: LegalEntityFormValues[K],
    ): void => {
      setLegalValues((prev) => ({ ...prev, [field]: value }));
      setLegalErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  const onThirdPartyFieldChange = useCallback(
    <K extends ThirdPartyBeneficiaryField>(
      field: K,
      value: ThirdPartyBeneficiaryValues[K],
    ): void => {
      setThirdPartyValues((prev) => ({ ...prev, [field]: value }));
      setThirdPartyErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  const onVehicleBeneficiaryChange = useCallback(
    (beneficiary: VehicleBeneficiaryType): void => {
      setVehicleBeneficiary(beneficiary);

      if (beneficiary === 'third_party') {
        setThirdPartyValues((prev) => ({
          ...prev,
          isThirdPartyRegistration: true,
        }));
        openBeneficiaryModal();
      } else {
        setThirdPartyValues(APPLICANT_STEP_VIEW_DEFAULT_VALUES.THIRD_PARTY);
        setThirdPartyErrors({});
        closeBeneficiaryModal();
      }
    },
    [closeBeneficiaryModal, openBeneficiaryModal],
  );

  const onSubmit = useCallback((): void => {
    const isThirdParty = vehicleBeneficiary === 'third_party';
    let hasValidationErrors = false;

    if (isThirdParty) {
      const thirdPartyResult = ThirdPartyBeneficiarySchema.safeParse({
        ...thirdPartyValues,
        isThirdPartyRegistration: true,
        thirdPartyBirthDate: normalizeThirdPartyBirthDate(
          thirdPartyValues.thirdPartyBirthDate,
        ),
      });

      if (!thirdPartyResult.success) {
        setThirdPartyErrors(
          mapIssuesToFieldErrors(
            thirdPartyResult.error.issues,
            THIRD_PARTY_BENEFICIARY_FIELDS,
          ),
        );
        openBeneficiaryModal();
        hasValidationErrors = true;
      }
    }

    if (regime === 'physical') {
      const physicalResult = PhysicalApplicantSchema.safeParse(physicalValues);

      if (!physicalResult.success) {
        setPhysicalErrors(
          mapIssuesToFieldErrors(
            physicalResult.error.issues,
            PHYSICAL_APPLICANT_FIELDS,
          ),
        );
        hasValidationErrors = true;
      }
    } else {
      const legalResult = LegalApplicantSchema.safeParse(legalValues);

      if (!legalResult.success) {
        setLegalErrors(
          mapIssuesToFieldErrors(
            legalResult.error.issues,
            LEGAL_APPLICANT_FIELDS,
          ),
        );
        hasValidationErrors = true;
      }
    }

    if (hasValidationErrors) {
      return;
    }

    const thirdPartyPayload = isThirdParty
      ? { ...thirdPartyValues, isThirdPartyRegistration: true }
      : {};

    onSubmitProp?.(
      regime === 'physical'
        ? {
            regime: 'physical',
            values: physicalValues,
            vehicleBeneficiary,
            ...thirdPartyPayload,
          }
        : {
            regime: 'legal',
            values: legalValues,
            vehicleBeneficiary,
            ...thirdPartyPayload,
          },
    );
  }, [
    legalValues,
    onSubmitProp,
    openBeneficiaryModal,
    physicalValues,
    regime,
    thirdPartyValues,
    vehicleBeneficiary,
  ]);

  return {
    closeBeneficiaryModal,
    isBeneficiaryModalOpen,
    isIdentificationValid,
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
    thirdPartyErrors,
    thirdPartyValues,
    vehicleBeneficiary,
  };
};
