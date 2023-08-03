package com.improvement_app.food.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DietSummaryDto {
    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;
}
