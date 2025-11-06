package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.calculate.CalculateResult;

public record CalculationResponse(
        double kcal,
        double protein,
        double carbohydrates,
        double fat
) {
    public static CalculationResponse from(CalculateResult calculateResult) {
        return new CalculationResponse(
            calculateResult.kcal(),
            calculateResult.protein(),
            calculateResult.carbohydrates(),
            calculateResult.fat()
        );
    }
}
