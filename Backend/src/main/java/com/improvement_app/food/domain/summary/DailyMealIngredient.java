package com.improvement_app.food.domain.summary;

import com.improvement_app.food.domain.enums.Unit;

public record DailyMealIngredient(
        Long id,
        Long mealRecipeIngredientId,
        String name,
        double amount,
        Unit unit
) {
}
