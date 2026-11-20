import {
  createClient,
  type RealtimeClientOptions,
  type SupportedStorage,
  type WebSocketLike,
} from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const TEST_ENV = 'test' as const;
const TEST_ONLY_SUPABASE_URL = 'http://127.0.0.1:54321' as const;
const TEST_ONLY_SUPABASE_ANON_KEY = 'test-only-supabase-anon-key' as const;

export const SUPABASE_CONFIG_ERRORS = {
  ANON_KEY_REQUIRED:
    'Missing or empty EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable. Configure Supabase credentials before starting the app.',
  URL_INVALID:
    'Invalid EXPO_PUBLIC_SUPABASE_URL environment variable. Expected an http:// or https:// URL.',
  URL_REQUIRED:
    'Missing or empty EXPO_PUBLIC_SUPABASE_URL environment variable. Configure Supabase credentials before starting the app.',
} as const;

export interface SupabaseEnvSource {
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  EXPO_PUBLIC_SUPABASE_URL?: string;
  NODE_ENV?: string;
}

export interface ResolveSupabaseConfigOptions {
  allowTestFallback?: boolean;
}

export interface SupabaseConfig {
  anonKey: string;
  isTestFallback: boolean;
  url: string;
}

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Resolves and validates Supabase environment configuration.
 * Fails fast outside test runs when required public credentials are missing or invalid.
 */
export const resolveSupabaseConfig = (
  env: SupabaseEnvSource = process.env,
  options?: ResolveSupabaseConfigOptions,
): SupabaseConfig => {
  const nodeEnv = env.NODE_ENV ?? process.env.NODE_ENV;
  const isTestEnv = nodeEnv === TEST_ENV;
  const canUseTestFallback = isTestEnv && (options?.allowTestFallback ?? true);

  const trimmedUrl = env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const trimmedAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

  if (!trimmedUrl && !canUseTestFallback) {
    throw new Error(SUPABASE_CONFIG_ERRORS.URL_REQUIRED);
  }

  if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
    throw new Error(SUPABASE_CONFIG_ERRORS.URL_INVALID);
  }

  if (!trimmedAnonKey && !canUseTestFallback) {
    throw new Error(SUPABASE_CONFIG_ERRORS.ANON_KEY_REQUIRED);
  }

  return {
    anonKey: trimmedAnonKey || TEST_ONLY_SUPABASE_ANON_KEY,
    isTestFallback: !trimmedUrl || !trimmedAnonKey,
    url: trimmedUrl || TEST_ONLY_SUPABASE_URL,
  };
};

class TestNoopWebSocket implements WebSocketLike {
  public readonly CONNECTING = 0;
  public readonly OPEN = 1;
  public readonly CLOSING = 2;
  public readonly CLOSED = 3;
  public readonly readyState = 3;
  public readonly url: string;
  public readonly protocol = '';
  public onopen: WebSocketLike['onopen'] = null;
  public onmessage: WebSocketLike['onmessage'] = null;
  public onclose: WebSocketLike['onclose'] = null;
  public onerror: WebSocketLike['onerror'] = null;

  constructor(address: string | URL) {
    this.url = String(address);
  }

  public readonly close = (): void => undefined;
  public readonly send = (): void => undefined;
  public readonly addEventListener = (): void => undefined;
  public readonly removeEventListener = (): void => undefined;
}

const createRealtimeOptions = (): RealtimeClientOptions | undefined => {
  if (
    process.env.NODE_ENV === TEST_ENV &&
    typeof globalThis.WebSocket === 'undefined'
  ) {
    return {
      transport: TestNoopWebSocket,
    };
  }
  return undefined;
};

export interface SecureStoreModuleLike {
  deleteItemAsync: (key: string) => Promise<void>;
  getItemAsync: (key: string) => Promise<string | null>;
  isAvailableAsync?: () => Promise<boolean>;
  setItemAsync: (key: string, value: string) => Promise<void>;
}

/**
 * Builds a SecureStore adapter that degrades cleanly to a RAM-only Map when
 * `expo-secure-store` is unavailable (e.g., Web) or raises native Keychain/Keystore errors.
 */
export const createResilientSecureStoreAdapter = (
  storage: SecureStoreModuleLike = SecureStore,
  memoryFallback: Map<string, string> = new Map<string, string>(),
): SupportedStorage => {
  const canUseNativeStore = async (): Promise<boolean> => {
    try {
      if (typeof storage.isAvailableAsync === 'function') {
        return await storage.isAvailableAsync();
      }
      return (
        typeof storage.getItemAsync === 'function' &&
        typeof storage.setItemAsync === 'function' &&
        typeof storage.deleteItemAsync === 'function'
      );
    } catch {
      return false;
    }
  };

  return {
    getItem: async (key: string): Promise<string | null> => {
      if (await canUseNativeStore()) {
        try {
          const nativeValue = await storage.getItemAsync(key);
          return nativeValue ?? memoryFallback.get(key) ?? null;
        } catch {
          return memoryFallback.get(key) ?? null;
        }
      }
      return memoryFallback.get(key) ?? null;
    },
    removeItem: async (key: string): Promise<void> => {
      memoryFallback.delete(key);
      if (await canUseNativeStore()) {
        try {
          await storage.deleteItemAsync(key);
        } catch {
          // RAM fallback already cleared; suppress native deletion failures
        }
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      if (await canUseNativeStore()) {
        try {
          await storage.setItemAsync(key, value);
          memoryFallback.delete(key);
          return;
        } catch {
          // Degrade to RAM-only Map on native Keychain/Keystore write failures
        }
      }
      memoryFallback.set(key, value);
    },
  };
};

export const expoSecureStoreAdapter: SupportedStorage =
  createResilientSecureStoreAdapter();

const resolvedConfig = resolveSupabaseConfig(process.env);
const realtimeOptions = createRealtimeOptions();

export const supabase = createClient(
  resolvedConfig.url,
  resolvedConfig.anonKey,
  {
    auth: {
      autoRefreshToken: process.env.NODE_ENV !== TEST_ENV,
      detectSessionInUrl: false,
      persistSession: true,
      storage: expoSecureStoreAdapter,
    },
    ...(realtimeOptions ? { realtime: realtimeOptions } : {}),
  },
);
