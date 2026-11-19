-- Migration: Enforce strict RLS policies, schema type guards, and durable DB idempotency on public.credit_applications
-- Covers BYC-37 QA Final Closure (Stage 6):
--   1. Ensures required columns exist and fails fast via DO $$ guard if user_id is not uuid or payload is not jsonb.
--   2. Adds partial unique index credit_applications_idempotency_key_unique (SQLSTATE 23505 protection).
--   3. Enables Row Level Security, dynamically drops all existing policies on public.credit_applications via pg_policies,
--      and creates the 3 canonical RBAC policies.
--   4. Protects approval integrity and audit trail (update restricted to super_admin; DELETE denied by default under RLS).

BEGIN;

CREATE TABLE IF NOT EXISTS public.credit_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  regime text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  template_version text NOT NULL DEFAULT 'v1',
  selected_banks jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL,
  idempotency_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_applications
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS payload jsonb,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

DO $$
DECLARE
  v_user_id_type text;
  v_payload_type text;
BEGIN
  SELECT c.data_type
    INTO v_user_id_type
    FROM information_schema.columns AS c
   WHERE c.table_schema = 'public'
     AND c.table_name = 'credit_applications'
     AND c.column_name = 'user_id';

  IF v_user_id_type IS DISTINCT FROM 'uuid' THEN
    RAISE EXCEPTION
      'Incompatible schema on public.credit_applications.user_id: expected uuid, found %',
      COALESCE(v_user_id_type, 'MISSING');
  END IF;

  SELECT c.data_type
    INTO v_payload_type
    FROM information_schema.columns AS c
   WHERE c.table_schema = 'public'
     AND c.table_name = 'credit_applications'
     AND c.column_name = 'payload';

  IF v_payload_type IS DISTINCT FROM 'jsonb' THEN
    RAISE EXCEPTION
      'Incompatible schema on public.credit_applications.payload: expected jsonb, found %',
      COALESCE(v_payload_type, 'MISSING');
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS credit_applications_idempotency_key_unique
  ON public.credit_applications (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT p.policyname
      FROM pg_policies AS p
     WHERE p.schemaname = 'public'
       AND p.tablename = 'credit_applications'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.credit_applications',
      policy_record.policyname
    );
  END LOOP;
END
$$;

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

-- DELETE is intentionally denied by default under RLS for authenticated users to preserve the audit trail
-- (only service-role or administrative database migrations may purge records).

COMMIT;
