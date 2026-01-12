CREATE SEQUENCE IF NOT EXISTS workout.training_id_seq START WITH 1000;
CREATE SEQUENCE IF NOT EXISTS workout.exercise_id_seq START WITH 1000;

-- Ustaw starting value powyżej obecnych ID (jeśli masz dane)
SELECT setval('workout.training_id_seq', COALESCE((SELECT MAX(id) FROM workout.training), 0) + 1);
SELECT setval('workout.exercise_id_seq', COALESCE((SELECT MAX(id) FROM workout.exercise), 0) + 1);

-- Usuń auto-increment (IDENTITY) z kolumn
ALTER TABLE workout.training ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE workout.exercise ALTER COLUMN id DROP IDENTITY IF EXISTS;