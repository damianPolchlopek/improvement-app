package com.improvement_app.food.ui.requests;

import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.infrastructure.entity.EatenMealEntity;
import jakarta.validation.constraints.NotNull;

public record RecalculateMealMacroRequest(
        @NotNull(message = "Posiłek nie być null")
        EatenMeal eatenMeal
) { }
