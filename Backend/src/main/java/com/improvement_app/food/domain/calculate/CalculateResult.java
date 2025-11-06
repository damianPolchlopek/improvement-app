package com.improvement_app.food.domain.calculate;

public record CalculateResult(
        double kcal,
        double protein,
        double carbohydrates,
        double fat
) {
}
