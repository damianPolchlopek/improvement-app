package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.domain.enums.Unit;
import com.improvement_app.food.ui.requests.calculate.CalculateMealIngredientRequest;

public record CreateDailyMealIngredientRequest(
        Long mealRecipeIngredientId,
        Long productId,
        String name,
        double amount,
        Unit unit
) {
    public DailyMealIngredient toDailyMealIngredient() {
        return new DailyMealIngredient(
                null,
                this.mealRecipeIngredientId,
                this.productId,
                this.name,
                this.amount,
                this.unit
        );
    }

    public CalculateMealIngredientRequest toCalculateMealIngredientRequest() {
        return new CalculateMealIngredientRequest(
                mealRecipeIngredientId,
                name,
                amount,
                unit
        );
    }
}
