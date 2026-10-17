import { WizardProgressHeaderViewModelPageObject } from './useWizardProgressHeaderViewModel.po';

describe('useWizardProgressHeaderViewModel', () => {
  it('computes correct progress percentage and text for step 1 of 4', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: 1,
      totalSteps: 4,
    });

    expect(page.percentage).toBe(25);
    expect(page.percentageText).toBe('25% LISTO');
    expect(page.stepText).toBe('PASO 1 DE 4');
    expect(page.segments).toHaveLength(4);
    expect(page.segments[0].isActive).toBe(true);
    expect(page.segments[1].isActive).toBe(false);
    expect(page.segments[2].isActive).toBe(false);
    expect(page.segments[3].isActive).toBe(false);
    expect(page.badgeVariant.hasCheckIcon).toBe(false);
  });

  it('computes 100% and displays check icon when complete', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: 4,
      totalSteps: 4,
    });

    expect(page.percentage).toBe(100);
    expect(page.percentageText).toBe('100% LISTO');
    expect(page.badgeVariant.hasCheckIcon).toBe(true);
    expect(page.segments.every((s) => s.isActive)).toBe(true);
  });

  it('clamps to 100% when currentStep exceeds totalSteps', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: 6,
      totalSteps: 4,
    });

    expect(page.percentage).toBe(100);
    expect(page.percentageText).toBe('100% LISTO');
  });

  it('handles zero totalSteps safely by returning 0% and empty segments', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: 0,
      totalSteps: 0,
    });

    expect(page.percentage).toBe(0);
    expect(page.percentageText).toBe('0% LISTO');
    expect(page.segments).toHaveLength(0);
  });

  it('handles negative or NaN currentStep safely', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: NaN,
      totalSteps: 4,
    });

    expect(page.percentage).toBe(0);
    expect(page.percentageText).toBe('0% LISTO');
  });

  it('preserves referential stability via useMemo when props do not change', () => {
    const page = WizardProgressHeaderViewModelPageObject.render({
      currentStep: 2,
      totalSteps: 4,
    });

    const firstReturn = page.current;
    page.rerender({ currentStep: 2, totalSteps: 4 });

    expect(page.current).toBe(firstReturn);
  });
});
