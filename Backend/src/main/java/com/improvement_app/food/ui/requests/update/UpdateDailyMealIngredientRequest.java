package com.improvement_app.food.ui.requests.update;

import com.improvement_app.food.domain.enums.Unit;
import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.ui.requests.calculate.CalculateMealIngredientRequest;

public record UpdateDailyMealIngredientRequest(
        Long id,
        Long mealRecipeIngredientId,
        Long productId,
        String name,
        double amount,
        Unit unit
) {
    public DailyMealIngredient toDailyMealIngredient() {
        return new DailyMealIngredient(
                this.id,
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
