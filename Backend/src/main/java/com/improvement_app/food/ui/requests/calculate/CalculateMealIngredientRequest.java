package com.improvement_app.food.ui.requests.calculate;

import com.improvement_app.food.domain.enums.Unit;

public record CalculateMealIngredientRequest (
        Long productId,
        String name,
        double amount,
        Unit unit
) {
}
