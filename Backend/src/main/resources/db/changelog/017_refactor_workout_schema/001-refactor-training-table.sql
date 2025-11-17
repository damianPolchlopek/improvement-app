ALTER TABLE workout.training ALTER COLUMN user_id DROP DEFAULT;

-- dodanie klucza obcego do tabeli user
ALTER TABLE workout.training
    ADD CONSTRAINT fk_training_user
    FOREIGN KEY(user_id)
    REFERENCES users.users(id)
    ON DELETE CASCADE;
