package com.improvement_app.food.domain.dietsummary;

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
        List<MealIngredientDTO> mealIngredients,
        List<String> recipe,
        double amount
) {
    @Override
    public String toString() {
        return "EatenMeals{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", kcal=" + kcal +
                ", protein=" + protein +
                ", carbohydrates=" + carbohydrates +
                ", fat=" + fat +
                ", amount=" + amount +
                ", category=" + category +
                ", type=" + type +
                ", popularity=" + popularity +
                '}';
    }
}