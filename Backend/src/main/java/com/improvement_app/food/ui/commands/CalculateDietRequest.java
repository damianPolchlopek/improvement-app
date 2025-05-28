package com.improvement_app.food.ui.commands;

import com.improvement_app.food.domain.EatenMeal;

import java.util.List;

public record CalculateDietRequest(List<EatenMeal> eatenMeals) {
}
