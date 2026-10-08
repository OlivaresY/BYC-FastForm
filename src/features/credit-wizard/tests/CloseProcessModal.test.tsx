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
});
