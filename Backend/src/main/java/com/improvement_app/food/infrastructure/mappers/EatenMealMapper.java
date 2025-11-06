package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EatenMealMapper {

    private final DailyMealIngredientMapper mealIngredientMapper;
    private final EntityManager entityManager;

    public DailyMealEntity toEntity(DailyMeal dailyMeal) {

        DailyMealEntity entity = new DailyMealEntity(
                dailyMeal.id(),
                dailyMeal.name(),
                dailyMeal.kcal(),
                dailyMeal.protein(),
                dailyMeal.carbohydrates(),
                dailyMeal.fat(),
                dailyMeal.portionMultiplier(),
                mealIngredientMapper.toEntityList(dailyMeal.ingredients()));

        // Ustaw referencję do przepisu TYLKO jeśli ID nie jest null
        if (dailyMeal.mealRecipeId() != null) {
            entity.setRecipeEntity(
                    entityManager.getReference(MealRecipeEntity.class, dailyMeal.mealRecipeId())
            );
        }

        return entity;
    }

    public DailyMeal toDomain(DailyMealEntity entity) {
        return new DailyMeal(
                entity.getId(),
                entity.getRecipeEntity().getId(),
                entity.getName(),
                entity.getCachedKcal(),
                entity.getCachedProtein(),
                entity.getCachedCarbohydrates(),
                entity.getCachedFat(),
                entity.getPortionMultiplier(),
                mealIngredientMapper.toDomainList(entity.getMealIngredients())
        );
    }

    public List<DailyMeal> toDomain(List<DailyMealEntity> entities) {
        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public List<DailyMealEntity> toEntity(List<DailyMeal> domains) {
        return domains.stream()
                .map(this::toEntity)
                .toList();
    }
}
