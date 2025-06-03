package com.improvement_app.food.ui.response;

import com.improvement_app.food.infrastructure.entity.ProductEntity;
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
    public static GetProductResponse from(ProductEntity productEntity) {
        return new GetProductResponse(
                productEntity.getId(),
                productEntity.getName(),
                productEntity.getKcal(),
                productEntity.getProtein(),
                productEntity.getCarbohydrates(),
                productEntity.getFat(),
                productEntity.getAmount(),
                productEntity.getUnit(),
                productEntity.getProductCategory()
        );
    }
}
