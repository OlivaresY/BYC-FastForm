import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import {
  useHistoryViewModel,
  type UseHistoryViewModelOptions,
} from '../useHistoryViewModel';
import type {
  HistoryDossierItem,
  HistoryStatusFilter,
  UseHistoryViewModelResult,
} from '../../types';

export class HistoryViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseHistoryViewModelResult,
    UseHistoryViewModelOptions | undefined
  >;

  public constructor(
    hookResult: RenderHookResult<
      UseHistoryViewModelResult,
      UseHistoryViewModelOptions | undefined
    >,
  ) {
    this.hookResult = hookResult;
  }

  public static render = (
    options?: UseHistoryViewModelOptions,
  ): HistoryViewModelPageObject => {
    const rendered = renderHook(
      (currentOptions?: UseHistoryViewModelOptions) =>
        useHistoryViewModel(currentOptions),
      { initialProps: options },
    );

    return new HistoryViewModelPageObject(rendered);
  };

  public get current(): UseHistoryViewModelResult {
    return this.hookResult.result.current;
  }

  public rerender = (options?: UseHistoryViewModelOptions): void => {
    this.hookResult.rerender(options);
  };

  public waitForState = async (assertion: () => void): Promise<void> => {
    await waitFor(assertion);
  };

  public setSearchQuery = (query: string): void => {
    act(() => {
      this.hookResult.result.current.setSearchQuery(query);
    });
  };

  public clearSearch = (): void => {
    act(() => {
      this.hookResult.result.current.clearSearch();
    });
  };

  public clearQuickPrintError = (): void => {
    act(() => {
      this.hookResult.result.current.clearQuickPrintError();
    });
  };

  public setSelectedFilter = (filter: HistoryStatusFilter): void => {
    act(() => {
      this.hookResult.result.current.setSelectedFilter(filter);
    });
  };

  public openNotifications = (): void => {
    act(() => {
      this.hookResult.result.current.openNotifications();
    });
  };

  public closeNotifications = (): void => {
    act(() => {
      this.hookResult.result.current.closeNotifications();
    });
  };

  public markAsRead = (notificationId: string): void => {
    act(() => {
      this.hookResult.result.current.markAsRead(notificationId);
    });
  };

  public markAllAsRead = (): void => {
    act(() => {
      this.hookResult.result.current.markAllAsRead();
    });
  };

  public loadMore = async (): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.loadMore();
    });
  };

  public startLoadMore = (): Promise<void> => {
    let pendingLoadMore!: Promise<void>;
    act(() => {
      pendingLoadMore = this.hookResult.result.current.loadMore();
    });
    return pendingLoadMore;
  };

  public refresh = async (): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.refresh();
    });
  };

  public startRefresh = (): Promise<void> => {
    let pendingRefresh!: Promise<void>;
    act(() => {
      pendingRefresh = this.hookResult.result.current.refresh();
    });
    return pendingRefresh;
  };

  public retry = async (): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.retry();
    });
  };

  public requestQuickPrint = async (
    dossier: HistoryDossierItem,
  ): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.requestQuickPrint(dossier);
    });
  };

  public startQuickPrint = (dossier: HistoryDossierItem): Promise<void> => {
    let pendingPrint!: Promise<void>;
    act(() => {
      pendingPrint = this.hookResult.result.current.requestQuickPrint(dossier);
    });
    return pendingPrint;
  };

  public settle = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };

  public unmount = (): void => {
    this.hookResult.unmount();
  };
}
