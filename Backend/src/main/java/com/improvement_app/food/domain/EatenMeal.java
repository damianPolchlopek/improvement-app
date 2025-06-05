package com.improvement_app.food.domain;

import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;

import java.util.List;

public record EatenMeal(
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
        List<MealIngredient> ingredients,
        double amount
) {
    public EatenMeal updateMacro(
            double kcal,
            double protein,
            double carbohydrates,
            double fat
    ) {
        return new EatenMeal(
                id,
                name,
                kcal,
                protein,
                carbohydrates,
                fat,
                portionAmount,
                url,
                category,
                type,
                popularity,
                recipe,
                ingredients,
                amount
        );
    }
}
