package com.improvement_app.food.services;

import com.improvement_app.food.entity.Meal;

import java.io.IOException;
import java.util.List;

public interface MealService {

    List<Meal> initMeals() throws IOException;

    List<Meal> getMeals();

    void deleteAllMeals();
}
