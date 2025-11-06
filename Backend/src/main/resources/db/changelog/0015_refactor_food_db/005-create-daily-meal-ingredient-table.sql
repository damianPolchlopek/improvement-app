-- ============================================
-- Tabela: daily_meal_ingredient (składniki zjedzonych posiłków)
-- ============================================

CREATE TABLE IF NOT EXISTS food.daily_meal_ingredient (
    id BIGSERIAL PRIMARY KEY,
    daily_meal_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,

    CONSTRAINT fk_daily_meal_ingredient_daily_meal
        FOREIGN KEY (daily_meal_id)
        REFERENCES food.daily_meal(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_daily_meal_ingredient_product
        FOREIGN KEY (product_id)
        REFERENCES food.product(id)
        ON DELETE RESTRICT

);

CREATE INDEX idx_daily_meal_ingredient_daily_meal_id ON food.daily_meal_ingredient(daily_meal_id);
CREATE INDEX idx_daily_meal_ingredient_product_id ON food.daily_meal_ingredient(product_id);
