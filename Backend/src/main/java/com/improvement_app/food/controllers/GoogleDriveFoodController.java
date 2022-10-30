package com.improvement_app.food.controllers;

import com.improvement_app.food.services.FoodService;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/drive")
public class GoogleDriveFoodController {

    private static final Logger LOGGER = Logger.getLogger(GoogleDriveFoodController.class);

    private final FoodService foodService;

    @Transactional
    @GetMapping("/initProducts")
    public void initProducts() throws IOException {
        LOGGER.info("Usuwam i dodaje nowe produkty");
        foodService.deleteAllProducts();
        foodService.initProducts();
    }

}
