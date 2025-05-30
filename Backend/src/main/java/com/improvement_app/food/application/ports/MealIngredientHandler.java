package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealIngredient;

import java.util.List;
import java.util.Optional;

public interface MealIngredientHandler {
    Optional<MealIngredient> getMealIngredient(int id);

    List<MealIngredient> getMealIngredients(List<Long> ingredients);
}
