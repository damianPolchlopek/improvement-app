CREATE TABLE workout.training_template_exercise (
    id SERIAL PRIMARY KEY,
    training_template_id BIGINT NOT NULL REFERENCES workout.training_template(id) ON DELETE CASCADE,
    exercise_name_id BIGINT NOT NULL REFERENCES workout.exercise_name(id) ON DELETE CASCADE
);

CREATE INDEX idx_training_template_exercise_template ON workout.training_template_exercise(training_template_id);
CREATE INDEX idx_training_template_exercise_name ON workout.training_template_exercise(exercise_name_id);