package com.improvement_app.food.ui.requests.update;

import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateMealRequest;
import com.improvement_app.food.ui.requests.create.CreateDailyMealRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateDietSummaryRequest(
        @Min(value = 1, message = "Identyfikator podsumowania diety musi być większy niż 0")
        Long dietSummaryId,

        @NotNull(message = "Lista posiłków nie może być null")
        @NotEmpty(message = "Lista posiłków nie może być pusta")
        List<UpdateDailyMealRequest> meals
) {
        public CalculateDietRequest toCalculateDayRequest() {
                List<CalculateMealRequest> calculateMealRequests = meals.stream()
                        .map(UpdateDailyMealRequest::toCalculateMealRequest)
                        .toList();

                return new CalculateDietRequest(calculateMealRequests);
        }
}
