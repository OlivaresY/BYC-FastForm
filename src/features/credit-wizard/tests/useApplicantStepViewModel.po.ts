import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { useApplicantStepViewModel } from '../hooks/useApplicantStepViewModel';
import type {
  ThirdPartyBeneficiaryField,
  ThirdPartyBeneficiaryValues,
  UseApplicantStepViewModelProps,
  UseApplicantStepViewModelReturn,
} from '../types/ApplicantStepView.types';
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

export class ApplicantStepViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseApplicantStepViewModelReturn,
    UseApplicantStepViewModelProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseApplicantStepViewModelReturn,
      UseApplicantStepViewModelProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props?: UseApplicantStepViewModelProps,
  ): ApplicantStepViewModelPageObject {
    const result = renderHook(
      (currentProps?: UseApplicantStepViewModelProps) =>
        useApplicantStepViewModel(currentProps),
      { initialProps: props },
    );
    return new ApplicantStepViewModelPageObject(result);
  }

  // =========================================================================
  // Getters
  // =========================================================================

  public get current(): UseApplicantStepViewModelReturn {
    return this.hookResult.result.current;
  }

  public get isBeneficiaryModalOpen(): boolean {
    return this.current.isBeneficiaryModalOpen;
  }

  public get isIdentificationValid(): boolean {
    return this.current.isIdentificationValid;
  }

  public get isValid(): boolean {
    return this.current.isValid;
  }

  public get legalErrors(): Partial<Record<LegalEntityFormField, string>> {
    return this.current.legalErrors;
  }

  public get legalValues(): LegalEntityFormValues {
    return this.current.legalValues;
  }

  public get physicalErrors(): Partial<
    Record<PhysicalPersonFormField, string>
  > {
    return this.current.physicalErrors;
  }

  public get physicalValues(): PhysicalPersonFormValues {
    return this.current.physicalValues;
  }

  public get regime(): LegalEntityType {
    return this.current.regime;
  }

  public get thirdPartyErrors(): Partial<
    Record<ThirdPartyBeneficiaryField, string>
  > {
    return this.current.thirdPartyErrors;
  }

  public get thirdPartyValues(): ThirdPartyBeneficiaryValues {
    return this.current.thirdPartyValues;
  }

  public get vehicleBeneficiary(): VehicleBeneficiaryType {
    return this.current.vehicleBeneficiary;
  }

  // =========================================================================
  // Fluent Actions (Method Chaining: return this)
  // =========================================================================

  public setPhysicalField<K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ): this {
    act(() => {
      this.current.onPhysicalFieldChange(field, value);
    });
    return this;
  }

  public onPhysicalFieldChange<K extends PhysicalPersonFormField>(
    field: K,
    value: PhysicalPersonFormValues[K],
  ): this {
    return this.setPhysicalField(field, value);
  }

  public fillPhysicalFields(fields: Partial<PhysicalPersonFormValues>): this {
    act(() => {
      (Object.keys(fields) as PhysicalPersonFormField[]).forEach((key) => {
        const val = fields[key];
        if (val !== undefined) {
          this.current.onPhysicalFieldChange(key, val);
        }
      });
    });
    return this;
  }

  public setLegalField<K extends LegalEntityFormField>(
    field: K,
    value: LegalEntityFormValues[K],
  ): this {
    act(() => {
      this.current.onLegalFieldChange(field, value);
    });
    return this;
  }

  public onLegalFieldChange<K extends LegalEntityFormField>(
    field: K,
    value: LegalEntityFormValues[K],
  ): this {
    return this.setLegalField(field, value);
  }

  public fillLegalFields(fields: Partial<LegalEntityFormValues>): this {
    act(() => {
      (Object.keys(fields) as LegalEntityFormField[]).forEach((key) => {
        const val = fields[key];
        if (val !== undefined) {
          this.current.onLegalFieldChange(key, val);
        }
      });
    });
    return this;
  }

  public setThirdPartyField<K extends ThirdPartyBeneficiaryField>(
    field: K,
    value: ThirdPartyBeneficiaryValues[K],
  ): this {
    act(() => {
      this.current.onThirdPartyFieldChange(field, value);
    });
    return this;
  }

  public onThirdPartyFieldChange<K extends ThirdPartyBeneficiaryField>(
    field: K,
    value: ThirdPartyBeneficiaryValues[K],
  ): this {
    return this.setThirdPartyField(field, value);
  }

  public fillThirdPartyFields(
    fields: Partial<ThirdPartyBeneficiaryValues>,
  ): this {
    act(() => {
      (Object.keys(fields) as ThirdPartyBeneficiaryField[]).forEach((key) => {
        const val = fields[key];
        if (val !== undefined) {
          this.current.onThirdPartyFieldChange(key, val);
        }
      });
    });
    return this;
  }

  public setRegime(regime: LegalEntityType): this {
    act(() => {
      this.current.onRegimeChange(regime);
    });
    return this;
  }

  public onRegimeChange(regime: LegalEntityType): this {
    return this.setRegime(regime);
  }

  public setVehicleBeneficiary(beneficiary: VehicleBeneficiaryType): this {
    act(() => {
      this.current.onVehicleBeneficiaryChange(beneficiary);
    });
    return this;
  }

  public onVehicleBeneficiaryChange(beneficiary: VehicleBeneficiaryType): this {
    return this.setVehicleBeneficiary(beneficiary);
  }

  public openBeneficiaryModal(): this {
    act(() => {
      this.current.openBeneficiaryModal();
    });
    return this;
  }

  public closeBeneficiaryModal(): this {
    act(() => {
      this.current.closeBeneficiaryModal();
    });
    return this;
  }

  public submit(): this {
    act(() => {
      this.current.onSubmit();
    });
    return this;
  }

  public onSubmit(): this {
    return this.submit();
  }
}
