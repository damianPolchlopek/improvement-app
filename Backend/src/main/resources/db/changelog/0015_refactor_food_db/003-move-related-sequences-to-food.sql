-- Move sequences that are owned by the moved tables' columns.
-- This script finds sequences in public that have dependencies (ownership) on the listed tables,
-- and moves only those sequences.

DO $$
DECLARE
  r RECORD;
  target_tables TEXT[] := ARRAY['diet_summary','meal_ingredient','meal_ingredients','meal_recipe','product'];
BEGIN
  FOR r IN
    SELECT c.relname as sequence_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'S'
      AND n.nspname = 'public'
  LOOP
    -- check if sequence is owned by any of the target tables' columns
    IF EXISTS (
      SELECT 1
      FROM pg_depend d
      JOIN pg_class t ON d.refobjid = t.oid
      WHERE d.objid = (SELECT oid FROM pg_class WHERE relname = r.sequence_name AND relkind = 'S' LIMIT 1)
        AND t.relname = ANY(target_tables)
    ) THEN
      EXECUTE format('ALTER SEQUENCE public.%I SET SCHEMA food;', r.sequence_name);
    END IF;
  END LOOP;
END
$$;
