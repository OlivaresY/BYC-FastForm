import {
  CUSTOM_SELECT_COPY,
  CUSTOM_SELECT_STYLES,
} from '../constants/CustomSelect.constants';
import { CustomSelectPageObject } from './CustomSelect.po';

describe('CustomSelect Component', () => {
  const sampleOptions = [
    { label: 'Cédula Física', value: 'physical_id' },
    { label: 'Cédula Jurídica', value: 'legal_id' },
    { label: 'DIMEX', value: 'dimex' },
  ] as const;

  describe('Label & Required Asterisk', () => {
    it('renders label with red required asterisk when required is true', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        label: 'Tipo de Identificación',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        required: true,
      });

      // Assert
      expect(page.label).toBeTruthy();
      expect(page.getLabelText()).toBe('Tipo de Identificación');
      expect(page.requiredAsterisk).toBeTruthy();
    });

    it('renders label without asterisk when required is false or omitted', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        label: 'Tipo de Identificación',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.label).toBeTruthy();
      expect(page.getLabelText()).toBe('Tipo de Identificación');
      expect(page.requiredAsterisk).toBeNull();
    });

    it('omits label container entirely when label is not provided', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.label).toBeNull();
      expect(page.requiredAsterisk).toBeNull();
    });
  });

  describe('Selected Value & Placeholder', () => {
    it('renders default placeholder when placeholder is omitted and no value is selected', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.getTriggerText()).toBe(
        CUSTOM_SELECT_COPY.DEFAULT_PLACEHOLDER,
      );
    });

    it('renders custom placeholder when provided and no value is selected', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        placeholder: 'Seleccione un tipo de documento...',
      });

      // Assert
      expect(page.getTriggerText()).toBe('Seleccione un tipo de documento...');
    });

    it('renders selected option label when matching value is provided', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        value: 'legal_id',
      });

      // Assert
      expect(page.getTriggerText()).toBe('Cédula Jurídica');
    });

    it('falls back to placeholder when provided value does not match any option', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        placeholder: 'Seleccione...',
        value: 'unknown_value',
      });

      // Assert
      expect(page.getTriggerText()).toBe('Seleccione...');
    });
  });

  describe('Icons', () => {
    it('renders Globe icon when leftIcon is globe', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        leftIcon: 'globe',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.leftIcon).toBeTruthy();
    });

    it('omits left icon when leftIcon is undefined', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.leftIcon).toBeNull();
    });

    it('renders Chevron down right icon unconditionally', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.chevronIcon).toBeTruthy();
    });
  });

  describe('Modal Interaction & Option Selection', () => {
    it('opens modal on trigger press and reflects expanded accessibilityState', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert initial closed state
      expect(page.isModalVisible()).toBe(false);
      expect(page.isTriggerExpanded()).toBe(false);

      // Act
      page.pressTrigger();

      // Assert opened state
      expect(page.isModalVisible()).toBe(true);
      expect(page.isTriggerExpanded()).toBe(true);
    });

    it('does not open modal when trigger is pressed while disabled', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        disabled: true,
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert disabled state
      expect(page.isTriggerDisabled()).toBe(true);
      expect(page.getTriggerClassName()).toContain(
        CUSTOM_SELECT_STYLES.TRIGGER_DISABLED,
      );

      // Act
      page.pressTrigger();

      // Assert modal remains closed
      expect(page.isModalVisible()).toBe(false);
    });

    it('highlights currently selected option with active styling and checkmark icon', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        value: 'physical_id',
      });

      // Act
      page.pressTrigger();

      // Assert
      expect(page.isOptionSelected('physical_id')).toBe(true);
      expect(page.getOptionCheck('physical_id')).toBeTruthy();

      expect(page.isOptionSelected('legal_id')).toBe(false);
      expect(page.getOptionCheck('legal_id')).toBeNull();
    });

    it('calls onValueChange and closes modal when an option is selected', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();
      page.selectOption('dimex');

      // Assert
      expect(onValueChangeMock).toHaveBeenCalledTimes(1);
      expect(onValueChangeMock).toHaveBeenCalledWith('dimex');
      expect(page.isModalVisible()).toBe(false);
    });

    it('closes modal when backdrop is pressed', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();
      expect(page.isModalVisible()).toBe(true);

      page.pressBackdrop();

      // Assert
      expect(page.isModalVisible()).toBe(false);
      expect(onValueChangeMock).not.toHaveBeenCalled();
    });

    it('closes modal when close button is pressed', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();
      expect(page.isModalVisible()).toBe(true);

      page.pressCloseButton();

      // Assert
      expect(page.isModalVisible()).toBe(false);
      expect(onValueChangeMock).not.toHaveBeenCalled();
    });

    it('does not close modal when modal card itself is pressed due to stopPropagation', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();
      page.pressModalCard();

      // Assert
      expect(page.isModalVisible()).toBe(true);
    });

    it('closes modal when dismissed via native modal request', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();
      page.dismissModalViaNativeRequest();

      // Assert
      expect(page.isModalVisible()).toBe(false);
    });
  });

  describe('Modal Title Resolution', () => {
    it('uses modalTitle when explicitly provided', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        label: 'Tipo',
        modalTitle: 'Seleccione Documento Legal',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();

      // Assert
      expect(page.getModalTitleText()).toBe('Seleccione Documento Legal');
    });

    it('falls back to label when modalTitle is omitted', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        label: 'Nacionalidad',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();

      // Assert
      expect(page.getModalTitleText()).toBe('Nacionalidad');
    });

    it('falls back to default modal title when both modalTitle and label are omitted', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Act
      page.pressTrigger();

      // Assert
      expect(page.getModalTitleText()).toBe(
        CUSTOM_SELECT_COPY.DEFAULT_MODAL_TITLE,
      );
    });
  });

  describe('Helper & Error Messages', () => {
    it('renders errorMessage and error border on trigger, taking precedence over helperText', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        errorMessage: 'Campo obligatorio',
        helperText: 'Texto de ayuda ignorado',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.errorMessage).toBeTruthy();
      expect(page.getErrorMessageText()).toBe('Campo obligatorio');
      expect(page.helperText).toBeNull();
      expect(page.isTriggerInvalid()).toBe(true);
      expect(page.getTriggerClassName()).toContain(
        CUSTOM_SELECT_STYLES.TRIGGER_BORDER_ERROR,
      );
    });

    it('renders helperText when errorMessage is absent', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        helperText: 'Seleccione según su documento',
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.errorMessage).toBeNull();
      expect(page.helperText).toBeTruthy();
      expect(page.getHelperText()).toBe('Seleccione según su documento');
      expect(page.isTriggerInvalid()).toBe(false);
      expect(page.getTriggerClassName()).toContain(
        CUSTOM_SELECT_STYLES.TRIGGER_BORDER_BASE,
      );
    });

    it('omits feedback text entirely when both errorMessage and helperText are absent', () => {
      // Arrange & Act
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert
      expect(page.errorMessage).toBeNull();
      expect(page.helperText).toBeNull();
    });
  });

  describe('Accessibility & Custom testID', () => {
    it('exposes accessibilityRole="button" on trigger and option items', () => {
      // Arrange
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
      });

      // Assert trigger
      expect(page.trigger.props.accessibilityRole).toBe('button');

      // Act
      page.pressTrigger();

      // Assert options
      expect(page.getOption('physical_id')?.props.accessibilityRole).toBe(
        'button',
      );
    });

    it('renders with custom testID when provided', () => {
      // Arrange & Act
      const customTestId = 'custom-identity-select';
      const onValueChangeMock = jest.fn();
      const page = CustomSelectPageObject.render({
        onValueChange: onValueChangeMock,
        options: sampleOptions,
        testID: customTestId,
      });

      // Assert
      expect(page.container).toBeTruthy();
    });
  });
});
