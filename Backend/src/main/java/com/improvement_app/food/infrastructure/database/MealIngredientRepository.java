package com.improvement_app.food.infrastructure.database;

import com.improvement_app.food.domain.MealIngredient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealIngredientRepository extends JpaRepository<MealIngredient, Long> {

    @EntityGraph(attributePaths = "product")
    List<MealIngredient> findAllById(Iterable<Long> ids);

}
