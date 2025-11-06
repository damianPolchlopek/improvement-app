package com.improvement_app.food.domain.recipe;

import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.domain.enums.Unit;

public record Product(
        Long id,
        String name,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        double amount,
        Unit unit,
        ProductCategory productCategory
) {
}
