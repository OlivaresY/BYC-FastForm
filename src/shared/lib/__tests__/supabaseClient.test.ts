import * as SecureStore from 'expo-secure-store';
import {
  SUPABASE_CONFIG_ERRORS,
  expoSecureStoreAdapter,
  resolveSupabaseConfig,
  supabase,
} from '../supabaseClient';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
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

  it('delegates storage calls directly to expo-secure-store', async () => {
    // Arrange
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
    expect(fetched).toBe('stored-session');
    expect(getItemSpy).toHaveBeenCalledWith('sb-token');
    expect(setItemSpy).toHaveBeenCalledWith('sb-token', 'new-value');
    expect(deleteItemSpy).toHaveBeenCalledWith('sb-token');
  });
});
