import { createContext, useContext } from 'react';

export interface KeyboardAutoScrollContextValue {
  onInputFocus: (eventOrNode?: unknown) => void;
}

export const KeyboardAutoScrollContext =
  createContext<KeyboardAutoScrollContextValue | null>(null);

export const useKeyboardAutoScrollContext =
  (): KeyboardAutoScrollContextValue | null =>
    useContext(KeyboardAutoScrollContext);

