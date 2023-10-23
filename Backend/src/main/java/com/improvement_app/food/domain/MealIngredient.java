package com.improvement_app.food.domain;

import com.improvement_app.food.domain.enums.Unit;
import lombok.Data;

@Data
public class MealIngredient {

    private int productId;
    private String name;
    private double amount;
    private Unit unit;

    public MealIngredient(int productId, String name, double amount, Unit unit) {
        this.productId = productId;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }

    public MealIngredient(MealIngredient mealIngredient) {
        this.productId = mealIngredient.getProductId();
        this.name = mealIngredient.getName();
        this.amount = mealIngredient.getAmount();
        this.unit = mealIngredient.getUnit();
    }
}
