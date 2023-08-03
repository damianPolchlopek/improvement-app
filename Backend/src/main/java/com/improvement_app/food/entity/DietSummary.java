package com.improvement_app.food.entity;

import com.improvement_app.food.dto.DietSummaryDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class DietSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;

    private LocalDate date;

    public DietSummary(double kcal, double protein, double carbohydrates, double fat) {
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.date = LocalDate.now();
    }

    public static DietSummary from(DietSummaryDto dietSummaryDto) {
        return new DietSummary(dietSummaryDto.getKcal(),
                dietSummaryDto.getProtein(),
                dietSummaryDto.getCarbohydrates(),
                dietSummaryDto.getFat());
    }
}
