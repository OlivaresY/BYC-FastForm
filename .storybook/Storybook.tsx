import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { view } from './storybook.requires';

const storybookStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return typeof window !== 'undefined'
          ? window.localStorage.getItem(key)
          : null;
      } catch {
        return null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      } catch {
        // Silently handle quota or storage access errors on web
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
};

const Storybook = view.getStorybookUI({
  storage: storybookStorage,
});

export default Storybook;
