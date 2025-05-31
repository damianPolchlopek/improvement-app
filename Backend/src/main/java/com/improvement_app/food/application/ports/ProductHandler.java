package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;

import java.util.List;

public interface ProductHandler {
    List<Product> findAll();

    void deleteAll();

    List<Product> saveAll(List<Product> products);

    List<Product> findByName(String name);

    List<Product> findProduct(ProductCategory productCategory, String productName);
}
