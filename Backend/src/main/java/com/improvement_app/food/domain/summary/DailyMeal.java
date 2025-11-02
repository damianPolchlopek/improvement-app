package com.improvement_app.food.domain.summary;

import java.util.List;

public record DailyMeal(
        Long id,
        Long mealRecipeId,
        String name,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        double portionMultiplier,
        List<DailyMealIngredient> ingredients
) { }
