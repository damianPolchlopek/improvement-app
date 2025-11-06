package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.recipe.MealIngredient;
import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;

import java.util.List;

public interface MealIngredientPersistencePort {

    List<MealIngredient> getMealIngredients(Long mealId);
}
