package com.improvement_app.food.ui.requests;

import com.improvement_app.food.domain.summary.DailyMeal;
import jakarta.validation.constraints.NotNull;

public record RecalculateMealMacroRequest(
        @NotNull(message = "Posiłek nie być null")
        DailyMeal dailyMeal
) { }
