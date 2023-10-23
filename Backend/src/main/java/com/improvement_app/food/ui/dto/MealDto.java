package com.improvement_app.food.ui.dto;

import com.improvement_app.food.domain.Meal;
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

    public static MealDto from(Meal meal) {
        return new MealDto(
                meal.getId(),
                meal.getName(),
                meal.getKcal(),
                meal.getProtein(),
                meal.getCarbohydrates(),
                meal.getFat(),
                meal.getPortionAmount(),
                meal.getUrl(),
                meal.getCategory(),
                meal.getType(),
                meal.getMealIngredients(),
                meal.getRecipe(),
                0
            );
    }
}
