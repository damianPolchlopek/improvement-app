package com.improvement_app.food.services;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;

import java.io.IOException;
import java.util.List;

public interface MealService {

    List<Meal> initMeals() throws IOException;

    List<Meal> getMeals(MealCategory mealCategory, MealType mealType);

    void deleteAllMeals();
}
