import { esCR } from './es-CR';

export interface UseTranslationReturn {
  i18n: typeof esCR;
  t: typeof esCR;
}

export const useTranslation = (): UseTranslationReturn => {
  return {
    i18n: esCR,
    t: esCR,
  };
};
