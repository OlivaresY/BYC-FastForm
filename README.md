# BYC-FastForm — Automotive Credit Application & Approval Ecosystem

Cross-platform automotive credit onboarding platform built for **CoriMotors**, consisting of a **React Native mobile application** for commercial sales advisors and a **Super Admin approval & PDF template mapping ecosystem**[cite: 16, 17]. It eliminates repetitive manual form-filling across multiple financial institutions by capturing client data once, enforcing strict compliance rules, and consolidating multi-bank credit forms in under 5 seconds under a **Zero-Storage** policy[cite: 16, 17].

---

## Application Preview

| Advisor Login | 4-Step Credit Wizard | Dossier History & Print Manager |
| :---: | :---: | :---: |
<!--
| <img src="./assets/screenshots/login.png" width="240" alt="Advisor Login Screen" /> | <img src="./assets/screenshots/credit-wizard.png" width="240" alt="Multi-Step Credit Wizard" /> | <img src="./assets/screenshots/print-manager.png" width="240" alt="Dossier Print Manager" /> |

*(Replace the placeholder paths above once your screenshots are added to `assets/screenshots/`)*
-->
---

## Key Features & Business Rules

* **Dynamic 4-Step Credit Wizard (Individual & Corporate):** Conditional onboarding flows tailored to **Persona Física** (Individual) and **Persona Jurídica** (Corporate) applicants, supporting third-party vehicle beneficiaries, Costa Rican geographic catalogs (Province, Canton, District), automated financing calculations, and multi-bank selection (`BAC Credomatic`, `BNCR`, `Scotiabank`, `Banco Promerica`, `Carro Fácil`).
* **Strict Costa Rican Data Validation & Sanitization:** Real-time schema validation powered by **React Hook Form** and **Zod**, enforcing Costa Rican identification formats (National ID, DIMEX, Passport, Legal ID, NITE), 22-character `CR` IBAN validation, minimum 10% down-payment rules, and mandatory SUGEF/CIC and credit bureau authorizations.
* **Approval-Gated Printing & Zero-Storage PDF Policy (< 5s SLA):** Enforces a core business rule blocking document generation and printing until a Super Admin approves the application (`Approved` status)[cite: 16]. Approved records are consolidated in-memory across selected banks and dispatched natively via `expo-print` and `expo-sharing` without persisting sensitive PII PDF files on disk or cloud storage, preserving immutable template versions (`v1`)[cite: 16, 17].
* **Dossier History & Non-Destructive Edit Mode:** Chronological dossier tracking (`created_at DESC`) with status filters, quick-print actions for approved applications, granular single-page or multi-bank print selection, and direct wizard editing that patches form payloads without resetting `Approved` status or altering approval metrics[cite: 16, 17].
* **Role-Based Security, Idempotency & Real-Time Operations:** Encrypted local session storage (`expo-secure-store`), PostgreSQL **Row Level Security (RLS)** isolating advisor records (`auth.uid() = user_id`), deterministic SHA-256 `idempotency_key` constraints to prevent duplicate submissions on unstable networks, and live maintenance mode synchronization via **Supabase Realtime**[cite: 16, 17].

---

## Tech Stack & Architecture

* **Mobile App (Advisors):** React Native (`0.88`), Expo SDK `58` (Expo Go), Expo Router, TypeScript (`strict: true`), NativeWind / Tailwind CSS, React Hook Form, Zod, `lucide-react-native`, `react-native-svg`, `expo-print`, `expo-sharing`, `expo-secure-store`[cite: 16, 17].
* **Backend & Database:** Supabase (Auth, PostgreSQL relational + validated `JSONB` hybrid schema, Row Level Security, Realtime)[cite: 16, 17]. Operated with zero external banking API dependencies using an internal financial catalog and template versioning architecture[cite: 16, 17].
* **Super Admin Console (Web Ecosystem):** Next.js, React, TypeScript, and `pdf-lib` for in-memory coordinate mapping and approval workflows[cite: 16, 17].
* **Architecture & Quality Engineering:**
  * **Feature-Driven Architecture (FDA) + MVVM:** Strict separation between declarative Views (`components/`), stateful ViewModels (`hooks/`), and data repositories (`services/`), built with 100% functional arrow components and centralized Costa Rican localization (`es-CR`)[cite: 17].
  * **Automated Testing & Visual Catalog:** Unit and integration test suites built with **Jest** and **React Native Testing Library** following the **Page Object Model (`*.po.ts`)** pattern, alongside isolated component previews in **Storybook v10 (CSF3)** running on Metro bundler.

---

## Getting Started (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/OlivaresY/BYC-FastForm.git](https://github.com/OlivaresY/BYC-FastForm.git)
   cd BYC-FastForm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory based on `.env.example` and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the mobile app or Storybook:**
   ```bash
   # Start Expo development server
   npx expo start

   # Start on-device Storybook component catalog
   npm run storybook
   ```

5. **Run quality gates (TypeScript & Tests):**
   ```bash
   npx tsc --noEmit
   npx jest --watchAll=false
   ```

---

## Author & Contact

* **Developer:** Yordy Josué Olivares Rosales (`YOR`)
* **GitHub:** [@OlivaresY](https://github.com/OlivaresY)
* **LinkedIn:** [linkedin.com/in/olivares-yordy-cr-pz11901](https://www.linkedin.com/in/olivares-yordy-cr-pz11901)
