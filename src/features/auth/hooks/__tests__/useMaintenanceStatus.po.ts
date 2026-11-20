import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import {
  useMaintenanceStatus,
  type UseMaintenanceStatusProps,
  type UseMaintenanceStatusReturn,
} from '../useMaintenanceStatus';

export class MaintenanceStatusHookPageObject {
  private readonly hookResult: RenderHookResult<
    UseMaintenanceStatusReturn,
    UseMaintenanceStatusProps | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseMaintenanceStatusReturn,
      UseMaintenanceStatusProps | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render = (
    props?: UseMaintenanceStatusProps,
  ): MaintenanceStatusHookPageObject => {
    const rendered = renderHook(
      (currentProps?: UseMaintenanceStatusProps) =>
        useMaintenanceStatus(currentProps),
      { initialProps: props },
    );
    return new MaintenanceStatusHookPageObject(rendered);
  };

  public get current(): UseMaintenanceStatusReturn {
    return this.hookResult.result.current;
  }

  public recheck = async (): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.recheckMaintenance();
    });
  };

  public advanceTimers = async (ms: number): Promise<void> => {
    await act(async () => {
      jest.advanceTimersByTime(ms);
    });
  };

  public waitForState = async (assertion: () => void): Promise<void> => {
    await waitFor(assertion);
  };
}
