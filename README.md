# BYC-FastForm — Internal Credit Form Automation & Approval Platform

Cross-platform **React Native (Expo)** mobile application built for **CoriMotors** sales advisors to standardize vehicle credit applications, enforce Costa Rican data validation, and generate consolidated bank PDF dossiers only after administrative approval in the shared **Supabase** backend (**Zero PDF Storage**).

---

## Key Features & Business Rules

- **Guided Credit Onboarding (Physical & Legal Entities):** Dedicated workflows for *Persona Física* (Physical Person) and *Persona Jurídica* (Legal Entity) applicants, supporting optional third-party vehicle beneficiaries, Costa Rican geographic catalogs (Province, Canton, District), financing calculations, and Costa Rican bank/lender selection (`BAC`, `BNCR`, `Scotiabank`, `Promerica`, `Carro Fácil`).
- **Costa Rican Schema Validation:** Real-time form validation powered by **React Hook Form** and **Zod**, enforcing national identification formats (`Cédula Física`, `DIMEX`, `Pasaporte`, `Cédula Jurídica`, `NITE`), 22-character `CR` IBAN accounts, term/down-payment rules, and bureau/SUGEF authorization flags.
- **Zero PDF Storage & Approval-Gated Printing:** Only structured application metadata and consolidated `JSONB` payloads are stored in `public.credit_applications`. Dossier quick-printing and PDF generation are strictly locked unless an application reaches the `Approved` status.
- **Row-Level Security & Session Hardening:** Advisor queries are scoped by **Supabase PostgreSQL Row Level Security (RLS)** (`auth.uid()`) so each advisor can access and manage only their own applications, alongside `expo-secure-store` session persistence and global maintenance mode gating (`public.system_settings`).

---

## Tech Stack & Architecture

Verified against [package.json](./package.json) and [app.json](./app.json):

- **Core Mobile Framework:**
  - `expo`: `~58.0.19` (`expo-router` `~58.0.26`, `typedRoutes` & `reactCompiler` enabled)
  - `react-native`: `0.88.0` / `react`: `19.3.0`
  - `typescript`: `~6.0.3` (`strict`)
- **UI, Styling & Icons:**
  - `nativewind`: `^4.2.7` / `tailwindcss`: `^3.3.2`
  - `lucide-react-native`: `^1.52.0`, `@gorhom/bottom-sheet`: `^5.2.14`
- **Forms, Validation & Native Capabilities:**
  - `react-hook-form`: `^7.89.0`, `zod`: `^4.6.7`, `@hookform/resolvers`: `^5.9.1`
  - `expo-print`: `~58.0.7`, `expo-sharing`: `~58.0.20`, `expo-secure-store`: `~58.0.2`
- **Backend & Persistence:**
  - `@supabase/supabase-js`: `^2.117.2` (Supabase Auth + PostgreSQL + RLS migrations in `supabase/migrations/`)
  - Pairs cleanly with an administrative approval console sharing the same Supabase database schema (with zero external bank API dependencies).
- **Architecture & Quality Tooling:**
  - **Feature-Sliced Design (FSD) + MVVM:** Clean boundaries across `src/app/` (Expo Router navigation), `src/features/*` (`components/`, `hooks/`, `services/`, `types/`, `constants/`), and `src/shared/` design primitives/i18n (`es-CR`).
  - **Spec-Driven Development (SDD) & POM Testing:** Governed by `.agents/WORKFLOW.md` and tested with `jest` (`~30.5.2`), `jest-expo` (`~58.0.12`), and `@testing-library/react-native` (`^13.3.3`) using Page Object Model (`*.po.ts`) classes.
  - **UI Catalog & Linting:** `storybook` / `@storybook/react-native` (`^10.6.0`) via Metro (`withStorybook`) and `eslint` (`^9.0.0`, `eslint-config-expo` `~58.0.4`).

---

## Screenshots

Store `.png` or `.webp` mobile app and Storybook screenshots inside [`docs/screenshots/`](./docs/screenshots/) before merging:

| Screen / View | Suggested Filename | Description |
| :--- | :--- | :--- |
| Advisor Login | `docs/screenshots/login.png` | Encrypted email/password advisor authentication & branding |
| Guided Credit Wizard | `docs/screenshots/credit-wizard.png` | Physical/Legal applicant intake, Costa Rican catalogs & authorizations |
| Dossier History & Print Gate | `docs/screenshots/dossier-history.png` | Status badges (`APROBADO`, `PENDIENTE`, `RECHAZADO`) & locked printing |
| Storybook Component Catalog | `docs/screenshots/storybook-catalog.png` | Isolated component states rendered on Metro bundler |

---

## Getting Started (Local Setup)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/OlivaresY/BYC-FastForm.git
   cd BYC-FastForm
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the template file and fill in your Supabase public project URL and anon key (never commit `.env`):

   ```bash
   cp .env.example .env
   ```

   ```env
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   ```

4. **Run the app or Storybook:**

   ```bash
   # Start Expo development server
   npm start

   # Launch platform targets directly
   npm run android
   npm run ios
   npm run web

   # Start on-device Storybook v10 component catalog
   npm run storybook:start
   ```

5. **Run type checking, linting, and tests:**

   ```bash
   npx tsc --noEmit
   npm run lint
   npm test -- --watchAll=false
   ```

---

## Author

- **Developer:** Yordy Josué Olivares Rosales (`YOR`)
- **GitHub:** [@OlivaresY](https://github.com/OlivaresY)
