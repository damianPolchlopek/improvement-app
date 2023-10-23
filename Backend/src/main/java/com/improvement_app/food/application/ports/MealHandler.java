package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.Meal;

import java.util.List;

public interface MealHandler {
    List<Meal> findAll();

    void deleteAll();

    List<Meal> saveAll(List<Meal> meals);

    List<Meal> findAllByName(String name, String sortBy);

    List<Meal> findAllById(List<Long> ids);
}
