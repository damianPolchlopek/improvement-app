package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.domain.enums.Unit;

public record GetMealIngredientWithProductResponse(String name, Unit unit, double amount, long id,
                                                   ProductCategory productCategory) {

    public static GetMealIngredientWithProductResponse from(MealIngredient ingredient) {
        return new GetMealIngredientWithProductResponse(
                ingredient.name(),
                ingredient.unit(),
                ingredient.amount(),
                ingredient.id(),
                ingredient.product().productCategory()
        );
    }
}
