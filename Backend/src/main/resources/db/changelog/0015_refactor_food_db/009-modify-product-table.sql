ALTER TABLE food.product
    ADD CONSTRAINT chk_product_kcal CHECK (kcal >= 0),
    ADD CONSTRAINT chk_product_protein CHECK (protein >= 0),
    ADD CONSTRAINT chk_product_carbs CHECK (carbohydrates >= 0),
    ADD CONSTRAINT chk_product_fat CHECK (fat >= 0),
    ADD CONSTRAINT chk_product_amount CHECK (amount > 0);