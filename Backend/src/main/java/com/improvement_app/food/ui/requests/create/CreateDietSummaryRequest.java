package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.summary.DailyMeal;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateDietSummaryRequest(
        @NotNull(message = "Lista posiłków nie może być null")
        @NotEmpty(message = "Lista posiłków nie może być pusta")
        List<CreateDailyMealRequest> meals
) {
        public List<DailyMeal> toDailyMeals() {
                return meals.stream()
                        .map(CreateDailyMealRequest::toDailyMeal)
                        .toList();
        }
}
