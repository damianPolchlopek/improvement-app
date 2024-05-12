package com.improvement_app.food.ui;

import com.improvement_app.food.application.MealService;
import com.improvement_app.food.application.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveFoodController {
    private final MealService mealService;
    private final ProductService productService;

    @GetMapping("/initFoodModule")
    public void initProducts() throws IOException {
        log.info("Usuwam i dodaje nowe produkty i posiłki");
        productService.deleteAll();
        productService.initProducts();

        mealService.deleteAll();
        mealService.initMeals();
    }

}
