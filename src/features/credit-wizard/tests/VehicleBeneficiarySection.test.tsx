import {
  VEHICLE_BENEFICIARY_SECTION_COPY,
  VEHICLE_BENEFICIARY_SECTION_ENTITIES,
  VEHICLE_BENEFICIARY_SECTION_STYLES,
} from "../constants/VehicleBeneficiarySection.constants";
import { VehicleBeneficiarySectionPageObject } from "./VehicleBeneficiarySection.po";

describe("VehicleBeneficiarySection Component", () => {
  it("renders section header row with car icon, title, and prompt question", () => {
    // Arrange & Act
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Assert
    expect(page.container).toBeTruthy();
    expect(page.headerRow).toBeTruthy();
    expect(page.carIcon).toBeTruthy();
    expect(page.getHeaderTitleText()).toBe(
      VEHICLE_BENEFICIARY_SECTION_COPY.HEADER_TITLE,
    );
    expect(page.getPromptText()).toBe(VEHICLE_BENEFICIARY_SECTION_COPY.PROMPT);
  });

  it("renders with custom testID when provided", () => {
    // Arrange & Act
    const customTestId = "custom-vehicle-beneficiary-section";
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
      testID: customTestId,
    });

    // Assert
    expect(page.container).toBeTruthy();
  });

  it("renders both option buttons with their respective labels", () => {
    // Arrange & Act
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Assert
    expect(page.sameHolderButton).toBeTruthy();
    expect(page.getSameHolderLabelText()).toBe(
      VEHICLE_BENEFICIARY_SECTION_COPY.SAME_HOLDER_LABEL,
    );

    expect(page.thirdPartyButton).toBeTruthy();
    expect(page.getThirdPartyLabelText()).toBe(
      VEHICLE_BENEFICIARY_SECTION_COPY.THIRD_PARTY_LABEL,
    );
  });

  it("displays active state on same_holder button and inactive on third_party button when same_holder is selected", () => {
    // Arrange & Act
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Assert accessibility state
    expect(page.isSameHolderSelected()).toBe(true);
    expect(page.isThirdPartySelected()).toBe(false);

    // Assert active styling on same_holder
    expect(page.getSameHolderButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_BUTTON,
    );
    expect(page.getSameHolderLabelClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_LABEL,
    );

    // Assert inactive styling on third_party
    expect(page.getThirdPartyButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_BUTTON,
    );
    expect(page.getThirdPartyLabelClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_LABEL,
    );
  });

  it("displays active state on third_party button and inactive on same_holder button when third_party is selected", () => {
    // Arrange & Act
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
    });

    // Assert accessibility state
    expect(page.isSameHolderSelected()).toBe(false);
    expect(page.isThirdPartySelected()).toBe(true);

    // Assert active styling on third_party
    expect(page.getThirdPartyButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_BUTTON,
    );
    expect(page.getThirdPartyLabelClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.ACTIVE_LABEL,
    );

    // Assert inactive styling on same_holder
    expect(page.getSameHolderButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_BUTTON,
    );
    expect(page.getSameHolderLabelClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.INACTIVE_LABEL,
    );
  });

  it("triggers onSelectBeneficiary with same_holder when same_holder button is pressed", () => {
    // Arrange
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
    });

    // Act
    page.pressSameHolder();

    // Assert
    expect(onSelectBeneficiaryMock).toHaveBeenCalledTimes(1);
    expect(onSelectBeneficiaryMock).toHaveBeenCalledWith(
      VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    );
  });

  it("triggers onSelectBeneficiary with third_party when third_party button is pressed", () => {
    // Arrange
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Act
    page.pressThirdParty();

    // Assert
    expect(onSelectBeneficiaryMock).toHaveBeenCalledTimes(1);
    expect(onSelectBeneficiaryMock).toHaveBeenCalledWith(
      VEHICLE_BENEFICIARY_SECTION_ENTITIES.THIRD_PARTY,
    );
  });

  it("does not trigger onSelectBeneficiary when buttons are pressed while disabled", () => {
    // Arrange
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      disabled: true,
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Assert disabled accessibility states
    expect(page.isSameHolderDisabled()).toBe(true);
    expect(page.isThirdPartyDisabled()).toBe(true);
    expect(page.getSameHolderButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.BUTTON_DISABLED,
    );
    expect(page.getThirdPartyButtonClassName()).toContain(
      VEHICLE_BENEFICIARY_SECTION_STYLES.BUTTON_DISABLED,
    );

    // Act
    page.pressSameHolder().pressThirdParty();

    // Assert
    expect(onSelectBeneficiaryMock).not.toHaveBeenCalled();
  });

  it('exposes accessibilityRole="button" on both option buttons', () => {
    // Arrange & Act
    const onSelectBeneficiaryMock = jest.fn();
    const page = VehicleBeneficiarySectionPageObject.render({
      onSelectBeneficiary: onSelectBeneficiaryMock,
      selectedBeneficiary: VEHICLE_BENEFICIARY_SECTION_ENTITIES.SAME_HOLDER,
    });

    // Assert
    expect(page.sameHolderButton.props.accessibilityRole).toBe("button");
    expect(page.thirdPartyButton.props.accessibilityRole).toBe("button");
  });
});
