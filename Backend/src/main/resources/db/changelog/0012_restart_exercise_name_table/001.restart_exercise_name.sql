-- Usuń istniejącą tabelę
DROP TABLE IF EXISTS workout.exercise_name CASCADE;

-- Utwórz tabelę z poprawną definicją IDENTITY
CREATE TABLE workout.exercise_name (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);