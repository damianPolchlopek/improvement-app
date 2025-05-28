ALTER TABLE meal_ingredient
ADD CONSTRAINT fk_meal_ingredient_meal
FOREIGN KEY (meal_id) REFERENCES meal_recipe(id) ON DELETE CASCADE;

ALTER TABLE meal_ingredient
ADD CONSTRAINT fk_meal_ingredient_product
FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT;