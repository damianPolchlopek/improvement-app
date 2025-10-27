package com.improvement_app.food.infrastructure.repository;

import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealIngredientRepository extends JpaRepository<MealIngredientEntity, Long> {

    @EntityGraph(attributePaths = "productEntity")
    List<MealIngredientEntity> findAllById(Iterable<Long> ids);

    @EntityGraph(attributePaths = "productEntity")
    List<MealIngredientEntity> findByMealRecipeEntityId(Long mealId);

}
