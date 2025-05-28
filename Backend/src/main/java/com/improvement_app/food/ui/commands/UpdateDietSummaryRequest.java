package com.improvement_app.food.ui.commands;

import com.improvement_app.food.domain.EatenMeal;

import java.util.List;

public record UpdateDietSummaryRequest(
        Long dietSummaryId,
        List<EatenMeal> meals
) {
}
