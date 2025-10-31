package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.recipe.MealRecipe;
import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MealMapper {

    private final MealIngredientMapper mealIngredientMapper;

    public MealRecipe toDomain(MealRecipeEntity entity) {
        if (entity == null) {
            return null;
        }

        return new MealRecipe(
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
                mealIngredientMapper.toDomainList(entity.getIngredients())
        );
    }

    public List<MealRecipe> toDomain(List<MealRecipeEntity> entities) {
        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public MealRecipeEntity toEntity(MealRecipe meal) {
        if (meal == null) {
            return null;
        }

        MealRecipeEntity entity = new MealRecipeEntity();
        entity.setId(meal.id());
        entity.setName(meal.name());
        entity.setKcal(meal.kcal());
        entity.setProtein(meal.protein());
        entity.setCarbohydrates(meal.carbohydrates());
        entity.setFat(meal.fat());
        entity.setPortionAmount(meal.portionAmount());
        entity.setUrl(meal.url());
        entity.setCategory(meal.category());
        entity.setType(meal.type());
        entity.setPopularity(meal.popularity());
        entity.setRecipe(meal.recipe());
        entity.setIngredients(mealIngredientMapper.toEntityList(meal.ingredients()));

        return entity;
    }

    public List<MealRecipeEntity> toEntity(List<MealRecipe> meals) {
        return meals.stream()
                .map(this::toEntity)
                .toList();
    }
}
