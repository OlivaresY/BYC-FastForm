import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_FALLBACK_URL = 'https://placeholder.supabase.co';
const SUPABASE_FALLBACK_ANON_KEY = 'placeholder-anon-key';
const TEST_ENV = 'test';

export const expoSecureStoreAdapter: SupportedStorage = {
  getItem: (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),
  removeItem: (key: string): Promise<void> => SecureStore.deleteItemAsync(key),
  setItem: (key: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value),
};

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || SUPABASE_FALLBACK_URL;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  SUPABASE_FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: process.env.NODE_ENV !== TEST_ENV,
    detectSessionInUrl: false,
    persistSession: true,
    storage: expoSecureStoreAdapter,
  },
});
