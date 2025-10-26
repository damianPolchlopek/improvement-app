package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;

import java.util.List;

public interface MealIngredientPersistencePort {

    List<MealIngredientEntity> getMealIngredients(List<Long> ingredients);

    List<MealIngredient> getMealIngredients(Long mealId);
}
