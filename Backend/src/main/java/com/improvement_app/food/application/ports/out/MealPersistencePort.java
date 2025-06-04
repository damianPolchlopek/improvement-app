package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.domain.MealSearchCriteria;
import com.improvement_app.food.domain.MealSortCriteria;

import java.util.List;

public interface MealPersistencePort {

    List<Meal> findMeals(MealSearchCriteria searchCriteria, MealSortCriteria sortCriteria);

    void deleteAll();

    List<Meal> saveAll(List<Meal> meals);

    List<Meal> findAll();
}
