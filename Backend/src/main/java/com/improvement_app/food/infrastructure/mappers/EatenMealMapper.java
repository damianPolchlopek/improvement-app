package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.EatenMeal;
import com.improvement_app.food.infrastructure.entity.summary.EatenMealEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EatenMealMapper {

    private final MealIngredientMapper mealIngredientMapper;

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
                mealIngredientMapper.toEntityList(eatenMeal.ingredients()),
                eatenMeal.recipe(),
                eatenMeal.amount()
        );
    }

    public EatenMeal toDomain(EatenMealEntity entity) {
        return new EatenMeal(
                entity.getId(),
                entity.getName(),
                entity.getKcal(),
                entity.getProtein(),
                entity.getCarbohydrates(),
                entity.getFat(),
                entity.getPortionAmount(),
                entity.getUrl(),
                entity.getCategory(),
                entity.getType(),
                entity.getPopularity(),
                entity.getRecipe(),
                mealIngredientMapper.toDomainList(entity.getMealIngredients()),
                entity.getAmount()
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
