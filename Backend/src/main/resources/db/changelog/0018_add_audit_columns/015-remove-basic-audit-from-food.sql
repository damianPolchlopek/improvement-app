ALTER TABLE food.diet_summary DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.diet_summary DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.diet_summary DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.diet_summary DROP COLUMN IF EXISTS updated_date;

ALTER TABLE food.daily_meal DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.daily_meal DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.daily_meal DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.daily_meal DROP COLUMN IF EXISTS updated_date;

ALTER TABLE food.daily_meal_ingredient DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.daily_meal_ingredient DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.daily_meal_ingredient DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.daily_meal_ingredient DROP COLUMN IF EXISTS updated_date;

ALTER TABLE food.meal_recipe DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.meal_recipe DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.meal_recipe DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.meal_recipe DROP COLUMN IF EXISTS updated_date;

ALTER TABLE food.meal_ingredient DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.meal_ingredient DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.meal_ingredient DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.meal_ingredient DROP COLUMN IF EXISTS updated_date;

ALTER TABLE food.product DROP COLUMN IF EXISTS created_by;
ALTER TABLE food.product DROP COLUMN IF EXISTS updated_by;
ALTER TABLE food.product DROP COLUMN IF EXISTS created_date;
ALTER TABLE food.product DROP COLUMN IF EXISTS updated_date;