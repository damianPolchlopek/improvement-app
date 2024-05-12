package com.improvement_app.food.ui;

import com.improvement_app.food.application.DietSummaryService;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.ui.dto.MealDto;
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

    private final DietSummaryService dietSummaryService;

    @PostMapping("/calculate")
    public Response getMealCategories(@RequestBody List<Long> ids) {
        DietSummary dietSummary = dietSummaryService.calculateDietSummary(ids);
        return Response.ok(dietSummary).build();
    }

    @PostMapping("/save-diet-day")
    public Response addDietDay(@RequestBody List<Long> ids) {
        DietSummary dietSummary = dietSummaryService.calculateDietSummary(ids);
        DietSummary diet = dietSummaryService.addDietSummary(dietSummary);
        return Response.ok(diet).build();
    }

    @PostMapping("/sum-product")
    public Response sumProduct(@RequestBody List<MealDto> mealDtos) {
        List<MealIngredient> products = dietSummaryService.getProducts(mealDtos);
        return Response.ok(products).build();
    }
}
