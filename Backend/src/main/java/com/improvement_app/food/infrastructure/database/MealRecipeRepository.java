package com.improvement_app.food.infrastructure.database;

import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRecipeRepository extends JpaRepository<MealRecipeEntity, Long>, JpaSpecificationExecutor<MealRecipeEntity> {

//    @Query("SELECT m FROM MealRecipe m JOIN FETCH m.ingredients WHERE LOWER(m.name) LIKE %:mealName% ORDER BY "
//            + "CASE WHEN :order = 'category' THEN m.category ELSE m.name END")
//    List<MealRecipe> findAllByName(String mealName, String order);

    @EntityGraph(attributePaths = {"ingredients", "ingredients.productEntity"})
    List<MealRecipeEntity> findAll(@Nullable Specification<MealRecipeEntity> spec, Sort sort);

}
