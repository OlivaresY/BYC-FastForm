-- Migration: Enforce strict RLS policies, full schema type guards, and durable DB idempotency on public.credit_applications
-- Covers BYC-37 Final SQL Schema Guard Patch:
--   1. Aligns all columns written/read by creditApplication.service.ts (including selected_banks as text[]).
--   2. Fails fast via DO $$ guard if any repository column is missing or has an incompatible data type.
--   3. Adds partial unique index credit_applications_idempotency_key_unique (SQLSTATE 23505 protection).
--   4. Enables Row Level Security, dynamically drops all existing policies on public.credit_applications via pg_policies,
--      and creates the 3 canonical RBAC policies.
--   5. Protects approval integrity and audit trail (update restricted to super_admin; DELETE denied by default under RLS).

BEGIN;

CREATE TABLE IF NOT EXISTS public.credit_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  regime text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  template_version text NOT NULL DEFAULT 'v1',
  selected_banks text[] NOT NULL DEFAULT '{}'::text[],
  payload jsonb NOT NULL,
  idempotency_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_applications
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS regime text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS template_version text DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS selected_banks text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS payload jsonb,
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

DO $$
DECLARE
  v_column_name text;
  v_expected_type text;
  v_data_type text;
  v_udt_name text;
  v_actual_type text;
BEGIN
  FOR v_column_name, v_expected_type IN
    SELECT required_col.column_name, required_col.expected_type
      FROM (
        VALUES
          ('id', 'uuid'),
          ('user_id', 'uuid'),
          ('regime', 'text | character varying'),
          ('status', 'text | character varying'),
          ('template_version', 'text | character varying'),
          ('selected_banks', 'text[] (ARRAY/_text)'),
          ('payload', 'jsonb'),
          ('idempotency_key', 'text | character varying'),
          ('created_at', 'timestamp with time zone')
      ) AS required_col (column_name, expected_type)
  LOOP
    v_data_type := NULL;
    v_udt_name := NULL;

    SELECT c.data_type, c.udt_name
      INTO v_data_type, v_udt_name
      FROM information_schema.columns AS c
     WHERE c.table_schema = 'public'
       AND c.table_name = 'credit_applications'
       AND c.column_name = v_column_name;

    v_actual_type := CASE
      WHEN v_data_type IS NULL THEN 'MISSING'
      WHEN v_data_type = 'ARRAY' THEN format('%s (%s)', v_data_type, COALESCE(v_udt_name, 'unknown'))
      ELSE v_data_type
    END;

    IF v_column_name IN ('id', 'user_id')
      AND v_data_type IS DISTINCT FROM 'uuid' THEN
      RAISE EXCEPTION
        'Incompatible schema on public.credit_applications.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name IN ('regime', 'status', 'template_version', 'idempotency_key')
      AND (v_data_type IS NULL OR v_data_type NOT IN ('text', 'character varying')) THEN
      RAISE EXCEPTION
        'Incompatible schema on public.credit_applications.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name = 'selected_banks'
      AND (v_data_type IS DISTINCT FROM 'ARRAY' OR v_udt_name IS DISTINCT FROM '_text') THEN
      RAISE EXCEPTION
        'Incompatible schema on public.credit_applications.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name = 'payload'
      AND v_data_type IS DISTINCT FROM 'jsonb' THEN
      RAISE EXCEPTION
        'Incompatible schema on public.credit_applications.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name = 'created_at'
      AND v_data_type IS DISTINCT FROM 'timestamp with time zone' THEN
      RAISE EXCEPTION
        'Incompatible schema on public.credit_applications.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    END IF;
  END LOOP;
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
