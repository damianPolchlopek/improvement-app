package com.improvement_app.food.ui.commands;

import com.improvement_app.food.domain.dietsummary.EatenMeal;

import java.util.List;

public record CalculateDietRequest(List<EatenMeal> eatenMeals) {
}
