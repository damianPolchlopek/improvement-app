package com.improvement_app.food.ui.requests.update;

import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.calculate.CalculateMealIngredientRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateMealRequest;
import com.improvement_app.food.ui.requests.create.CreateDailyMealIngredientRequest;

import java.util.List;
import java.util.stream.Collectors;

public record UpdateDailyMealRequest(
        Long id,
        Long mealRecipeId,
        String name,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        double portionMultiplier,
        List<UpdateDailyMealIngredientRequest> ingredients
) {
    public DailyMeal toDailyMeal() {
        return new DailyMeal(
                this.id,
                this.mealRecipeId,
                this.name,
                this.kcal,
                this.protein,
                this.carbohydrates,
                this.fat,
                this.portionMultiplier,
                this.ingredients.stream()
                        .map(UpdateDailyMealIngredientRequest::toDailyMealIngredient)
                        .toList()
        );
    }

    public CalculateMealRequest toCalculateMealRequest() {
        List<CalculateMealIngredientRequest> collect = this.ingredients.stream()
                .map(UpdateDailyMealIngredientRequest::toCalculateMealIngredientRequest)
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
