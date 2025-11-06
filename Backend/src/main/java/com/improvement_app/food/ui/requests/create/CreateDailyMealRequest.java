package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.calculate.CalculateMealIngredientRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateMealRequest;

import java.util.List;
import java.util.stream.Collectors;

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

    public CalculateMealRequest toCalculateMealRequest() {
        List<CalculateMealIngredientRequest> collect = this.ingredients.stream()
                .map(CreateDailyMealIngredientRequest::toCalculateMealIngredientRequest)
                .collect(Collectors.toList());

        return new CalculateMealRequest(
                kcal,
                protein,
                carbohydrates,
                fat,
                portionMultiplier,
                collect
        );
    }
}
