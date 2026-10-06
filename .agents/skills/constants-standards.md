---
name: constants-standards
description: Centralizes hard-coded strings and magic numbers into @/shared/constants. Enforces as const, alphabetical key sorting, semantic grouping, screaming snake case, units, and derived types.
---

# Constants Standards for BYC FastForm Mobile

This skill is the single source of truth for centralizing hard-coded strings, Supabase table names, magic numbers, and UI values into `@/shared/constants` (or feature-specific constant files).

Adhering to these rules ensures type safety, prevents accidental mutations, avoids magic values in business and UI logic, and maintains a clean diff history.

## 1. Mandatory Protocol

Whenever you author or edit components, ViewModels, utilities, or services:

1. **No raw literals**: Never use raw strings or unexplained numeric literals in the code.
2. **Move to Constants**: Place global constants in `@/shared/constants/` and feature-specific constants in `src/features/<feature-name>/constants/`.
3. **Immutable with `as const`**: Every constant object must be declared with `as const` for literal type inference.
4. **Sort keys alphabetically (A → Z)**: Every key in a constant object must be sorted alphabetically.
5. **Name with `SCREAMING_SNAKE_CASE`**: Keys must be in uppercase snake case.
6. **Include units for numbers**: Units (e.g., `_MS`, `_BYTES`, `_PX`, `_SECONDS`) must be part of the key or object name.
7. **Derive types**: Never hand-craft string union types; derive them from the constant object using `typeof + keyof` or `typeof obj[keyof typeof obj]`.
8. **Export from barrel**: Re-export all shared constants in `src/shared/constants/index.ts`.

---

## 2. Replace Hard-Coded Literals

### Strings

Replace raw strings with named constants. 

| Raw literal             | Centralized replacement                  |
| :---                    | :---                                     |
| `""`                    | `STRING.EMPTY`                           |
| `"credit_applications"` | `SUPABASE_TABLES.CREDIT_APPLICATIONS`    |
| `"/login"`              | `ROUTES.LOGIN`                           |
| `"@auth_token"`         | `STORAGE_KEYS.AUTH_TOKEN`                |

```tsx
// ❌ INCORRECT (Raw literals)
const isSelected = value === "";
if (route === "/login") { router.push("/login"); }

// ✅ CORRECT (Centralized constants)
import { STRING, ROUTES } from '@/shared/constants';

const isSelected = value === STRING.EMPTY;
if (route === ROUTES.LOGIN) { router.push(ROUTES.LOGIN); }
```

---

## 3. Magic Numbers & Units

Numbers must never appear isolated in the code. Group them and include their unit of measurement in the name.

```typescript
// ❌ INCORRECT
setTimeout(closeModal, 5000);
const MAX_WIDTH = 768;

// ✅ CORRECT
import { TIME_MS, LAYOUT_PX } from '@/shared/constants';

setTimeout(closeModal, TIME_MS.MODAL_TIMEOUT);
const MAX_WIDTH = LAYOUT_PX.TABLET_BREAKPOINT;
```

---

## 4. Derived TypeScript Unions

Do not duplicate string values in type declarations. Rely on TypeScript's inference.

```typescript
// ✅ CORRECT
export const APPLICATION_STATUS = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
} as const;

// Derives type: "APPROVED" | "PENDING" | "REJECTED"
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
```