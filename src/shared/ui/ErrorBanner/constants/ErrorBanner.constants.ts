export const ERROR_BANNER_STYLES = {
  CONTAINER: 'w-full rounded-lg border border-red-200 bg-red-50 p-4',
  MESSAGE: 'text-sm font-medium text-brand-red',
  TITLE: 'mb-1 text-sm font-bold text-brand-red',
} as const;

export const ERROR_BANNER_TEST_IDS = {
  CONTAINER: 'error-banner-container',
  MESSAGE: 'error-banner-message',
  TITLE: 'error-banner-title',
} as const;
