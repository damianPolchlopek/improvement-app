package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietSummaryAuditDto {
    private Long id;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private LocalDate date;
    private Long userId;

    public static DietSummaryAuditDto from(DietSummaryEntity entity) {
        return DietSummaryAuditDto.builder()
                .id(entity.getId())
                .kcal(entity.getKcal())
                .protein(entity.getProtein())
                .carbohydrates(entity.getCarbohydrates())
                .fat(entity.getFat())
                .date(entity.getDate())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .build();
    }
}