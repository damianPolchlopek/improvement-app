package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;

import java.util.List;

public interface MealIngredientPersistencePort {

    List<MealIngredientEntity> getMealIngredients(List<Long> ingredients);
}
