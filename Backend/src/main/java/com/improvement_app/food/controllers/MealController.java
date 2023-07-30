package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import com.improvement_app.food.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class MealController {

    private final MealService mealService;

    @GetMapping("/meal")
    public Response getMeals(@RequestParam String mealCategory,
                             @RequestParam String mealType,
                             @RequestParam String mealName) {
        MealCategory mealCategoryEnum = MealCategory.fromValue(mealCategory);
        MealType mealTypeEnum = MealType.fromValue(mealType);
        return Response.ok(mealService.getMeals(mealCategoryEnum, mealTypeEnum, mealName)).build();
    }

    @GetMapping("/mealByCategory")
    public Response getMealsByCategory(@RequestParam String mealCategory,
                             @RequestParam String mealType,
                             @RequestParam String mealName) {
        MealCategory mealCategoryEnum = MealCategory.fromValue(mealCategory);
        MealType mealTypeEnum = MealType.fromValue(mealType);
        return Response.ok(mealService.getMealsByCategory(mealCategoryEnum, mealTypeEnum, mealName)).build();
    }

    @GetMapping("/meal/categories")
    public Response getMealCategories() {
        return Response.ok(Arrays.stream(MealCategory.values()).map(MealCategory::getName).toArray()).build();
    }

    @GetMapping("/meal/types")
    public Response getMealTypes() {
        return Response.ok(Arrays.stream(MealType.values()).map(MealType::getName).toArray()).build();
    }



    @GetMapping("/initMeals")
    public List<Meal> initMeals() throws IOException {
        return mealService.initMeals();
    }
}
