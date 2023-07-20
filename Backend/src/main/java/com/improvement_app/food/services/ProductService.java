package com.improvement_app.food.services;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.enums.ProductCategory;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    List<Product> initProducts() throws IOException;

    List<Product> getProducts(ProductCategory category, String productName);

    void deleteAllProducts();

}
