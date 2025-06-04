package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MealMapper {

    private final MealIngredientMapper mealIngredientMapper;

    public Meal toDomain(MealRecipeEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Meal(
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

    public List<Meal> toDomain(List<MealRecipeEntity> entities) {
        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public MealRecipeEntity toEntity(Meal meal) {
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

    public List<MealRecipeEntity> toEntity(List<Meal> meals) {
        return meals.stream()
                .map(this::toEntity)
                .toList();
    }
}
