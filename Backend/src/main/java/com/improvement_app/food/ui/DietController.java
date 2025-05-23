package com.improvement_app.food.ui;

import com.improvement_app.food.application.DietSummaryService;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.ui.commands.CalculateDietRequest;
import com.improvement_app.food.ui.commands.CreateDietSummaryRequest;
import com.improvement_app.food.ui.commands.UpdateDietSummaryRequest;
import com.improvement_app.food.ui.dto.MealDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import jakarta.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food/diet")
public class DietController {

    private final DietSummaryService dietSummaryService;

    @GetMapping("/day-summary")
    public Page<DietSummary> getDayDietSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortField,
            @RequestParam(defaultValue = "DESC") String direction) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.valueOf(direction), sortField));
        return dietSummaryService.getDietSummaries(pageable);
    }

    @PostMapping("/calculate")
    public Response getMealCategories(@RequestBody CalculateDietRequest calculateDietRequest) {
        DietSummary dietSummary = dietSummaryService.calculateDietSummary(calculateDietRequest.eatenMeals());
        return Response.ok(dietSummary).build();
    }

    @PostMapping("/sum-product")
    public Response sumProduct(@RequestBody List<MealDto> mealDTOs) {
        List<MealIngredient> products = dietSummaryService.getProducts(mealDTOs);
        return Response.ok(products).build();
    }







    @GetMapping("/day-summary/{id}")
    public Response getDietDaySummary(@PathVariable Long id) {
        DietSummary dayDietSummary = dietSummaryService.getDayDietSummary(id);
        return Response.ok(dayDietSummary).build();
    }

    @PostMapping("/day-summary")
    public Response addDietDay(@RequestBody CreateDietSummaryRequest createDietSummaryRequest) {
        DietSummary diet = dietSummaryService.saveDietDaySummary(createDietSummaryRequest);
        return Response.ok(diet).build();
    }

    @PutMapping("/day-summary")
    public Response editDietDaySummary(@RequestBody UpdateDietSummaryRequest updateDietSummaryRequest) {
        DietSummary updatedDietSummary = dietSummaryService.updateDietSummary(updateDietSummaryRequest);
        return Response.ok(updatedDietSummary).build();
    }

    @DeleteMapping("/day-summary/{id}")
    public Response deleteDietDay(@PathVariable Long id) {
        dietSummaryService.deleteDietSummary(id);
        return Response.ok().build();
    }
}
