package com.improvement_app.food.ui.requests.calculate;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CalculateDietRequest(
        @NotNull(message = "Lista posiłków nie może być null")
        @NotEmpty(message = "Lista posiłków nie może być pusta")
        List<CalculateMealRequest> dailyMeals
) {
}
