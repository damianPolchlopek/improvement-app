package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.MealRecipe;
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

    public static GetMealResponse from(MealRecipe mealRecipe) {
        return new GetMealResponse(
                mealRecipe.getId(),
                mealRecipe.getName(),
                mealRecipe.getKcal(),
                mealRecipe.getProtein(),
                mealRecipe.getCarbohydrates(),
                mealRecipe.getFat(),
                mealRecipe.getPortionAmount(),
                mealRecipe.getUrl(),
                mealRecipe.getCategory(),
                mealRecipe.getType(),
                mealRecipe.getPopularity(),
                mealRecipe.getIngredients().stream()
                        .map(ingredient -> new MealIngredientResponse(
                                ingredient.getName(),
                                ingredient.getUnit(),
                                ingredient.getAmount(),
                                ingredient.getId(),
                                ingredient.getProduct().getId()))
                        .toList(),
                mealRecipe.getRecipe(),
                0
        );
    }
}
