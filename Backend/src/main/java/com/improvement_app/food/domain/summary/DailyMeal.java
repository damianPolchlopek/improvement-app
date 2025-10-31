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
) {
    public DailyMeal updateMacro(
            double kcal,
            double protein,
            double carbohydrates,
            double fat
    ) {
        return new DailyMeal(
                id,
                mealRecipeId,
                name,
                kcal,
                protein,
                carbohydrates,
                fat,
                portionMultiplier,
                ingredients
        );
    }
}
