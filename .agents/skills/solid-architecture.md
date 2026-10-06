---
name: solid-architecture
description: Enforces SOLID design principles across code layers and mandates strict component reuse to prevent duplicate UI elements.
---

# SOLID Architecture & Component Reuse Standards

This skill governs clean software design and enforces component reuse to ensure a maintainable, DRY (Don't Repeat Yourself) codebase.

## 1. SOLID Principles in React Native & TypeScript

All features, hooks, and services must adhere to SOLID principles:
- **S (Single Responsibility):** A component handles only UI presentation; a ViewModel (`use*ViewModel.ts`) handles state and logic; a Service handles data fetching. Never mix responsibilities.
- **O (Open/Closed):** Components and services must be open for extension (via props or composition) but closed for modification. Do not hack existing primitives; extend them or create a variant.
- **L (Liskov Substitution):** Custom components implementing shared interfaces must accept standard props without breaking expected behavior.
- **I (Interface Segregation):** Keep TypeScript contracts (`types/`) granular. Do not create massive monolithic interfaces if a component only uses a subset of properties.
- **D (Dependency Inversion):** Depend on abstractions (TypeScript interfaces). ViewModels depend on service contracts, not concrete hardcoded database implementations.

## 2. Mandatory Component Reuse (No Reinventing the Wheel)

**CRITICAL RULE:** Before creating any new UI component or utility, you MUST search:
1. `src/shared/components/`
2. `src/features/<feature-name>/components/`

If a component or layout already exists that serves a similar purpose, you **must reuse and compose it** using Tailwind/NativeWind variants or props. Creating a duplicate component when an existing one is available is strictly forbidden.