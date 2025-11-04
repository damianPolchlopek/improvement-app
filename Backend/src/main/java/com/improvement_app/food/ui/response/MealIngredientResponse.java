package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.enums.Unit;

public record MealIngredientResponse(
        long id,
        long productId,
        String name,
        double amount,
        Unit unit
) { }
