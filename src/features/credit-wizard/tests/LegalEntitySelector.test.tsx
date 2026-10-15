import {
  LEGAL_ENTITY_SELECTOR_COPY,
  LEGAL_ENTITY_SELECTOR_ENTITIES,
  LEGAL_ENTITY_SELECTOR_STYLES,
} from "../constants/LegalEntitySelector.constants";
import { LegalEntitySelectorPageObject } from "./LegalEntitySelector.po";

describe("LegalEntitySelector Component", () => {
  it("renders section header title and subtitle correctly", () => {
    // Arrange & Act
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Assert
    expect(page.container).toBeTruthy();
    expect(page.getHeaderTitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.HEADER_TITLE,
    );
    expect(page.getHeaderSubtitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.HEADER_SUBTITLE,
    );
  });

  it("renders with custom testID when provided", () => {
    // Arrange & Act
    const customTestId = "custom-legal-entity-selector";
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
      testID: customTestId,
    });

    // Assert
    expect(page.container).toBeTruthy();
  });

  it("renders both entity cards with their titles and subtitles", () => {
    // Arrange & Act
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Assert
    expect(page.physicalCard).toBeTruthy();
    expect(page.getPhysicalTitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.PHYSICAL_TITLE,
    );
    expect(page.getPhysicalSubtitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.PHYSICAL_SUBTITLE,
    );

    expect(page.legalCard).toBeTruthy();
    expect(page.getLegalTitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.LEGAL_TITLE,
    );
    expect(page.getLegalSubtitleText()).toBe(
      LEGAL_ENTITY_SELECTOR_COPY.LEGAL_SUBTITLE,
    );
  });

  it("displays active state on physical card and inactive on legal card when physical is selected", () => {
    // Arrange & Act
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Assert accessibility state
    expect(page.isPhysicalSelected()).toBe(true);
    expect(page.isLegalSelected()).toBe(false);

    // Assert active styling on physical card
    expect(page.getPhysicalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD,
    );
    expect(page.getPhysicalBadgeClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_BADGE,
    );
    expect(page.getPhysicalTitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_TITLE,
    );
    expect(page.getPhysicalSubtitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_SUBTITLE,
    );

    // Assert inactive styling on legal card
    expect(page.getLegalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD,
    );
    expect(page.getLegalBadgeClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_BADGE,
    );
    expect(page.getLegalTitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_TITLE,
    );
    expect(page.getLegalSubtitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_SUBTITLE,
    );
  });

  it("displays active state on legal card and inactive on physical card when legal is selected", () => {
    // Arrange & Act
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    });

    // Assert accessibility state
    expect(page.isPhysicalSelected()).toBe(false);
    expect(page.isLegalSelected()).toBe(true);

    // Assert active styling on legal card
    expect(page.getLegalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_CARD,
    );
    expect(page.getLegalBadgeClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_BADGE,
    );
    expect(page.getLegalTitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_TITLE,
    );
    expect(page.getLegalSubtitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.ACTIVE_SUBTITLE,
    );

    // Assert inactive styling on physical card
    expect(page.getPhysicalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_CARD,
    );
    expect(page.getPhysicalBadgeClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_BADGE,
    );
    expect(page.getPhysicalTitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_TITLE,
    );
    expect(page.getPhysicalSubtitleClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.INACTIVE_SUBTITLE,
    );
  });

  it("triggers onSelectEntity with physical when physical card is pressed", () => {
    // Arrange
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    });

    // Act
    page.pressPhysical();

    // Assert
    expect(onSelectEntityMock).toHaveBeenCalledTimes(1);
    expect(onSelectEntityMock).toHaveBeenCalledWith(
      LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    );
  });

  it("triggers onSelectEntity with legal when legal card is pressed", () => {
    // Arrange
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Act
    page.pressLegal();

    // Assert
    expect(onSelectEntityMock).toHaveBeenCalledTimes(1);
    expect(onSelectEntityMock).toHaveBeenCalledWith(
      LEGAL_ENTITY_SELECTOR_ENTITIES.LEGAL,
    );
  });

  it("does not trigger onSelectEntity when physical or legal card is pressed while disabled", () => {
    // Arrange
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      disabled: true,
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Assert disabled accessibility states
    expect(page.isPhysicalDisabled()).toBe(true);
    expect(page.isLegalDisabled()).toBe(true);
    expect(page.getPhysicalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.CARD_DISABLED,
    );
    expect(page.getLegalCardClassName()).toContain(
      LEGAL_ENTITY_SELECTOR_STYLES.CARD_DISABLED,
    );

    // Act
    page.pressPhysical().pressLegal();

    // Assert
    expect(onSelectEntityMock).not.toHaveBeenCalled();
  });

  it('exposes accessibilityRole="button" on both interactive cards', () => {
    // Arrange & Act
    const onSelectEntityMock = jest.fn();
    const page = LegalEntitySelectorPageObject.render({
      onSelectEntity: onSelectEntityMock,
      selectedEntity: LEGAL_ENTITY_SELECTOR_ENTITIES.PHYSICAL,
    });

    // Assert
    expect(page.physicalCard.props.accessibilityRole).toBe("button");
    expect(page.legalCard.props.accessibilityRole).toBe("button");
  });
});
