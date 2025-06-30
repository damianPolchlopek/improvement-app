CREATE TABLE workout.exercise_set (
    id INT PRIMARY KEY,
    exercise_id BIGINT NOT NULL REFERENCES workout.exercise(id) ON DELETE CASCADE,
    rep DOUBLE PRECISION NOT NULL,
    weight DOUBLE PRECISION NOT NULL
);

CREATE INDEX idx_exercise_training ON workout.exercise(training_id);
CREATE INDEX idx_set_exercise ON workout.exercise_set(exercise_id);