# BYC FastForm - Spec-Driven Development (SDD) Workflow

This document defines the strict workflow that all AI agents must follow when developing new features for BYC FastForm.

## 1. The Golden Rule: Zero Blind Coding
You are **STRICTLY FORBIDDEN** from generating, modifying, or suggesting source code files (`.ts`, `.tsx`, `.sql`) based solely on an initial user prompt. Every implementation must first pass through the Specification (Spec) phase.

## 2. The SDD (Spec-Driven Development) Flow

### Step 1: Spec Generation (Draft)
When the user requests a new feature (e.g., "Create the advisor login"), you must:
1. Read the visual guidelines in `.agents/DESIGN.md` and consult `.agents/skills/component-architecture.md` for structure.
2. Generate a markdown block titled **[SPECIFICATION DRAFT]**.
3. The Draft must contain:
   - **Objective:** What is being built.
   - **File Structure:** The exact files to be created or modified following the FSD (Feature-Sliced Design) and MVVM architecture.
   - **Data Types (Contracts):** What TypeScript interfaces are needed in the `types/` layer.
   - **State Logic:** What hooks will make up the ViewModel (`hooks/`).
   - **External Dependencies:** Any Supabase interactions required (`services/`).
4. Pause execution and **explicitly ask the user**: *"Do you approve this specification, or would you like to make adjustments before I generate the code?"*.

### Step 2: Implementation (Only after approval)
Once the user explicitly approves the Spec Draft:
1. Generate the files in a logical, bottom-up order to prevent type errors:
   - **First:** `types/` (TypeScript Interfaces & Zod Schemas).
   - **Second:** `services/` (Supabase DB Calls / Model).
   - **Third:** `hooks/` (ViewModels and local state).
   - **Fourth:** `components/` (UI Views using NativeWind/Design System primitives).
2. Each generated file must compile in isolation without leaving `any` types or placeholder logic.

### Step 3: Validation & GitFlow
Before concluding the task:
1. Ensure the code complies with standards by silently verifying `npx prettier --write <touched-files>` and `npx expo lint`.
2. Suggest the Git command to create a new feature branch: `git checkout -b feature/<short-name>`.
3. Generate a semantic commit message (Conventional Commits in English) detailing the changes (e.g., `feat(credit): add advisor login viewmodel`).

## 3. Troubleshooting & Error Resolution
If a compilation or linting error occurs during development:
- **DO NOT** attempt to guess quick fixes (hotfixes) by patching UI components (`.tsx`).
- Analyze the error, trace it back to its root in the ViewModel (`hooks/`) or Model (`types/` / `services/`), and fix the core issue while respecting strict typing.