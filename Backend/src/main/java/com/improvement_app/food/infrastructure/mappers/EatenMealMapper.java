package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EatenMealMapper {

    private final DailyMealIngredientMapper mealIngredientMapper;

    public DailyMealEntity toEntity(DailyMeal dailyMeal) {

        return new DailyMealEntity(
                dailyMeal.id(),
                dailyMeal.name(),
                dailyMeal.kcal(),
                dailyMeal.protein(),
                dailyMeal.carbohydrates(),
                dailyMeal.fat(),
                dailyMeal.portionMultiplier(),
                mealIngredientMapper.toEntityList(dailyMeal.ingredients())
        );
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
