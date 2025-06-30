CREATE TABLE workout.exercise (
    id INT PRIMARY KEY,
    training_id BIGINT NOT NULL REFERENCES workout.training(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    progress VARCHAR(255)
);
