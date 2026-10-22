import { renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import { useWizardProgressHeaderViewModel } from '../hooks/useWizardProgressHeaderViewModel';
import type {
  UseWizardProgressHeaderViewModelProps,
  UseWizardProgressHeaderViewModelReturn,
  WizardProgressSegment,
} from '../hooks/useWizardProgressHeaderViewModel';
import type {
  WizardProgressHeaderBadgeVariant,
  WizardProgressHeaderStepIconConfig,
} from '../constants/WizardProgressHeader.constants';

export class WizardProgressHeaderViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseWizardProgressHeaderViewModelReturn,
    UseWizardProgressHeaderViewModelProps
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseWizardProgressHeaderViewModelReturn,
      UseWizardProgressHeaderViewModelProps
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render(
    props: UseWizardProgressHeaderViewModelProps,
  ): WizardProgressHeaderViewModelPageObject {
    const result = renderHook(
      (currentProps: UseWizardProgressHeaderViewModelProps) =>
        useWizardProgressHeaderViewModel(currentProps),
      { initialProps: props },
    );
    return new WizardProgressHeaderViewModelPageObject(result);
  }

  public rerender(props: UseWizardProgressHeaderViewModelProps): this {
    this.hookResult.rerender(props);
    return this;
  }

  public get current(): UseWizardProgressHeaderViewModelReturn {
    return this.hookResult.result.current;
  }

  public get percentage(): number {
    return this.hookResult.result.current.percentage;
  }

  public get percentageText(): string {
    return this.hookResult.result.current.percentageText;
  }

  public get stepText(): string {
    return this.hookResult.result.current.stepText;
  }

  public get segments(): readonly WizardProgressSegment[] {
    return this.hookResult.result.current.segments;
  }

  public get badgeVariant(): WizardProgressHeaderBadgeVariant {
    return this.hookResult.result.current.badgeVariant;
  }

  public get stepIconConfig(): WizardProgressHeaderStepIconConfig {
    return this.hookResult.result.current.stepIconConfig;
  }
}
