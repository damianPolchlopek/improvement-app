package com.improvement_app.food.infrastructure.database;

import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealIngredientRepository extends JpaRepository<MealIngredientEntity, Long> {

    @EntityGraph(attributePaths = "productEntity")
    List<MealIngredientEntity> findAllById(Iterable<Long> ids);

}
