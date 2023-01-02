package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/initMeals")
    public List<Meal> initMeals() throws IOException {
        return mealService.initMeals();
    }

}
