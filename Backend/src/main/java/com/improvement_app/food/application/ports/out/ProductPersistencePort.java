package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.recipe.Product;
import com.improvement_app.food.domain.enums.ProductCategory;

import java.util.List;

public interface ProductPersistencePort {
    List<Product> findAll();

    void deleteAll();

    List<Product> saveAll(List<Product> productEntities);

    List<Product> findByName(String name);

    List<Product> findProduct(ProductCategory productCategory, String productName);
}
