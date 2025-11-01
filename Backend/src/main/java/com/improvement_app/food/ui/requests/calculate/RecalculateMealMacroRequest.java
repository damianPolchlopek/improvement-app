package com.improvement_app.food.ui.requests.calculate;

import jakarta.validation.constraints.NotNull;

public record RecalculateMealMacroRequest(
        @NotNull(message = "Posiłek nie być null")
        CalculateMealRequest dailyMeal
) { }
