---
name: eslint-standards
description: Enforces ESLint rules for Expo and React Native projects. Use when authoring code, fixing lint errors, or updating the ESLint config.
---

# ESLint Standards for BYC FastForm Mobile

This skill is the single source of truth for how agents apply the repository's ESLint configuration (typically `.eslintrc.js` or `eslint.config.js`).

This skill must stay in lockstep with the configuration file. `prettier-standards` owns wrapping, indent, trailing commas, and JSX attribute line breaks. Quotes and semicolons must match between both configurations.

---

## 1. Mandatory Protocol

Whenever you create or edit `**/*.{js,jsx,ts,tsx}`:

1. Write code that satisfies every rule in this skill.
2. After the edit, run Expo's ESLint wrapper on the touched files and zero remaining errors before finishing:
   Command: `npx expo lint`
3. Prefer auto-fixing violations where possible, then repair anything still reported by hand.
4. Do not leave unused variables, `var`, `==`, or other violations "for later." 
5. Do not disable a rule with an inline comment (`// eslint-disable-next-line`) unless the user explicitly asks and the exception is documented.

### Scope
- **Files:** `**/*.{js,jsx,ts,tsx}`
- **Base:** `universe/native` (Expo standard), `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`

---

## 2. Formatting

- `quotes`: Single quotes (`''`). Never double quotes (aligned with Prettier).
- `semi`: Semicolons required.
- `padding-line-between-statements`: Blank line after the last import before any non-import statement.

```typescript
// ❌ INCORRECT
import { useState } from 'react';
const [value, setValue] = useState('');

// ✅ CORRECT
import { useState } from 'react';

const [value, setValue] = useState('');
```

---

## 3. Arrows, Templates, and Bodies

- `prefer-arrow-callback`: Callbacks are arrows, not `function () {}`.
- `arrow-body-style`: `"as-needed"` (expression body when the function only returns; braces only when there are other statements).