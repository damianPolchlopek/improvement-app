package com.improvement_app.food.domain;

import com.improvement_app.food.domain.enums.Unit;

public record MealIngredient(
        Long id,
        String name,
        double amount,
        Unit unit,
        Long productId
) {

    public MealIngredient adjustAmount(double portionDivisor) {
        return new MealIngredient(
                id,
                name,
                amount / portionDivisor,
                unit,
                productId
        );
    }
}
