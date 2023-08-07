package com.improvement_app.food.controllers;

import com.improvement_app.food.dto.MealDto;
import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.enums.MealCategory;
import com.improvement_app.food.entity.enums.MealType;
import com.improvement_app.food.services.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class MealController {

    private final MealService mealService;

    @GetMapping("/meal")
    public Response getMeals(@RequestParam String mealCategory,
                             @RequestParam String mealType,
                             @RequestParam String mealName,
                             @RequestParam String sortBy) {
        MealCategory mealCategoryEnum = MealCategory.fromValue(mealCategory);
        MealType mealTypeEnum = MealType.fromValue(mealType);

        System.out.println(mealCategoryEnum);
        System.out.println(mealTypeEnum);

        List<MealDto> mealDtos = mealService.getMeals(mealCategoryEnum, mealTypeEnum, mealName, sortBy)
                .stream()
                .map(MealDto::from)
                .collect(Collectors.toList());

        System.out.println(mealDtos);

        return Response.ok(mealDtos).build();
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
