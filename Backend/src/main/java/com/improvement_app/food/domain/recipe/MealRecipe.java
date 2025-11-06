package com.improvement_app.food.domain.recipe;

import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;

import java.util.List;

public record MealRecipe(
        Long id,
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
        List<String> recipe,
        List<MealIngredient> ingredients
) {

    public MealRecipe adjustToSinglePortion() {
        if (portionAmount <= 1.0) {
            return this;
        }

        List<MealIngredient> adjustedIngredients = ingredients.stream()
                .map(ingredient -> ingredient.adjustAmount(portionAmount))
                .toList();

        return new MealRecipe(
                id,
                name,
                kcal,
                protein,
                carbohydrates,
                fat,
                1.0, // adjusted portion
                url,
                category,
                type,
                popularity,
                recipe,
                adjustedIngredients
        );
    }
}
