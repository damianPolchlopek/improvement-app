package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealIngredient;

import java.util.List;

public interface MealIngredientHandler {

    List<MealIngredient> getMealIngredients(List<Long> ingredients);
}
