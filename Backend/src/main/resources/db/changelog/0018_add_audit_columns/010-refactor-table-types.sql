-- ============================================================
-- BACKUP NAJPIERW!
-- pg_dump -U p2222_food -d your_database -n workout > backup_workout_schema.sql
-- ============================================================

BEGIN;

-- 1. USUŃ KLUCZE OBCE (żeby móc zmienić typy)
ALTER TABLE workout.exercise_set
    DROP CONSTRAINT IF EXISTS exercise_set_exercise_id_fkey;

ALTER TABLE workout.exercise
    DROP CONSTRAINT IF EXISTS exercise_training_id_fkey;

ALTER TABLE workout.training_template_exercise
    DROP CONSTRAINT IF EXISTS training_template_exercise_exercise_name_id_fkey;

ALTER TABLE workout.training_template_exercise
    DROP CONSTRAINT IF EXISTS training_template_exercise_training_template_id_fkey;

-- 2. ZMIEŃ TYPY KLUCZY GŁÓWNYCH NA BIGINT
ALTER TABLE workout.exercise
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE workout.exercise_set
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE workout.training
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE workout.exercise_name
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE workout.training_template
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE workout.training_template_exercise
    ALTER COLUMN id TYPE BIGINT;

-- 3. ZMIEŃ TYPY KLUCZY OBCYCH (jeśli jeszcze nie są BIGINT)
-- exercise.training_id już jest BIGINT ✓
-- exercise_set.exercise_id już jest BIGINT ✓
-- training_template_exercise pola już są BIGINT ✓

-- 4. NAPRAW SEKWENCJE (zmień na BIGINT)
ALTER SEQUENCE workout.exercise_id_seq AS BIGINT;
ALTER SEQUENCE workout.exercise_set_id_seq AS BIGINT;
ALTER SEQUENCE workout.training_id_seq AS BIGINT;
ALTER SEQUENCE workout.exercise_name_id_seq AS BIGINT;
ALTER SEQUENCE workout.training_template_id_seq AS BIGINT;
ALTER SEQUENCE workout.training_template_exercise_id_seq AS BIGINT;

-- 5. DODAJ BRAKUJĄCE DEFAULT dla exercise.id i training.id
ALTER TABLE workout.exercise
    ALTER COLUMN id SET DEFAULT nextval('workout.exercise_id_seq'::regclass);

ALTER TABLE workout.training
    ALTER COLUMN id SET DEFAULT nextval('workout.training_id_seq'::regclass);

-- 6. PRZYWRÓĆ KLUCZE OBCE
ALTER TABLE workout.exercise_set
    ADD CONSTRAINT exercise_set_exercise_id_fkey
    FOREIGN KEY (exercise_id) REFERENCES workout.exercise(id) ON DELETE CASCADE;

ALTER TABLE workout.exercise
    ADD CONSTRAINT exercise_training_id_fkey
    FOREIGN KEY (training_id) REFERENCES workout.training(id) ON DELETE CASCADE;

ALTER TABLE workout.training_template_exercise
    ADD CONSTRAINT training_template_exercise_exercise_name_id_fkey
    FOREIGN KEY (exercise_name_id) REFERENCES workout.exercise_name(id) ON DELETE CASCADE;

ALTER TABLE workout.training_template_exercise
    ADD CONSTRAINT training_template_exercise_training_template_id_fkey
    FOREIGN KEY (training_template_id) REFERENCES workout.training_template(id) ON DELETE CASCADE;

COMMIT;