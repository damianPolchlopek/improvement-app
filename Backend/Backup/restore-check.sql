-- Sprawdzenie bazy odtworzonej z kopii (test odtwarzania w .github/workflows/backup.yml).
-- Błąd (RAISE EXCEPTION) = workflow czerwony = mail od GitHuba.

\set ON_ERROR_STOP on

-- 1. Kluczowe tabele nie mogą być puste
DO $$
BEGIN
    IF (SELECT count(*) FROM users.users) = 0 THEN
        RAISE EXCEPTION 'Pusta tabela users.users';
    END IF;
    IF (SELECT count(*) FROM workout.training) = 0 THEN
        RAISE EXCEPTION 'Pusta tabela workout.training';
    END IF;
    IF (SELECT count(*) FROM food.diet_summary) = 0 THEN
        RAISE EXCEPTION 'Pusta tabela food.diet_summary';
    END IF;
    -- Stan migracji Liquibase - bez niego aplikacja próbowałaby migrować bazę od zera
    IF (SELECT count(*) FROM public.databasechangelog) = 0 THEN
        RAISE EXCEPTION 'Pusta tabela public.databasechangelog';
    END IF;
END
$$;

-- 2. Liczba wierszy we wszystkich tabelach - trafia do podsumowania workflow
SELECT '| ' || table_schema || '.' || table_name || ' | ' ||
       (xpath('/row/c/text()',
              query_to_xml(format('SELECT count(*) AS c FROM %I.%I', table_schema, table_name),
                           false, true, '')))[1]::text || ' |'
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;
