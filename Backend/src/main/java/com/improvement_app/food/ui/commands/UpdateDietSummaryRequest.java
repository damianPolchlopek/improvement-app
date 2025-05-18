package com.improvement_app.food.ui.commands;

import com.improvement_app.food.domain.EatenMeals;

import java.util.List;

public record UpdateDietSummaryRequest(
        Long dietSummaryId,
        List<EatenMeals> meals
) {
}
