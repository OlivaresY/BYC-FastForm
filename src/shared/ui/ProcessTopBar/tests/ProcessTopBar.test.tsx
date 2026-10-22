import {
  PROCESS_TOP_BAR_COPY,
  PROCESS_TOP_BAR_HIT_SLOP,
} from '../constants/ProcessTopBar.constants';
import { ProcessTopBarPageObject } from './ProcessTopBar.po';

describe('ProcessTopBar Component', () => {
  describe('Default Render State', () => {
    it('renders all structural branding, badge, close button, and default avatar', () => {
      // Arrange & Act
      const page = ProcessTopBarPageObject.render();

      // Assert - Structure & Branding
      expect(page.container).toBeTruthy();
      expect(page.title.props.children).toBe(PROCESS_TOP_BAR_COPY.TITLE);
      expect(page.divider).toBeTruthy();
      expect(page.badge).toBeTruthy();
      expect(page.badgeText.props.children).toBe(
        PROCESS_TOP_BAR_COPY.BADGE_TEXT,
      );

      // Assert - Close button accessibility & hitSlop
      expect(page.closeButton.props.accessibilityRole).toBe('button');
      expect(page.closeButton.props.accessibilityLabel).toBe(
        PROCESS_TOP_BAR_COPY.CLOSE_ACCESSIBILITY_LABEL,
      );
      expect(page.closeButton.props.hitSlop).toEqual(PROCESS_TOP_BAR_HIT_SLOP);

      // Assert - Avatar button accessibility, hitSlop & default initials
      expect(page.avatarButton.props.accessibilityRole).toBe('button');
      expect(page.avatarButton.props.accessibilityLabel).toBe(
        PROCESS_TOP_BAR_COPY.AVATAR_ACCESSIBILITY_LABEL,
      );
      expect(page.avatarButton.props.hitSlop).toEqual(PROCESS_TOP_BAR_HIT_SLOP);
      expect(page.avatarInitials.props.children).toBe(
        PROCESS_TOP_BAR_COPY.DEFAULT_INITIALS,
      );
    });

    it('renders custom userInitials when provided', () => {
      // Arrange & Act
      const page = ProcessTopBarPageObject.render({
        userInitials: 'JD',
      });

      // Assert
      expect(page.avatarInitials.props.children).toBe('JD');
    });

    it('applies custom testID and custom className to outer container', () => {
      // Arrange & Act
      const page = ProcessTopBarPageObject.render({
        className: 'custom-top-bar-class',
        testID: 'custom-top-bar-id',
      });

      // Assert
      expect(page.container.props.className).toContain('custom-top-bar-class');
      expect(page.container.props.testID).toBe('custom-top-bar-id');
    });
  });

  describe('User Interactions', () => {
    it('triggers onClose when close button is pressed', () => {
      // Arrange
      const onClose = jest.fn();
      const page = ProcessTopBarPageObject.render({ onClose });

      // Act
      page.pressClose();

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('triggers onProfilePress when avatar button is pressed', () => {
      // Arrange
      const onProfilePress = jest.fn();
      const page = ProcessTopBarPageObject.render({ onProfilePress });

      // Act
      page.pressAvatar();

      // Assert
      expect(onProfilePress).toHaveBeenCalledTimes(1);
    });

    it('disables avatar press interaction when onProfilePress is not provided', () => {
      // Arrange & Act
      const page = ProcessTopBarPageObject.render();

      // Assert
      expect(page.isAvatarDisabled()).toBe(true);
    });
  });
});
