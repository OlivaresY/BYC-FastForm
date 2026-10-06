# BYC FastForm & CoriMotors - Master AI Instructions

This is an Expo/React Native mobile application for the BYC FastForm SaaS ecosystem. Prioritize mobile-first patterns, performance, and cross-platform compatibility (iOS & Android).

## 1. CRITICAL DIRECTIVES (MUST READ)
Before generating any UI component, page, or mobile screen, or making architectural decisions, you MUST read and strictly adhere to the following specification files located in the `.agents/` directory:

*   **Read `.agents/DESIGN.md`**: For visual identity, specific Tailwind/NativeWind hex colors, and cryptographic constraints (ZERO EMOJIS, SVG ONLY).
*   **Read `.agents/ARCHITECTURE.md`**: For folder structure, the Feature-Driven Architecture (FDA), and the MVVM pattern.
*   **Read `.agents/WORKFLOW.md`**: For the Spec-Driven Development (SDD) process. You must not write code blindly.
*   **Read `.agents/SECURITY.md`**: For Supabase Row Level Security (RLS) and Role-Based Access Control (RBAC).

## 2. Coding Standards & Architecture
*   **Language:** All codebase nomenclature (folders, files, variables, functions) MUST be in English. UI text displayed to the end-user MUST be in Spanish.
*   **Architecture:** We use Feature-Sliced Design (FSD) with MVVM.
    *   `src/app/` is strictly for Expo Router navigation (Dumb Pages).
    *   `src/features/<feature-name>/components/` is for pure UI Views.
    *   `src/features/<feature-name>/hooks/` is for ViewModels (State and Logic).
    *   `src/features/<feature-name>/services/` is for Models (Supabase DB calls).
    *   `src/features/<feature-name>/types/` is for strict TypeScript interfaces.

## 3. Expo Framework Rules — Do not trust your training data
Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:
1.  Read the major version of the `expo` package in `package.json`.
2.  Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3.  For anything else, fetch `https://docs.expo.dev/llms.txt`. Follow its links to the specific page you need; never answer from memory.

### Commands (NPM/NPX Environment)
```bash
npx expo install <package>  # ALWAYS use instead of npm install for Expo packages — resolves SDK-compatible versions
npx expo start -c           # start the dev server and clear cache
npx tsc --noEmit            # typecheck