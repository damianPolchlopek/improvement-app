package com.improvement_app.food.domain;

import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class EatenMeals {

    private Long id;

    private String name;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private double portionAmount;
    private String url;

    private MealCategory category;
    private MealType type;
    private MealPopularity popularity;

    private List<MealIngredient> mealIngredients;
    private List<String> recipe;

    private double amount;

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
