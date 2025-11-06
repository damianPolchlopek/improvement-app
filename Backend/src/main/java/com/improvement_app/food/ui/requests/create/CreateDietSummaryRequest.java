package com.improvement_app.food.ui.requests.create;

import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateMealRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record CreateDietSummaryRequest(
        @NotNull(message = "Lista posiłków nie może być null")
        @NotEmpty(message = "Lista posiłków nie może być pusta")
        List<CreateDailyMealRequest> meals
) {
        public DietSummary toDietSummary(CalculateResult calculateResult) {
                List<DailyMeal> dailyMeals = meals.stream()
                        .map(CreateDailyMealRequest::toDailyMeal)
                        .toList();

                return new DietSummary(
                        null,
                        calculateResult.kcal(),
                        calculateResult.protein(),
                        calculateResult.carbohydrates(),
                        calculateResult.fat(),
                        LocalDate.now(),
                        dailyMeals
                );
        }

        public CalculateDietRequest toCalculateDayRequest() {
                List<CalculateMealRequest> calculateMealRequests = meals.stream()
                        .map(CreateDailyMealRequest::toCalculateMealRequest)
                        .toList();

                return new CalculateDietRequest(calculateMealRequests);
        }
}
