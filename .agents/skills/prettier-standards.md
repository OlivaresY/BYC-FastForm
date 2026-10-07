---
name: prettier-standards
description: Enforces Prettier formatting rules for React Native, Expo, and TypeScript. Use when authoring code, fixing format drift, or maintaining clean diffs.
---

# Prettier Standards for BYC FastForm Mobile

This skill is the single source of truth for code formatting across the mobile application.

## 0. Canonical Config Reference
This skill mirrors the exact rules defined in `.prettierrc.json` located at the root of the repository. Both the configuration file and this skill must stay in lockstep.

## 1. Mandatory Protocol

Whenever you create or edit any supported file (TS, TSX, JSON, CSS, Markdown):

1. Write code that already matches the formatting rules below. Do not rely solely on a later format pass.
2. After making edits, format the touched files using command: `npx prettier --write <touched-files>`
3. Keep diffs scoped to the files you are working on. Do not format the entire repository tree unless explicitly requested.
4. Never add `// prettier-ignore` comments unless the user explicitly asks for an exception.

---

## 2. Configured Formatting Rules

- `semi: true` -> Semicolons are required on every statement.
- `singleQuote: true` -> Use single quotes for JS/TS and JSX strings, following standard React/Expo conventions.
- `tabWidth: 2` -> Two spaces per indentation level. Never use tabs.
- `trailingComma: "es5"` -> Trailing commas in objects, arrays, and destructuring (ES5 compliant).
- `printWidth: 80` -> Wrap lines at 80 columns. Optimized to prevent excessive line breaks in React Native components with long Tailwind/NativeWind class names.
- `singleAttributePerLine: true` -> When a JSX component has two or more attributes, place one attribute per line. The closing bracket sits on its own line.

---

## 3. Code Style Examples

### Semicolons and Quotes

```typescript
// ❌ INCORRECT
const label = "ready"
const count = 1

// ✅ CORRECT
const label = 'ready';
const count = 1;
```

### Multi-Attribute JSX (NativeWind / Tailwind)

```tsx
// ❌ INCORRECT (Multiple attributes on the same line)
<View className="flex-1 bg-brand-bg px-4 py-6" testID="main">
  <Text>{label}</Text>
</View>

// ✅ CORRECT (One attribute per line)
<View
  className="flex-1 bg-brand-bg px-4 py-6"
  testID="main"
>
  <Text>{label}</Text>
</View>
```

---

## 4. Checklist

Before finishing any file modification:

- [ ] Single quotes used; semicolons present; 2-space indentation.
- [ ] Lines wrapped cleanly toward the 80-column limit.
- [ ] Multi-attribute JSX formatted with one attribute per line.
- [ ] `npx prettier --write <touched-files>` executed successfully.