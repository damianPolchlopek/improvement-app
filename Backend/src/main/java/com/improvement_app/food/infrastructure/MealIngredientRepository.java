package com.improvement_app.food.infrastructure;

import com.improvement_app.food.domain.MealIngredient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealIngredientRepository extends JpaRepository<MealIngredient, Long> {

    @EntityGraph(attributePaths = "product")
    Optional<MealIngredient> findById(Long id);

    @EntityGraph(attributePaths = "product")
    List<MealIngredient> findAllById(Iterable<Long> ids);

}
