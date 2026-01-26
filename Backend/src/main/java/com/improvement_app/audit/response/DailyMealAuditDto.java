package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMealAuditDto {
    private Long id;
    private String name;
    private double cachedKcal;
    private double cachedProtein;
    private double cachedCarbohydrates;
    private double cachedFat;
    private double portionMultiplier;
    private Long recipeId;
    private Long dietSummaryId;

    public static DailyMealAuditDto from(DailyMealEntity entity) {
        return DailyMealAuditDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .cachedKcal(entity.getCachedKcal())
                .cachedProtein(entity.getCachedProtein())
                .cachedCarbohydrates(entity.getCachedCarbohydrates())
                .cachedFat(entity.getCachedFat())
                .portionMultiplier(entity.getPortionMultiplier())
                .recipeId(entity.getRecipeEntity() != null ? entity.getRecipeEntity().getId() : null)
                .dietSummaryId(entity.getDietSummary() != null ? entity.getDietSummary().getId() : null)
                .build();
    }
}