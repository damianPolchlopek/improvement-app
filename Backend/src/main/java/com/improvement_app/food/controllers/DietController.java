package com.improvement_app.food.controllers;

import com.improvement_app.food.dto.DietSummaryDto;
import com.improvement_app.food.dto.MealDto;
import com.improvement_app.food.entity.DietSummary;
import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.MealIngredient;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.repository.MealRepository;
import com.improvement_app.food.services.DietSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food/diet")
public class DietController {

    private final MealRepository mealRepository;
    private final DietSummaryService dietSummaryService;


    @PostMapping("/calculate")
    public Response getMealCategories(@RequestBody List<Long> ids) {
        List<Meal> allById = mealRepository.findAllById(ids);

        double kcal = 0;
        double protein = 0;
        double carbs = 0;
        double fat = 0;

        for (Meal meal : allById) {
            kcal += meal.getKcal();
            protein += meal.getProtein();
            carbs += meal.getCarbohydrates();
            fat += meal.getFat();
        }

        return Response.ok(new DietSummary(kcal, protein, carbs, fat)).build();
    }

    @PostMapping("/")
    public Response addDietDay(@RequestBody DietSummaryDto dietSummaryDto) {
        DietSummary diet = dietSummaryService.addDietSummary(dietSummaryDto);
        return Response.ok(diet).build();
    }

    @PostMapping("/sum-product")
    public Response sumProduct(@RequestBody List<MealDto> mealDtos) {

        List<MealIngredient> products = dietSummaryService.getProducts(mealDtos);

        return Response.ok(products).build();
    }
}
