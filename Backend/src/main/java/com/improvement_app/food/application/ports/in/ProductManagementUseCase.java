package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;

import java.util.List;

public interface ProductManagementUseCase {
    List<Product> getProducts(ProductCategory productCategoryEnum, String productName);

    List<String> getAvailableCategories();
}
