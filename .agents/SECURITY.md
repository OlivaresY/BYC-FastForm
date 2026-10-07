# BYC FastForm & CoriMotors - Security & Authorization Standards

This document defines the strict security protocols, Role-Based Access Control (RBAC), and Supabase Row Level Security (RLS) rules that all AI agents must follow when building features for BYC FastForm.

## 1. Core Security Philosophy

- **Never Trust the Client:** Hiding a button in the React Native app or Next.js frontend is NOT security. All authorization must be enforced at the database level via Supabase RLS.
- **Strict Data Isolation:** A CoriMotors Advisor must NEVER be able to read, modify, or delete a credit application created by another Advisor.
- **Secret Management:** Never hardcode API keys, JWT tokens, or passwords in the source code.

## 2. Role-Based Access Control (RBAC)

The system operates with two primary roles defined in the Supabase Auth JWT claims or a secure `user_roles` table:

### A. Advisor (Asesor)

- **Environment:** Expo / React Native Mobile App.
- **Permissions:**
  - Can CREATE new credit applications.
  - Can READ only their own credit applications (where `advisor_id = auth.uid()`).
  - Can UPDATE their own applications ONLY if the status is `'DRAFT'` or `'PENDING'`.
  - Cannot approve or reject applications.
  - Cannot read, create, or modify PDF Templates.

### B. Super Admin (Súper Administrador)

- **Environment:** Next.js Web Console.
- **Permissions:**
  - Can READ all credit applications across the entire system.
  - Can UPDATE application statuses (Approve / Reject).
  - Can CREATE, READ, UPDATE, and DELETE PDF templates and coordinate mappings.
  - Can manage user roles and branch configurations.

## 3. Supabase Row Level Security (RLS) Standards

Whenever you generate SQL for a new Supabase table, you MUST enable RLS and write explicit policies.

### Mandatory RLS Enablement

```sql
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
```

### Example: Advisor Read Policy (Isolation)

```sql
CREATE POLICY "Advisors can view own applications" 
ON public.credit_applications 
FOR SELECT 
USING (auth.uid() = advisor_id);
```

### Example: Super Admin Read Policy (Global Access)

```sql
CREATE POLICY "Super Admins can view all applications" 
ON public.credit_applications 
FOR SELECT 
USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'super_admin'
);
```

## 4. Client-Side Security Guidelines

### Environment Variables

- **Public Keys:** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_*`) are safe to use in the frontend clients.
- **Service Role Key:** The `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies. It is **STRICTLY FORBIDDEN** in the Expo mobile app. It may only be used in secure Node.js backend environments, Next.js Server Actions, or Supabase Edge Functions.

### Token Storage (Mobile)

- Never store session tokens in standard `AsyncStorage`.
- You MUST use `expo-secure-store` for persisting Supabase authentication sessions on iOS and Android to ensure they are encrypted by the OS keychain/keystore.

### Data Validation (Sanitization)

- Always validate incoming payloads before sending them to Supabase.
- Use Zod schemas in the `types/` layer to enforce data integrity, string lengths, and required fields before triggering a mutation in the `services/` layer.

## Definition of Done (Security Checklist)

Before completing any database or authentication task:

- [ ] RLS is explicitly enabled on all new tables.
- [ ] Policies restrict SELECT, INSERT, UPDATE, and DELETE actions based on `auth.uid()` or role.
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` is exposed in the React Native codebase.
- [ ] Secure storage is used for authentication tokens.
- [ ] Zod schemas are implemented for payload sanitization.
