package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;

public record DailyMealAuditDto(
        Long id,
        String name,
        double cachedKcal,
        double cachedProtein,
        double cachedCarbohydrates,
        double cachedFat,
        double portionMultiplier,
        Long recipeId,
        Long dietSummaryId
) {

    public static DailyMealAuditDto from(DailyMealEntity entity) {
        return new DailyMealAuditDto(
                entity.getId(),
                entity.getName(),
                entity.getCachedKcal(),
                entity.getCachedProtein(),
                entity.getCachedCarbohydrates(),
                entity.getCachedFat(),
                entity.getPortionMultiplier(),
                entity.getRecipeEntity() != null ? entity.getRecipeEntity().getId() : null,
                entity.getDietSummary() != null ? entity.getDietSummary().getId() : null
        );
    }
}
