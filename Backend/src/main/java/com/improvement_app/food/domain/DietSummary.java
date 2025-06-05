package com.improvement_app.food.domain;

import com.improvement_app.food.infrastructure.entity.EatenMealEntity;

import java.time.LocalDate;
import java.util.List;

public record DietSummary(
        Long id,
        double kcal,
        double protein,
        double carbohydrates,
        double fat,
        LocalDate date,
        List<EatenMeal> meals
) {

        public DietSummary(double kcal, double protein,
                        double carbohydrates, double fat,
                        List<EatenMeal> meals) {
            this(null, kcal, protein, carbohydrates, fat, LocalDate.now(), meals);
        }

        public DietSummary update(DietSummary newDietSummary) {
            return new DietSummary(
                    this.id,
                    newDietSummary.kcal,
                    newDietSummary.protein,
                    newDietSummary.carbohydrates,
                    newDietSummary.fat,
                    this.date,
                    newDietSummary.meals
            );
        }
}
