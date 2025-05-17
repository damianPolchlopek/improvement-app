package com.improvement_app.food.ui;


import com.improvement_app.food.application.MealService;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.ui.dto.MealDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.ws.rs.core.Response;
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
                             @RequestParam String mealPopularity,
                             @RequestParam String sortBy) {

        MealCategory mealCategoryEnum = MealCategory.fromValue(mealCategory);
        MealType mealTypeEnum = MealType.fromValue(mealType);
        MealPopularity mealPopularityEnum = MealPopularity.fromValue(mealPopularity);

        List<MealDto> mealDTOs = mealService.getMeals(mealCategoryEnum, mealTypeEnum, mealPopularityEnum, mealName, sortBy)
                .stream()
                .map(MealDto::from)
                .collect(Collectors.toList());

        return Response.ok(mealDTOs).build();
    }

    @GetMapping("/meal/categories")
    public Response getMealCategories() {
        return Response.ok(Arrays.stream(MealCategory.values())
                        .map(MealCategory::getName).toArray())
                .build();
    }

    @GetMapping("/meal/types")
    public Response getMealTypes() {
        return Response.ok(Arrays.stream(MealType.values()).map(MealType::getName).toArray()).build();
    }


    @GetMapping("/initMeals")
    public List<MealRecipe> initMeals() throws IOException {
        return mealService.initMeals();
    }
}
