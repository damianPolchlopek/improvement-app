package com.improvement_app.food.services;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.entity.enums.ProductCategory;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    List<Product> initProducts() throws IOException;

    List<Product> getProducts();

    List<Product> getProducts(ProductCategory category);

    Product saveProduct(Product product);

    void deleteAllProducts();

    List<String> getProductCategories() throws IOException;
}
