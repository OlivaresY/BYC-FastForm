---
name: unit-testing-standards
description: Enforces Jest, React Native Testing Library, and the Page Object Model when writing unit or component tests in Expo. Use when adding tests for a component or a ViewModel.
---

# Unit Testing Standards for BYC FastForm Mobile

This skill is the **single source of truth** for how agents write tests in this repository.

Every UI test follows the **Page Object Model (POM)**, so suites stay readable and survive UI changes. A test that reaches into the React Native component tree directly is not acceptable here, no matter how small.

`prettier-standards` owns formatting and `eslint-standards` owns lint semantics — test files are not exempt. The `.tsx` / `use*ViewModel.ts` split belongs to `component-architecture`; this skill only dictates how to **test** each side of that split.

---

## 1. Mandatory Protocol

When you create or modify a component, a hook, or a ViewModel:

1. Write tests for **that unit only**. One feature at a time.
2. Place them in the feature's `tests/` folder (Section 3).
3. Encapsulate every query and every interaction in a `*.page.ts` (Section 4).
4. Mock all external I/O (Supabase, network) at the boundary (Section 8).
5. Run the suite for the touched path and leave it green:
   Command: `npx expo test src/features/<feature>`

### Scope

- Runner: Jest (via Expo)
- Rendering: `@testing-library/react-native`
- Interactions: `fireEvent` from `@testing-library/react-native`
- Environment: React Native
- Command: `npx expo test <path>`

---

## 2. Environment Setup (First run only)

If testing has not been configured yet, apply these dependencies and setup files.

### 2.1 Dependencies
Command: 
`npm i -D jest jest-expo @testing-library/react-native @testing-library/jest-native react-test-renderer`

### 2.2 `jest.config.js`
```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  clearMocks: true,
};
```

### 2.3 `jest.setup.ts`
```ts
import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';

afterEach(() => {
  cleanup();
});
```

---

## 3. Colocated Test Layout (FSD)

Tests live inside the feature domain folder:

```text
src/features/<feature-name>/
├── components/
│   └── <Feature>.tsx
├── hooks/
│   └── use<Feature>ViewModel.ts
└── tests/
    ├── <Feature>.page.ts              // Page Object: locators + actions
    ├── <Feature>.test.tsx             // Suite: the UI assertions
    └── use<Feature>ViewModel.test.ts  // Pure logic, no POM
```

---

## 4. Page Object Model (POM)

The Page Object owns **how** to find elements and **how** to operate them. The test owns **what** must be true. 

Write Page Objects as **factory functions**. Do not use classes.

### The Page Object
```ts
import { screen, fireEvent } from '@testing-library/react-native';

export const createCreditFormPage = () => {
  const amountInput = () => screen.getByPlaceholderText('Monto solicitado');
  const submitButton = () => screen.getByText('Enviar Solicitud');
  const findSuccessBanner = () => screen.findByText('Solicitud enviada con éxito');

  const fillAmount = (value: string) => {
    fireEvent.changeText(amountInput(), value);
  };

  const submit = () => {
    fireEvent.press(submitButton());
  };

  return {
    amountInput,
    submitButton,
    findSuccessBanner,
    fillAmount,
    submit,
  };
};
```

### Rule: No assertions in the Page Object
**Incorrect:**
```ts
const expectSuccess = () => {
  expect(successBanner()).toBeVisible();
};
```

### Rule: No raw queries in the test file
`screen.getBy*`, `screen.findBy*`, and `fireEvent` must NOT appear in a `.test.tsx`. Only `render` and the Page Object factory do.

**Correct (.test.tsx):**
```tsx
await page.fillAmount('5000');
await page.submit();
```

---

## 5. Accessible Queries

Query the way a user interacts. In React Native, use:
1. `getByText(text)`
2. `getByPlaceholderText(placeholder)`
3. `getByLabelText(label)` (targets `accessibilityLabel`)

`getByTestId` is a last resort. If used, the component must have a `testID` prop and a comment explaining why it was needed.

---

## 6. AAA Structure

Every test reads as three visible blocks.

```tsx
it('shows the success banner after a successful submit', async () => {
  // Arrange
  const mockSubmit = jest.fn().mockResolvedValue(true);
  jest.spyOn(creditService, 'createCreditApplication').mockImplementation(mockSubmit);
  
  render(<CreditApplicationForm/>);
  const page = createCreditFormPage();

  // Act
  page.fillAmount('10000');
  page.submit();

  // Assert
  expect(await page.findSuccessBanner()).toBeTruthy();
});
```
Test names state the behaviour: `'does not submit when the amount is empty'`, never `'test submit 2'`.

---

## 7. Mocking at the Boundary

Tests never hit a real backend or the real Supabase database.

### Supabase Stubbing
Always mock Supabase responses at the Service layer or using Jest module mocks.

```ts
jest.mock('@/shared/utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
  },
}));
```

---

## 8. ViewModel Tests

ViewModels (hooks) are tested with `renderHook`, **without** a Page Object — there is no UI to locate.

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useCreditFormViewModel } from '../hooks/useCreditFormViewModel';

describe('useCreditFormViewModel', () => {
  it('toggles isSubmitting during submission', async () => {
    // Arrange
    const { result } = renderHook(() => useCreditFormViewModel());

    // Act
    await act(async () => {
      await result.current.handleSubmit(mockData);
    });

    // Assert
    expect(result.current.isSubmitting).toBe(false);
  });
});
```

**Rule of Thumb:**
- If the user can see it, assert it in `<Feature>.test.tsx` through the POM.
- If it is internal state the UI does not render directly, assert it in `use<Feature>ViewModel.test.ts`.

---

## 9. Checklist

Before finishing a test change:
- [ ] Tests live in `src/features/<feature>/tests/`.
- [ ] Interactions and locators are encapsulated in `<Feature>.page.ts`.
- [ ] No `expect` in the `.page.ts`.
- [ ] No `screen.getBy*` or `fireEvent` in the `.test.tsx`.
- [ ] Each test reads Arrange / Act / Assert.
- [ ] Supabase / Network calls are completely mocked.
- [ ] ViewModel logic is covered by `renderHook` tests without a POM.
- [ ] `npx expo test` passes.