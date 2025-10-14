package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.enums.Unit;

public record MealIngredientResponse(String name, Unit unit, double amount, long id) {
}
