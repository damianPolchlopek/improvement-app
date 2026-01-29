package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;

import java.time.LocalDate;

public record DietSummaryDto(
        Long id,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        LocalDate date,
        Long userId
) {

    public static DietSummaryDto from(DietSummaryEntity entity) {
        return new DietSummaryDto(
                entity.getId(),
                entity.getKcal(),
                entity.getProtein(),
                entity.getCarbohydrates(),
                entity.getFat(),
                entity.getDate(),
                entity.getUser() != null ? entity.getUser().getId() : null
        );
    }
}
