package com.improvement_app.food.application.ports;

import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;

import java.util.List;

public interface MealIngredientHandler {

    List<MealIngredientEntity> getMealIngredients(List<Long> ingredients);
}
