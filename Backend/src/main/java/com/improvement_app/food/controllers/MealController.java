package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import com.improvement_app.food.entity.enums.ProductCategory;
import com.improvement_app.food.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class MealController {

    private final MealService mealService;

    @GetMapping("/getMeals")
    public Response getMeals() {
        return Response.ok(mealService.getMeals()).build();
    }

    @GetMapping("/getMeals/{mealCategory}/{mealType}")
    public Response getMeals(@PathVariable String mealCategory, @PathVariable String mealType) {
        MealCategory mealCategoryEnum = MealCategory.valueOf(mealCategory);
        MealType mealTypeEnum = MealType.valueOf(mealType);
        return Response.ok(mealService.getMeals(mealCategoryEnum, mealTypeEnum)).build();
    }

    @GetMapping("/initMeals")
    public List<Meal> initMeals() throws IOException {
        return mealService.initMeals();
    }


    @GetMapping("/getMealCategories")
    public Response getMealCategories() {
        return Response.ok(MealCategory.values()).build();
    }

    @GetMapping("/getMealTypes")
    public Response getMealTypes() {
        return Response.ok(MealType.values()).build();
    }


}
