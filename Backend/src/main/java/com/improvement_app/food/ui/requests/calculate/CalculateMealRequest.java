package com.improvement_app.food.ui.requests.calculate;

import java.util.List;

public record CalculateMealRequest (
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        double portionMultiplier,
        List<CalculateMealIngredientRequest> ingredients
) {

}
