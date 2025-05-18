package com.improvement_app.food.ui.commands;

import com.improvement_app.food.domain.EatenMeals;

import java.util.List;

public record CreateDietSummaryRequest(
        List<EatenMeals> meals
) {
}
