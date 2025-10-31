-- ============================================
-- Tabela: daily_meal (pojedynczy zjedzony posiłek)
-- ============================================

CREATE TABLE IF NOT EXISTS food.daily_meal (
    id BIGSERIAL PRIMARY KEY,
    diet_summary_id BIGINT NOT NULL,
    meal_recipe_id BIGINT,
    name VARCHAR(255),
    portion_multiplier DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    -- Cache makroskładników dla wydajności
    cached_kcal DOUBLE PRECISION,
    cached_protein DOUBLE PRECISION,
    cached_carbohydrates DOUBLE PRECISION,
    cached_fat DOUBLE PRECISION,



    CONSTRAINT fk_daily_meal_diet_summary
        FOREIGN KEY (diet_summary_id)
        REFERENCES food.diet_summary(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_daily_meal_recipe
        FOREIGN KEY (meal_recipe_id)
        REFERENCES food.meal_recipe(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_daily_meal_diet_summary_id ON food.daily_meal(diet_summary_id);
CREATE INDEX idx_daily_meal_recipe_id ON food.daily_meal(meal_recipe_id);