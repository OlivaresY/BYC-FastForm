import { WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES } from "../constants/WizardProgressHeader.constants";
import { WizardProgressHeaderPageObject } from "./WizardProgressHeader.po";

const BASE_PROPS = {
  subtitle: "NUEVO TRÁMITE",
  title: "DATOS DEL CLIENTE",
  totalSteps: 4,
} as const;

describe("WizardProgressHeader Component", () => {
  describe("Step Indicator Pill & Icons", () => {
    it("renders bordered step pill with text and dynamic SVG icon", () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 1,
      });

      // Assert
      expect(pom.stepPill).toBeTruthy();
      expect(pom.getStepPillClassName()).toContain("rounded-full");
      expect(pom.getStepPillClassName()).toContain("border");
      expect(pom.stepIcon).toBeTruthy();
      expect(pom.getStepText()).toBe("PASO 1 DE 4");
    });

    it.each([1, 2, 3, 4])(
      "renders step icon inside pill for step %i",
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

  describe("Text content", () => {
    it("renders title and subtitle correctly", () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 1,
      });

      // Assert
      expect(pom.getTitleText()).toBe("DATOS DEL CLIENTE");
      expect(pom.getSubtitleText()).toBe("NUEVO TRÁMITE");
    });
  });

  describe("Segmented line uniform active colors", () => {
    it("renders one segment per step at the bottom of the container", () => {
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
      "renders uniform green active segments (bg-[#385741]) for step %i",
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
          expect(classes[i]).toContain("bg-[#385741]");
        }
        for (let i = currentStep; i < 4; i++) {
          expect(classes[i]).toContain(
            WIZARD_PROGRESS_HEADER_SEGMENT_CLASSES.INACTIVE,
          );
        }
      },
    );

    it("renders no segments when totalSteps is zero", () => {
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

  describe("Percentage badge", () => {
    it.each([
      [1, "25% LISTO", "bg-[#EAF5FF]", "text-[#0070D2]"],
      [2, "50% LISTO", "bg-[#F2F4F8]", "text-[#1A237E]"],
      [3, "75% LISTO", "bg-[#FFF8E1]", "text-[#B97700]"],
      [4, "100% LISTO", "bg-[#E8F5E9]", "text-[#1B5E20]"],
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

    it("renders the check icon only at 100%", () => {
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

  describe("Math safety", () => {
    it.each([
      ["totalSteps is zero", 0, 0],
      ["totalSteps is negative", 1, -4],
      ["currentStep is negative", -2, 4],
      ["currentStep is NaN", NaN, 4],
    ])("defaults to 0%% when %s", (_, currentStep, totalSteps) => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep,
        totalSteps,
      });

      // Assert
      expect(pom.getPercentageText()).toBe("0% LISTO");
      expect(pom.getBadgeClassName()).toContain("bg-[#EAF5FF]");
      expect(pom.checkIcon).toBeNull();
    });

    it("clamps to 100% when currentStep exceeds totalSteps", () => {
      // Arrange & Act
      const pom = WizardProgressHeaderPageObject.render({
        ...BASE_PROPS,
        currentStep: 6,
      });

      // Assert
      expect(pom.getPercentageText()).toBe("100% LISTO");
      expect(pom.getActiveSegmentStates()).toEqual([true, true, true, true]);
      expect(pom.checkIcon).not.toBeNull();
    });
  });
});
