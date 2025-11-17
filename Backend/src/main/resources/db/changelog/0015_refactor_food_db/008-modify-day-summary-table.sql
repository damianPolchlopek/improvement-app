ALTER TABLE food.diet_summary
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE food.diet_summary
    ADD CONSTRAINT fk_diet_summary_user
    FOREIGN KEY (user_id)
    REFERENCES users.users(id)
    ON DELETE CASCADE;
