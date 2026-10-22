import { WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES } from '../constants/WizardProgressHeader.constants';
import { WizardProgressHeaderPageObject } from './WizardProgressHeader.po';

const BASE_PROPS = {
  subtitle: 'NUEVO TRÁMITE',
  title: 'DATOS DEL CLIENTE',
  totalSteps: 4,
} as const;

describe('WizardProgressHeader Component', () => {
  describe('Step Indicator Pill & Icons', () => {
    it('renders bordered step pill with text and dynamic SVG icon', () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 1,
      });

      // Assert
      expect(pom.stepPill).toBeTruthy();
      expect(pom.getStepPillClassName()).toContain('rounded-full');
      expect(pom.getStepPillClassName()).toContain('border');
      expect(pom.stepIcon).toBeTruthy();
      expect(pom.getStepText()).toBe('PASO 1 DE 4');
    });

    it.each([1, 2, 3, 4])(
      'renders step icon inside pill for step %i',
      (currentStep) => {
        // Arrange & Act
        const pom = WizardProgressHeaderPageObject.render({
          ...BASE_PROPS,
          currentStep,
        });

        // Assert
        expect(pom.stepIcon).toBeTruthy();
      },
    );
  });

  describe('Text content', () => {
    it('renders title and subtitle correctly', () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 1,
      });

      // Assert
      expect(pom.getTitleText()).toBe('DATOS DEL CLIENTE');
      expect(pom.getSubtitleText()).toBe('NUEVO TRÁMITE');
    });
  });

  describe('Segmented line uniform active colors', () => {
    it('renders one segment per step at the bottom of the container', () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 1,
      });

      // Assert
      expect(pom.segmentedLine).toBeTruthy();
      expect(pom.getSegmentCount()).toBe(4);
    });

    it.each([1, 2, 3, 4])(
      'renders uniform green active segments (bg-brand-green) for step %i',
      (currentStep) => {
        // Arrange & Act
        const pom = WizardProgressHeaderPageObject.render({
          ...BASE_PROPS,
          currentStep,
        });

        // Assert
        const classes = pom.getSegmentClassNames();
        for (let i = 0; i < currentStep; i++) {
          expect(classes[i]).toContain(
            WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.ACTIVE,
          );
          expect(classes[i]).toContain('bg-brand-green');
        }
        for (let i = currentStep; i < 4; i++) {
          expect(classes[i]).toContain(
            WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.INACTIVE,
          );
        }
      },
    );

    it('renders no segments when totalSteps is zero', () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 0,
        totalSteps: 0,
      });

      // Assert
      expect(pom.getSegmentCount()).toBe(0);
    });
  });

  describe('Percentage badge', () => {
    it.each([
      [1, '25% LISTO', 'bg-blue-50', 'text-blue-700'],
      [2, '50% LISTO', 'bg-slate-100', 'text-indigo-900'],
      [3, '75% LISTO', 'bg-amber-50', 'text-amber-700'],
      [4, '100% LISTO', 'bg-green-50', 'text-green-900'],
    ])(
      'step %i shows "%s" with %s background and %s text',
      (currentStep, expectedText, expectedBg, expectedTextColor) => {
        // Arrange & Act
        const pom = WizardProgressHeaderPageObject.render({
          ...BASE_PROPS,
          currentStep,
        });

        // Assert
        expect(pom.getPercentageText()).toBe(expectedText);
        expect(pom.getBadgeClassName()).toContain(expectedBg);
        expect(pom.getBadgeTextClassName()).toContain(expectedTextColor);
      },
    );

    it('renders the check icon only at 100%', () => {
      // Arrange & Act
      const partialPom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 3,
      });
      const isIconVisibleAtPartial = partialPom.checkIcon !== null;
      partialPom.unmount();

      const completePom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 4,
      });

      // Assert
      expect(isIconVisibleAtPartial).toBe(false);
      expect(completePom.checkIcon).not.toBeNull();
    });
  });

  describe('Math safety', () => {
    it.each([
      ['totalSteps is zero', 0, 0],
      ['totalSteps is negative', 1, -4],
      ['currentStep is negative', -2, 4],
      ['currentStep is NaN', NaN, 4],
    ])('defaults to 0%% when %s', (_, currentStep, totalSteps) => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep,
        totalSteps,
      });

      // Assert
      expect(pom.getPercentageText()).toBe('0% LISTO');
      expect(pom.getBadgeClassName()).toContain('bg-blue-50');
      expect(pom.checkIcon).toBeNull();
    });

    it('clamps to 100% when currentStep exceeds totalSteps', () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 6,
      });

      // Assert
      expect(pom.getPercentageText()).toBe('100% LISTO');
      expect(pom.getActiveSegmentStates()).toEqual([true, true, true, true]);
      expect(pom.checkIcon).not.toBeNull();
    });
  });

  describe("Layout Stability", () => {
    it("maintains min-height and structural stability when title and subtitle are omitted", () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        currentStep: 1,
        totalSteps: 4,
      });

      // Assert
      expect(pom.container.props.className).toContain("min-h-[50px]");
      expect(pom.container.props.className).toContain("justify-between");
      expect(pom.title).toBeNull();
      expect(pom.subtitle).toBeNull();
      expect(pom.stepPill).toBeTruthy();
      expect(pom.segmentedLine).toBeTruthy();
    });
  });
});
