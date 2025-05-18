package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealRecipe;

import java.util.List;

public interface MealHandler {
    List<MealRecipe> findAll();

    void deleteAll();

    List<MealRecipe> saveAll(List<MealRecipe> mealRecipes);

    List<MealRecipe> findAllByName(String name, String sortBy);

    List<MealRecipe> findAllById(List<Long> ids);
}
