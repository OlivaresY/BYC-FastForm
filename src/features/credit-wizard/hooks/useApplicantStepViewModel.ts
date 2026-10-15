import { useCallback, useMemo, useState } from "react";
import {
  APPLICANT_STEP_VIEW_DEFAULT_VALUES,
  APPLICANT_STEP_VIEW_ERRORS,
  APPLICANT_STEP_VIEW_NUMERICAL,
} from "../constants/ApplicantStepView.constants";
import type { LegalEntityType } from "../types/LegalEntitySelector.types";
import type {
  LegalEntityFormField,
  LegalEntityFormValues,
} from "../types/LegalEntityForm.types";
import type {
  PhysicalPersonFormField,
  PhysicalPersonFormValues,
} from "../types/PhysicalPersonForm.types";
import type { VehicleBeneficiaryType } from "../types/VehicleBeneficiarySection.types";
import type {
  UseApplicantStepViewModelProps,
  UseApplicantStepViewModelReturn,
} from "../types/ApplicantStepView.types";

export const useApplicantStepViewModel = (
  props?: UseApplicantStepViewModelProps,
): UseApplicantStepViewModelReturn => {
  const {
    initialLegalValues,
    initialPhysicalValues,
    initialRegime,
    initialVehicleBeneficiary,
    onSubmit: onSubmitProp,
  } = props ?? {};

  const [regime, setRegime] = useState<LegalEntityType>(
    initialRegime ?? "physical",
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
      initialVehicleBeneficiary ?? "same_holder",
    );

  const [physicalErrors, setPhysicalErrors] = useState<
    Partial<Record<PhysicalPersonFormField, string>>
  >({});

  const [legalErrors, setLegalErrors] = useState<
    Partial<Record<LegalEntityFormField, string>>
  >({});

  // ===========================================================================
  // Validation Computations
  // ===========================================================================

  const isPhysicalIdentificationValid = useMemo<boolean>(() => {
    const sanitizedId = physicalValues.identificationNumber.replace(/\D/g, "");
    return (
      sanitizedId.length >= APPLICANT_STEP_VIEW_NUMERICAL.MIN_PHYSICAL_ID_LENGTH
    );
  }, [physicalValues.identificationNumber]);

  const isLegalIdentificationValid = useMemo<boolean>(() => {
    const sanitizedId = legalValues.identificationNumber.replace(/\D/g, "");
    return (
      sanitizedId.length >= APPLICANT_STEP_VIEW_NUMERICAL.MIN_LEGAL_ID_LENGTH
    );
  }, [legalValues.identificationNumber]);

  const isIdentificationValid =
    regime === "physical"
      ? isPhysicalIdentificationValid
      : isLegalIdentificationValid;

  const isPhysicalValid = useMemo<boolean>(() => {
    return (
      physicalValues.identificationType.trim() !== "" &&
      isPhysicalIdentificationValid &&
      physicalValues.firstName.trim() !== "" &&
      physicalValues.firstLastName.trim() !== "" &&
      physicalValues.secondLastName.trim() !== "" &&
      physicalValues.birthDate.trim() !== "" &&
      physicalValues.nationality.trim() !== "" &&
      physicalValues.maritalStatus.trim() !== "" &&
      physicalValues.gender.trim() !== ""
    );
  }, [isPhysicalIdentificationValid, physicalValues]);

  const isLegalValid = useMemo<boolean>(() => {
    return (
      legalValues.identificationType.trim() !== "" &&
      isLegalIdentificationValid &&
      legalValues.legalName.trim() !== "" &&
      legalValues.representativeIdentification.trim() !== "" &&
      legalValues.representativeName.trim() !== ""
    );
  }, [isLegalIdentificationValid, legalValues]);

  const isValid = regime === "physical" ? isPhysicalValid : isLegalValid;

  // ===========================================================================
  // Handlers
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

  const onVehicleBeneficiaryChange = useCallback(
    (beneficiary: VehicleBeneficiaryType): void => {
      setVehicleBeneficiary(beneficiary);
    },
    [],
  );

  const onSubmit = useCallback((): void => {
    if (regime === "physical") {
      const errors: Partial<Record<PhysicalPersonFormField, string>> = {};
      if (!physicalValues.identificationType.trim()) {
        errors.identificationType =
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.IDENTIFICATION_TYPE;
      }
      if (!isPhysicalIdentificationValid) {
        errors.identificationNumber =
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.IDENTIFICATION_NUMBER;
      }
      if (!physicalValues.firstName.trim()) {
        errors.firstName = APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_NAME;
      }
      if (!physicalValues.firstLastName.trim()) {
        errors.firstLastName =
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.FIRST_LAST_NAME;
      }
      if (!physicalValues.secondLastName.trim()) {
        errors.secondLastName =
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.SECOND_LAST_NAME;
      }
      if (!physicalValues.birthDate.trim()) {
        errors.birthDate = APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.BIRTH_DATE;
      }
      if (!physicalValues.nationality.trim()) {
        errors.nationality = APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.NATIONALITY;
      }
      if (!physicalValues.maritalStatus.trim()) {
        errors.maritalStatus =
          APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.MARITAL_STATUS;
      }
      if (!physicalValues.gender.trim()) {
        errors.gender = APPLICANT_STEP_VIEW_ERRORS.PHYSICAL.GENDER;
      }

      if (Object.keys(errors).length > 0) {
        setPhysicalErrors(errors);
        return;
      }

      onSubmitProp?.({
        regime: "physical",
        values: physicalValues,
        vehicleBeneficiary,
      });
    } else {
      const errors: Partial<Record<LegalEntityFormField, string>> = {};
      if (!legalValues.identificationType.trim()) {
        errors.identificationType =
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_TYPE;
      }
      if (!isLegalIdentificationValid) {
        errors.identificationNumber =
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.IDENTIFICATION_NUMBER;
      }
      if (!legalValues.legalName.trim()) {
        errors.legalName = APPLICANT_STEP_VIEW_ERRORS.LEGAL.LEGAL_NAME;
      }
      if (!legalValues.representativeIdentification.trim()) {
        errors.representativeIdentification =
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_IDENTIFICATION;
      }
      if (!legalValues.representativeName.trim()) {
        errors.representativeName =
          APPLICANT_STEP_VIEW_ERRORS.LEGAL.REPRESENTATIVE_NAME;
      }

      if (Object.keys(errors).length > 0) {
        setLegalErrors(errors);
        return;
      }

      onSubmitProp?.({
        regime: "legal",
        values: legalValues,
        vehicleBeneficiary,
      });
    }
  }, [
    isLegalIdentificationValid,
    isPhysicalIdentificationValid,
    legalValues,
    onSubmitProp,
    physicalValues,
    regime,
    vehicleBeneficiary,
  ]);

  return {
    isIdentificationValid,
    isValid,
    legalErrors,
    legalValues,
    onLegalFieldChange,
    onPhysicalFieldChange,
    onRegimeChange,
    onSubmit,
    onVehicleBeneficiaryChange,
    physicalErrors,
    physicalValues,
    regime,
    vehicleBeneficiary,
  };
};
