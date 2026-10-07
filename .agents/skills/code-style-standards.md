---
name: code-style-standards
description: Define code-style conventions for React Native components, MVVM hooks, TypeScript return types, and descriptive naming.
---

# Code Style Standards for BYC FastForm Mobile

Apply this skill when writing or refactoring React Native components, ViewModels (custom hooks), or their TypeScript implementation details. It defines declaration style, return-type annotations, and naming conventions.

This skill defers to:
- `eslint-standards` for all ESLint-owned rules and validation.
- `prettier-standards` for formatting.
- `component-architecture` for MVVM and file-split rules.

## 1. Components and ViewModels use `const` arrow functions

Declare React Native components and ViewModels (hooks) with `const` and an arrow function. Do not use the `function` keyword. Name a component in PascalCase and a ViewModel with the `use` prefix (e.g., `useCreditFormViewModel`).

For an arrow function that only returns one expression, follow `eslint-standards` for the expression-body requirement. Use a block body when the implementation needs statements (e.g., local bindings, hooks).

**Incorrect:**
```tsx
function ApplicationCard({ application }: ApplicationCardProps) {
  return <View><Text>{application.status}</Text></View>;
}

function useApplicationFilters() {
  return { clearFilters: () => undefined };
}
```

**Correct:**
```tsx
import { Card, Typography } from '@/shared/components';

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => (
  <Card>
    <Typography>{application.status}</Typography>
  </Card>
);

export const useApplicationFilters = () => {
  const clearFilters = () => undefined;
  return { clearFilters };
};
```

## 2. Explicit TypeScript Return Types

Always define explicit return types for ViewModels to maintain a strict contract with the View.
React components should be typed using `React.FC<Props>`.

```typescript
// ✅ CORRECT: Explicit interface for the ViewModel return
interface UseFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useFiltersViewModel = (): UseFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  return { searchQuery, setSearchQuery };
};
```

## 3. Naming Conventions (Booleans and Handlers)

- **Booleans:** Must be prefixed with `is`, `has`, `should`, or `can` (e.g., `isLoading`, `hasError`, `canSubmit`).
- **Event Handlers:**
  - Props passed to components should start with `on` (e.g., `onSubmit`, `onPress`).
  - Internal functions handling the events should start with `handle` (e.g., `handleSubmit`, `handlePress`).