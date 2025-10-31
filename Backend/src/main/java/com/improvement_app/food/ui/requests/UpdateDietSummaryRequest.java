package com.improvement_app.food.ui.requests;

import com.improvement_app.food.domain.summary.DailyMeal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateDietSummaryRequest(
        @Min(value = 1, message = "Identyfikator podsumowania diety musi być większy niż 0")
        Long dietSummaryId,

        @NotNull(message = "Lista posiłków nie może być null")
        @NotEmpty(message = "Lista posiłków nie może być pusta")
        List<DailyMeal> meals
) {
}
