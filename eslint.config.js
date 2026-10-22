// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@testing-library/react-native',
              message:
                'Direct imports of @testing-library/react-native in test files are forbidden. Encapsulate all interactions and queries inside *.po.ts Page Objects.',
            },
          ],
        },
      ],
    },
  },
]);
