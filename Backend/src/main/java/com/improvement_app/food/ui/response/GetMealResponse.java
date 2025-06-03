package com.improvement_app.food.ui.response;

import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;

import java.util.List;

public record GetMealResponse(Long id,
                              String name,
                              double kcal,
                              double protein,
                              double carbohydrates,
                              double fat,
                              double portionAmount,
                              String url,
                              MealCategory category,
                              MealType type,
                              MealPopularity popularity,
                              List<MealIngredientResponse> mealIngredients,
                              List<String> recipe,
                              double amount
) {

    public static GetMealResponse from(MealRecipeEntity mealRecipeEntity) {
        return new GetMealResponse(
                mealRecipeEntity.getId(),
                mealRecipeEntity.getName(),
                mealRecipeEntity.getKcal(),
                mealRecipeEntity.getProtein(),
                mealRecipeEntity.getCarbohydrates(),
                mealRecipeEntity.getFat(),
                mealRecipeEntity.getPortionAmount(),
                mealRecipeEntity.getUrl(),
                mealRecipeEntity.getCategory(),
                mealRecipeEntity.getType(),
                mealRecipeEntity.getPopularity(),
                mealRecipeEntity.getIngredients().stream()
                        .map(ingredient -> new MealIngredientResponse(
                                ingredient.getName(),
                                ingredient.getUnit(),
                                ingredient.getAmount(),
                                ingredient.getId(),
                                ingredient.getProductEntity().getId()))
                        .toList(),
                mealRecipeEntity.getRecipe(),
                0
        );
    }
}
