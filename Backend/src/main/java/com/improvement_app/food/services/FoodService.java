package com.improvement_app.food.services;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.Product;

import java.io.IOException;
import java.util.List;

public interface FoodService {

    List<Product> initProducts() throws IOException;

    void deleteAllProducts();

    List<Meal> initMeals() throws IOException;

    void deleteAllMeals();
}
