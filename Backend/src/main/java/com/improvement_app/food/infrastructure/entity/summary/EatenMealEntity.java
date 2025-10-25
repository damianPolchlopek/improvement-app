package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EatenMealEntity implements Serializable {
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

    private List<MealIngredientEntity> mealIngredients;
    private List<String> recipe;
    private double amount;

    @Override
    public String toString() {
        return "EatenMealEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", kcal=" + kcal +
                ", protein=" + protein +
                ", carbohydrates=" + carbohydrates +
                ", fat=" + fat +
                ", portionAmount=" + portionAmount +
                ", url='" + url + '\'' +
                ", category=" + category +
                ", type=" + type +
                ", popularity=" + popularity +
                ", amount=" + amount +
                '}';
    }
}