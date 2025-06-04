package com.improvement_app.food.infrastructure.entity;

import com.improvement_app.food.domain.MealIngredient;
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
        List<MealIngredient> mealIngredients,
        List<String> recipe,
        int amount
) {

    public EatenMeal(long id, String test_meal, double kcal, double protein, double carbohydrates, double fat) {
        this(id, test_meal, kcal, protein, carbohydrates, fat, 1.0, null,
                MealCategory.DINNER, MealType.ALL, MealPopularity.HIGH, List.of(), List.of(), 1);
    }

    public EatenMeal updateMacro(
            double kcal,
            double protein,
            double carbohydrates,
            double fat
    ) {
        return new EatenMeal(
                this.id,
                this.name,
                kcal,
                protein,
                carbohydrates,
                fat,
                this.portionAmount,
                this.url,
                this.category,
                this.type,
                this.popularity,
                this.mealIngredients,
                this.recipe,
                this.amount
        );
    }

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