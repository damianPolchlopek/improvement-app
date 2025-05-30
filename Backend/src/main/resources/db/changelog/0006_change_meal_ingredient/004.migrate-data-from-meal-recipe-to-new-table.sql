INSERT INTO meal_ingredient (meal_id, product_id, name, amount, unit)
SELECT
    mr.id as meal_id,
    (ingredient->>'productId')::INT as product_id,
    ingredient->>'name' as name,
    (ingredient->>'amount')::DOUBLE PRECISION as amount,
    ingredient->>'unit' as unit
FROM meal_recipe mr,
     jsonb_array_elements(mr.meal_ingredients) as ingredient
WHERE mr.meal_ingredients IS NOT NULL
  AND jsonb_typeof(mr.meal_ingredients) = 'array';