package com.improvement_app.food.ui.dto;

import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MealDto {
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
    private List<MealIngredient> mealIngredients;
    private List<String> recipe;

    private int amount;

    public static MealDto from(MealRecipe mealRecipe) {
        return new MealDto(
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
                mealRecipe.getMealIngredients(),
                mealRecipe.getRecipe(),
                0
            );
    }
}
