BEGIN;

-- 1. Usuń IDENTITY
ALTER TABLE workout.exercise_set
    ALTER COLUMN id DROP IDENTITY IF EXISTS;

-- 2. Usuń starą sekwencję
DROP SEQUENCE IF EXISTS workout.exercise_set_id_seq CASCADE;

-- 3. Utwórz nową sekwencję
CREATE SEQUENCE workout.exercise_set_id_seq
    AS BIGINT
    START WITH 67500
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 4. Ustaw właściciela
ALTER SEQUENCE workout.exercise_set_id_seq
    OWNED BY workout.exercise_set.id;

-- 5. Ustaw DEFAULT
ALTER TABLE workout.exercise_set
    ALTER COLUMN id SET DEFAULT nextval('workout.exercise_set_id_seq'::regclass);

COMMIT;