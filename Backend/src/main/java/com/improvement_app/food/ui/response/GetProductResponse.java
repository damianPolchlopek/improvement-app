package com.improvement_app.food.ui.response;

import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.domain.enums.Unit;

public record GetProductResponse(
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
    public static GetProductResponse from(Product product) {
        return new GetProductResponse(
                product.id(),
                product.name(),
                product.kcal(),
                product.protein(),
                product.carbohydrates(),
                product.fat(),
                product.amount(),
                product.unit(),
                product.productCategory()
        );
    }

}
