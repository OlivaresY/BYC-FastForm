-- Migration: Provision public.system_settings with schema guards, default maintenance flag seed, and strict RBAC RLS
-- Covers BYC-38 QA Verdict Closure:
--   1. Creates/upgrades public.system_settings matching useMaintenanceStatus (key = 'maintenance_mode', value jsonb, message text, updated_at timestamptz).
--   2. Fails fast via DO $$ guard if any required column is missing or has an incompatible data type.
--   3. Idempotently seeds 'maintenance_mode' disabled by default ({"enabled": false}).
--   4. Enables Row Level Security, drops any stray pre-existing policies dynamically, and enforces:
--      - Public SELECT (anon, authenticated) so Screen 0 / root layout can evaluate maintenance mode pre-auth.
--      - Write access (INSERT/UPDATE/DELETE) restricted strictly to super_admin JWT app_metadata role.

BEGIN;

CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{"enabled": false}'::jsonb,
  message text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings
  ADD COLUMN IF NOT EXISTS key text,
  ADD COLUMN IF NOT EXISTS value jsonb DEFAULT '{"enabled": false}'::jsonb,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS system_settings_key_unique
  ON public.system_settings (key);

DO $$
DECLARE
  v_column_name text;
  v_expected_type text;
  v_data_type text;
  v_actual_type text;
BEGIN
  FOR v_column_name, v_expected_type IN
    SELECT required_col.column_name, required_col.expected_type
      FROM (
        VALUES
          ('key', 'text | character varying'),
          ('value', 'jsonb'),
          ('message', 'text | character varying'),
          ('updated_at', 'timestamp with time zone')
      ) AS required_col (column_name, expected_type)
  LOOP
    v_data_type := NULL;

    SELECT c.data_type
      INTO v_data_type
      FROM information_schema.columns AS c
     WHERE c.table_schema = 'public'
       AND c.table_name = 'system_settings'
       AND c.column_name = v_column_name;

    v_actual_type := COALESCE(v_data_type, 'MISSING');

    IF v_column_name IN ('key', 'message')
      AND (v_data_type IS NULL OR v_data_type NOT IN ('text', 'character varying')) THEN
      RAISE EXCEPTION
        'Incompatible schema on public.system_settings.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name = 'value'
      AND v_data_type IS DISTINCT FROM 'jsonb' THEN
      RAISE EXCEPTION
        'Incompatible schema on public.system_settings.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    ELSIF v_column_name = 'updated_at'
      AND v_data_type IS DISTINCT FROM 'timestamp with time zone' THEN
      RAISE EXCEPTION
        'Incompatible schema on public.system_settings.%: expected %, found %',
        v_column_name,
        v_expected_type,
        v_actual_type;
    END IF;
  END LOOP;
END
$$;

INSERT INTO public.system_settings (key, value, message)
VALUES ('maintenance_mode', '{"enabled": false}'::jsonb, NULL)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT p.policyname
      FROM pg_policies AS p
     WHERE p.schemaname = 'public'
       AND p.tablename = 'system_settings'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.system_settings',
      policy_record.policyname
    );
  END LOOP;
END
$$;

-- Allow pre-auth and authenticated clients to read global app configuration such as maintenance_mode.
CREATE POLICY system_settings_select_public
  ON public.system_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Restrict inserts, updates, and deletes on system settings strictly to super_admin users.
CREATE POLICY system_settings_write_admin_only
  ON public.system_settings
  FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

COMMIT;
