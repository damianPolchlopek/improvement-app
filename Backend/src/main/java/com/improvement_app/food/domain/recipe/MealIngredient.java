package com.improvement_app.food.domain.recipe;

import com.improvement_app.food.domain.enums.Unit;

public record MealIngredient(
        Long id,
        String name,
        double amount,
        Unit unit,
        Product product
) {

    public MealIngredient(Long id, String name, double amount, Unit unit, Product product) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
        this.product = product;
    }

    public MealIngredient adjustAmount(double portionDivisor) {
        return new MealIngredient(
                id,
                name,
                amount / portionDivisor,
                unit,
                product
        );
    }
}
