package com.improvement_app.audit.response;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietSummaryWithMealsDto {
    private Long id;
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
    private LocalDate date;
    private Long userId;
    private List<DailyMealAuditDto> meals;

    public static DietSummaryWithMealsDto from(
            DietSummaryEntity diet,
            List<DailyMealAuditDto> meals) {

        return DietSummaryWithMealsDto.builder()
                .id(diet.getId())
                .kcal(diet.getKcal())
                .protein(diet.getProtein())
                .carbohydrates(diet.getCarbohydrates())
                .fat(diet.getFat())
                .date(diet.getDate())
                .userId(diet.getUser() != null ? diet.getUser().getId() : null)
                .meals(meals)
                .build();
    }
}