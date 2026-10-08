# BYC FastForm & CoriMotors - Master AI Instructions

This is an Expo / React Native mobile SaaS application for the BYC FastForm ecosystem, built for CoriMotors automotive credit evaluations and financing workflows. Prioritize mobile-first ergonomics, fast form processing, offline resilience, and cross-platform compatibility (iOS & Android).

---

## 1. Business Domain & Core Context
- **Product:** BYC FastForm is a high-efficiency automotive credit application and vehicular qualification platform for CoriMotors.
- **Mission:** Streamline vehicle credit intake with responsive, ergonomic, and frictionless mobile forms.
- **Target Experience:** Fast completion times, thumb-friendly interaction zones (minimum 48x48px hit areas), clean visual hierarchy, and immediate validation feedback.

---

## 2. Master Directives & Hierarchy (Single Source of Truth)
Before creating or editing any code, screen, or architectural layer, you MUST read and strictly adhere to the master governance documents in `.agents/`:

1. **`.agents/WORKFLOW.md` (SDD & Git Protocol):**
   - Strictly enforces Spec-Driven Development (SDD): Specify -> Plan -> User Approval -> Implement -> Validate.
   - You MUST NEVER write code blindly. Generate a `[SPECIFICATION DRAFT]` and wait for human confirmation.
   - Conventional Commits enforced in English (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`).

2. **`.agents/DESIGN.md` (Visual Identity & System Rules):**
   - Palette Tokens: Strict adherence to the Beige, Forest Green, and Taupe palette via NativeWind tokens.
   - **ZERO EMOJIS:** Emojis are strictly forbidden across UI, buttons, alerts, and placeholders.
   - **SVG ONLY:** Use monochromatic SVG icons (e.g., Lucide React Native).
   - Mobile Ergonomics: Touch targets >= 48px, accessible contrast, and native keyboard avoidance.

3. **`.agents/SECURITY.md` (Supabase Governance):**
   - Enforce Row Level Security (RLS) and Role-Based Access Control (RBAC).
   - Multi-tenant client/agency data isolation. Never bypass authorization headers or tokens.

---

## 3. Skill Routing Matrix (Task-Based Dispatcher)
When implementing specific layers, consult the corresponding skill inside `.agents/skills/`:

| Task Category | Skill File | Mandatory Standard Enforced |
| :--- | :--- | :--- |
| **Directory & MVVM Layers** | `.agents/skills/component-architecture.md` | Feature-Sliced Design (`src/features/*`), strict View vs ViewModel split. |
| **UI Components & Primitives** | `.agents/skills/component-standards.md` | Reuse `src/shared/components`; no raw React Native tags; SVG only. |
| **SOLID & Component Reuse** | `.agents/skills/solid-architecture.md` | SOLID design principles and mandatory search-before-create UI reuse. |
| **Supabase Data & API** | `.agents/skills/api-mutation-standards.md` | Isolated `services/` calls; `use*ViewModel` loading & error states. |
| **Constants & Hardcoded Data** | `.agents/skills/constants-standards.md` | No magic numbers/strings; `as const`; alphabetical sorting (A-Z). |
| **Coding Style & Naming** | `.agents/skills/code-style-standards.md` | `const` arrow functions; explicit React return types; domain naming. |
| **Linting & Code Quality** | `.agents/skills/eslint-standards.md` | Single quotes; clean hook dependencies; zero `console.log` in final code. |
| **Code Formatting** | `.agents/skills/prettier-standards.md` | 80 print width; `singleQuote: true`; `singleAttributePerLine: true`. |
| **Testing & Quality Assurance** | `.agents/skills/unit-testing-standards.md` | Page Object Model (POM); React Native Testing Library; mocked Supabase. |
| **Page Object Model (POM)** | `.agents/skills/page-object-model.md` | Dedicated `.po.ts` classes, fluent method chaining, selector decoupling. |
| **Storybook Architecture** | `.agents/skills/storybook-standards.md` | Metro bundler integration (`withStorybook`), zero Webpack, lazy entry injection. |
| **Changelog & Jira Tracking** | `.agents/skills/changelog-standards.md` | Automatic root `CHANGELOG.md` maintenance linked to Jira issues. |

---

## 4. Strict Dual-Language Rule
- **Codebase & Architecture (100% English):** All folders, files, functions, variables, interfaces, types, database schemas, test descriptions, and Git commit messages MUST be in English.
- **User Interface (100% Spanish):** All user-facing labels, placeholders, validation feedback, error messages, dialogs, and button copy MUST be in Spanish.

---

## 5. Architectural Blueprints (FSD + MVVM)
The project strictly separates UI presentation from business logic:

```text
src/
├── app/                              # Expo Router navigation (Dumb Pages only)
├── features/                         # Business Domain Features (FSD)
│   └── <feature-name>/               # kebab-case (e.g., credit-application)
│       ├── components/               # Pure UI Views (.tsx) - NO logic/Supabase
│       ├── hooks/                    # ViewModels (use*ViewModel.ts) - State & logic
│       ├── services/                 # Models - Supabase DB queries & mutations
│       ├── types/                    # Domain TypeScript contracts & Zod schemas
│       ├── constants/                # Feature-specific constants
│       └── tests/                    # POM-based UI and hook tests
└── shared/                           # Cross-cutting primitives & design system
    ├── components/                   # Primitives (Button, Typography, InputField)
    ├── constants/                    # Global tokens, routes, tables, storage keys
    ├── types/                        # Nullable<T>, global utility types
    └── utils/                        # Supabase client singleton, helpers
```
## 6. Code Style, Quality Baseline & Pre-Execution Checklist

**CRITICAL PROTOCOL:** Before writing or modifying any source code (`.ts`, `.tsx`, `.sql`), the AI agent must mentally or explicitly execute the following verification steps:

1. **Search Before Create (No Duplicate UI):** Scan `src/shared/components/` and feature directories. If a component (like a card, button, layout, or header) already exists, you MUST reuse and compose it. Never reinvent existing elements.
2. **Zero Hardcoded Strings & Magic Numbers:** Never use raw literals in code or UI (e.g., status strings, route paths, hardcoded timeouts). All values must pull from `@/shared/constants` or feature-specific constants.
3. **Arrow Functions Only:** Declare all React Native components and ViewModels (custom hooks) using `const` and arrow functions. The `function` keyword is strictly prohibited.
4. **Strict Formatting & Linting:** Enforce Prettier standards (80 columns, single quotes, single attribute per line for JSX) and zero ESLint errors via `npx expo lint`.
5. **Architecture & Hooks Placement:** All stateful orchestration belongs in `src/features/<feature>/hooks/use<Feature>ViewModel.ts`. Views must only bind state and actions.

---

## 7. Expo Framework Rules — Do Not Trust Training Data
Expo releases regular breaking changes. Never rely on memorized APIs:
1. Check the major Expo SDK version in `package.json`.
2. Reference the versioned documentation: `https://docs.expo.dev/versions/v<major>.0.0/`
3. Fetch `https://docs.expo.dev/llms.txt` for real-time API patterns.

### Approved CLI Commands (NPM/NPX)
    npx expo install <package>   # Resolves SDK-compatible package versions
    npx expo start -c            # Start Metro bundler with cleared cache
    npx tsc --noEmit             # TypeScript validation
    npx expo lint                # Linting check
    npx prettier --write <path>  # Prettier formatting
    npx expo test <path>         # Run Jest tests