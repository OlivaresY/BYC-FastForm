---
name: page-object-model
description: Enforces the Page Object Model (POM) pattern for React Native Testing Library (RNTL) using strongly-typed .po.ts classes, fluent method chaining, and complete UI selector decoupling across automotive credit features.
---

# Page Object Model (POM) Standards for BYC FastForm Mobile

This skill is the **single source of truth** for authoring and maintaining component tests using the **Page Object Model (POM)** pattern within the BYC FastForm & CoriMotors mobile application.

The Page Object Model creates an impenetrable boundary between **how** user interface elements are located and manipulated (encapsulated in `.po.ts` classes) and **what** business behavior is verified (declared in `.test.tsx` suites).

Adhering to this standard guarantees that test suites remain resilient against UI restyling, component refactoring, and accessibility label updates, while delivering clean, readable, fluent test specifications for automotive credit workflows.

---

## 1. Architectural Synergy: MVVM & The Page Object Model

In our Feature-Sliced Design (FSD) architecture, application features are partitioned into strict Model-View-ViewModel (MVVM) layers. The Page Object Model mirrors this exact separation of concerns in the automated testing suite:

| Application Layer | File Type | Responsibility | Testing Counterpart | Testing Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **View** | `<Feature>.tsx` | Pure JSX presentation, layout, NativeWind tokens | `<Feature>.po.ts` | Locates elements, encapsulates `testID`s, executes gestures |
| **ViewModel** | `use<Feature>ViewModel.ts` | State orchestration, validation, business calculations | `use<Feature>ViewModel.test.ts` | Tests state transitions via `renderHook` in isolation |
| **Model** | `services/*.ts` | Supabase RPCs, REST endpoints, storage | `jest.mock(...)` | Boundary stubs configured in test setup / Arrange phase |
| **Contract** | `<Feature>.test.tsx` | Test orchestration | **The Test Suite** | Declares user scenarios and asserts domain outcomes |

```text
+-------------------------------------------------------------+
|                      TEST SUITE (.test.tsx)                 |
|   - Arrange: Configures service stubs & renders via POM     |
|   - Act: Executes business actions via fluent chaining      |
|   - Assert: Verifies state against POM element getters      |
+------------------------------+------------------------------+
                               | calls fluent methods & getters
                               v
+-------------------------------------------------------------+
|                   PAGE OBJECT CLASS (.po.ts)                |
|   - Encapsulates testIDs & RNTL selectors                   |
|   - Executes fireEvent (changeText, press, scroll)          |
|   - Returns `this` / `Promise<this>` for fluent chaining    |
|   - Exposes strongly-typed ReactTestInstance getters        |
+------------------------------+------------------------------+
                               | queries rendered tree
                               v
+-------------------------------------------------------------+
|                     VIEW COMPONENT (.tsx)                   |
|   - Pure presentation with testID attributes                |
|   - Bound to ViewModel actions and state                    |
+-------------------------------------------------------------+
```

---

## 2. The Four Inviolable Governance Rules

Every engineer and AI agent writing UI tests in this codebase must strictly adhere to these four cardinal rules. Violations will cause automated CI test review failure.

### Rule 1: Dedicated `.po.ts` Class Mandate
Every UI test suite (`<Feature>.test.tsx`) **MUST** be paired with a dedicated Page Object class residing in a `<Feature>.po.ts` file in the same `tests/` directory. 
- Page Objects must be structured as **TypeScript classes**. 
- Free-floating utility functions or ad-hoc test helper files are prohibited.

### Rule 2: Complete UI Selector Decoupling
Test assertion files (`.test.tsx`) must be completely agnostic of UI selectors:
- **Zero testIDs in test files:** `testID` string literals (e.g., `'advisor-login-submit-button'`) must **never** appear inside `.test.tsx`.
- **Zero direct RNTL queries in test files:** Direct invocations of `screen.getByTestId()`, `screen.getByText()`, `screen.findByText()`, `screen.queryByTestId()`, or container query equivalents inside `.test.tsx` are strictly prohibited.
- All selectors are defined in feature constants (`*.constants.ts`) and accessed solely by the `.po.ts` class.

### Rule 3: Zero Assertions in Page Objects
The Page Object owns **interaction**, never **verification**:
- Page Objects must **NEVER** contain Jest matchers (`expect(...)`, `toBe()`, `toBeTruthy()`, `toHaveBeenCalled()`).
- The Page Object exposes typed getters (`ReactTestInstance` or `null`) and promise-based element finders so that the `.test.tsx` file retains full ownership of assertions.

### Rule 4: Strict TypeScript Typing & Fluent Method Chaining
All interaction helpers on the Page Object must return `this` (or `Promise<this>` for asynchronous steps):
- This enforces the **fluent interface pattern**, enabling clean, sequential multi-step business actions.
- All method parameters, props, and getters must be strictly typed using domain models and interfaces. The `any` type is strictly forbidden.

---

## 3. Colocated Feature Directory Structure (FSD)

All test files are colocated inside the feature domain folder under `src/features/<feature-name>/tests/`:

```text
src/features/credit-application/
├── components/
│   ├── CreditApplicationForm.tsx        # Pure View component
│   └── VehicleQuoteSummary.tsx          # Sub-view primitive
├── constants/
│   └── CreditApplication.constants.ts   # UI labels, testIDs, defaults (as const, A-Z)
├── hooks/
│   └── useCreditApplicationViewModel.ts # State & credit validation logic
├── services/
│   └── creditEvaluationService.ts       # Supabase credit scoring service
├── types/
│   └── CreditApplication.types.ts       # TypeScript interfaces & Zod schemas
└── tests/
    ├── CreditApplicationForm.po.ts      # Dedicated Page Object CLASS
    ├── CreditApplicationForm.test.tsx   # Component UI test suite (POM-based)
    └── useCreditApplicationViewModel.test.ts # Pure ViewModel hook test (renderHook)
```

> **Note on Hook Tests:** ViewModel unit tests (`use*ViewModel.test.ts`) test business logic and custom hook state via `renderHook`. They do not render JSX and therefore **do not** use a Page Object.

---

## 4. Page Object Class Anatomy & Technical Contract

Every Page Object class must implement the following structural anatomy:

```ts
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { RenderAPI } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';

export class FeaturePageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  /**
   * Static factory method to render the component and initialize the Page Object.
   */
  public static render(props: FeatureComponentProps): FeaturePageObject {
    const renderApi = render(<FeatureComponent {...props} />);
    return new FeaturePageObject(renderApi);
  }

  // =========================================================================
  // Element Getters (Synchronous & Nullable Queries)
  // =========================================================================

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(FEATURE_TEST_IDS.SUBMIT_BUTTON);
  }

  public get errorMessageBanner(): ReactTestInstance | null {
    return screen.queryByTestId(FEATURE_TEST_IDS.ERROR_BANNER);
  }

  // =========================================================================
  // Element Finders (Asynchronous / Delayed Queries)
  // =========================================================================

  public async findSuccessBanner(): Promise<ReactTestInstance> {
    return screen.findByTestId(FEATURE_TEST_IDS.SUCCESS_BANNER);
  }

  // =========================================================================
  // Fluent Action Helpers (Method Chaining: return this or Promise<this>)
  // =========================================================================

  public fillInputField(value: string): this {
    fireEvent.changeText(screen.getByTestId(FEATURE_TEST_IDS.INPUT_FIELD), value);
    return this;
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public async submitForm(): Promise<this> {
    this.pressSubmit();
    return this;
  }
}
```

### Getter Classification Guide:
1. **Synchronous Present (`get element(): ReactTestInstance`):** Uses `screen.getByTestId()`. Use when the element is guaranteed to be in the DOM immediately.
2. **Synchronous Optional/Absence (`get element(): ReactTestInstance | null`):** Uses `screen.queryByTestId()`. Use when asserting that an element does not exist or conditional banners before an action.
3. **Asynchronous Present (`async findElement(): Promise<ReactTestInstance>`):** Uses `screen.findByTestId()`. Use when elements appear after an async operation, network resolution, or animation.

---

## 5. Fluent Method Chaining Rules

Fluent method chaining allows user interaction sequences to read as natural, readable business narratives.

### 5.1 Synchronous Chaining (`return this`)
When interactions execute synchronously (e.g., text inputs, checkbox toggles, tab switches):
```ts
public fillClientName(name: string): this {
  fireEvent.changeText(this.clientNameInput, name);
  return this;
}

public selectVehicleTier(tier: CreditTier): this {
  fireEvent.press(screen.getByTestId(tierSelectorTestId(tier)));
  return this;
}
```

Usage in `.test.tsx`:
```tsx
page
  .fillClientName('Carlos Alvarado')
  .selectVehicleTier('PREMIUM')
  .toggleGuarantorIncluded();
```

### 5.2 Asynchronous Chaining (`return Promise<this>`)
When an action triggers transitions that require awaiting async side-effects inside the helper:
```ts
public async searchClientByNationalId(id: string): Promise<this> {
  fireEvent.changeText(this.nationalIdInput, id);
  fireEvent.press(this.searchButton);
  return this;
}
```

Usage in `.test.tsx`:
```tsx
await page
  .fillAdvisorPin('4481')
  .searchClientByNationalId('1-1152-0491');
```

### 5.3 Composite Helper Methods
For repetitive form setups across multiple tests, provide higher-order composite fluent helpers that accept strongly-typed parameter bundles:
```ts
public fillCompleteApplication(data: CreditApplicationFormData): this {
  return this
    .fillIdentification(data.identification)
    .enterMonthlyIncome(data.monthlyIncome)
    .selectVehicleModel(data.vehicleModel)
    .enterDownPayment(data.downPayment)
    .selectTenureMonths(data.tenureMonths);
}
```

---

## 6. Practical Automotive Credit Examples

### Example 1: Advisor Login & Dealership Branch Selection

This workflow validates advisor authentication, PIN authorization, and dealership branch assignment at CoriMotors.

#### 1. Constants Definition: `src/features/advisor-auth/constants/AdvisorLogin.constants.ts`
```ts
export const ADVISOR_LOGIN_TEST_IDS = {
  BRANCH_SELECTOR: 'advisor-login-branch-selector',
  BRANCH_OPTION_PREFIX: 'advisor-login-branch-option-',
  ERROR_BANNER: 'advisor-login-error-banner',
  IDENTIFICATION_INPUT: 'advisor-login-identification-input',
  LOGIN_BUTTON: 'advisor-login-submit-button',
  PIN_INPUT: 'advisor-login-pin-input',
  SUCCESS_BANNER: 'advisor-login-success-banner',
} as const;

export const ADVISOR_LOGIN_BRANCHES = {
  CURRIDABAT: 'Curridabat',
  HEREDIA: 'Heredia',
  LIBERIA: 'Liberia',
  LINDORA: 'Lindora',
  URUCA: 'La Uruca',
} as const;
```

#### 2. Page Object Class: `src/features/advisor-auth/tests/AdvisorLoginForm.po.ts`
```ts
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { RenderAPI } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { AdvisorLoginForm } from '../components/AdvisorLoginForm';
import { ADVISOR_LOGIN_TEST_IDS } from '../constants/AdvisorLogin.constants';
import type { AdvisorLoginFormProps } from '../types/AdvisorAuth.types';

export class AdvisorLoginFormPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(
    props: AdvisorLoginFormProps
  ): AdvisorLoginFormPageObject {
    const renderApi = render(<AdvisorLoginForm {...props} />);
    return new AdvisorLoginFormPageObject(renderApi);
  }

  // --- Element Getters ---

  public get identificationInput(): ReactTestInstance {
    return screen.getByTestId(ADVISOR_LOGIN_TEST_IDS.IDENTIFICATION_INPUT);
  }

  public get pinInput(): ReactTestInstance {
    return screen.getByTestId(ADVISOR_LOGIN_TEST_IDS.PIN_INPUT);
  }

  public get branchSelector(): ReactTestInstance {
    return screen.getByTestId(ADVISOR_LOGIN_TEST_IDS.BRANCH_SELECTOR);
  }

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(ADVISOR_LOGIN_TEST_IDS.LOGIN_BUTTON);
  }

  public get errorBanner(): ReactTestInstance | null {
    return screen.queryByTestId(ADVISOR_LOGIN_TEST_IDS.ERROR_BANNER);
  }

  public async findSuccessBanner(): Promise<ReactTestInstance> {
    return screen.findByTestId(ADVISOR_LOGIN_TEST_IDS.SUCCESS_BANNER);
  }

  // --- Fluent User Actions ---

  public fillAdvisorIdentification(id: string): this {
    fireEvent.changeText(this.identificationInput, id);
    return this;
  }

  public fillPin(pin: string): this {
    fireEvent.changeText(this.pinInput, pin);
    return this;
  }

  public selectBranch(branchKey: string): this {
    fireEvent.press(this.branchSelector);
    const branchOption = screen.getByTestId(
      `${ADVISOR_LOGIN_TEST_IDS.BRANCH_OPTION_PREFIX}${branchKey}`
    );
    fireEvent.press(branchOption);
    return this;
  }

  public pressLogin(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public loginWithCredentials(id: string, pin: string, branch: string): this {
    return this
      .selectBranch(branch)
      .fillAdvisorIdentification(id)
      .fillPin(pin)
      .pressLogin();
  }
}
```

#### 3. Test Suite: `src/features/advisor-auth/tests/AdvisorLoginForm.test.tsx`
```tsx
import React from 'react';
import { ADVISOR_LOGIN_BRANCHES } from '../constants/AdvisorLogin.constants';
import { AdvisorLoginFormPageObject } from './AdvisorLoginForm.po';

describe('AdvisorLoginForm Component', () => {
  it('authenticates advisor successfully when valid credentials and branch are submitted', async () => {
    // Arrange
    const handleLoginSuccess = jest.fn();
    const page = AdvisorLoginFormPageObject.render({
      onLoginSuccess: handleLoginSuccess,
    });

    // Act
    page.loginWithCredentials(
      'ADV-9021',
      '8492',
      ADVISOR_LOGIN_BRANCHES.LINDORA
    );

    // Assert
    expect(await page.findSuccessBanner()).toBeTruthy();
    expect(page.errorBanner).toBeNull();
    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
    expect(handleLoginSuccess).toHaveBeenCalledWith({
      advisorId: 'ADV-9021',
      branch: ADVISOR_LOGIN_BRANCHES.LINDORA,
    });
  });

  it('displays validation error banner and blocks submission when PIN is incomplete', () => {
    // Arrange
    const handleLoginSuccess = jest.fn();
    const page = AdvisorLoginFormPageObject.render({
      onLoginSuccess: handleLoginSuccess,
    });

    // Act
    page
      .selectBranch(ADVISOR_LOGIN_BRANCHES.URUCA)
      .fillAdvisorIdentification('ADV-9021')
      .fillPin('12') // Incomplete 2-digit PIN
      .pressLogin();

    // Assert
    expect(page.errorBanner).toBeTruthy();
    expect(handleLoginSuccess).not.toHaveBeenCalled();
    expect(page.submitButton).toBeDisabled();
  });
});
```

---

### Example 2: Client Credit Intake & Vehicle Financing Form

This workflow models the automotive credit application intake at CoriMotors: client national identity validation, monthly income verification, BYD electric vehicle selection, down payment (prima), and loan term selection.

#### 1. Constants: `src/features/credit-application/constants/CreditApplication.constants.ts`
```ts
export const CREDIT_APP_TEST_IDS = {
  CALCULATED_MONTHLY_FEE: 'credit-app-calculated-monthly-fee',
  DOWN_PAYMENT_INPUT: 'credit-app-down-payment-input',
  DOWN_PAYMENT_WARNING: 'credit-app-down-payment-warning',
  MONTHLY_INCOME_INPUT: 'credit-app-monthly-income-input',
  NATIONAL_ID_INPUT: 'credit-app-national-id-input',
  SUBMIT_BUTTON: 'credit-app-submit-button',
  TENURE_MONTHS_SELECTOR: 'credit-app-tenure-months-selector',
  TENURE_OPTION_PREFIX: 'credit-app-tenure-option-',
  VEHICLE_MODEL_SELECTOR: 'credit-app-vehicle-model-selector',
  VEHICLE_OPTION_PREFIX: 'credit-app-vehicle-option-',
} as const;

export const VEHICLE_MODELS = {
  BYD_HAN_EV: 'byd-han-ev',
  BYD_SONG_PLUS: 'byd-song-plus-dmi',
  BYD_YUAN_PRO: 'byd-yuan-pro',
} as const;
```

#### 2. Page Object Class: `src/features/credit-application/tests/CreditApplicationForm.po.ts`
```ts
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { RenderAPI } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { CreditApplicationForm } from '../components/CreditApplicationForm';
import { CREDIT_APP_TEST_IDS } from '../constants/CreditApplication.constants';
import type {
  CreditApplicationFormData,
  CreditApplicationFormProps,
} from '../types/CreditApplication.types';

export class CreditApplicationFormPageObject {
  private readonly renderApi: RenderAPI;

  public constructor(renderApi: RenderAPI) {
    this.renderApi = renderApi;
  }

  public static render(
    props: CreditApplicationFormProps
  ): CreditApplicationFormPageObject {
    const renderApi = render(<CreditApplicationForm {...props} />);
    return new CreditApplicationFormPageObject(renderApi);
  }

  // --- Element Getters ---

  public get nationalIdInput(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.NATIONAL_ID_INPUT);
  }

  public get monthlyIncomeInput(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.MONTHLY_INCOME_INPUT);
  }

  public get vehicleSelector(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.VEHICLE_MODEL_SELECTOR);
  }

  public get downPaymentInput(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.DOWN_PAYMENT_INPUT);
  }

  public get tenureSelector(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.TENURE_MONTHS_SELECTOR);
  }

  public get submitButton(): ReactTestInstance {
    return screen.getByTestId(CREDIT_APP_TEST_IDS.SUBMIT_BUTTON);
  }

  public get downPaymentWarning(): ReactTestInstance | null {
    return screen.queryByTestId(CREDIT_APP_TEST_IDS.DOWN_PAYMENT_WARNING);
  }

  public get monthlyFeeDisplay(): ReactTestInstance | null {
    return screen.queryByTestId(CREDIT_APP_TEST_IDS.CALCULATED_MONTHLY_FEE);
  }

  // --- Fluent User Actions ---

  public fillNationalId(id: string): this {
    fireEvent.changeText(this.nationalIdInput, id);
    return this;
  }

  public fillMonthlyIncome(amountInUsd: string): this {
    fireEvent.changeText(this.monthlyIncomeInput, amountInUsd);
    return this;
  }

  public selectVehicleModel(modelKey: string): this {
    fireEvent.press(this.vehicleSelector);
    const option = screen.getByTestId(
      `${CREDIT_APP_TEST_IDS.VEHICLE_OPTION_PREFIX}${modelKey}`
    );
    fireEvent.press(option);
    return this;
  }

  public fillDownPayment(amountInUsd: string): this {
    fireEvent.changeText(this.downPaymentInput, amountInUsd);
    return this;
  }

  public selectTenureMonths(months: number): this {
    fireEvent.press(this.tenureSelector);
    const option = screen.getByTestId(
      `${CREDIT_APP_TEST_IDS.TENURE_OPTION_PREFIX}${months}`
    );
    fireEvent.press(option);
    return this;
  }

  public pressSubmit(): this {
    fireEvent.press(this.submitButton);
    return this;
  }

  public fillCompleteApplication(data: CreditApplicationFormData): this {
    return this
      .fillNationalId(data.nationalId)
      .fillMonthlyIncome(data.monthlyIncome)
      .selectVehicleModel(data.vehicleModel)
      .fillDownPayment(data.downPayment)
      .selectTenureMonths(data.tenureMonths);
  }
}
```

#### 3. Test Suite: `src/features/credit-application/tests/CreditApplicationForm.test.tsx`
```tsx
import React from 'react';
import {
  CREDIT_APP_TEST_IDS,
  VEHICLE_MODELS,
} from '../constants/CreditApplication.constants';
import { CreditApplicationFormPageObject } from './CreditApplicationForm.po';

describe('CreditApplicationForm Component', () => {
  it('calculates installment fee and submits vehicular credit application when criteria are met', () => {
    // Arrange
    const handleSubmit = jest.fn();
    const page = CreditApplicationFormPageObject.render({
      onSubmitApplication: handleSubmit,
    });

    // Act
    page
      .fillCompleteApplication({
        downPayment: '8000',
        monthlyIncome: '3500',
        nationalId: '1-1823-0491',
        tenureMonths: 60,
        vehicleModel: VEHICLE_MODELS.BYD_SONG_PLUS,
      })
      .pressSubmit();

    // Assert
    expect(page.downPaymentWarning).toBeNull();
    expect(page.monthlyFeeDisplay).toHaveTextContent('$485');
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        downPayment: 8000,
        monthlyIncome: 3500,
        nationalId: '1-1823-0491',
        tenureMonths: 60,
        vehicleModel: VEHICLE_MODELS.BYD_SONG_PLUS,
      })
    );
  });

  it('renders minimum down payment warning when down payment is less than 15% of vehicle value', () => {
    // Arrange
    const handleSubmit = jest.fn();
    const page = CreditApplicationFormPageObject.render({
      onSubmitApplication: handleSubmit,
    });

    // Act: BYD Song Plus requires minimum $5,500 (15%), advisor enters $2,000
    page
      .selectVehicleModel(VEHICLE_MODELS.BYD_SONG_PLUS)
      .fillDownPayment('2000');

    // Assert
    expect(page.downPaymentWarning).toBeTruthy();
    expect(page.submitButton).toBeDisabled();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
```

---

## 7. Anti-Pattern Matrix: Forbidden vs. Approved Patterns

| Anti-Pattern (STRICTLY PROHIBITED) | Approved Pattern (MANDATORY STANDARD) | Why It Matters |
| :--- | :--- | :--- |
| **Hardcoded testID in test suite:**<br>`screen.getByTestId('advisor-id-input')` in `.test.tsx` | **Page Object Getter:**<br>`page.advisorIdInput` in `.test.tsx` calling encapsulated PO getter | Changes to testIDs only require updating one line in the constants file. Test suites never break. |
| **Direct event firing in test suite:**<br>`fireEvent.changeText(input, 'val')` in `.test.tsx` | **Fluent Page Object Action:**<br>`page.fillAdvisorId('val')` | Test reads like user interaction narrative, not mechanical DOM plumbing. |
| **Assertion inside Page Object:**<br>`public expectError() { expect(...).toBeVisible(); }` | **Assertion in `.test.tsx`:**<br>`expect(page.errorBanner).toBeTruthy();` | Page Objects model interface structure; test suites own expectations and failure reports. |
| **`void` action methods breaking chaining:**<br>`public fillId(val: string): void` | **Fluent `this` return:**<br>`public fillId(val: string): this { ... return this; }` | Enables clean, concise multi-step actions without repeating `page.` on every line. |
| **Untyped loose parameters:**<br>`fillForm(data: any): this` | **Strongly-typed DTO contract:**<br>`fillForm(data: CreditAppFormData): this` | Prevents runtime test bugs and leverages TypeScript autocomplete during test authoring. |
| **Querying by volatile Spanish text:**<br>`screen.getByText('Monto solicitado:')` | **Querying by semantic testID in PO:**<br>`screen.getByTestId(CREDIT_TEST_IDS.AMOUNT_INPUT)` | Text copy changes for marketing or translations do not crash unit tests. |

---

## 8. Asynchronous Gestures & Modal Transitions

In React Native, certain automotive workflows trigger modal dialogs (e.g., `DossierModal`, vehicle specs modal, credit score status loaders). 

When testing asynchronous transitions:
1. **Never use arbitrary `setTimeout` or sleep loops.**
2. Expose `async find*` methods on the Page Object that delegate to RNTL's `screen.findBy*` or wrap state transitions in `waitFor`.

```ts
export class DossierModalPageObject {
  // Asynchronous finder awaiting modal animation and Supabase document fetch
  public async findDossierDocumentPreview(): Promise<ReactTestInstance> {
    return screen.findByTestId(DOSSIER_TEST_IDS.DOCUMENT_PREVIEW);
  }

  public async dismissModal(): Promise<this> {
    fireEvent.press(screen.getByTestId(DOSSIER_TEST_IDS.CLOSE_BUTTON));
    return this;
  }
}
```

In the test file:
```tsx
it('displays client credit dossier documents when advisor expands the preview', async () => {
  // Arrange
  const page = DossierModalPageObject.render({ clientId: 'CLI-8401' });

  // Assert
  expect(await page.findDossierDocumentPreview()).toBeTruthy();
});
```

---

## 9. AAA (Arrange-Act-Assert) Structural Enforcement

Every test case must visually follow the Arrange-Act-Assert structure with explicit comments. The Page Object Model ensures that each section has a single, unambiguous purpose:

```tsx
it('rejects credit application when client monthly income is below threshold', () => {
  // Arrange: Initialize mocks, spies, and render component through Page Object
  const onRejectMock = jest.fn();
  const page = CreditApplicationFormPageObject.render({
    onApplicationRejected: onRejectMock,
  });

  // Act: Perform user action sequence via fluent chaining
  page
    .fillNationalId('1-0948-0284')
    .fillMonthlyIncome('450') // Below minimum CoriMotors vehicular threshold ($600)
    .pressSubmit();

  // Assert: Execute expectations against Page Object getters
  expect(page.incomeThresholdWarning).toBeTruthy();
  expect(page.submitButton).toBeDisabled();
  expect(onRejectMock).toHaveBeenCalledWith({
    reason: 'INSUFFICIENT_INCOME_MINIMUM',
  });
});
```

---

## 10. Pre-PR Verification & Agent Compliance Checklist

Before submitting code, finalizing changes, or presenting tests to human reviewers, verify that:

- [ ] Every UI test suite (`*.test.tsx`) is accompanied by a dedicated `<Feature>.po.ts` class.
- [ ] No `.test.tsx` file contains imports of `screen` or `fireEvent` from `@testing-library/react-native`.
- [ ] No `testID` strings are hardcoded in `.test.tsx` or `.po.ts` (all imported from feature constants).
- [ ] No `expect()` assertions exist inside any Page Object method or getter.
- [ ] All action methods on the Page Object return `this` or `Promise<this>`.
- [ ] All element getters in the Page Object return `ReactTestInstance` or `ReactTestInstance | null`.
- [ ] TypeScript compiles cleanly with zero type errors (`npx tsc --noEmit`).
- [ ] Tests execute and pass cleanly via Jest:
  ```bash
  npx expo test src/features/<feature-name>
  ```
- [ ] Files are formatted according to `prettier-standards.md` (single quotes, 80 width).
