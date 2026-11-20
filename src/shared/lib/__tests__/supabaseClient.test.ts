import * as SecureStore from 'expo-secure-store';
import {
  SUPABASE_CONFIG_ERRORS,
  createResilientSecureStoreAdapter,
  expoSecureStoreAdapter,
  resolveSupabaseConfig,
  supabase,
} from '../supabaseClient';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  setItemAsync: jest.fn(),
}));

describe('resolveSupabaseConfig', () => {
  const VALID_URL = 'https://example-project.supabase.co';
  const VALID_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-key';

  it('resolves trimmed URL and anon key when valid credentials are provided', () => {
    // Arrange
    const env = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: `  ${VALID_ANON_KEY}  `,
      EXPO_PUBLIC_SUPABASE_URL: `  ${VALID_URL}  `,
      NODE_ENV: 'production',
    };

    // Act
    const config = resolveSupabaseConfig(env);

    // Assert
    expect(config).toEqual({
      anonKey: VALID_ANON_KEY,
      isTestFallback: false,
      url: VALID_URL,
    });
  });

  it('throws an explicit configuration error when EXPO_PUBLIC_SUPABASE_URL is missing with allowTestFallback false', () => {
    // Arrange
    const envMissing = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: VALID_ANON_KEY,
      NODE_ENV: 'test',
    };
    const envBlank = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: VALID_ANON_KEY,
      EXPO_PUBLIC_SUPABASE_URL: '   ',
      NODE_ENV: 'test',
    };

    // Act & Assert
    expect(() =>
      resolveSupabaseConfig(envMissing, { allowTestFallback: false }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.URL_REQUIRED);
    expect(() =>
      resolveSupabaseConfig(envBlank, { allowTestFallback: false }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.URL_REQUIRED);
  });

  it('throws an explicit configuration error when EXPO_PUBLIC_SUPABASE_ANON_KEY is missing with allowTestFallback false', () => {
    // Arrange
    const envMissing = {
      EXPO_PUBLIC_SUPABASE_URL: VALID_URL,
      NODE_ENV: 'test',
    };
    const envBlank = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: '  \t\n ',
      EXPO_PUBLIC_SUPABASE_URL: VALID_URL,
      NODE_ENV: 'test',
    };

    // Act & Assert
    expect(() =>
      resolveSupabaseConfig(envMissing, { allowTestFallback: false }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.ANON_KEY_REQUIRED);
    expect(() =>
      resolveSupabaseConfig(envBlank, { allowTestFallback: false }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.ANON_KEY_REQUIRED);
  });

  it('fails fast in non-test environments when credentials are missing even without options', () => {
    // Arrange
    const prodEnv = {
      NODE_ENV: 'production',
    };
    const devEnv = {
      EXPO_PUBLIC_SUPABASE_URL: VALID_URL,
      NODE_ENV: 'development',
    };

    // Act & Assert
    expect(() => resolveSupabaseConfig(prodEnv)).toThrow(
      SUPABASE_CONFIG_ERRORS.URL_REQUIRED,
    );
    expect(() => resolveSupabaseConfig(devEnv)).toThrow(
      SUPABASE_CONFIG_ERRORS.ANON_KEY_REQUIRED,
    );
    expect(() =>
      resolveSupabaseConfig(prodEnv, { allowTestFallback: true }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.URL_REQUIRED);
  });

  it('throws an explicit configuration error when EXPO_PUBLIC_SUPABASE_URL is not a valid HTTP(S) URL', () => {
    // Arrange
    const invalidEnv = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: VALID_ANON_KEY,
      EXPO_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
      NODE_ENV: 'production',
    };
    const unsupportedProtocolEnv = {
      EXPO_PUBLIC_SUPABASE_ANON_KEY: VALID_ANON_KEY,
      EXPO_PUBLIC_SUPABASE_URL: 'ftp://example-project.supabase.co',
      NODE_ENV: 'test',
    };

    // Act & Assert
    expect(() => resolveSupabaseConfig(invalidEnv)).toThrow(
      SUPABASE_CONFIG_ERRORS.URL_INVALID,
    );
    expect(() =>
      resolveSupabaseConfig(unsupportedProtocolEnv, {
        allowTestFallback: false,
      }),
    ).toThrow(SUPABASE_CONFIG_ERRORS.URL_INVALID);
  });

  it('uses controlled test fallback in NODE_ENV test when allowTestFallback is true', () => {
    // Arrange
    const emptyTestEnv = {
      NODE_ENV: 'test',
    };

    // Act
    const config = resolveSupabaseConfig(emptyTestEnv, {
      allowTestFallback: true,
    });

    // Assert
    expect(config.isTestFallback).toBe(true);
    expect(config.url).toBe('http://127.0.0.1:54321');
    expect(config.anonKey).toBe('test-only-supabase-anon-key');
  });
});

describe('supabaseClient and expoSecureStoreAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes the singleton supabase client cleanly under test environment', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('delegates storage calls directly to expo-secure-store when available', async () => {
    // Arrange
    const isAvailableSpy = jest
      .mocked(SecureStore.isAvailableAsync)
      .mockResolvedValue(true);
    const getItemSpy = jest
      .mocked(SecureStore.getItemAsync)
      .mockResolvedValueOnce('stored-session');
    const setItemSpy = jest
      .mocked(SecureStore.setItemAsync)
      .mockResolvedValueOnce();
    const deleteItemSpy = jest
      .mocked(SecureStore.deleteItemAsync)
      .mockResolvedValueOnce();

    // Act
    const fetched = await expoSecureStoreAdapter.getItem('sb-token');
    await expoSecureStoreAdapter.setItem('sb-token', 'new-value');
    await expoSecureStoreAdapter.removeItem('sb-token');

    // Assert
    expect(isAvailableSpy).toHaveBeenCalled();
    expect(fetched).toBe('stored-session');
    expect(getItemSpy).toHaveBeenCalledWith('sb-token');
    expect(setItemSpy).toHaveBeenCalledWith('sb-token', 'new-value');
    expect(deleteItemSpy).toHaveBeenCalledWith('sb-token');
  });

  it('degrades cleanly to RAM-only Map fallback without throwing when SecureStore.isAvailableAsync returns false', async () => {
    // Arrange
    jest.mocked(SecureStore.isAvailableAsync).mockResolvedValue(false);
    const getItemSpy = jest.mocked(SecureStore.getItemAsync);
    const setItemSpy = jest.mocked(SecureStore.setItemAsync);
    const deleteItemSpy = jest.mocked(SecureStore.deleteItemAsync);
    const adapter = createResilientSecureStoreAdapter();

    // Act & Assert
    await expect(
      adapter.setItem('sb-session', 'ram-token-value'),
    ).resolves.toBeUndefined();
    await expect(adapter.getItem('sb-session')).resolves.toBe(
      'ram-token-value',
    );
    await expect(adapter.removeItem('sb-session')).resolves.toBeUndefined();
    await expect(adapter.getItem('sb-session')).resolves.toBeNull();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(deleteItemSpy).not.toHaveBeenCalled();
  });

  it('falls back to RAM-only Map without throwing when native SecureStore methods or availability checks reject', async () => {
    // Arrange
    const throwingAdapter = createResilientSecureStoreAdapter({
      deleteItemAsync: jest
        .fn()
        .mockRejectedValue(new Error('Keystore locked')),
      getItemAsync: jest
        .fn()
        .mockRejectedValue(new Error('Keychain unavailable')),
      isAvailableAsync: jest.fn().mockResolvedValue(true),
      setItemAsync: jest
        .fn()
        .mockRejectedValue(new Error('Keychain write failed')),
    });

    const unavailableCheckAdapter = createResilientSecureStoreAdapter({
      deleteItemAsync: jest.fn(),
      getItemAsync: jest.fn(),
      isAvailableAsync: jest
        .fn()
        .mockRejectedValue(new Error('Native bridge error')),
      setItemAsync: jest.fn(),
    });

    // Act & Assert - native method rejections fallback gracefully
    await expect(
      throwingAdapter.setItem('sb-key', 'fallback-secret'),
    ).resolves.toBeUndefined();
    await expect(throwingAdapter.getItem('sb-key')).resolves.toBe(
      'fallback-secret',
    );
    await expect(throwingAdapter.removeItem('sb-key')).resolves.toBeUndefined();
    await expect(throwingAdapter.getItem('sb-key')).resolves.toBeNull();

    // Act & Assert - rejecting isAvailableAsync degrades gracefully
    await expect(
      unavailableCheckAdapter.setItem('sb-key-2', 'ephemeral-jwt'),
    ).resolves.toBeUndefined();
    await expect(unavailableCheckAdapter.getItem('sb-key-2')).resolves.toBe(
      'ephemeral-jwt',
    );
  });
});
