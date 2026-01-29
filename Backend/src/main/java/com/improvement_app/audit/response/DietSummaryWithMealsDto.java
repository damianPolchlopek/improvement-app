package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;

import java.time.LocalDate;
import java.util.List;

public record DietSummaryWithMealsDto(
        Long id,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        LocalDate date,
        Long userId,
        List<DailyMealAuditDto> meals
) {

    public static DietSummaryWithMealsDto from(
            DietSummaryEntity diet,
            List<DailyMealAuditDto> meals
    ) {
        return new DietSummaryWithMealsDto(
                diet.getId(),
                diet.getKcal(),
                diet.getProtein(),
                diet.getCarbohydrates(),
                diet.getFat(),
                diet.getDate(),
                diet.getUser() != null ? diet.getUser().getId() : null,
                meals
        );
    }
}
