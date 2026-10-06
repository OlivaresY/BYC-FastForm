---
name: component-standards
description: Building or modifying UI in src/features/**/components or src/shared/components — mandatory reuse of existing primitives over raw React Native tags, and Nullable type handling. Defers ViewModel rules to component-architecture.
---

# Component Standards for BYC FastForm Mobile

Governs how UI gets built in this mobile repository: reuse before creation, strict adherence to the Design System, and standardized nullable types. This skill does not own ViewModel/file-split rules (see `component-architecture`).

## 1. Mandatory Component Reuse & The Design System

**Before writing any new UI, search `src/shared/components/` for an existing primitive that already does the job.** Compose it with props and NativeWind `className` variants. Do not clone its markup into a new component.

Expected core primitives (verify against `src/shared/components/index.ts` before creating new ones):

| Category   | Component             | Path                                              |
| :---       | :---                  | :---                                              |
| Actions    | `Button`              | `src/shared/components/button/Button.tsx`         |
| Layout     | `Screen`, `Card`      | `src/shared/components/layout/`                   |
| Forms      | `InputField`, `Select`| `src/shared/components/form/`                     |
| Typography | `Typography`          | `src/shared/components/typography/Typography.tsx` |
| Media      | `Icon` (SVG ONLY)     | `src/shared/components/icon/Icon.tsx`             |
| Feedback   | `Spinner`, `Toast`    | `src/shared/components/feedback/`                 |

### Prohibited: Raw React Native tags for product UI
`Text`, `TouchableOpacity`, `Pressable`, `TextInput`, and `Button` (from `react-native`) are **strictly forbidden** inside feature components (`src/features/**/components`). 

You MUST use the standardized wrappers from the Design System (`Typography`, `Button`, `InputField`, etc.). The only place where raw React Native tags are allowed is inside the primitive wrappers themselves (in `src/shared/components/`).

```tsx
// ✅ Correct — compose the existing primitive from your Design System
import { Button, Typography, Icon } from '@/shared/components';

<Button className="gap-2" onPress="{handleDelete}" variant="danger">
  <Icon name="trash"/>
  <Typography variant="buttonText">Eliminar</Typography>
</Button>

// ❌ Incorrect — bypasses the standardized wrappers (FORBIDDEN)
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity className="bg-red-600 rounded px-3 py-2" onPress="{handleDelete}">
  <Text className="text-white">Eliminar</Text>
</TouchableOpacity>
```

## 2. Standardized Nullable & Undefined Type Handling

- Never render `undefined` or `null` directly in the UI, as React Native can crash.
- Use the global utility type `Nullable<T>` from `@/shared/types` when dealing with data that may be null from database rows.
- Explicitly guard against null values with early returns, optional chaining (`?.`), and nullish coalescing (`??`).
- **CRITICAL:** Never use the `&&` operator for conditional rendering of numeric values in React Native (e.g., `count && <Component />`), because a `0` will render as a raw text string on the screen and break the layout. Use explicit boolean checks or ternary operators instead.

```tsx
// ✅ CORRECT
{items.length > 0 ? <Typography>{items.length} elementos</Typography> : null}
<Typography>{user.name ?? 'Asesor no asignado'}</Typography>

// ❌ INCORRECT (Can crash or render a stray '0' on screen)
{items.length && <Text>{items.length} elementos</Text>}
```

## 3. Ergonomics & Strict Visual Rules

- **Minimum Touch Target:** Any interactive element (`Icon`, `Button`, `Link`) must have a minimum interactive area of 48x48px to comply with mobile accessibility standards (use `min-h-[48px]` or `hitSlop`).
- **Zero Emojis:** Strictly prohibited. Use only Lucide/SVG monochromatic icons for all graphical representations.