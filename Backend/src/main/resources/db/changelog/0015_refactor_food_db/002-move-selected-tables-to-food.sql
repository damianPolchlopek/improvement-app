-- Move specifically listed tables from public -> food
ALTER TABLE IF EXISTS public.diet_summary SET SCHEMA food;
ALTER TABLE IF EXISTS public.meal_ingredient SET SCHEMA food;
ALTER TABLE IF EXISTS public.meal_ingredients SET SCHEMA food;
ALTER TABLE IF EXISTS public.meal_recipe SET SCHEMA food;
ALTER TABLE IF EXISTS public.product SET SCHEMA food;
