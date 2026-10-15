import { CLOSE_PROCESS_MODAL_COPY } from "../constants/CloseProcessModal.constants";
import { CloseProcessModalPageObject } from "./CloseProcessModal.po";

describe("CloseProcessModal Component", () => {
  it("renders modal title, body copy, and action buttons when visible is true", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Assert
    expect(page.container).toBeTruthy();
    expect(page.title).toBeTruthy();
    expect(page.title?.props.children).toBe(CLOSE_PROCESS_MODAL_COPY.TITLE);
    expect(page.body).toBeTruthy();
    expect(page.body?.props.children).toBe(CLOSE_PROCESS_MODAL_COPY.BODY);
    expect(page.saveDraftButton).toBeTruthy();
    expect(page.discardButton).toBeTruthy();
    expect(page.closeButton).toBeTruthy();
  });

  it("triggers onClose callback when close button is pressed", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Act
    page.pressClose();

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleDiscard).not.toHaveBeenCalled();
    expect(handleSaveDraft).not.toHaveBeenCalled();
  });

  it("triggers onSaveDraft callback when Guardar Borrador button is pressed", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Act
    page.pressSaveDraft();

    // Assert
    expect(handleSaveDraft).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();
    expect(handleDiscard).not.toHaveBeenCalled();
  });

  it("triggers onDiscard callback when Descartar button is pressed", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Act
    page.pressDiscard();

    // Assert
    expect(handleDiscard).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();
    expect(handleSaveDraft).not.toHaveBeenCalled();
  });

  it("does not render modal content when visible is false", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: false,
    });

    // Assert
    expect(page.queryModalCard()).toBeNull();
    expect(page.backdrop).toBeNull();
  });

  it("triggers onClose callback when backdrop is pressed", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Act
    page.pressBackdrop();

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleDiscard).not.toHaveBeenCalled();
    expect(handleSaveDraft).not.toHaveBeenCalled();
  });

  it("does not trigger onClose when modal card is pressed", () => {
    // Arrange
    const handleClose = jest.fn();
    const handleDiscard = jest.fn();
    const handleSaveDraft = jest.fn();

    const page = CloseProcessModalPageObject.render({
      onClose: handleClose,
      onDiscard: handleDiscard,
      onSaveDraft: handleSaveDraft,
      visible: true,
    });

    // Act
    page.pressModalCard();

    // Assert
    expect(handleClose).not.toHaveBeenCalled();
    expect(handleDiscard).not.toHaveBeenCalled();
    expect(handleSaveDraft).not.toHaveBeenCalled();
  });

  it("renders distinct accessibility labels on backdrop and close button with button role", () => {
    // Arrange
    const page = CloseProcessModalPageObject.render({
      onClose: jest.fn(),
      onDiscard: jest.fn(),
      onSaveDraft: jest.fn(),
      visible: true,
    });

    // Assert
    expect(page.backdrop?.props.accessibilityRole).toBe("button");
    expect(page.backdrop?.props.accessibilityLabel).toBe(
      CLOSE_PROCESS_MODAL_COPY.BACKDROP_ACCESSIBILITY_LABEL,
    );
    expect(page.closeButton.props.accessibilityRole).toBe("button");
    expect(page.closeButton.props.accessibilityLabel).toBe(
      CLOSE_PROCESS_MODAL_COPY.CLOSE_ACCESSIBILITY_LABEL,
    );
    expect(page.backdrop?.props.accessibilityLabel).not.toBe(
      page.closeButton.props.accessibilityLabel,
    );
  });
});
