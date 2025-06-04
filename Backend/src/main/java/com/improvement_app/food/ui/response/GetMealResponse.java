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

    public static GetMealResponse from(MealRecipe meal) {
        return new GetMealResponse(
                meal.id(),
                meal.name(),
                meal.kcal(),
                meal.protein(),
                meal.carbohydrates(),
                meal.fat(),
                meal.portionAmount(),
                meal.url(),
                meal.category(),
                meal.type(),
                meal.popularity(),
                meal.ingredients().stream()
                        .map(ingredient -> new MealIngredientResponse(
                                ingredient.name(),
                                ingredient.unit(),
                                ingredient.amount(),
                                ingredient.id(),
                                ingredient.productId()))
                        .toList(),
                meal.recipe(),
                -1
        );
    }

}
