-- Migration: Enforce strict RLS policies and durable DB idempotency on public.credit_applications
-- Covers BYC-37 QA Final Closure:
--   1. Adds nullable idempotency_key with partial unique index (SQLSTATE 23505 protection).
--   2. Enables Row Level Security and replaces conflicting policies with explicit RBAC rules.
--   3. Protects approval integrity (update restricted to super_admin; no advisor delete policy).

BEGIN;

CREATE TABLE IF NOT EXISTS public.credit_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  regime text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  template_version text NOT NULL DEFAULT 'v1',
  selected_banks jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_applications
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS credit_applications_idempotency_key_unique
  ON public.credit_applications (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Advisors insert own applications" ON public.credit_applications;
DROP POLICY IF EXISTS "Advisors can view own applications" ON public.credit_applications;
DROP POLICY IF EXISTS "Super Admins can view all applications" ON public.credit_applications;
DROP POLICY IF EXISTS credit_applications_insert_own ON public.credit_applications;
DROP POLICY IF EXISTS credit_applications_select_own_or_admin ON public.credit_applications;
DROP POLICY IF EXISTS credit_applications_update_admin_only ON public.credit_applications;
DROP POLICY IF EXISTS credit_applications_delete_none ON public.credit_applications;
DROP POLICY IF EXISTS credit_applications_delete_own ON public.credit_applications;

-- Advisors can insert only credit applications owned by their authenticated session.
CREATE POLICY credit_applications_insert_own
  ON public.credit_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Advisors can read their own applications; super admins can read all applications.
CREATE POLICY credit_applications_select_own_or_admin
  ON public.credit_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );

-- Only super admins can update applications (prevents advisors from self-approving).
CREATE POLICY credit_applications_update_admin_only
  ON public.credit_applications
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- DELETE intentionally has no permissive policy for authenticated users to preserve the audit trail.

COMMIT;
