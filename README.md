readme de  BYC-FastForm:
# BYC-FastForm — Internal Credit Form Automation & Approval Platform

Cross-platform internal credit documentation platform built for **CoriMotors**, consisting of a **React Native (Expo) mobile app** for commercial sales advisors and a **Next.js Super Admin web console**. It streamlines filling and organized printing of credit applications for national banks and lenders by capturing client data once through a guided wizard, persisting only structured data (**Zero PDF Storage**), and enforcing pre-print administrative approval.

---

## Key Features & Business Rules

* **Guided 4-Step Credit Wizard (Individual & Corporate):** Dynamic flows for *Persona Física* and *Persona Jurídica* applicants, supporting third-party beneficiaries, Costa Rican geographic catalogs (Province, Canton, District), automated financing calculations, and selection of national banks and lending institutions.
* **Costa Rican Data Validation:** Real-time schema validation powered by **React Hook Form** and **Zod**, enforcing Costa Rican ID formats (National ID, DIMEX, Passport, Legal ID, NITE), 22-character `CR` IBAN validation, down-payment rules, and required authorizations.
* **Pre-Print Approval Gate & Zero PDF Storage:** Blocks document printing until a Super Admin reviews and approves the application. Only structured wizard data is persisted in PostgreSQL—PDF files are never stored on disk or cloud storage, preventing storage bloat while keeping client dossiers available for future reference.
* **Super Admin Console & Dynamic Management (RBAC):** Centralized web console to add or remove **forms, branches, and users with assigned roles**, review/approve/reject applications prior to printing, and monitor historical application volume by **advisor, branch, and company-wide** (daily, weekly, monthly, and yearly).
* **Dossier History & Row-Level Security:** Chronological application tracking with status filters, non-destructive editing, encrypted local session handling (`expo-secure-store`), and **PostgreSQL Row Level Security (RLS)** so each advisor only accesses their own records.

---

## Tech Stack & Architecture

* **Mobile App (Advisors):** React Native, Expo, Expo Router, TypeScript (`strict`), NativeWind / Tailwind CSS, React Hook Form, Zod, `expo-print`, `expo-sharing`, `expo-secure-store`.
* **Web Console (Super Admin):** Next.js, React, TypeScript, Tailwind CSS.
* **Backend & Database:** Supabase (Authentication, PostgreSQL relational + `JSONB`, Row Level Security, Realtime). Operates internally with zero external banking API dependencies.
* **Architecture & Quality Engineering:**
  * **Feature-Driven Architecture (FDA) + MVVM:** Clean separation between Views (`components/`), ViewModels (`hooks/`), and data services (`services/`), designed with **SOLID** principles, `DESIGN.md`, user stories, and UI prototypes in **Figma** and **Stitch**.
  * **Testing & Component Catalog:** Unit and integration testing with **Jest** and **React Native Testing Library** using the **Page Object Model (`*.po.ts`)** pattern under **TDD**, plus isolated UI development with **Storybook** on Metro bundler.

---

## Application Preview

> *Add screenshots to `assets/screenshots/` and uncomment the table below once ready.*

<!--
| Advisor Login | 4-Step Credit Wizard | Dossier History & Print Manager |
| :---: | :---: | :---: |
| <img src="./assets/screenshots/login.png" width="240" alt="Advisor Login Screen" /> | <img src="./assets/screenshots/credit-wizard.png" width="240" alt="4-Step Credit Wizard" /> | <img src="./assets/screenshots/print-manager.png" width="240" alt="Dossier Print Manager" /> |
-->

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

5. **Run type checking and tests:**
   ```bash
   npx tsc --noEmit
   npx jest --watchAll=false
   ```

---

## Author & Contact

* **Developer:** Yordy Josué Olivares Rosales (`YOR`)
* **GitHub:** [@OlivaresY](https://github.com/OlivaresY)
* **LinkedIn:** [linkedin.com/in/olivares-yordy-cr-pz11901](https://www.linkedin.com/in/olivares-yordy-cr-pz11901)