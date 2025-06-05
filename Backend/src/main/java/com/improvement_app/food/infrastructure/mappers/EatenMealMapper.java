package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.infrastructure.entity.EatenMealEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EatenMealMapper {

    public EatenMealEntity toEntity(EatenMeal eatenMeal) {

        return new EatenMealEntity(
                eatenMeal.id(),
                eatenMeal.name(),
                eatenMeal.kcal(),
                eatenMeal.protein(),
                eatenMeal.carbohydrates(),
                eatenMeal.fat(),
                eatenMeal.portionAmount(),
                eatenMeal.url(),
                eatenMeal.category(),
                eatenMeal.type(),
                eatenMeal.popularity(),
                eatenMeal.ingredients(),
                eatenMeal.recipe(),
                eatenMeal.amount()
        );
    }

    public EatenMeal toDomain(EatenMealEntity entity) {
        return new EatenMeal(
                entity.id(),
                entity.name(),
                entity.kcal(),
                entity.protein(),
                entity.carbohydrates(),
                entity.fat(),
                entity.portionAmount(),
                entity.url(),
                entity.category(),
                entity.type(),
                entity.popularity(),
                entity.recipe(),
                entity.mealIngredients(),
                entity.amount()
        );
    }

    public List<EatenMeal> toDomain(List<EatenMealEntity> entities) {
        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public List<EatenMealEntity> toEntity(List<EatenMeal> domains) {
        return domains.stream()
                .map(this::toEntity)
                .toList();
    }
}
