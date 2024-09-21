package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.application.ports.SweetsGoogleDriveHandler;
import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SweetsService {

    private final MealHandler mealHandler;
    private final SweetsGoogleDriveHandler sweetsGoogleDriveHandler;

    public void initSweets() throws IOException {
        List<Meal> sweets = sweetsGoogleDriveHandler.findAll();
        mealHandler.saveAll(sweets);
    }

//    public List<Product> getProducts(ProductCategory productCategory, String productName) {
//        final String productNameLower = productName.toLowerCase();
//        if (productCategory == ProductCategory.ALL) {
//            return sweetsHandler.findByName(productNameLower);
//        }
//
//        return sweetsHandler.findProduct(productCategory, productNameLower);
//    }


}
