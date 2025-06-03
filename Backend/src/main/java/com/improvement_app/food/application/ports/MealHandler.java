package com.improvement_app.food.application.ports;

import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface MealHandler {
    List<MealRecipeEntity> findAll();

    void deleteAll();

    List<MealRecipeEntity> saveAll(List<MealRecipeEntity> mealRecipeEntities);

    List<MealRecipeEntity> findAll(Specification<MealRecipeEntity> spec, Sort sort);
}
