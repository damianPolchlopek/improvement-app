package com.improvement_app.food.application.ports;

import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.enums.ProductCategory;

import java.util.List;

public interface ProductHandler {
    List<ProductEntity> findAll();

    void deleteAll();

    List<ProductEntity> saveAll(List<ProductEntity> productEntities);

    List<ProductEntity> findByName(String name);

    List<ProductEntity> findProduct(ProductCategory productCategory, String productName);
}
