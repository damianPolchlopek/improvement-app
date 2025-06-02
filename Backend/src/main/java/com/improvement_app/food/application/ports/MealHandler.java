package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.MealRecipe;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface MealHandler {
    List<MealRecipe> findAll();

    void deleteAll();

    List<MealRecipe> saveAll(List<MealRecipe> mealRecipes);

    List<MealRecipe> findAll(Specification<MealRecipe> spec, Sort sort);
}
