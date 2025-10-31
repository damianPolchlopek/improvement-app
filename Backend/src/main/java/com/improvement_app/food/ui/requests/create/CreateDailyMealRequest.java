package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.summary.DailyMeal;

import java.util.List;

public record CreateDailyMealRequest(
        Long mealRecipeId,
        String name,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        double portionMultiplier,
        List<CreateDailyMealIngredientRequest> ingredients
) {
    public DailyMeal toDailyMeal() {
        return new DailyMeal(
                null,
                this.mealRecipeId,
                this.name,
                this.kcal,
                this.protein,
                this.carbohydrates,
                this.fat,
                this.portionMultiplier,
                this.ingredients.stream()
                        .map(CreateDailyMealIngredientRequest::toDailyMealIngredient)
                        .toList()
        );
    }
}
