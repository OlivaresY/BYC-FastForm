import * as SecureStore from "expo-secure-store";
import { view } from "./storybook.requires";

const Storybook = view.getStorybookUI({
  storage: {
    getItem: (key: string): Promise<string | null> =>
      SecureStore.getItemAsync(key),
    setItem: (key: string, value: string): Promise<void> =>
      SecureStore.setItemAsync(key, value),
  },
});

export default Storybook;
