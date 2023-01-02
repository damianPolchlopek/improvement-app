package com.improvement_app.food.services;

import com.improvement_app.food.entity.Product;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    List<Product> initProducts() throws IOException;

    List<Product> getProducts();

    Product saveProduct(Product product);

    void deleteAllProducts();

    List<String> getProductCategories() throws IOException;
}
