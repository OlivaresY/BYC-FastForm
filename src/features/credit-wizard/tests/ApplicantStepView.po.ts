import React from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { CUSTOM_SELECT_TEST_IDS } from "@/shared/ui/CustomSelect";
import { PROCESS_TOP_BAR_TEST_IDS } from "@/shared/ui/ProcessTopBar";
import { ApplicantStepView } from "../components/ApplicantStepView";
import { APPLICANT_STEP_VIEW_TEST_IDS } from "../constants/ApplicantStepView.constants";
import { LEGAL_ENTITY_FORM_TEST_IDS } from "../constants/LegalEntityForm.constants";
import { LEGAL_ENTITY_SELECTOR_TEST_IDS } from "../constants/LegalEntitySelector.constants";
import { PHYSICAL_PERSON_FORM_TEST_IDS } from "../constants/PhysicalPersonForm.constants";
import { VEHICLE_BENEFICIARY_SECTION_TEST_IDS } from "../constants/VehicleBeneficiarySection.constants";
import { useApplicantStepViewModel } from "../hooks/useApplicantStepViewModel";
import type {
  ApplicantStepViewProps,
  UseApplicantStepViewModelProps,
} from "../types/ApplicantStepView.types";

export { act };

export type PhysicalTextInputField =
  | "birthDate"
  | "firstLastName"
  | "firstName"
  | "identificationNumber"
  | "middleName"
  | "secondLastName";

export type PhysicalSelectField =
  "gender" | "identificationType" | "maritalStatus" | "nationality";

export type LegalTextInputField =
  | "identificationNumber"
  | "legalName"
  | "representativeIdentification"
  | "representativeName";

const PHYSICAL_TEXT_MAP: Record<PhysicalTextInputField, string> = {
  birthDate: PHYSICAL_PERSON_FORM_TEST_IDS.BIRTH_DATE_INPUT,
  firstLastName: PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_LAST_NAME_INPUT,
  firstName: PHYSICAL_PERSON_FORM_TEST_IDS.FIRST_NAME_INPUT,
  identificationNumber:
    PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT,
  middleName: PHYSICAL_PERSON_FORM_TEST_IDS.MIDDLE_NAME_INPUT,
  secondLastName: PHYSICAL_PERSON_FORM_TEST_IDS.SECOND_LAST_NAME_INPUT,
};

const PHYSICAL_SELECT_MAP: Record<PhysicalSelectField, string> = {
  gender: PHYSICAL_PERSON_FORM_TEST_IDS.GENDER_SELECT,
  identificationType: PHYSICAL_PERSON_FORM_TEST_IDS.IDENTIFICATION_TYPE_SELECT,
  maritalStatus: PHYSICAL_PERSON_FORM_TEST_IDS.MARITAL_STATUS_SELECT,
  nationality: PHYSICAL_PERSON_FORM_TEST_IDS.NATIONALITY_SELECT,
};

const LEGAL_TEXT_MAP: Record<LegalTextInputField, string> = {
  identificationNumber: LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_NUMBER_INPUT,
  legalName: LEGAL_ENTITY_FORM_TEST_IDS.LEGAL_NAME_INPUT,
  representativeIdentification:
    LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_IDENTIFICATION_INPUT,
  representativeName: LEGAL_ENTITY_FORM_TEST_IDS.REPRESENTATIVE_NAME_INPUT,
};

interface ApplicantStepViewTestContainerProps extends UseApplicantStepViewModelProps {
  disabled?: boolean;
  handleOpenCloseModal?: () => void;
  onClose?: () => void;
  testID?: string;
}

const ApplicantStepViewTestContainer = ({
  disabled,
  handleOpenCloseModal,
  onClose,
  testID,
  ...hookProps
}: ApplicantStepViewTestContainerProps): React.JSX.Element => {
  const viewModel = useApplicantStepViewModel(hookProps);
  return React.createElement(ApplicantStepView, {
    ...viewModel,
    disabled,
    handleOpenCloseModal,
    onClose,
    testID,
  });
};

export class ApplicantStepViewPageObject {
  private readonly customTestId?: string;

  public constructor(customTestId?: string) {
    this.customTestId = customTestId;
  }

  public static render(
    props?: ApplicantStepViewTestContainerProps,
  ): ApplicantStepViewPageObject {
    render(React.createElement(ApplicantStepViewTestContainer, props ?? {}));
    return new ApplicantStepViewPageObject(props?.testID);
  }

  public static renderDirect(
    props: ApplicantStepViewProps,
  ): ApplicantStepViewPageObject {
    render(React.createElement(ApplicantStepView, props));
    return new ApplicantStepViewPageObject(props.testID);
  }

  public static renderHook(props?: UseApplicantStepViewModelProps) {
    return renderHook(() => useApplicantStepViewModel(props));
  }

  // =========================================================================
  // Getters
  // =========================================================================

  public get container(): ReactTestInstance {
    const id = this.customTestId ?? APPLICANT_STEP_VIEW_TEST_IDS.CONTAINER;
    return screen.getByTestId(id);
  }

  public get processTopBar(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR);
  }

  public get scrollView(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.SCROLL_VIEW);
  }

  public get wizardHeader(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.WIZARD_HEADER);
  }

  public get title(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.TITLE);
  }

  public get description(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.DESCRIPTION);
  }

  public get legalSelector(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_SELECTOR);
  }

  public get taupeContainer(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.TAUPE_CONTAINER);
  }

  public get divider(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.DIVIDER);
  }

  public get vehicleBeneficiary(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.VEHICLE_BENEFICIARY);
  }

  public get bottomBar(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.BOTTOM_BAR);
  }

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(APPLICANT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON);
  }

  public get physicalForm(): ReactTestInstance | null {
    return screen.queryByTestId(APPLICANT_STEP_VIEW_TEST_IDS.PHYSICAL_FORM);
  }

  public get legalForm(): ReactTestInstance | null {
    return screen.queryByTestId(APPLICANT_STEP_VIEW_TEST_IDS.LEGAL_FORM);
  }

  // =========================================================================
  // Actions
  // =========================================================================

  public selectPhysicalRegime(): this {
    fireEvent.press(
      screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.PHYSICAL_CARD),
    );
    return this;
  }

  public selectLegalRegime(): this {
    fireEvent.press(
      screen.getByTestId(LEGAL_ENTITY_SELECTOR_TEST_IDS.LEGAL_CARD),
    );
    return this;
  }

  public selectVehicleBeneficiarySameHolder(): this {
    fireEvent.press(
      screen.getByTestId(
        VEHICLE_BENEFICIARY_SECTION_TEST_IDS.SAME_HOLDER_BUTTON,
      ),
    );
    return this;
  }

  public selectVehicleBeneficiaryThirdParty(): this {
    fireEvent.press(
      screen.getByTestId(
        VEHICLE_BENEFICIARY_SECTION_TEST_IDS.THIRD_PARTY_BUTTON,
      ),
    );
    return this;
  }

  public fillPhysicalField(field: PhysicalTextInputField, text: string): this {
    const inputId = PHYSICAL_TEXT_MAP[field];
    const input = screen.getByTestId(inputId);
    fireEvent.changeText(input, text);
    return this;
  }

  public selectPhysicalOption(field: PhysicalSelectField, value: string): this {
    const baseId = PHYSICAL_SELECT_MAP[field];
    const trigger = screen.getByTestId(`${baseId}-trigger`);
    fireEvent.press(trigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public fillLegalField(field: LegalTextInputField, text: string): this {
    const inputId = LEGAL_TEXT_MAP[field];
    const input = screen.getByTestId(inputId);
    fireEvent.changeText(input, text);
    return this;
  }

  public selectLegalOption(value: string): this {
    const trigger = screen.getByTestId(
      `${LEGAL_ENTITY_FORM_TEST_IDS.IDENTIFICATION_TYPE_SELECT}-trigger`,
    );
    fireEvent.press(trigger);
    const option = screen.getByTestId(
      `${CUSTOM_SELECT_TEST_IDS.OPTION_ITEM_PREFIX}${value}`,
    );
    fireEvent.press(option);
    return this;
  }

  public fillAllPhysicalFieldsValid(): this {
    this.selectPhysicalOption("identificationType", "national_id");
    this.fillPhysicalField("identificationNumber", "1-1234-0567");
    this.fillPhysicalField("firstName", "Carlos");
    this.fillPhysicalField("firstLastName", "Rodríguez");
    this.fillPhysicalField("secondLastName", "Castro");
    this.fillPhysicalField("birthDate", "15 / 08 / 1988");
    this.selectPhysicalOption("nationality", "CR");
    this.selectPhysicalOption("maritalStatus", "married");
    this.selectPhysicalOption("gender", "male");
    return this;
  }

  public fillAllLegalFieldsValid(): this {
    this.selectLegalOption("legal_id");
    this.fillLegalField("identificationNumber", "3-101-123456");
    this.fillLegalField("legalName", "Inversiones Tecnológicas S.A.");
    this.fillLegalField("representativeIdentification", "1-1150-0222");
    this.fillLegalField("representativeName", "Juan Alberto Pérez Rojas");
    return this;
  }

  public pressCloseButton(): this {
    fireEvent.press(
      within(this.processTopBar).getByTestId(
        PROCESS_TOP_BAR_TEST_IDS.CLOSE_BUTTON,
      ),
    );
    return this;
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  // =========================================================================
  // State Query Helpers
  // =========================================================================

  public isSubmitButtonDisabled(): boolean {
    return this.submitButton.props.accessibilityState?.disabled === true;
  }

  public isPhysicalFormVisible(): boolean {
    return this.physicalForm !== null;
  }

  public isLegalFormVisible(): boolean {
    return this.legalForm !== null;
  }

  public getPhysicalInputValue(field: PhysicalTextInputField): string {
    const inputId = PHYSICAL_TEXT_MAP[field];
    return screen.getByTestId(inputId).props.value;
  }

  public getLegalInputValue(field: LegalTextInputField): string {
    const inputId = LEGAL_TEXT_MAP[field];
    return screen.getByTestId(inputId).props.value;
  }

  public getPhysicalFieldError(field: PhysicalTextInputField): string | null {
    const inputId = PHYSICAL_TEXT_MAP[field];
    const container = screen.getByTestId(`${inputId}-container`);
    const errorElement = within(container).queryByTestId(`${inputId}-error`);
    return errorElement?.props.children ?? null;
  }

  public getLegalFieldError(field: LegalTextInputField): string | null {
    const inputId = LEGAL_TEXT_MAP[field];
    const container = screen.getByTestId(`${inputId}-container`);
    const errorElement = within(container).queryByTestId(`${inputId}-error`);
    return errorElement?.props.children ?? null;
  }
}
