package com.improvement_app.food.ui;

import com.improvement_app.food.application.MealService;
import com.improvement_app.food.application.ProductService;
import com.improvement_app.food.application.SweetsService;
import com.improvement_app.food.infrastructure.MealIngredientRepository;
import com.improvement_app.food.infrastructure.MealRepository;
import com.improvement_app.food.infrastructure.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final SweetsService sweetsService;

    private final MealIngredientRepository mealIngredientRepository;
    private final MealRepository mealRepository;
    private final ProductRepository productRepository;

    @GetMapping("/initFoodModule")
    public void initProducts() throws IOException {
        log.info("Usuwam i dodaje nowe produkty i posiłki");
        productService.deleteAll();
        productService.initProducts();

        mealService.deleteAll();
        mealService.initMeals();

        sweetsService.initSweets();
    }

}
