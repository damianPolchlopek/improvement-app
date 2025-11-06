package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.recipe.MealRecipe;
import com.improvement_app.food.domain.MealSearchCriteria;
import com.improvement_app.food.domain.MealSortCriteria;

import java.util.List;

public interface MealPersistencePort {

    List<MealRecipe> findMeals(MealSearchCriteria searchCriteria, MealSortCriteria sortCriteria);

    void deleteAll();

    List<MealRecipe> saveAll(List<MealRecipe> meals);

    List<MealRecipe> findAll();
}
