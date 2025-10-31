package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.domain.enums.Unit;

public record CreateDailyMealIngredientRequest(
        Long mealRecipeIngredientId,
        String name,
        double amount,
        Unit unit
) {
    public DailyMealIngredient toDailyMealIngredient() {
        return new DailyMealIngredient(
                null,
                this.mealRecipeIngredientId,
                this.name,
                this.amount,
                this.unit
        );
    }
}
