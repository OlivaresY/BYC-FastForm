import {
  WIZARD_PROGRESS_HEADER_BADGE_VARIANTS,
  WIZARD_PROGRESS_HEADER_STEP_ICONS,
} from '../constants/WizardProgressHeader.constants';
import { resolveBadgeVariant, resolveStepIcon } from '../utils/wizardProgress';

describe('wizardProgress utility', () => {
  describe('resolveBadgeVariant', () => {
    it('returns STARTED when percentage is below 50', () => {
      expect(resolveBadgeVariant(0)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.STARTED,
      );
      expect(resolveBadgeVariant(49)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.STARTED,
      );
    });

    it('returns HALFWAY when percentage is between 50 and 74', () => {
      expect(resolveBadgeVariant(50)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.HALFWAY,
      );
      expect(resolveBadgeVariant(74)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.HALFWAY,
      );
    });

    it('returns NEAR_COMPLETE when percentage is between 75 and 99', () => {
      expect(resolveBadgeVariant(75)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.NEAR_COMPLETE,
      );
      expect(resolveBadgeVariant(99)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.NEAR_COMPLETE,
      );
    });

    it('returns COMPLETE when percentage is 100 or greater', () => {
      expect(resolveBadgeVariant(100)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.COMPLETE,
      );
      expect(resolveBadgeVariant(120)).toBe(
        WIZARD_PROGRESS_HEADER_BADGE_VARIANTS.COMPLETE,
      );
    });
  });

  describe('resolveStepIcon', () => {
    it.each([1, 2, 3, 4])('resolves icon configuration for step %i', (step) => {
      expect(resolveStepIcon(step)).toBe(
        WIZARD_PROGRESS_HEADER_STEP_ICONS[step],
      );
    });

    it('clamps to step 1 icon when step is less than 1', () => {
      expect(resolveStepIcon(0)).toBe(WIZARD_PROGRESS_HEADER_STEP_ICONS[1]);
      expect(resolveStepIcon(-5)).toBe(WIZARD_PROGRESS_HEADER_STEP_ICONS[1]);
    });

    it('clamps to step 4 icon when step is greater than 4', () => {
      expect(resolveStepIcon(5)).toBe(WIZARD_PROGRESS_HEADER_STEP_ICONS[4]);
      expect(resolveStepIcon(10)).toBe(WIZARD_PROGRESS_HEADER_STEP_ICONS[4]);
    });
  });
});
