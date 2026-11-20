import { act, renderHook } from '@testing-library/react-native';
import type { RenderHookResult } from '@testing-library/react-native';
import type { LoginCredentials } from '../../types/Auth.types';
import {
  useAuthViewModel,
  type UseAuthViewModelProps,
  type UseAuthViewModelReturn,
} from '../useAuthViewModel';

export class AuthViewModelPageObject {
  private readonly hookResult: RenderHookResult<
    UseAuthViewModelReturn,
    UseAuthViewModelProps
  >;

  public constructor(
    hookResult: RenderHookResult<UseAuthViewModelReturn, UseAuthViewModelProps>,
  ) {
    this.hookResult = hookResult;
  }

  public static render = (
    props: UseAuthViewModelProps,
  ): AuthViewModelPageObject => {
    const result = renderHook(
      (currentProps: UseAuthViewModelProps) => useAuthViewModel(currentProps),
      { initialProps: props },
    );
    return new AuthViewModelPageObject(result);
  };

  public get authError(): string | null {
    return this.hookResult.result.current.authError;
  }

  public get isLoading(): boolean {
    return this.hookResult.result.current.isLoading;
  }

  public clearError = (): void => {
    act(() => {
      this.hookResult.result.current.clearError();
    });
  };

  public startSignIn = (credentials: LoginCredentials): Promise<void> => {
    let pendingCall!: Promise<void>;
    act(() => {
      pendingCall = this.hookResult.result.current.signIn(credentials);
    });
    return pendingCall;
  };

  public signIn = async (credentials: LoginCredentials): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.signIn(credentials);
    });
  };

  public signOut = async (): Promise<void> => {
    await act(async () => {
      await this.hookResult.result.current.signOut?.();
    });
  };

  public settle = async (operation: () => Promise<void>): Promise<void> => {
    await act(async () => {
      await operation();
    });
  };
}
